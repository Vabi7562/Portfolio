import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#F5F5F5] overflow-hidden -z-10">
      {/* Animated Orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-96 h-96 bg-gradient-to-br from-[#5B9BD5] to-[#F4D35E] rounded-full blur-3xl opacity-15"
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
          }}
          transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
          style={{ left: `${i * 20}%`, top: `${i * 15}%` }}
        />
      ))}

      {/* Mouse-reactive glow */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-br from-[#F4D35E] to-[#5B9BD5] rounded-full blur-3xl opacity-10 pointer-events-none"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      />
    </div>
  );
}
