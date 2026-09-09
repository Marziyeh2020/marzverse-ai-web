"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import PremiumButton from "@/components/PremiumButton";
import CinematicCursor from "@/components/CinematicCursor";
import FullscreenContact from "@/components/FullscreenContact";
import ServicesSection from "@/components/ServicesSection";
import WorkShowcase from "@/components/WorkShowcase";
import CinematicEarth from "@/components/CinematicEarth";
import Chatbot from "@/components/Chatbot";
import ErrorBoundary from "@/components/ErrorBoundary";


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll only on desktop to prevent mobile touch locking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null;
    try {
      if (typeof window !== "undefined" && window.innerWidth >= 1024) {
        lenis = new Lenis({
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
        lenisRef.current = lenis;

        function raf(time: number) {
          lenis?.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (e) {
      console.warn("Lenis initialization failed", e);
    }

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  const scrollTo = (id: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(id, { offset: 0, duration: 2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNav = (id: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      scrollTo(id);
    }, 800); // Wait for cinematic menu dissolve before scrolling
  };

  const handleOpenContact = (serviceTitle?: string) => {
    setSelectedService(serviceTitle || "");
    setIsContactOpen(true);
  };

  return (
    <main 
      className="relative w-full max-w-[100vw] overflow-x-clip min-h-screen text-[#FFFFFF] font-sans bg-[#050505] selection:bg-[#D9D9D9]/30"
      style={{ background: "#050505" }}
    >
      {/* 3D Interactive Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <ErrorBoundary fallback={<div className="absolute inset-0 bg-[#050505]" />}>
          <HeroAmbientEffects />
          <CinematicEarth />
        </ErrorBoundary>
      </div>

      <div
        key="content"
        className="relative w-full flex flex-col pointer-events-none"
      >
            <FullscreenMenu 
              isOpen={isMenuOpen} 
              onClose={() => setIsMenuOpen(false)} 
              onNavigate={handleNav}
              onOpenContact={() => { setIsMenuOpen(false); setTimeout(() => handleOpenContact(), 800); }}
            />
            <FullscreenContact 
              isOpen={isContactOpen} 
              onClose={() => setIsContactOpen(false)} 
              initialService={selectedService}
            />
            <CinematicCursor />
            
            <Navbar />
            
            {/* The z-10 wrapper has pointer-events-none so mouse passes through to 3D canvas, while interactive children enable pointer-events-auto */}
            <div className="relative z-10 pointer-events-none">
              <HeroIntro 
                onContact={() => handleOpenContact()}
                onViewWork={() => scrollTo("#work")}
              />
              <div className="pointer-events-auto"><ImmersiveTransition /></div>
              <div className="pointer-events-auto"><ServicesSection onContact={handleOpenContact} /></div>
              <div className="pointer-events-auto"><WorkShowcase /></div>
              <div className="pointer-events-auto"><FinalExperience onContact={() => handleOpenContact()} /></div>
            </div>

            <div className="pointer-events-auto"><Footer /></div>
            
            {/* Global Floating Chatbot */}
            <div className="pointer-events-auto">
              <Chatbot onOpenContact={() => handleOpenContact()} />
            </div>
          </div>

          {/* Screen Reader Accessible SEO Supporting Text */}
          <div className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
            <section>
              <h2>AI Automation Services</h2>
              <p>Marzverse designs and integrates cutting-edge AI automation solutions that streamline business workflows, reduce operational overhead, and enhance productivity. Our systems use machine learning and intelligent task routing to handle complex business operations.</p>
            </section>
            <section>
              <h2>AI Chatbot Development</h2>
              <p>We build custom, intelligent AI chatbots that understand context, answer customer inquiries instantly, and integrate seamlessly with your CRM and databases. Our conversational interfaces provide natural, human-like responses to increase sales and support efficiency.</p>
            </section>
            <section>
              <h2>Modern Website Development</h2>
              <p>Our modern website development combines high-performance Next.js architectures with clean, responsive, and jaw-dropping cinematic designs. We build fast, secure, and SEO-optimized sites that convert visitors into loyal clients.</p>
            </section>
            <section>
              <h2>Business Process Automation</h2>
              <p>We automate repetitive tasks and business processes using workflow integrations, connecting your favorite software and AI tools. By optimizing data pipelines and communication flows, we help your business scale automatically.</p>
            </section>
            <section>
              <h2>Digital Experience Design</h2>
              <p>Marzverse crafts immersive, luxury digital experiences that captivate audiences. We combine WebGL, 3D graphics, smooth scroll animations, and interactive components to tell your brand story and leave a lasting impression.</p>
            </section>
          </div>
    </main>
  );
}



// ==========================================
// FULLSCREEN CINEMATIC MENU
// ==========================================
function FullscreenMenu({ isOpen, onClose, onNavigate, onOpenContact }: { isOpen: boolean; onClose: () => void; onNavigate: (id: string) => void; onOpenContact: () => void; }) {
  const menuItems = [
    { label: "Experience", action: () => onNavigate("#hero") },
    { label: "Vision", action: () => onNavigate("#immersive") },
    { label: "Services", action: () => onNavigate("#services") },
    { label: "Work", action: () => onNavigate("#work") },
    { label: "Contact", action: () => onOpenContact() },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
          id="navigation-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020202]/80 backdrop-blur-[50px] overflow-hidden pointer-events-auto"
        >
          {/* Ambient Background Layer inside Menu */}
          <motion.div 
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_80%)]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

          {/* Close Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute top-8 right-8 md:top-16 md:right-16 z-10"
          >
            <PremiumButton onClick={onClose} aria-label="Close navigation menu" className="!px-8 !py-3 bg-transparent !border-transparent">
              Close
            </PremiumButton>
          </motion.div>
          
          <div className="flex flex-col items-center gap-8 md:gap-12 relative z-10">
            {menuItems.map((item, index) => (
              <MenuLink key={item.label} item={item.label} action={item.action} index={index} />
            ))}
            
            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 2, delay: 0.5 + menuItems.length * 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="mt-8 flex flex-col items-center gap-6"
            >
              <span className="text-xs tracking-[0.5em] font-light uppercase text-[#BFBFBF]/50">Connect</span>
              <div className="flex gap-8 items-center">
                <a href="https://x.com/MARZ_VERSE" target="_blank" rel="noopener noreferrer" className="group hidden md:flex text-[#BFBFBF] hover:text-[#FFFFFF] transition-colors">
                  <XIcon className="w-6 h-6 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-all duration-500" strokeWidth={1.5} />
                </a>
                <a href="https://www.linkedin.com/company/marzverse/" target="_blank" rel="noopener noreferrer" className="group text-[#BFBFBF] hover:text-[#FFA94D] transition-colors">
                  <LinkedinIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                </a>
                <a href="https://www.instagram.com/marz_verse_tech/" target="_blank" rel="noopener noreferrer" className="group text-[#BFBFBF] hover:text-[#FFA94D] transition-colors">
                  <InstagramIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuLink({ item, action, index }: { item: string; action: () => void; index: number; }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 2, delay: 0.5 + index * 0.2, ease: [0.25, 1, 0.5, 1] }}
      className="group cursor-pointer relative"
      onClick={action}
      role="button"
      tabIndex={0}
      aria-label={`Navigate to ${item} section`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          action();
        }
      }}
    >
      <motion.div 
        whileHover={{ x: 30 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] uppercase text-[#B8B8B8] group-hover:text-[#FF6A00] transition-colors duration-700"
      >
        {item}
      </motion.div>
      {/* Soft Hover Glow Response */}
      <motion.div
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 }
        }}
        initial="initial"
        whileHover="hover"
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,106,0,0.15)_0%,transparent_70%)] pointer-events-none filter blur-xl mix-blend-screen"
      />
    </motion.div>
  );
}

// ==========================================
// SECTIONS (LUXURY EDITORIAL)
// ==========================================

function HeroIntro({ onContact, onViewWork }: { onContact: () => void; onViewWork: () => void }) {
  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center px-6 sm:px-12 lg:px-24 pt-20 sm:pt-24 lg:pt-0 pb-16 lg:py-0 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
          className="w-full lg:max-w-3xl xl:max-w-[850px] text-left pointer-events-auto flex flex-col items-start"
        >
          {/* Small Label */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.28em] sm:tracking-[0.3em] uppercase text-[#D0D0D0] mb-3 sm:mb-5"
          >
            MARZVERSE • DIGITAL STUDIO
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.4 }}
            className="font-extralight text-[#F5F5F5] tracking-tight leading-[1.10] sm:leading-[1.12] lg:leading-[1.14] mb-4 sm:mb-6 text-[34px] min-[390px]:text-[38px] sm:text-[44px] md:text-[52px] lg:text-[60px] xl:text-[68px] max-w-3xl"
          >
            <span className="block sm:inline">Websites and</span>{" "}
            <span className="block sm:inline text-[#FF6A00] font-normal">AI Systems</span><br className="hidden lg:inline" />{" "}
            <span className="block sm:inline">Built to Grow</span>{" "}
            <span className="block sm:inline">Your Business</span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6 }}
            className="font-light text-[#B8B8B8] max-w-xl text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.65] sm:leading-[1.7] tracking-normal mb-6 sm:mb-8 lg:mb-10"
          >
            We design modern websites, AI chatbots and smart automation systems that help businesses save time and grow faster.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto"
          >
            {/* Primary Button */}
            <button
              type="button"
              onClick={onContact}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 bg-[#FF6A00] hover:bg-[#FF8533] text-[#050505] font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(255,106,0,0.25)] hover:shadow-[0_0_30px_rgba(255,106,0,0.45)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] cursor-pointer min-h-[48px]"
              aria-label="Start a Project"
            >
              <span>Start a Project</span>
            </button>

            {/* Secondary Button */}
            <button
              type="button"
              onClick={onViewWork}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-4 bg-transparent hover:bg-white/[0.06] text-[#F5F5F5] hover:text-white font-medium text-xs sm:text-sm tracking-[0.18em] uppercase border border-white/20 hover:border-white/50 transition-all duration-300 rounded-sm hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] cursor-pointer min-h-[48px]"
              aria-label="View Our Work"
            >
              <span>View Our Work</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ImmersiveTransition() {
  return (
    <section id="immersive" className="relative w-full py-20 sm:py-24 md:py-28 lg:py-32 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto lg:mx-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2 className="font-extralight tracking-tight mb-6 sm:mb-8 leading-[1.1] text-[#F5F5F5] text-[32px] sm:text-[42px] md:text-[50px] lg:text-[56px]">
            WE DESIGN<br /><span className="text-[#FF6A00]">DIGITAL</span> FUTURES
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] lg:text-[19px] font-light text-[#B8B8B8] max-w-xl leading-[1.7] tracking-normal">
            AI systems, immersive websites and intelligent automation designed for ambitious businesses.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FinalExperience({ onContact }: { onContact: () => void }) {
  return (
    <section id="final" className="relative w-full py-24 sm:py-32 md:py-40 px-6">
      <div className="h-full w-full flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col items-center justify-center max-w-3xl"
        >
          <p className="text-xs sm:text-sm font-medium tracking-[0.4em] text-[#A3A3A3] uppercase mb-6 sm:mb-8">
            The Final Frontier
          </p>
          <h2 className="font-extralight tracking-tight mb-10 sm:mb-12 leading-[1.1] text-[#F5F5F5] text-[32px] sm:text-[44px] md:text-[54px] lg:text-[64px]">
            Built for the<br />Next Generation
          </h2>
          
          <PremiumButton onClick={onContact} aria-label="Open contact and start your project">Start Your Project</PremiumButton>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// FOOTER & NAVBAR
// ==========================================

function Navbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 2 }}
      className="fixed top-0 left-0 z-50 w-full px-8 md:px-16 py-8 flex items-center justify-between pointer-events-none"
    >
      <div className="text-xs md:text-sm font-light tracking-[0.2em] md:tracking-[0.3em] uppercase mix-blend-difference pointer-events-auto flex items-center gap-2 md:gap-4 whitespace-nowrap">
        <img src="/logo.png" alt="Marzverse - AI Automation, AI Chatbots and Modern Web Development Agency" className="h-10 md:h-16 w-auto object-contain shrink-0" />
        <span>MARZ<span className="text-[#FF6A00]">VERSE</span></span>
      </div>
    </motion.nav>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 w-full py-12 px-8 md:px-16 border-t border-white/10 bg-black/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-xs font-light tracking-[0.2em] uppercase text-[#A3A3A3] min-w-0 text-center md:text-left">
        © 2026 Marzverse
      </div>
      <div className="flex flex-wrap gap-8 text-xs font-light tracking-[0.2em] uppercase text-[#A3A3A3] min-w-0 justify-center">
        <a 
          href="https://x.com/MARZ_VERSE" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-2 hover:text-[#FFFFFF] transition-colors"
        >
          <XIcon className="w-4 h-4 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300" strokeWidth={1.5} />
        </a>
        <a 
          href="https://www.linkedin.com/company/marzverse/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-2 hover:text-[#FF6A00] transition-colors"
        >
          <LinkedinIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        </a>
        <a 
          href="https://www.instagram.com/marz_verse_tech/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-2 hover:text-[#FF6A00] transition-colors"
        >
          <InstagramIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        </a>
      </div>
      <a href="mailto:contact@marzverse.com" className="text-xs font-light tracking-[0.2em] uppercase text-[#A3A3A3] hover:text-[#FF6A00] transition-colors cursor-pointer whitespace-nowrap min-w-0 text-center md:text-right">
        contact@marzverse.com
      </a>
    </footer>
  );
}

// ==========================================
// HERO AMBIENT EFFECTS (COLOR ATMOSPHERE)
// ==========================================
function HeroAmbientEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ambient Blue/Purple Edges */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#3B82F6] opacity-[0.03] blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#8B5CF6] opacity-[0.02] blur-[120px] rounded-full mix-blend-screen" />
      
      {/* Soft Orange Glow behind Right Sphere - Left side is kept pure and clean black */}
      <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[35%] h-[55%] bg-[#FF6A00] opacity-[0.06] blur-[120px] rounded-full mix-blend-screen" />
      
      {/* Minimal Floating Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            y: Math.sin(i * 12.9898) * 500,
            x: Math.cos(i * 78.233) * 500 
          }}
          animate={{ 
            opacity: [0, 0.35, 0],
            y: `+=${Math.sin(i * 45.123) * 50}`,
            x: `+=${Math.cos(i * 32.456) * 50}` 
          }}
          transition={{ 
            duration: Math.abs(Math.sin(i * 88.3)) * 8 + 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute top-1/2 left-1/2 w-1 h-1 rounded-full blur-[1px] ${
            i % 3 === 0 ? "bg-[#FF6A00]" : i % 3 === 1 ? "bg-[#3B82F6]" : "bg-[#8B5CF6]"
          }`}
        />
      ))}
    </div>
  );
}

// ==========================================
// ICONS
// ==========================================
function LinkedinIcon({ className, strokeWidth = 2 }: { className?: string, strokeWidth?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function InstagramIcon({ className, strokeWidth = 2 }: { className?: string, strokeWidth?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function XIcon({ className, strokeWidth = 2 }: { className?: string, strokeWidth?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}
