import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Lock, ChevronRight, GraduationCap, BookOpen, Crown, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useStudent } from '../contexts/StudentContext';
import { useLanguage } from '../contexts/LanguageContext';
import { syllabusData } from '../data/syllabus';
import { generatePracticeQuestions } from '../services/ai';

export default function GamifiedLearning() {
  const { studentInfo, performance, recordTopicCompletion, recordTestAttempt } = useStudent();
  const { t, language } = useLanguage();
  
  const [step, setStep] = useState<'subject' | 'chapter' | 'level' | 'quiz' | 'result'>('subject');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [activeLevel, setActiveLevel] = useState<number>(1);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

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
    if (isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(index);
    
    const isCorrect = index === questions[currentQIndex].correctIndex;
    if (isCorrect) {
      setScore(score + 10);
    }
    
    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(currentQIndex + 1);
        setSelectedAnswer(null);
        setIsAnswering(false);
      } else {
        setStep('result');
        const finalScore = isCorrect ? score + 10 : score;
        recordTestAttempt(finalScore);
        if (finalScore >= 40) {
           recordTopicCompletion(selectedChapter);
        }
        setIsAnswering(false);
        setSelectedAnswer(null);
      }
    }, 800); // Increased delay to see feedback
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full pb-32 lg:pb-10 min-h-screen text-white/80 overflow-y-auto">
      
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

        {/* Step 3: Level Selection - Map Style */}
        {step === 'level' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-10">
            <button onClick={() => setStep('chapter')} className="self-start flex items-center gap-2 text-white/40 hover:text-white font-black uppercase text-xs tracking-widest mb-10">
              <ArrowLeft className="w-4 h-4" /> {t('Back')}
            </button>
            
            <div className="relative flex flex-col items-center gap-12 w-full max-w-md pb-20">
              {/* Vertical Path Line */}
              <div className="absolute top-10 bottom-10 w-1 bg-white/5 left-1/2 -translate-x-1/2" />
              
              {[1, 2, 3, 4, 5].map((lvl, idx) => {
                const isUnlocked = lvl === 1 || (performance?.topicsCompleted || 0) >= (lvl - 1);
                const isActive = isUnlocked && lvl === activeLevel;
                const isOdd = idx % 2 !== 0;
                
                return (
                  <motion.button
                    key={lvl}
                    disabled={!isUnlocked}
                    whileHover={isUnlocked ? { scale: 1.1 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                    onClick={() => startQuiz(lvl)}
                    className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white border-4 border-white' 
                        : 'bg-gray-800 text-white/20 border-4 border-white/5 grayscale'
                    } ${isOdd ? 'translate-x-16' : '-translate-x-16'}`}
                  >
                    <span className="text-3xl font-black italic">{lvl}</span>
                    
                    {/* Stars below the level node */}
                    <div className="absolute -bottom-6 flex gap-1">
                      {[1, 2, 3].map(s => (
                        <Star key={s} className={`w-4 h-4 ${isUnlocked ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />
                      ))}
                    </div>

                    {/* Connecting line to next level */}
                    {lvl < 5 && (
                      <div className={`absolute top-full h-12 w-1 bg-white/10 -translate-x-1/2 left-1/2 ${isUnlocked ? 'bg-green-500/30' : ''}`} />
                    )}

                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white/60" />
                      </div>
                    )}
                  </motion.button>
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
              <div className="space-y-6 md:space-y-10">
                <div className="flex justify-between items-end">
                   <p className="text-primary font-black uppercase tracking-widest text-xs">{t('Question')} {currentQIndex + 1}/10</p>
                   <p className="text-white/40 font-black text-3xl">{score}</p>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQIndex + 1) / 10) * 100}%` }} className="h-full bg-primary" />
                </div>
                
                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">
                  {questions[currentQIndex]?.question}
                </h3>

                <div className="grid gap-3 md:gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {questions[currentQIndex]?.options.map((opt: string, i: number) => {
                    const isSelected = selectedAnswer === i;
                    const isCorrect = i === questions[currentQIndex].correctIndex;
                    const showSuccess = isAnswering && isCorrect;
                    const showError = isAnswering && isSelected && !isCorrect;

                    return (
                      <button
                        key={i}
                        disabled={isAnswering}
                        onClick={() => handleAnswer(i)}
                        className={`w-full text-left p-5 md:p-6 rounded-3xl border transition-all font-bold text-base md:text-lg relative overflow-hidden ${
                          showSuccess 
                            ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]' 
                            : showError
                              ? 'bg-red-500/20 border-red-500 text-red-400'
                              : isAnswering && !isCorrect
                                ? 'bg-white/5 border-white/5 opacity-40'
                                : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10 text-white/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                            showSuccess ? 'bg-green-500 text-white' : showError ? 'bg-red-500 text-white' : 'bg-white/10'
                          }`}>
                            {showSuccess ? <CheckCircle2 className="w-4 h-4" /> : showError ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                          </div>
                          {opt}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 5: Result Screen - Score! Hero Style */}
        {step === 'result' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-gradient-to-b from-[#1a4d2e] to-[#0a1f12] w-full max-w-md rounded-[3rem] p-10 text-center border-4 border-white/20 shadow-[0_0_100px_rgba(34,197,94,0.3)] relative overflow-hidden"
            >
              {/* Score! Hero Style Background Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
              </div>

              <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase drop-shadow-lg">
                {score >= 90 ? 'Amazing!' : score >= 70 ? 'Great Job!' : score >= 40 ? 'Level Clear!' : 'Try Again!'}
              </h2>
              
              <div className="flex justify-center gap-4 my-10">
                {[1, 2, 3].map((star) => {
                  const isFilled = (star === 1 && score >= 40) || (star === 2 && score >= 70) || (star === 3 && score >= 90);
                  return (
                    <motion.div
                      key={star}
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3 + (star * 0.2), type: 'spring' }}
                    >
                      <Star 
                        className={`w-16 h-16 ${isFilled ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'text-white/10'}`} 
                        strokeWidth={1}
                      />
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-2 mb-10">
                <p className="text-white/60 font-bold uppercase tracking-[0.2em] text-xs">Final Score</p>
                <div className="text-7xl font-black text-white italic tracking-tighter">
                   {score}<span className="text-2xl text-white/40 not-italic ml-1">/100</span>
                </div>
              </div>

              <div className="grid gap-4">
                {score >= 40 ? (
                  <button 
                    onClick={() => startQuiz(activeLevel + 1)} 
                    className="w-full py-6 bg-yellow-400 hover:bg-yellow-300 text-black rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_10px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
                  >
                    Next Level <ChevronRight className="w-6 h-6" />
                  </button>
                ) : (
                  <button 
                    onClick={() => startQuiz(activeLevel)} 
                    className="w-full py-6 bg-white hover:bg-gray-100 text-black rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_10px_0_rgb(156,163,175)] active:translate-y-1 active:shadow-none transition-all"
                  >
                    Retry
                  </button>
                )}
                <button 
                  onClick={() => setStep('subject')} 
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                >
                  Exit to Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
