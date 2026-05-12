import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';
import { Pen } from 'lucide-react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const mouseX = useSpring(0, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 400, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-primary pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-screen"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          borderColor: isHovering ? 'var(--color-primary)' : 'rgba(74, 222, 128, 0.4)',
          backgroundColor: isHovering ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
          opacity: isClicking ? 0.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
      
      {/* Inner Pen Icon */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] hidden md:block text-primary"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-20%',
          translateY: '-80%',
        }}
        animate={{
          rotate: isHovering ? [0, -10, 10, 0] : 0,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ 
          rotate: { repeat: isHovering ? Infinity : 0, duration: 0.5 },
          scale: { type: 'spring', stiffness: 400 }
        }}
      >
        <Pen className="w-5 h-5 fill-primary/10" />
      </motion.div>
    </>
  );
}
