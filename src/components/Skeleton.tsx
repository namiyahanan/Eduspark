import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  count?: number;
  className?: string;
}

export function Skeleton({ width = '100%', height = 20, rounded = true, count = 1, className = '' }: SkeletonProps) {
  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, idx) => (
        <motion.div
          key={idx}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ width, height }}
          className={`${rounded ? 'rounded-lg' : ''} bg-white/10 ${className}`}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 space-y-4">
      <Skeleton height={24} width="60%" />
      <Skeleton height={16} width="100%" count={3} className="mb-2" />
    </div>
  );
}

export function GridSkeleton({ cols = 3, count = 6 }: { cols?: number; count?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function TopicSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height={32} width="80%" />
      <Skeleton height={16} width="100%" count={5} className="mb-2" />
      <Skeleton height={40} width="200px" rounded />
    </div>
  );
}
