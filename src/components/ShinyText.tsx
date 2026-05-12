import { motion } from 'motion/react';
import React from 'react';

interface ShinyTextProps {
  text: string;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ text, className }) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      initial={{ backgroundPosition: "-200% 0" }}
      animate={{ backgroundPosition: "200% 0" }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        background: "linear-gradient(100deg, #4ADE80 30%, #ffffff 50%, #4ADE80 70%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {text}
    </motion.span>
  );
};
