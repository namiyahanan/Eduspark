import React, { useState } from 'react';
import { Target, Calendar, CheckCircle2, Clock, Plus, Flame, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import ScrollReveal from '../components/ScrollReveal';

export default function StudyPlansPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const dailyGoals = [
    { id: 1, title: 'Complete Math Quiz', subject: 'Mathematics', duration: '30 mins', completed: true },
    { id: 2, title: 'Read Science Chapter 4', subject: 'Science', duration: '45 mins', completed: false },
    { id: 3, title: 'Practice Grammar Exercises', subject: 'English', duration: '20 mins', completed: false },
  ];

  const weeklyMilestones = [
    { id: 1, title: 'Master Algebra Basics', progress: 80, target: 'Friday' },
    { id: 2, title: 'Complete Physics Lab', progress: 40, target: 'Sunday' },
    { id: 3, title: 'Essay Submission', progress: 100, target: 'Wednesday' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full min-h-screen pb-24 lg:pb-10">
      <ScrollReveal direction="up" delay={0.1}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-8 h-8 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Your Journey</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">Study Plans.</h1>
            <p className="text-white/60 mt-4 max-w-xl">Organize your learning journey, set goals, and track your milestones to achieve academic excellence.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 flex flex-col items-center shadow-2xl">
              <Flame className="w-6 h-6 text-red-500 mb-1" />
              <span className="font-black text-white text-lg">7 Day</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Streak</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 flex flex-col items-center shadow-2xl">
              <Target className="w-6 h-6 text-primary mb-1" />
              <span className="font-black text-white text-lg">85%</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Completion</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Goals */}
        <div className="lg:col-span-8 space-y-8">
          {/* Tab Navigation */}
          <div className="bg-white/5 p-2 rounded-2xl inline-flex gap-2 border border-white/10">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'daily' ? 'bg-primary text-black shadow-lg' : 'text-white/60 hover:text-white'
              }`}
            >
              Daily Goals
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'weekly' ? 'bg-primary text-black shadow-lg' : 'text-white/60 hover:text-white'
              }`}
            >
              Weekly Milestones
            </button>
          </div>

          {/* Goals List */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white">
                {activeTab === 'daily' ? "Today's Tasks" : "This Week's Milestones"}
              </h2>
              <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-bold">
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === 'daily' ? (
                dailyGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-2xl p-5 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <button className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        goal.completed ? 'bg-primary border-primary text-black' : 'border-white/20 text-transparent hover:border-primary/50'
                      }`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <div>
                        <h3 className={`font-bold text-lg ${goal.completed ? 'text-white/40 line-through' : 'text-white'}`}>
                          {goal.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {goal.subject}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {goal.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                weeklyMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">{milestone.title}</h3>
                        <p className="text-sm text-white/50 mt-1">Target: {milestone.target}</p>
                      </div>
                      <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black">
                        {milestone.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${milestone.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${milestone.progress === 100 ? 'bg-primary' : 'bg-pink-500'}`}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-primary/20 to-pink-500/20 p-[1px] rounded-[2.5rem]">
            <div className="bg-black/80 backdrop-blur-2xl rounded-[2.5rem] p-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-black text-white">AI Recommendations</h3>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-4">
                  <h4 className="text-sm font-bold text-white mb-2">Focus on Algebra</h4>
                  <p className="text-xs text-white/60 leading-relaxed">Based on recent quizzes, allocating 20 extra minutes to Algebra will improve your overall math score.</p>
                </div>
                <div className="border-l-2 border-pink-500 pl-4">
                  <h4 className="text-sm font-bold text-white mb-2">Revise Physics Notes</h4>
                  <p className="text-xs text-white/60 leading-relaxed">You have an upcoming assessment in 3 days. We recommend reviewing Chapter 2 tonight.</p>
                </div>
              </div>

              <button className="mt-8 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                Generate Smart Plan <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
