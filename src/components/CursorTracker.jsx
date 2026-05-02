import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CursorTracker() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    let timeout;
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMoving(false), 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* Outer circle */}
      <motion.div
        className="fixed pointer-events-none z-50 w-6 h-6 border-2 border-[#5B9BD5] rounded-full"
        animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-50 w-2 h-2 bg-[#F4D35E] rounded-full"
        animate={{ 
          x: mousePosition.x - 4, 
          y: mousePosition.y - 4,
          scale: isMoving ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 30 }}
      />

      {/* Glow trail */}
      {isMoving && (
        <motion.div
          className="fixed pointer-events-none z-40 w-8 h-8 bg-[#F4D35E] rounded-full blur-lg opacity-30"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.6 }}
          style={{ 
            left: `${mousePosition.x - 16}px`, 
            top: `${mousePosition.y - 16}px` 
          }}
        />
      )}
    </>
  );
}
