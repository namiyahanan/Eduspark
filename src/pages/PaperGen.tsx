import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Settings, 
  Download, 
  Share2, 
  Plus, 
  X, 
  ChevronRight, 
  BookOpen, 
  Target, 
  Clock, 
  Shield, 
  Sparkles, 
  Printer, 
  FileDown,
  ChevronDown
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { useStudent } from '../contexts/StudentContext';
import { syllabusData } from '../data/syllabus';
import { generateQuestionPaper } from '../services/ai';
import { cleanAIOutput } from '../utils/helpers';
import { jsPDF } from 'jspdf';

type GeneratedPaper = {
  header?: {
    title?: string;
    board?: string;
    subject?: string;
    totalMarks?: number;
    duration?: number;
  };
  sections?: Array<{
    title: string;
    marks?: number;
    questions: string[];
  }>;
};

const getTopicName = (topic: string | { name: string }) => typeof topic === 'string' ? topic : topic.name;

export default function PaperGen() {
  const { studentInfo } = useStudent();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<GeneratedPaper | null>(null);
  const [config, setConfig] = useState({
    subject: 'Mathematics',
    board: studentInfo?.board || 'CBSE',
    chapters: [] as string[],
    customTopic: '',
    totalMarks: 80,
    time: 180,
  });

  const paperRef = useRef<HTMLDivElement>(null);

  const grade = studentInfo?.grade || 'Class 10';
  const syllabus = syllabusData[grade] || syllabusData['Class 10'];
  const subjects = Object.keys(syllabus);
  const currentSubject = syllabus[config.subject] ? config.subject : subjects[0];
  const availableChapters = syllabus[currentSubject]?.units.flatMap(unit => unit.topics.map(getTopicName)) || [];

  const handleGenerate = async () => {
    if (config.chapters.length === 0 && !config.customTopic) return;
    setIsGenerating(true);
    try {
      const paper = await generateQuestionPaper({
        board: config.board,
        subject: config.subject,
        chapters: config.chapters,
        totalMarks: config.totalMarks,
        duration: config.time,
        customInstructions: config.customTopic
      });
      setGeneratedPaper({
        ...paper,
        sections: paper.sections?.map((section: any) => ({
          ...section,
          questions: section.questions.map(cleanAIOutput),
        })),
      });
    } catch (error) {
      console.error('Generation Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedPaper) return;
    
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 30;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    const title = generatedPaper.header?.title || 'EXAMINATION 2025-26';
    doc.text(title, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    doc.setFontSize(12);
    doc.text(`${generatedPaper.header?.board || config.board} - ${config.subject}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;

    // Marks and Time
    doc.setFontSize(10);
    doc.text(`Time: ${config.time} Minutes`, margin, currentY);
    doc.text(`Maximum Marks: ${config.totalMarks}`, pageWidth - margin, currentY, { align: 'right' });
    currentY += 5;
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;

    // Sections
    generatedPaper.sections?.forEach((section) => {
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(section.title, margin, currentY);
      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      section.questions.forEach((q, idx) => {
        const text = `${idx + 1}. ${q}`;
        const lines = doc.splitTextToSize(text, pageWidth - (margin * 2) - 20);
        
        if (currentY + (lines.length * 5) > 270) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.text(lines, margin, currentY);
        if (section.marks) {
          doc.text(`(${section.marks})`, pageWidth - margin, currentY, { align: 'right' });
        }
        currentY += (lines.length * 5) + 5;
      });
      currentY += 5;
    });

    doc.save(`${config.subject}_Paper.pdf`);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-white/80 overflow-hidden font-sans">
      {/* Sidebar - Pro Config */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-[420px] bg-black border-r border-white/5 p-8 flex flex-col overflow-y-auto z-20 custom-scrollbar"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter">PaperGen.</h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Advanced Exam Factory</p>
          </div>
        </div>

        <div className="space-y-8 flex-1">
          {/* Custom Topic / Instructions */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Custom Topic / Instructions</label>
            <textarea
              value={config.customTopic}
              onChange={(e) => setConfig({ ...config, customTopic: e.target.value })}
              placeholder="e.g. Focus on Quantum Mechanics or Include case study on solar energy..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs font-medium text-white outline-none focus:border-primary/50 transition-all resize-none h-24"
            />
          </div>

          {/* Subject Selection */}
          <div className="space-y-4">
             <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Subject Area</label>
             <div className="grid grid-cols-2 gap-2">
                {subjects.map(s => (
                  <button
                    key={s}
                    onClick={() => setConfig({ ...config, subject: s })}
                    className={`p-3 text-xs font-bold rounded-xl border transition-all ${
                      config.subject === s 
                        ? 'bg-primary text-black border-primary' 
                        : 'bg-white/5 border-white/5 text-white/60 hover:border-white/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
             </div>
          </div>

          {/* Marks & Time */}
          <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Marks</span>
              </div>
              <input 
                type="number" 
                value={config.totalMarks}
                onChange={(e) => setConfig({ ...config, totalMarks: parseInt(e.target.value) || 0 })}
                className="w-16 bg-transparent border-b border-white/10 text-right text-sm font-bold text-primary outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Time (Min)</span>
              </div>
              <input 
                type="number" 
                value={config.time}
                onChange={(e) => setConfig({ ...config, time: parseInt(e.target.value) || 0 })}
                className="w-16 bg-transparent border-b border-white/10 text-right text-sm font-bold text-primary outline-none"
              />
            </div>
          </div>

          {/* Chapters */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Chapters Selection</label>
            <div className="flex flex-wrap gap-2">
              {config.chapters.map(c => (
                <button
                  key={c}
                  onClick={() => setConfig({ ...config, chapters: config.chapters.filter(i => i !== c) })}
                  className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-bold flex items-center gap-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  {c} <X className="w-3 h-3" />
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-2 pt-2">
              {availableChapters.filter(c => !config.chapters.includes(c)).slice(0, 4).map(c => (
                <button
                  key={c}
                  onClick={() => setConfig({ ...config, chapters: [...config.chapters, c] })}
                  className="text-left px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-[11px] font-medium text-white/40 hover:text-white hover:border-white/20 transition-all flex items-center justify-between group"
                >
                  {c} <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating || config.chapters.length === 0}
          className="mt-8 w-full bg-primary text-black py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(74,222,128,0.2)] disabled:opacity-50 transition-all"
        >
          {isGenerating ? <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin"></div> : <><Sparkles className="w-5 h-5" /> Assemble Paper</>}
        </motion.button>
      </motion.aside>

      {/* Preview Area - White Paper Aesthetic */}
      <main className="flex-1 bg-black p-6 lg:p-12 overflow-y-auto relative custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#4ADE80]"></div>
                <h3 className="text-xs font-black text-white tracking-widest uppercase opacity-60">Examination Blueprint</h3>
             </div>
             <div className="flex items-center gap-3">
                <button onClick={() => window.print()} className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-white/40 hover:text-primary transition-colors" title="Print">
                   <Printer className="w-4 h-4" />
                </button>
                <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase text-white hover:text-primary transition-all">
                   <FileDown className="w-4 h-4" /> Export PDF
                </button>
             </div>
          </div>

          <ScrollReveal direction="up" delay={0.1}>
            {/* The "White Paper" */}
            <div 
              ref={paperRef}
              className="bg-white text-black min-h-[1122px] w-full rounded-sm shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-12 lg:p-20 relative font-serif selection:bg-primary/20"
            >
              {/* Subtle Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }}></div>
              
              <div className="relative z-10">
                {/* Header Section */}
                <div className="text-center space-y-4 mb-16 border-b-2 border-black pb-8">
                  <h1 className="text-3xl font-bold uppercase tracking-tight">{generatedPaper?.header?.title || 'SCHOOL EXAMINATION 2025-26'}</h1>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-base font-bold uppercase tracking-widest">{generatedPaper?.header?.board || config.board} - {config.subject}</p>
                    <p className="text-[10px] uppercase font-bold text-black/60 italic tracking-tighter">Academic Session 2025-26 | Internal Assessment</p>
                  </div>
                  
                  <div className="flex justify-between items-end pt-6">
                    <div className="text-left">
                      <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5">Time Allowed</p>
                      <p className="text-sm font-bold">{config.time} Minutes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5">Maximum Marks</p>
                      <p className="text-sm font-bold">{config.totalMarks}</p>
                    </div>
                  </div>
                </div>

                {/* Instructions Section */}
                <div className="mb-12 space-y-3 border-l-4 border-black/10 pl-6 py-2 italic">
                  <h4 className="text-xs font-bold uppercase tracking-widest not-italic">General Instructions:</h4>
                  <ul className="text-xs space-y-1 list-disc ml-4 opacity-80 font-sans">
                    <li>All questions are compulsory.</li>
                    <li>The question paper contains multiple sections.</li>
                    <li>Marks for each question are indicated against it.</li>
                    <li>Draw diagrams wherever necessary.</li>
                  </ul>
                </div>

                {/* Question Sections */}
                <div className="space-y-12">
                  {(generatedPaper?.sections || [
                    { 
                      title: 'Section A: Objective Type Questions', 
                      marks: 1, 
                      questions: ['Define the fundamental concept of the subject matter.', 'Explain the historical significance of the current topic.', 'List three primary characteristics observed in this domain.'] 
                    },
                    { 
                      title: 'Section B: Short Answer Type Questions', 
                      marks: 3, 
                      questions: ['Compare and contrast the two main theories discussed in class.', 'Analyze the impact of external factors on the experimental results.'] 
                    }
                  ]).map((section, sIdx) => (
                    <div key={sIdx} className="space-y-8">
                      <div className="flex items-center justify-between border-y border-black/5 py-2">
                        <h2 className="text-base font-black uppercase tracking-[0.2em]">{section.title}</h2>
                        {section.marks && <span className="text-[10px] font-bold italic opacity-60">[{section.questions.length} × {section.marks} Marks]</span>}
                      </div>
                      
                      <div className="space-y-8">
                        {section.questions.map((q, qIdx) => (
                          <div key={qIdx} className="group flex justify-between gap-6">
                            <div className="flex-1">
                              <p className="text-base leading-relaxed text-black/90">
                                <span className="font-bold mr-3">{qIdx + 1}.</span>
                                {q}
                              </p>
                            </div>
                            {section.marks && (
                              <div className="shrink-0 pt-1">
                                <span className="text-sm font-bold">({section.marks})</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-20 pt-10 border-t border-black/10 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-30">--- End of Question Paper ---</p>
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none opacity-[0.02]">
                <h2 className="text-9xl font-black whitespace-nowrap tracking-tighter">OFFICIAL COPY</h2>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        @media print {
          .lg\\:w-\\[420px\\], button, .opacity-60 {
            display: none !important;
          }
          main {
            padding: 0 !important;
            background: white !important;
          }
          .max-w-4xl {
            max-width: 100% !important;
          }
          .bg-white {
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
