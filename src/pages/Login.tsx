import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Lock, User, ChevronRight, Sparkles } from 'lucide-react';
import { useStudent } from '../contexts/StudentContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStudent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: 'Class 10',
    board: 'CBSE'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: formData.name,
      email: formData.email,
      grade: formData.grade,
      board: formData.board,
      interests: ['Mathematics', 'Science', 'Social Science', 'English']
    });
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans selection:bg-primary/30 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        {/* Brand */}
        <div className="flex flex-col items-center mb-16">
          <Link to="/" className="flex items-center gap-4 mb-6 group">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-transform group-hover:rotate-12">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-black text-4xl tracking-tighter text-white">EDU SPARK</span>
          </Link>
          <div className="flex items-center gap-2 px-6 py-2 bg-white/5 rounded-full border border-white/10">
             <Sparkles className="w-4 h-4 text-primary" />
             <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">AI Learning Protocol</span>
          </div>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-3xl p-10 md:p-16 rounded-[4rem] border border-white/10 shadow-2xl shadow-black/50"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Initialize Session.</h2>
            <p className="text-white/40 font-medium text-lg">Enter your credentials to access your portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-16 py-5 text-white outline-none focus:border-primary/50 transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="Academic Email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-16 py-5 text-white outline-none focus:border-primary/50 transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 text-white outline-none focus:border-primary/50 transition-all appearance-none font-medium cursor-pointer"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                >
                  <option className="bg-black">Class 10</option>
                  <option className="bg-black">Class 12</option>
                </select>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-5 text-white outline-none focus:border-primary/50 transition-all appearance-none font-medium cursor-pointer"
                  value={formData.board}
                  onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                >
                  <option className="bg-black">CBSE</option>
                  <option className="bg-black">ICSE</option>
                  <option className="bg-black">State Board</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-primary text-black py-6 rounded-full font-black text-xl flex items-center justify-center gap-4 shadow-[0_0_50px_rgba(74,222,128,0.24)] transition-all mt-12 hover:bg-primary/90"
            >
              Access Portal
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </form>

          <p className="mt-12 text-center text-white/20 text-xs font-black uppercase tracking-[0.2em]">
            By logging in, you agree to the <span className="text-white/40 hover:text-primary cursor-pointer transition-colors underline">Neural Protocols</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
