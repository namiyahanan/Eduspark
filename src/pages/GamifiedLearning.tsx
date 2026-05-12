import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Shield, Zap, Lock, ChevronRight, GraduationCap, Compass, BookOpen, Crown } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useStudent } from '../contexts/StudentContext';

const subjectsData = {
  Mathematics: {
    theme: 'from-green-500 to-yellow-400',
    icon: <Compass className="w-6 h-6" />,
    levels: [
      { id: 1, name: 'Foundation', x: 200, y: 100, completed: true, active: false, stars: 3 },
      { id: 2, name: 'Algebra 101', x: 500, y: 250, completed: true, active: false, stars: 2 },
      { id: 3, name: 'Geometric Logic', x: 300, y: 450, completed: false, active: true, stars: 0 },
      { id: 4, name: 'Trig Masters', x: 600, y: 600, completed: false, active: false, stars: 0 },
      { id: 5, name: 'Calculus Peak', x: 400, y: 800, completed: false, active: false, stars: 0 },
    ]
  },
  Science: {
    theme: 'from-green-400 to-pink-400',
    icon: <Zap className="w-6 h-6" />,
    levels: [
      { id: 1, name: 'Matter Basics', x: 250, y: 150, completed: true, active: false, stars: 3 },
      { id: 2, name: 'Forces in Motion', x: 450, y: 350, completed: false, active: true, stars: 0 },
      { id: 3, name: 'Chemical Bonds', x: 200, y: 550, completed: false, active: false, stars: 0 },
      { id: 4, name: 'Cellular World', x: 550, y: 700, completed: false, active: false, stars: 0 },
    ]
  },
  English: {
    theme: 'from-pink-500 to-rose-600',
    icon: <BookOpen className="w-6 h-6" />,
    levels: [
      { id: 1, name: 'Grammar Core', x: 300, y: 100, completed: false, active: true, stars: 0 },
      { id: 2, name: 'Creative Writing', x: 500, y: 300, completed: false, active: false, stars: 0 },
      { id: 3, name: 'Literature Analysis', x: 350, y: 600, completed: false, active: false, stars: 0 },
    ]
  }
};

type SubjectKey = keyof typeof subjectsData;

export default function GamifiedLearning() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setActiveTopic } = useStudent();
  
  const defaultSubject = location.state?.subject && Object.keys(subjectsData).includes(location.state.subject as string)
    ? (location.state.subject as SubjectKey)
    : 'Mathematics';
    
  const [activeSubject, setActiveSubject] = useState<SubjectKey>(defaultSubject);

  const currentSubjectData = subjectsData[activeSubject];
  const levels = currentSubjectData.levels;

  const launchLevel = (level = levels.find(l => l.active) || levels[0]) => {
    if (!level.completed && !level.active) return;
    setActiveTopic(level.name, activeSubject);
    navigate(`/app/practice/${encodeURIComponent(activeSubject)}/${encodeURIComponent(level.name)}`, { state: { topic: level.name, subject: activeSubject } });
  };

  useEffect(() => {
    const activeLevel = levels.find(l => l.active);
    if (activeLevel && scrollRef.current) {
      scrollRef.current.scrollTop = activeLevel.y - 200;
    }
  }, [activeSubject, levels]);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full pb-24 lg:pb-10 min-h-screen text-white/80 overflow-hidden">
      <ScrollReveal direction="up" delay={0.1} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
               <GraduationCap className="w-8 h-8 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Quest Protocol</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter">Learning Path.</h2>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white/5 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-3 shadow-2xl">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="font-black text-white text-lg tracking-tight">Level 24</span>
             </div>
             <div className="bg-white/5 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-3 shadow-2xl">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-black text-white text-lg tracking-tight">12.4k XP</span>
             </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Subject Selector */}
      <div className="flex overflow-x-auto gap-4 mb-10 pb-4 scrollbar-hide">
        {(Object.keys(subjectsData) as SubjectKey[]).map((subject) => (
          <button
            key={subject}
            onClick={() => setActiveSubject(subject)}
            className={`flex items-center gap-3 px-6 py-4 rounded-3xl font-bold whitespace-nowrap transition-all border ${
              activeSubject === subject 
                ? `bg-gradient-to-r ${subjectsData[subject].theme} text-white border-transparent shadow-lg scale-105` 
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {subjectsData[subject].icon}
            {subject}
          </button>
        ))}
      </div>

      {/* Main Quest Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* The Winding Map */}
        <div className="lg:col-span-8 bg-white/5 backdrop-blur-xl rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden h-[700px]">
           <div className={`absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-gradient-to-br ${currentSubjectData.theme} mix-blend-overlay`}></div>

           <div ref={scrollRef} className="absolute inset-0 overflow-y-auto overflow-x-hidden p-10 scrollbar-hide scroll-smooth">
              <div className="relative w-full h-[1000px]">
                {/* SVG Path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 1000">
                   <motion.path
                     key={`${activeSubject}-path-bg`}
                     d={`M ${levels[0].x} ${levels[0].y} ` + levels.slice(1).map(l => `T ${l.x} ${l.y}`).join(' ')}
                     fill="none"
                     stroke="rgba(255, 255, 255, 0.1)"
                     strokeWidth="12"
                     strokeLinecap="round"
                   />
                   <motion.path
                     key={`${activeSubject}-path-active`}
                     d={`M ${levels[0].x} ${levels[0].y} ` + levels.slice(1).map(l => `T ${l.x} ${l.y}`).join(' ')}
                     fill="none"
                     stroke="url(#pathGradient)"
                     strokeWidth="12"
                     strokeLinecap="round"
                     strokeDasharray="0 1"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 0.6 }}
                     transition={{ duration: 2, ease: "easeInOut" }}
                   />
                   <defs>
                      <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                         <stop offset="0%" stopColor="#16a34a" />
                         <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                   </defs>
                </svg>

                {/* Level Nodes */}
                <AnimatePresence mode="popLayout">
                  {levels.map((level, idx) => (
                    <motion.div
                      key={`${activeSubject}-${level.id}`}
                      initial={{ opacity: 0, scale: 0, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ delay: idx * 0.15, type: 'spring' }}
                      style={{ left: level.x, top: level.y }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                      <motion.button
                        whileHover={{ scale: 1.15, rotate: level.completed ? 0 : 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => launchLevel(level)}
                        type="button"
                        className={`relative w-24 h-24 rounded-[2rem] flex items-center justify-center border-4 transition-all shadow-2xl ${
                          level.completed 
                            ? `bg-gradient-to-br ${currentSubjectData.theme} border-white/20 text-white` 
                            : level.active 
                              ? 'bg-black border-primary text-primary animate-[pulse_2s_infinite]' 
                              : 'bg-white/5 border-white/10 text-white/20 backdrop-blur-md'
                        }`}
                      >
                        {level.completed ? (
                          <div className="flex flex-col items-center">
                            <Trophy className="w-8 h-8" />
                            <div className="flex mt-1">
                              {[1, 2, 3].map(s => (
                                <Star key={s} className={`w-3 h-3 ${s <= level.stars ? 'fill-yellow-400 text-yellow-400' : 'opacity-20'}`} />
                              ))}
                            </div>
                          </div>
                        ) : level.active ? (
                          <div className="flex flex-col items-center">
                            <Zap className="w-8 h-8 fill-primary" />
                            <span className="text-[10px] font-black uppercase mt-1">START</span>
                          </div>
                        ) : (
                          <Lock className="w-8 h-8" />
                        )}

                        {/* Label */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                           <p className={`font-bold uppercase tracking-wider text-[10px] ${level.active ? 'text-primary' : 'text-white/60'}`}>
                             {level.name}
                          </p>
                        </div>
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             key={`${activeSubject}-stats`}
             className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 shadow-2xl"
           >
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
                 <Shield className="w-7 h-7 text-primary" />
                 {activeSubject} Mastery
              </h3>
              <div className="space-y-8">
                 <div className="space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-xs font-black text-white/40 uppercase tracking-widest">Subject Progress</span>
                       <span className="text-sm font-black text-primary">
                         {Math.round((levels.filter(l => l.completed).length / levels.length) * 100)}%
                       </span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-3 p-1 border border-white/5 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(levels.filter(l => l.completed).length / levels.length) * 100}%` }}
                         transition={{ duration: 1, delay: 0.5 }}
                         className={`h-full rounded-full bg-gradient-to-r ${currentSubjectData.theme} shadow-[0_0_15px_rgba(22,163,74,0.35)]`}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                       <p className="text-3xl font-black text-white">{levels.length}</p>
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Lessons</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                       <p className="text-3xl font-black text-yellow-400">
                         {levels.reduce((acc, l) => acc + (l.stars || 0), 0)}
                       </p>
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Stars</p>
                    </div>
                 </div>
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ scale: 1.02, y: -5 }}
             className={`bg-gradient-to-br ${currentSubjectData.theme} p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden`}
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <h3 className="text-2xl font-black mb-4 tracking-tighter relative z-10">Next Challenge</h3>
              <p className="text-white/80 font-medium mb-8 relative z-10">
                Continue your journey in {activeSubject}. The next lesson is waiting!
              </p>
              <button
                onClick={() => launchLevel()}
                className="w-full bg-white text-black py-4 rounded-full font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all relative z-10"
              >
                 Enter Arena <ChevronRight className="w-5 h-5" />
              </button>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
