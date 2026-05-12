import { Trophy, Zap, Star, Target, BookOpen, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  unlocked: boolean;
  progress?: number;
  totalRequired?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export const ACHIEVEMENT_TEMPLATES = {
  FIRST_STEPS: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first topic',
    icon: <Rocket className="w-full h-full" />,
    unlocked: false
  },
  STREAK_7: {
    id: 'streak_7',
    name: '7-Day Streak',
    description: 'Learn for 7 consecutive days',
    icon: <Zap className="w-full h-full" />,
    unlocked: false
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Score 100% on a test',
    icon: <Star className="w-full h-full" />,
    unlocked: false
  },
  FIVE_TOPICS: {
    id: 'five_topics',
    name: 'Knowledge Seeker',
    description: 'Complete 5 topics',
    icon: <BookOpen className="w-full h-full" />,
    unlocked: false
  },
  MASTER: {
    id: 'master',
    name: 'Master',
    description: 'Achieve 95% average score',
    icon: <Trophy className="w-full h-full" />,
    unlocked: false
  },
  CHALLENGE: {
    id: 'challenge',
    name: 'Challenge Master',
    description: 'Complete 10 tests',
    icon: <Target className="w-full h-full" />,
    unlocked: false
  }
};

function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`${achievement.unlocked ? 'opacity-100' : 'opacity-50'}`}
    >
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative`}
      >
        {achievement.unlocked ? (
          <>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 opacity-20 blur" />
            <div className="relative bg-gradient-to-r from-yellow-500/20 to-pink-500/20 border border-yellow-400/50 rounded-full w-full h-full flex items-center justify-center text-yellow-300">
              {achievement.icon}
            </div>
            {size === 'md' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-black text-xs font-bold"
              >
                ✓
              </motion.div>
            )}
          </>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-full w-full h-full flex items-center justify-center text-white/30">
            {achievement.icon}
          </div>
        )}
      </div>
      
      <div className={`mt-2 text-center ${textSizes[size]}`}>
        <p className="font-bold text-white">{achievement.name}</p>
        <p className="text-white/60">{achievement.description}</p>
        {achievement.progress !== undefined && achievement.totalRequired && (
          <div className="mt-1 text-xs text-white/40">
            {achievement.progress}/{achievement.totalRequired}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default AchievementBadge;
