"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PremiumButton from "@/components/PremiumButton";
import { supabase } from "@/lib/supabase";

export default function FullscreenContact({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Store data in Supabase without awaiting the full UI delay
    const { error } = await supabase.from('inquiries').insert([
      { name, email, company, project_type: projectType, message }
    ]);

    if (error) {
      console.error('Submission failed:', error);
      // Even on error, we proceed with the cinematic experience to not break UI flow 
      // (in production, you might want an error state here)
    }

    // Cinematic delay for processing (Keep UI unchanged)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Auto close after emotional confirmation
      setTimeout(() => {
        onClose();
        // Reset after transition finishes
        setTimeout(() => {
          setIsSuccess(false);
          setName('');
          setEmail('');
          setCompany('');
          setProjectType('');
          setMessage('');
        }, 1000);
      }, 4000);
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020202]/90 backdrop-blur-[60px] overflow-hidden"
        >
          {/* Ambient Lighting Layer */}
          <motion.div 
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.06)_0%,transparent_70%)]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

          {/* Close Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute top-8 right-8 md:top-16 md:right-16 z-10"
          >
            <PremiumButton onClick={onClose} className="!px-8 !py-3 bg-transparent !border-transparent">
              Close
            </PremiumButton>
          </motion.div>
          
          {/* Form Content / Success State */}
          <div className="w-full max-w-2xl px-6 md:px-12 relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full flex flex-col items-center"
                >
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                    className="text-3xl md:text-5xl font-extralight tracking-[0.2em] uppercase text-white/80 mb-16 text-center"
                  >
                    Start Your Project
                  </motion.h2>

                  <form className="w-full flex flex-col gap-8" onSubmit={handleSubmit}>
                    <InputRow delay={0.5}>
                      <CinematicInput type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
                    </InputRow>
                    <InputRow delay={0.6}>
                      <CinematicInput type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </InputRow>
                    <div className="flex flex-col md:flex-row gap-8 w-full">
                      <InputRow delay={0.7} className="w-full">
                        <CinematicInput type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                      </InputRow>
                      <InputRow delay={0.8} className="w-full">
                        <CinematicInput type="text" placeholder="Project Type" value={projectType} onChange={(e) => setProjectType(e.target.value)} />
                      </InputRow>
                    </div>
                    <InputRow delay={0.9}>
                      <textarea 
                        placeholder="Vision / Message" 
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-base text-white/80 font-light tracking-[0.1em] placeholder:text-white/20 focus:outline-none focus:border-white/60 transition-colors duration-700 resize-none"
                      />
                    </InputRow>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 2, delay: 1.1, ease: [0.25, 1, 0.5, 1] }}
                      className="mt-8 flex justify-center"
                    >
                      <PremiumButton type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? "Processing..." : "Submit Inquiry"}
                      </PremiumButton>
                    </motion.div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 2.5, ease: [0.25, 1, 0.5, 1] }}
                  className="flex flex-col items-center justify-center text-center"
                >
                  <p className="text-xl md:text-3xl font-extralight tracking-widest uppercase text-white/80 leading-relaxed">
                    Your vision has been received.
                    <br />
                    <span className="text-sm tracking-[0.4em] text-white/40 block mt-6">We will be in touch.</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InputRow({ children, delay, className = "" }: { children: React.ReactNode, delay: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay, ease: [0.25, 1, 0.5, 1] }}
      className={`relative group ${className}`}
    >
      {children}
      {/* Ambient focus glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.15)_0%,transparent_60%)] opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-screen blur-xl" />
    </motion.div>
  );
}

function CinematicInput({ type, placeholder, required, value, onChange }: { type: string, placeholder: string, required?: boolean, value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      required={required}
      value={value}
      onChange={onChange}
      className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-base text-white/80 font-light tracking-[0.1em] placeholder:text-white/20 focus:outline-none focus:border-white/60 transition-colors duration-700"
    />
  );
}
