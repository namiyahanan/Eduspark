import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Lock, ChevronRight, GraduationCap, BookOpen, Crown, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useStudent } from '../contexts/StudentContext';
import { useLanguage } from '../contexts/LanguageContext';
import { syllabusData } from '../data/syllabus';
import { generatePracticeQuestions } from '../services/ai';

export default function GamifiedLearning() {
  const { studentInfo, recordTopicCompletion, recordTestAttempt } = useStudent();
  const { t, language } = useLanguage();
  
  const [step, setStep] = useState<'subject' | 'chapter' | 'level' | 'quiz' | 'result'>('subject');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [activeLevel, setActiveLevel] = useState<number>(1);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const grade = studentInfo?.grade || 'Class 10';
  const subjects = Object.keys(syllabusData[grade] || syllabusData['Class 10']);

  const startQuiz = async (level: number) => {
    setActiveLevel(level);
    setLoading(true);
    setStep('quiz');
    setScore(0);
    setCurrentQIndex(0);
    
    try {
      const difficulty = level <= 2 ? 'easy' : level <= 4 ? 'medium' : 'hard';
      const qData = await generatePracticeQuestions(selectedChapter, selectedSubject, difficulty, 10);
      setQuestions(qData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (index === questions[currentQIndex].correctIndex) {
      setScore(score + 10);
    }
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setStep('result');
      recordTestAttempt(score);
      if (score >= 40) recordTopicCompletion(selectedChapter);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full pb-24 lg:pb-10 min-h-screen text-white/80">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <GraduationCap className="w-8 h-8 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t('Level')} {activeLevel}</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter">
            {step === 'subject' ? t('Select Subject') : step === 'chapter' ? t('Select Chapter') : selectedChapter}
          </h2>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white/5 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-3 shadow-2xl">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="font-black text-white text-lg tracking-tight">XP: {score * 10}</span>
           </div>
           <div className="bg-white/5 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-3 shadow-2xl">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-black text-white text-lg tracking-tight">{t('Progress')}: {score}%</span>
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Step 1: Subject Selection */}
        {step === 'subject' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => { setSelectedSubject(sub); setStep('chapter'); }}
                className="group bg-white/5 border border-white/10 p-10 rounded-[3rem] text-left hover:border-primary/40 transition-all hover:bg-white/10 relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">{sub}</h3>
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">10 {t('Chapters')}</p>
                <ChevronRight className="absolute bottom-10 right-10 w-8 h-8 text-white/10 group-hover:text-primary group-hover:translate-x-2 transition-all" />
              </button>
            ))}
          </motion.div>
        )}

        {/* Step 2: Chapter Selection */}
        {step === 'chapter' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <button onClick={() => setStep('subject')} className="flex items-center gap-2 text-white/40 hover:text-white font-black uppercase text-xs tracking-widest mb-4">
              <ArrowLeft className="w-4 h-4" /> {t('Back')}
            </button>
            <div className="grid md:grid-cols-2 gap-4">
              {syllabusData[grade]?.[selectedSubject]?.units.map((unit: any) => 
                unit.topics.map((topic: any) => {
                  const topicName = typeof topic === 'string' ? topic : topic.name;
                  return (
                    <button
                      key={topicName}
                      onClick={() => { setSelectedChapter(topicName); setStep('level'); }}
                      className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-primary/50 transition-all group"
                    >
                      <span className="text-xl font-black text-white/80 group-hover:text-white">{topicName}</span>
                      <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-primary" />
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* Step 3: Level Selection */}
        {step === 'level' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-10">
            <div className="grid grid-cols-1 gap-8 w-full max-w-md">
              {[1, 2, 3, 4, 5].map((lvl) => {
                const isUnlocked = lvl === 1 || (studentInfo?.performance?.topicsCompleted || 0) >= (lvl - 1) * 2;
                const isActive = isUnlocked && lvl === activeLevel;
                
                return (
                  <button
                    key={lvl}
                    disabled={!isUnlocked}
                    onClick={() => startQuiz(lvl)}
                    className={`relative flex items-center justify-between p-8 rounded-[2.5rem] border-2 transition-all group ${
                      isUnlocked 
                        ? 'bg-primary/20 border-primary text-white shadow-[0_0_50px_rgba(74,222,128,0.2)]' 
                        : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'
                    } ${isActive ? 'ring-2 ring-primary ring-offset-4 ring-offset-black' : ''}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${isUnlocked ? 'bg-primary text-black' : 'bg-white/10'}`}>
                        {lvl}
                      </div>
                      <div className="text-left">
                        <h4 className="text-2xl font-black tracking-tight">{t('Level')} {lvl}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">10 {t('Questions')} • 100 {t('Score')}</p>
                      </div>
                    </div>
                    {!isUnlocked ? <Lock className="w-6 h-6 text-white/20" /> : <ChevronRight className="w-8 h-8 text-primary group-hover:translate-x-2 transition-all" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 4: Quiz Mode */}
        {step === 'quiz' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto w-full">
            {loading ? (
              <div className="h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
                <p className="text-white/40 font-black uppercase tracking-widest">{t('Initialize Session.')}</p>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex justify-between items-end">
                   <p className="text-primary font-black uppercase tracking-widest text-xs">{t('Question')} {currentQIndex + 1}/10</p>
                   <p className="text-white/40 font-black text-3xl">{score}</p>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQIndex + 1) / 10) * 100}%` }} className="h-full bg-primary" />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  {questions[currentQIndex]?.question}
                </h3>

                <div className="grid gap-4">
                  {questions[currentQIndex]?.options.map((opt: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="w-full text-left p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all font-bold text-lg text-white/80 hover:text-white"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 5: Result Screen */}
        {step === 'result' && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-40 h-40 rounded-[3rem] bg-primary text-black flex items-center justify-center shadow-[0_0_80px_rgba(74,222,128,0.4)] mb-10">
               <Trophy className="w-20 h-20" />
            </div>
            <h2 className="text-6xl font-black text-white tracking-tighter mb-4">{score >= 40 ? t('Quiz Complete!') : 'Keep Trying!'}</h2>
            <p className="text-3xl font-black text-primary mb-12">{t('Your Marks:')} {score}/100</p>
            
            <div className="flex gap-4">
               <button onClick={() => setStep('subject')} className="px-10 py-5 bg-white text-black rounded-full font-black text-lg uppercase tracking-widest hover:bg-primary transition-all">
                  {t('Finish Quiz')}
               </button>
               {score >= 40 && (
                 <button onClick={() => startQuiz(activeLevel + 1)} className="px-10 py-5 bg-primary/10 border border-primary text-primary rounded-full font-black text-lg uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                    {t('Next Question')}
                 </button>
               )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
