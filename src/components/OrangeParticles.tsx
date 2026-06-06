"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedMultiplier: number;
}

export default function OrangeParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Mouse position trackers for subtle parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { damping: 50, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 100 });

  useEffect(() => {
    // Generate static deterministic particles on mount to avoid hydration mismatch
    const generated: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.abs(Math.sin(i * 12.9898)) * 100, // percentage
      y: Math.abs(Math.cos(i * 78.233)) * 100, // percentage
      size: Math.abs(Math.sin(i * 45.123)) * 3 + 1, // 1px to 4px
      opacity: Math.abs(Math.cos(i * 32.456)) * 0.4 + 0.1, // 0.1 to 0.5 opacity (subtle)
      speedMultiplier: Math.abs(Math.sin(i * 88.3)) * 0.05 + 0.01,
    }));
    setParticles(generated);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates around center
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x * 100);
      mouseY.set(y * 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
      {particles.map((p) => {
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-sm bg-brand-neon"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              x: springX,
              y: springY,
              // Parallax effect: further particles move slower
              transform: `translate(${springX.get() * p.speedMultiplier}px, ${springY.get() * p.speedMultiplier}px)`,
              boxShadow: `0 0 ${p.size * 3}px rgba(255, 94, 26, ${p.opacity * 1.5})`
            }}
          />
        );
      })}
    </div>
  );
}
