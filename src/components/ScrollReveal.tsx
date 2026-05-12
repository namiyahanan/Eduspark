import { motion, type Variants } from 'motion/react';
import { type Key, type ReactNode } from 'react';

type ScrollRevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface ScrollRevealProps {
  children: ReactNode;
  key?: Key;
  direction?: ScrollRevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  stagger?: boolean;
  staggerDelay?: number;
}

const getOffset = (direction: ScrollRevealDirection, distance: number) => {
  switch (direction) {
    case 'up': return { y: distance, x: 0 };
    case 'down': return { y: -distance, x: 0 };
    case 'left': return { x: distance, y: 0 };
    case 'right': return { x: -distance, y: 0 };
    case 'none': return { x: 0, y: 0 };
  }
};

export const inertiaVariants = (
  direction: ScrollRevealDirection = 'up',
  distance: number = 60,
  delay: number = 0,
  duration: number = 0.9,
): Variants => {
  const offset = getOffset(direction, distance);
  return {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      filter: 'blur(6px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 18,
        mass: 1.2,
        delay,
        duration,
      },
    },
  };
};

export const staggerContainerVariants = (staggerDelay: number = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
});

export const staggerItemVariants = (
  direction: ScrollRevealDirection = 'up',
  distance: number = 40,
): Variants => {
  const offset = getOffset(direction, distance);
  return {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
  };
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.9,
  distance = 60,
  once = true,
  className = '',
  stagger = false,
  staggerDelay = 0.08,
}: ScrollRevealProps) {
  if (stagger) {
    return (
      <motion.div
        variants={staggerContainerVariants(staggerDelay)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-80px' }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={inertiaVariants(direction, distance, delay, duration)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  direction = 'up',
  distance = 40,
  className = '',
}: {
  children: ReactNode;
  direction?: ScrollRevealDirection;
  distance?: number;
  className?: string;
  key?: string | number;
}) {
  return (
    <motion.div
      variants={staggerItemVariants(direction, distance)}
      className={className}
    >
      {children}
    </motion.div>
  );
}
