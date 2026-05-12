import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, LineChart, FileText, Search, Bell, LogOut, LibraryBig, MessagesSquare, Gamepad2, Moon, Sun, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { useStudent } from '../contexts/StudentContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentInfo, logout } = useStudent();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Study Plans', path: '/app/study-plans', icon: FileText },
    { name: 'Subjects', path: '/app/courses', icon: LibraryBig },
    { name: 'Flashcards', path: '/app/flashcards', icon: Layers },
    { name: 'Gamified Learning', path: '/app/gamified-learning', icon: Gamepad2 },
    { name: 'Practice', path: '/app/practice', icon: Dumbbell },
    { name: 'Paper Gen', path: '/app/paper-gen', icon: FileText },
    { name: 'Doubts', path: '/app/doubts', icon: MessagesSquare },
    { name: 'Progress', path: '/app/analytics', icon: LineChart },
  ];

  return (
    <div className="bg-black text-white/80 min-h-screen flex flex-col font-sans selection:bg-primary/30">
      
      {/* TopNavBar (Universal Shell) */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="flex justify-between items-center px-4 md:px-6 py-3 w-full sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-2xl gap-4 lg:gap-8"
      >
        <div className="flex items-center gap-4 lg:gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            <span className="font-bold text-xl tracking-tighter text-white">EDU SPARK</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item, idx) => {
              const isActive = item.path === '/app' ? location.pathname === item.path : location.pathname.startsWith(item.path);
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-2 rounded-xl transition-all relative group",
                      isActive 
                        ? "text-primary font-bold" 
                        : "text-white/60 hover:text-white hover:bg-white/5 font-medium"
                    )}
                  >
                    <item.icon className={clsx("w-4 h-4 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
                    <span className="text-sm">{item.name}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/10 rounded-xl -z-10 border border-primary/20"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
            <input 
              className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all focus:bg-white/10" 
              placeholder="Search resources..." 
              type="text"
            />
          </motion.div>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <motion.button 
            onClick={toggleTheme}
            whileHover={{ rotate: theme === 'dark' ? 15 : -15 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 text-white/60 hover:bg-white/10 rounded-full transition-colors relative border border-white/5"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          <motion.button 
            whileHover={{ rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 text-white/60 hover:bg-white/10 rounded-full transition-colors relative border border-white/5"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_#4ADE80]" />
          </motion.button>
          
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10 py-1 group relative">
            <div className="text-right">
              <p className="text-sm font-black text-white">{studentInfo?.name || 'Student'}</p>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{studentInfo?.grade || 'Class 10'} • {studentInfo?.board || 'CBSE'}</p>
            </div>
            <motion.img 
              whileHover={{ scale: 1.1, rotate: 5 }}
              alt="Student" 
              className="w-10 h-10 rounded-full border-2 border-white/20 object-cover shadow-xl cursor-pointer" 
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${studentInfo?.name || 'alex'}`} 
            />
            {/* Logout Dropdown */}
            <div className="absolute top-full right-0 pt-4 hidden group-hover:block z-50">
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-black border border-white/10 rounded-2xl shadow-2xl p-2 w-48"
              >
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 font-bold hover:bg-red-400/10 rounded-xl transition-colors w-full text-left">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* BottomNavBar (Mobile Shell) */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] z-50 flex justify-around items-center px-2 py-3 xl:hidden bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl"
      >
        {navItems.map((item) => {
           const isActive = item.path === '/app' ? location.pathname === item.path : location.pathname.startsWith(item.path);
           return (
             <Link
               key={item.name}
               to={item.path}
               className={clsx(
                 "flex flex-col items-center justify-center rounded-2xl px-2 py-2 transition-all text-center relative min-w-0",
                 isActive 
                   ? "text-primary" 
                   : "text-white/40"
               )}
             >
               {isActive && (
                 <motion.div 
                   layoutId="mobile-nav-pill"
                   className="absolute inset-0 bg-primary/10 rounded-2xl -z-10 border border-primary/20"
                   transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                 />
               )}
               <item.icon className={clsx("w-5 h-5 mb-1 transition-transform", isActive && "scale-110")} />
               <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-14">{item.name.replace('Dashboard', 'App').replace('Paper Gen', 'Papers')}</span>
             </Link>
           );
        })}
      </motion.nav>
    </div>
  );
}
