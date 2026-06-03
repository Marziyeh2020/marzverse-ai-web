"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CinematicCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Premium inertia and smooth delay settings
  const springConfig = { damping: 35, stiffness: 100, mass: 0.8 };
  
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      // Center the 400x400 glow exactly on the cursor
      mouseX.set(e.clientX - 200);
      mouseY.set(e.clientY - 200);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[5] mix-blend-screen will-change-transform"
      style={{
        x: cursorX,
        y: cursorY,
        background: "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(217, 217, 217, 0.02) 40%, transparent 70%)",
        filter: "blur(60px)",
      }}
    />
  );
}
