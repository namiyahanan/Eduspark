import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Plus, Save, Sparkles, Target, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { localStorage_safe, StudyPlanTask, suggestPersonalizedStudyPlan } from '../utils/helpers';
import { useStudent } from '../contexts/StudentContext';
import ScrollReveal from './ScrollReveal';

interface StudyPlanProps {
  topic: string;
  daysAvailable: number;
  onDayClick?: (day: number) => void;
}

export default function StudyPlan({ topic, daysAvailable, onDayClick }: StudyPlanProps) {
  const { studentInfo, performance } = useStudent();
  const storageKey = `study_plan_${studentInfo?.email || studentInfo?.name || 'guest'}`;
  const suggestedPlan = useMemo(
    () => suggestPersonalizedStudyPlan(studentInfo?.interests || [topic], performance.averageScore, daysAvailable),
    [daysAvailable, performance.averageScore, studentInfo?.interests, topic]
  );
  const [tasks, setTasks] = useState<StudyPlanTask[]>(() => {
    const stored = localStorage_safe.getItem(storageKey);
    if (!stored) return suggestedPlan;
    try {
      return JSON.parse(stored);
    } catch {
      return suggestedPlan;
    }
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage_safe.setItem(storageKey, JSON.stringify(tasks));
  }, [storageKey, tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((current) => [
      ...current,
      {
        id: `custom-${Date.now()}`,
        title: newTask.trim(),
        subject: topic,
        minutes: 45,
        done: false,
      },
    ]);
    setNewTask('');
  };

  const updateTask = (id: string, updates: Partial<StudyPlanTask>) => {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...updates } : task));
  };

  const removeTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  return (
    <ScrollReveal direction="up">
      <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-black text-white">Learning Plan</h3>
          </div>
          <button
            onClick={() => setTasks(suggestedPlan)}
            className="sm:ml-auto inline-flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Suggest
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              whileHover={{ y: -2, rotateX: 1 }}
              className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      updateTask(task.id, { done: !task.done });
                    }}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm ${task.done ? 'bg-primary border-primary text-black' : 'bg-primary/10 border-primary/40 text-primary'}`}
                    aria-label={`Mark ${task.title} ${task.done ? 'incomplete' : 'complete'}`}
                  >
                    {task.done ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </button>
                </div>
                <div className="flex-1">
                  <input
                    value={task.title}
                    onFocus={() => onDayClick?.(index)}
                    onChange={(event) => updateTask(task.id, { title: event.target.value })}
                    className="w-full bg-transparent text-white font-semibold group-hover:text-primary transition-colors outline-none"
                    aria-label={`Study task ${index + 1}`}
                  />
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-white/40 text-sm">Day {index + 1} of {tasks.length}</span>
                    <input
                      type="number"
                      min={10}
                      max={180}
                      value={task.minutes}
                      onChange={(event) => updateTask(task.id, { minutes: Number(event.target.value) || 10 })}
                      className="w-20 bg-black/25 border border-white/10 rounded-xl px-2 py-1 text-xs text-white/70 outline-none"
                      aria-label="Minutes for task"
                    />
                    <span className="text-white/35 text-xs">min</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeTask(task.id);
                  }}
                  className="p-2 rounded-xl text-white/30 hover:text-red-300 hover:bg-red-500/10 transition-all"
                  aria-label={`Remove ${task.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <input
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') addTask();
            }}
            placeholder="Add your own task"
            className="flex-1 bg-black/25 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-primary/50"
          />
          <button onClick={addTask} className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 font-black hover:border-primary/40 transition-all">
            <Plus className="w-4 h-4 text-primary" />
            Add
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-6 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{tasks.reduce((sum, task) => sum + task.minutes, 0)} total min</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span>Master {topic}</span>
          </div>
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-primary" />
            <span>Auto-saved</span>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
