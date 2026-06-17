"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

export default function PremiumButton({ 
  children, 
  onClick, 
  className = "", 
  type = "button", 
  disabled = false,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-controls": ariaControls
}: PremiumButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      whileHover="hover"
      initial="initial"
      className={`group relative overflow-hidden px-12 py-4 border border-white/10 bg-black/40 backdrop-blur-md rounded-none flex items-center justify-center ${className}`}
    >
      {/* Subtle ambient surface glow */}
      <motion.div
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 }
        }}
        transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.08)_0%,transparent_100%)] pointer-events-none"
      />
      
      {/* Slow cinematic light sweep */}
      <motion.div
        variants={{
          initial: { x: "-100%", opacity: 0 },
          hover: { x: "100%", opacity: 0.25 }
        }}
        transition={{ duration: 2.5, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[rgba(0,255,136,0.3)] to-transparent skew-x-[-20deg] pointer-events-none"
      />

      {/* Button Content with subtle scale */}
      <motion.span
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.015 }
        }}
        transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 text-xs font-light tracking-[0.4em] uppercase text-[#FF8A00]/70 group-hover:text-[#FFA94D] transition-colors duration-1000"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
