import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Camera, CheckCircle2, Clock3, FileText, Lightbulb, MessagesSquare, Mic, Paperclip, Search, Send, ShieldCheck, Sparkles, UserRound, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useStudent } from '../contexts/StudentContext';
import { doubtThreads } from '../data/learningContent';
import { generateConceptExplanation } from '../services/ai';
import { useLanguage } from '../contexts/LanguageContext';

const MAX_UPLOAD_SIZE = 8 * 1024 * 1024;
const SUPPORTED_UPLOAD_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export default function Doubts() {
  const { studentInfo } = useStudent();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState(studentInfo?.interests?.[0] || 'Mathematics');
  const [drafts, setDrafts] = useState(doubtThreads);
  const [isAsking, setIsAsking] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = useMemo(() => {
    const profileSubjects = studentInfo?.interests?.length ? studentInfo.interests : ['Mathematics', 'Science', 'English', 'Social Science'];
    return [...new Set(profileSubjects)];
  }, [studentInfo?.interests]);

  const askDoubt = async () => {
    if (!question.trim()) return;
    const askedQuestion = question.trim();
    const draftId = `local-${Date.now()}`;
    setIsAsking(true);
    setDrafts((current) => [
      {
        id: draftId,
        subject,
        question: askedQuestion,
        answer: t('Preparing a clear explanation...'),
        status: 'AI draft',
        time: t('Just now'),
      },
      ...current,
    ]);
    setQuestion('');

    const attachmentContext = attachments.length
      ? ` Attached files: ${attachments.map((file) => file.name).join(', ')}.`
      : '';
    const explanation = await generateConceptExplanation(`${askedQuestion} (${subject}).${attachmentContext}`, 'beginner');
    setDrafts((current) =>
      current.map((item) =>
        item.id === draftId
          ? { ...item, answer: explanation }
          : item
      )
    );
    setAttachments([]);
    setIsAsking(false);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setUploadError('');
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (!SUPPORTED_UPLOAD_TYPES.includes(file.type)) {
        setUploadError(`${file.name} is not a supported file type.`);
        return;
      }
      if (file.size > MAX_UPLOAD_SIZE) {
        setUploadError(`${file.name} is larger than 8 MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length) {
      setAttachments((current) => [...current, ...validFiles].slice(0, 5));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto w-full px-5 lg:px-10 py-10 pb-28 xl:pb-12">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
        <section className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
              <MessagesSquare className="w-4 h-4" />
              {t('Doubt Center')}
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">{t('Ask, solve, and revise every doubt.')}</h1>
            <p className="text-white/55 text-lg mt-5">{t('Built for the real homework loop: type a doubt, attach a photo, get an AI explanation, and keep a mentor review trail.')}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6">
            <div className="flex gap-2 overflow-x-auto pb-3">
              {subjects.map((item) => (
                <button
                  key={item}
                  onClick={() => setSubject(item)}
                  className={clsx(
                    'px-4 py-2 rounded-xl border text-sm font-black whitespace-nowrap transition-all',
                    subject === item ? 'bg-primary text-black border-primary' : 'bg-white/5 text-white/55 border-white/10 hover:text-white'
                  )}
                >
                  {t(item)}
                </button>
              ))}
            </div>

            <div className="rounded-3xl bg-black/35 border border-white/10 overflow-hidden">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <Bot className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-black text-white">{t('EduSpark AI Mentor')}</p>
                  <p className="text-xs text-white/40">{t('Fast explanation first, teacher review when needed')}</p>
                </div>
              </div>

              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={t('Type your doubt here. Example: I do not understand why the image is virtual in a convex mirror.')}
                className="w-full min-h-44 bg-transparent p-5 outline-none resize-none text-white placeholder:text-white/25"
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-t border-white/10 px-5 py-4">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={SUPPORTED_UPLOAD_TYPES.join(',')}
                    onChange={(event) => handleFiles(event.target.files)}
                    className="hidden"
                  />
                  <button onClick={() => fileInputRef.current?.click()} className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-white/55 hover:text-white hover:border-primary/30 flex items-center justify-center transition-all" aria-label="Upload image">
                    <Camera className="w-5 h-5" />
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-white/55 hover:text-white hover:border-primary/30 flex items-center justify-center transition-all" aria-label="Attach document">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-white/55 hover:text-white hover:border-primary/30 flex items-center justify-center transition-all" aria-label="Record voice note">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={askDoubt}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-black px-6 py-3 rounded-2xl font-black hover:bg-white transition-all disabled:opacity-40"
                  disabled={!question.trim() || isAsking}
                >
                  {isAsking ? t('Drafting...') : t('Ask mentor')}
                  <Send className="w-5 h-5" />
                </button>
              </div>
              {(attachments.length > 0 || uploadError) && (
                <div className="border-t border-white/10 px-5 py-4 space-y-2">
                  {uploadError && <p className="text-red-300 text-sm font-bold">{uploadError}</p>}
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file) => (
                      <span key={`${file.name}-${file.lastModified}`} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-xs text-white/65">
                        <FileText className="w-4 h-4 text-primary" />
                        {file.name}
                        <button
                          onClick={() => setAttachments((current) => current.filter((item) => item !== file))}
                          className="text-white/35 hover:text-red-300"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              [Sparkles, t('AI first answer'), t('Get a clean explanation in seconds.')],
              [ShieldCheck, t('Teacher verified'), t('Escalate hard doubts to mentors.')],
              [Lightbulb, t('Practice from doubt'), t('Turn mistakes into drills.')],
            ].map(([Icon, title, copy]) => {
              const TileIcon = Icon as typeof Sparkles;
              return (
                <div key={title as string} className="bg-white/5 border border-white/10 rounded-3xl p-5">
                  <TileIcon className="w-7 h-7 text-primary mb-4" />
                  <h3 className="font-black text-white">{title as string}</h3>
                  <p className="text-sm text-white/45 mt-2">{copy as string}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-primary text-xs uppercase tracking-[0.2em] font-black">{t('Recent Doubts')}</p>
              <h2 className="text-3xl font-black text-white tracking-tight mt-1">{t('Resolution timeline')}</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input className="bg-black/30 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/40" placeholder="Search doubts" />
            </div>
          </div>

          <div className="space-y-4">
            {drafts.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-black/30 border border-white/10 rounded-3xl p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {item.status === 'Solved' ? <CheckCircle2 className="w-6 h-6" /> : <Clock3 className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 items-center mb-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">{t(item.subject)}</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/35">{t(item.time)}</span>
                      <span className={clsx(
                        'text-[10px] uppercase tracking-[0.2em] font-black px-2 py-1 rounded-full',
                        item.status === 'Solved' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/10 text-white/55'
                      )}>
                        {t(item.status)}
                      </span>
                    </div>
                    <p className="text-white font-black text-lg leading-snug">{item.question}</p>
                    <div className="mt-4 bg-white/5 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-white/45 text-xs uppercase tracking-[0.2em] font-black mb-2">
                        <UserRound className="w-4 h-4" />
                        {t('Explanation')}
                      </div>
                      <p className="text-white/60">{item.answer}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/app/practice/${encodeURIComponent(item.subject)}/${encodeURIComponent(item.question)}`, { state: { topic: item.question, subject: item.subject } })}
                      className="mt-4 inline-flex items-center gap-2 text-primary font-black text-sm hover:text-white transition-colors"
                    >
                      {t('Create practice drill')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
