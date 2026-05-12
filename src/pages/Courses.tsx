import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CalendarClock, CheckCircle2, ChevronRight, ClipboardCheck, Clock, GraduationCap, LibraryBig, PlayCircle, Search, Sparkles, Star, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { useStudent } from '../contexts/StudentContext';
import { courseCatalog, liveClasses } from '../data/learningContent';
import { syllabusData } from '../data/syllabus';
import { generateLessonContent } from '../services/ai';
import { cleanAIOutput } from '../utils/helpers';

export default function Courses() {
  const { studentInfo, setActiveTopic } = useStudent();
  const [query, setQuery] = useState('');
  const [topicQuery, setTopicQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [activeSubject, setActiveSubjectState] = useState<string | null>(null);
  const [lessonContent, setLessonContent] = useState('');
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  const grade = studentInfo?.grade || 'Class 10';
  const board = studentInfo?.board || 'CBSE';
  const subjects = useMemo(() => ['All', ...new Set(courseCatalog.filter((course) => course.grade === grade).map((course) => course.subject))], [grade]);

  const filteredCourses = courseCatalog.filter((course) => {
    const matchesGrade = course.grade === grade || course.board === board;
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
    const matchesQuery = `${course.title} ${course.subject} ${course.mentor}`.toLowerCase().includes(query.toLowerCase());
    return matchesGrade && matchesSubject && matchesQuery;
  });

  const currentCourse = filteredCourses.find((course) => course.id === selectedCourseId) || filteredCourses[0] || courseCatalog[0];
  const subjectSyllabus = syllabusData[grade]?.[currentCourse.subject] || syllabusData['Class 10']?.[currentCourse.subject];
  const units = subjectSyllabus?.units || [];
  const filteredUnits = units
    .map((unit) => ({
      ...unit,
      topics: unit.topics.filter((topic) => {
        const topicName = typeof topic === 'string' ? topic : topic.name;
        const subtopics = typeof topic === 'string' ? '' : topic.subtopics?.join(' ') || '';
        return `${unit.name} ${topicName} ${subtopics}`.toLowerCase().includes(topicQuery.toLowerCase());
      }),
    }))
    .filter((unit) => unit.topics.length > 0);

  const startTopic = (subject: string, topic: string) => {
    setActiveTopic(topic, subject);
  };

  const openLesson = async (topic: string, subject: string) => {
    setSelectedTopic(topic);
    setActiveSubjectState(subject);
    setActiveTopic(topic, subject);
    setIsLoadingLesson(true);
    setLessonContent('');
    const content = await generateLessonContent(topic, subject);
    setLessonContent(cleanAIOutput(content));
    setIsLoadingLesson(false);
  };

  const closeLesson = () => {
    setSelectedTopic(null);
    setLessonContent('');
  };

  return (
    <div className="min-h-screen w-full pb-28 xl:pb-12">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10 lg:py-14">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
                <LibraryBig className="w-4 h-4" />
                Learning Hub
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white max-w-3xl">Complete courses, live classes, and tests in one place.</h1>
              <p className="text-white/55 text-lg mt-5 max-w-2xl">Personalized for {grade} {board}. Pick a course, continue a chapter, or jump straight into practice when the concept clicks.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ['Courses', filteredCourses.length.toString()],
                ['Live today', liveClasses.filter((item) => item.status !== 'Replay').length.toString()],
                ['Board tests', '32'],
              ].map(([label, value]) => (
                <div key={label} className="bg-black/35 border border-white/10 rounded-2xl p-5">
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-bold mt-2">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-5 lg:px-10 py-10 space-y-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, mentors, subjects"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={clsx(
                  'px-5 py-3 rounded-2xl text-sm font-black whitespace-nowrap border transition-all',
                  selectedSubject === subject ? 'bg-primary text-black border-primary' : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                )}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-primary/35 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-13 h-13 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${course.color}24`, color: course.color }}>
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/50 border border-white/10 rounded-full px-3 py-1">{course.level}</span>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white mt-6">{course.title}</h2>
              <p className="text-white/45 mt-2 text-sm">{course.subject} with {course.mentor}</p>

              <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${course.progress}%`, backgroundColor: course.color }} />
              </div>
              <p className="text-xs text-white/50 mt-2">{course.progress}% complete</p>

              <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                <div className="bg-black/25 rounded-2xl p-3"><p className="font-black text-white">{course.lessons}</p><p className="text-[10px] text-white/40 uppercase">Lessons</p></div>
                <div className="bg-black/25 rounded-2xl p-3"><p className="font-black text-white">{course.tests}</p><p className="text-[10px] text-white/40 uppercase">Tests</p></div>
                <div className="bg-black/25 rounded-2xl p-3"><p className="font-black text-white">{course.duration}</p><p className="text-[10px] text-white/40 uppercase">Plan</p></div>
              </div>

              <div className="space-y-3 mt-6">
                {course.outcomes.map((outcome) => (
                  <p key={outcome} className="flex items-center gap-2 text-sm text-white/60">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: course.color }} />
                    {outcome}
                  </p>
                ))}
              </div>

              <button
                data-subject={course.title}
                onClick={() => openLesson(course.outcomes[0], course.title)}
                className="mt-7 w-full flex items-center justify-between bg-white text-black rounded-2xl px-5 py-4 font-black hover:bg-primary transition-all continue-btn"
              >
                Continue course
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                data-subject={course.title}
                onClick={async () => {
                  setSelectedCourseId(course.id);
                  setTopicQuery('');
                  
                  // Connect to the new backend API for chapter list
                  try {
                    const res = await fetch(`http://localhost:5000/api/lessons?subject=${encodeURIComponent(course.title)}`);
                    const data = await res.json();
                    if (data.success) {
                      console.log('Chapters retrieved:', data.lessons);
                      // In a real app, we would update state here to show these specific lessons
                    }
                  } catch (e) {
                    console.error('Failed to fetch chapters:', e);
                  }

                  document.getElementById('course-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 font-black text-white/70 hover:text-white hover:border-primary/35 transition-all browse-btn"
              >
                Browse topics
                <BookOpen className="w-4 h-4 text-primary" />
              </button>
            </motion.article>
          ))}
        </div>

        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
          <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-primary text-xs uppercase tracking-[0.2em] font-black">Live Learning</p>
                <h2 className="text-3xl font-black text-white tracking-tight mt-1">Classes and replays</h2>
              </div>
              <CalendarClock className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-4">
              {liveClasses.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-black/25 rounded-2xl p-4 border border-white/5">
                  <div className={clsx('w-11 h-11 rounded-2xl flex items-center justify-center', item.status === 'Live' ? 'bg-red-500/15 text-red-300' : 'bg-primary/10 text-primary')}>
                    <PlayCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white truncate">{item.title}</p>
                    <p className="text-sm text-white/45">{item.time} - {item.duration} - {item.seats}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/50">{item.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="course-map" className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-primary text-xs uppercase tracking-[0.2em] font-black">Course Map</p>
                <h2 className="text-3xl font-black text-white tracking-tight mt-1">{currentCourse.title}</h2>
              </div>
              <ClipboardCheck className="w-8 h-8 text-primary" />
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={topicQuery}
                onChange={(event) => setTopicQuery(event.target.value)}
                placeholder="Search chapters, topics, subtopics"
                className="w-full bg-black/25 border border-white/10 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-primary/50"
              />
            </div>
            <div className="space-y-4 max-h-[470px] overflow-y-auto pr-1">
              {filteredUnits.map((unit, unitIndex) => (
                <div key={unit.name} className="bg-black/25 rounded-2xl border border-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-primary text-black flex items-center justify-center font-black">{unitIndex + 1}</span>
                    <p className="font-black text-white">{unit.name}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 mt-4">
                    {unit.topics.map((topic) => {
                      const topicName = typeof topic === 'string' ? topic : topic.name;
                      return (
                        <button
                          key={topicName}
                          onClick={() => openLesson(topicName, currentCourse.subject)}
                          className="flex items-center text-left gap-2 text-sm text-white/55 hover:text-primary bg-white/5 rounded-xl px-3 py-3 transition-colors"
                        >
                          <BookOpen className="w-4 h-4 shrink-0" />
                          <span className="min-w-0">
                            <span className="block truncate">{topicName}</span>
                            {typeof topic !== 'string' && topic.subtopics?.length ? (
                              <span className="block truncate text-[10px] text-white/35">{topic.subtopics.slice(0, 3).join(' - ')}</span>
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="grid md:grid-cols-3 gap-4">
          {[
            [Sparkles, 'Personalized revision', 'Daily cards adapt to accuracy and speed.'],
            [Users, 'Mentor support', 'Ask doubts, join teacher rooms, and save explanations.'],
            [Clock, 'Exam readiness', 'Timed mocks, paper generator, and weak-topic alerts.'],
          ].map(([Icon, title, copy]) => {
            const TileIcon = Icon as typeof Sparkles;
            return (
              <div key={title as string} className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <TileIcon className="w-7 h-7 text-primary mb-5" />
                <h3 className="font-black text-xl text-white">{title as string}</h3>
                <p className="text-white/45 mt-2">{copy as string}</p>
              </div>
            );
          })}
        </section>
      </main>

      <AnimatePresence>
        {selectedTopic && (
          <div className="fixed inset-0 z-[60] flex items-center justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLesson} className="absolute inset-0 bg-black/85 backdrop-blur-xl" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 34, stiffness: 300 }} className="relative bg-black w-full max-w-3xl h-full shadow-2xl flex flex-col border-l border-white/10">
              <div className="p-5 md:p-7 border-b border-white/10 bg-white/5 flex items-center gap-5">
                <button onClick={closeLesson} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <div>
                  <p className="text-primary text-xs uppercase tracking-[0.25em] font-black mb-1">AI lesson</p>
                  <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">{selectedTopic}</h3>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10">
                {isLoadingLesson ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <p className="text-white/45 uppercase tracking-[0.3em] text-xs font-black">Creating lesson notes</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-white/70 text-lg leading-8 space-y-6">
                      {lessonContent.split('\n\n').map((paragraph, index) => paragraph.startsWith('#') ? (
                        <h2 key={index} className="text-3xl font-black text-white pt-4">{paragraph.replace(/#/g, '').trim()}</h2>
                      ) : (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                      <Star className="w-10 h-10 text-primary mx-auto mb-4" />
                      <h4 className="text-2xl font-black text-white">Ready to test this?</h4>
                      <p className="text-white/45 mt-2 mb-6">Practice uses this topic as context for adaptive questions.</p>
                      <Link to={`/app/practice/${encodeURIComponent(activeSubject || currentCourse.subject)}/${encodeURIComponent(selectedTopic)}`} state={{ topic: selectedTopic, subject: activeSubject || currentCourse.subject }} className="inline-flex items-center justify-center gap-2 bg-primary text-black rounded-2xl px-6 py-4 font-black hover:bg-white transition-all">
                        Start practice
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
