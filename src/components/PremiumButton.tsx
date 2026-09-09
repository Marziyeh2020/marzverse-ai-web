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
      className={`group relative overflow-hidden px-10 sm:px-12 py-4 border border-white/15 bg-black/50 backdrop-blur-md rounded-none flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-[#FF6A00]/50 hover:shadow-[0_0_25px_rgba(255,106,0,0.25)] ${className}`}
    >
      {/* Subtle ambient surface glow */}
      <motion.div
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 }
        }}
        transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,106,0,0.15)_0%,transparent_100%)] pointer-events-none"
      />
      
      {/* Slow cinematic light sweep */}
      <motion.div
        variants={{
          initial: { x: "-100%", opacity: 0 },
          hover: { x: "100%", opacity: 0.3 }
        }}
        transition={{ duration: 2.0, ease: [0.25, 1, 0.5, 1] }}
        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[rgba(255,106,0,0.35)] to-transparent skew-x-[-20deg] pointer-events-none"
      />

      {/* Button Content with subtle scale */}
      <motion.span
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.02 }
        }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        className="relative z-10 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#FF6A00] group-hover:text-[#FF8533] transition-colors duration-500"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
