import { motion } from 'framer-motion';
import { 
  Play, Download, ArrowRight, GraduationCap, 
  Gamepad2, CheckCircle2, Sparkles, MessageSquare 
} from 'lucide-react';
import { clsx } from 'clsx';

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * A. "Launch Quest" (Start Quiz/Practice)
 * Vibrant Yellow, Pulsing animation.
 */
export const LaunchQuestButton = ({ onClick, className }: ButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.92 }}
    animate={{ 
      boxShadow: ["0 0 0px rgba(241, 196, 15, 0)", "0 0 20px rgba(241, 196, 15, 0.4)", "0 0 0px rgba(241, 196, 15, 0)"]
    }}
    transition={{ duration: 2, repeat: Infinity }}
    onClick={onClick}
    className={clsx(
      "bg-[#FACC15] text-black px-8 py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#CA8A04] active:shadow-none active:translate-y-[6px] transition-all flex items-center gap-3",
      className
    )}
  >
    <Gamepad2 className="w-6 h-6" />
    LAUNCH QUEST
  </motion.button>
);

/**
 * B. "Cast Answer" (Submit Answer)
 * Green, Slide-in checkmark effect.
 */
export const CastAnswerButton = ({ onClick, className, disabled }: ButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: "#15803d" }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      "bg-[#16A34A] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#15803d] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center gap-3 min-w-[200px]",
      disabled && "opacity-50 grayscale cursor-not-allowed",
      className
    )}
  >
    <CheckCircle2 className="w-5 h-5" />
    CAST ANSWER
  </motion.button>
);

/**
 * C. "Next Realm" (Next Lesson)
 * Pink, Arrow slide animation.
 */
export const NextRealmButton = ({ onClick, className }: ButtonProps) => (
  <motion.button
    whileHover="hover"
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={clsx(
      "bg-[#DB2777] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#BE185D] active:shadow-none active:translate-y-[6px] transition-all flex items-center gap-3",
      className
    )}
  >
    <span>NEXT REALM</span>
    <motion.div
      variants={{
        hover: { x: [0, 5, 0], transition: { repeat: Infinity, duration: 0.6 } }
      }}
    >
      <ArrowRight className="w-5 h-5" />
    </motion.div>
  </motion.button>
);

/**
 * D. "Harvest Resource" (Download)
 * Green, Bounce animation.
 */
export const HarvestResourceButton = ({ onClick, className }: ButtonProps) => (
  <motion.button
    whileHover="hover"
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={clsx(
      "bg-[#16A34A] text-white px-6 py-4 rounded-2xl font-black text-sm shadow-[0_6px_0_#15803D] active:shadow-none active:translate-y-[6px] transition-all flex items-center gap-3",
      className
    )}
  >
    <motion.div
      variants={{
        hover: { y: [-2, 2, -2], transition: { repeat: Infinity, duration: 0.8 } }
      }}
    >
      <Download className="w-5 h-5" />
    </motion.div>
    HARVEST RESOURCE
  </motion.button>
);

/**
 * E. "Unveil Wisdom" (Watch Video)
 * Salmon Red, Ripple effect.
 */
export const UnveilWisdomButton = ({ onClick, className }: ButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={clsx(
      "bg-[#DC2626] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#B91C1C] active:shadow-none active:translate-y-[6px] transition-all flex items-center gap-3 group overflow-hidden relative",
      className
    )}
  >
    <div className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
    <Play className="w-6 h-6 fill-white" />
    <span className="relative z-10">UNVEIL WISDOM</span>
  </motion.button>
);

/**
 * F. "Ascension Scroll" (Get Certificate)
 * Pink, Sparkle effect.
 */
export const AscensionScrollButton = ({ onClick, className }: ButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={clsx(
      "bg-[#EC4899] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#DB2777] active:shadow-none active:translate-y-[6px] transition-all flex items-center gap-3 relative",
      className
    )}
  >
    <motion.div
      animate={{ 
        rotate: [0, 10, -10, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Sparkles className="w-6 h-6 text-yellow-300 fill-yellow-300" />
    </motion.div>
    ASCENSION SCROLL
  </motion.button>
);

/**
 * G. "Join Portal" (Join Class)
 * Darker Action, Expansion effect.
 */
export const JoinPortalButton = ({ onClick, className }: ButtonProps) => (
  <motion.button
    whileHover={{ gap: "24px" }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={clsx(
      "bg-[#0A0A0A] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#000000] active:shadow-none active:translate-y-[6px] transition-all flex items-center gap-4 border border-white/15",
      className
    )}
  >
    <GraduationCap className="w-6 h-6" />
    JOIN PORTAL
  </motion.button>
);
