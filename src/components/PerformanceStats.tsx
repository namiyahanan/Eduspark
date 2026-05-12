import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react';
import { useStudent } from '../contexts/StudentContext';
import { calculateProgress } from '../utils/helpers';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

function StatsCard({ icon, label, value, subtext, color = 'green' }: StatsCardProps) {
  const colorClasses = {
    green: 'bg-green-500/20 border-green-500/30',
    yellow: 'bg-yellow-500/20 border-yellow-500/30',
    pink: 'bg-pink-500/20 border-pink-500/30',
    red: 'bg-red-500/20 border-red-500/30'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`${colorClasses[color as keyof typeof colorClasses]} backdrop-blur-2xl p-6 rounded-2xl border transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium mb-2">{label}</p>
          <p className="text-3xl font-black text-white">{value}</p>
          {subtext && <p className="text-white/40 text-xs mt-1">{subtext}</p>}
        </div>
        <div className="text-white/40">{icon}</div>
      </div>
    </motion.div>
  );
}

export default function PerformanceStats() {
  const { performance } = useStudent();
  
  const progressPercent = calculateProgress(performance.topicsCompleted, 50);
  const learningHours = Math.floor(performance.totalLearningMinutes / 60);
  const learningMinutes = performance.totalLearningMinutes % 60;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-7 h-7 text-primary" />
        <h3 className="text-2xl font-black text-white">Your Performance</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Target className="w-6 h-6" />}
          label="Topics Completed"
          value={performance.topicsCompleted}
          subtext={`${progressPercent}% progress`}
          color="green"
        />
        <StatsCard
          icon={<Zap className="w-6 h-6" />}
          label="Tests Attempted"
          value={performance.testsAttempted}
          subtext={`Avg: ${performance.averageScore}%`}
          color="pink"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Learning Time"
          value={`${learningHours}h ${learningMinutes}m`}
          subtext="Total invested"
          color="green"
        />
        <StatsCard
          icon={<Zap className="w-6 h-6" />}
          label="Current Streak"
          value={performance.streak}
          subtext="Days active"
          color="yellow"
        />
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-white font-semibold">Learning Progress</p>
          <p className="text-primary font-black">{progressPercent}%</p>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-500 to-pink-500"
          />
        </div>
      </motion.div>
    </div>
  );
}
