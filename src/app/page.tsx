"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Lenis from "lenis";
import PremiumButton from "@/components/PremiumButton";
import CinematicCursor from "@/components/CinematicCursor";
import FullscreenContact from "@/components/FullscreenContact";
import WorkShowcase from "@/components/WorkShowcase";
import CinematicEarth from "@/components/CinematicEarth";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Short cinematic loader for 3D initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      lenis.destroy();
    };
  }, []);

  // Intersection Observer for Active Section
  useEffect(() => {
    if (loading) return;
    
    const sections = document.querySelectorAll("section");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, [loading]);

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

  return (
    <main 
      className="relative w-full min-h-screen text-[#FFFFFF] font-sans selection:bg-[#D9D9D9]/30"
      style={{ background: "radial-gradient(circle at center, #050505 0%, #000000 100%)" }}
    >
      <AnimatePresence mode="wait">
        {loading ? (
           <Loader key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="relative w-full flex flex-col"
          >
            <FullscreenMenu 
              isOpen={isMenuOpen} 
              onClose={() => setIsMenuOpen(false)} 
              onNavigate={handleNav}
              onOpenContact={() => { setIsMenuOpen(false); setTimeout(() => setIsContactOpen(true), 800); }}
            />
            <FullscreenContact isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            <CinematicCursor />
            {/* BUGFIX: Canvas wrapper gets pointer-events-auto */}
            <div className="fixed inset-0 z-0 pointer-events-auto">
              <HeroAmbientEffects />
              <CinematicEarth />
            </div>
            
            <Navbar onOpenMenu={() => setIsMenuOpen(true)} />
            
            {/* BUGFIX: The z-10 wrapper MUST have pointer-events-none, otherwise it acts as an invisible wall blocking the Canvas! */}
            <div className="relative z-10 pointer-events-none">
              <HeroIntro onEnter={() => scrollTo("#immersive")} />
              <div className="pointer-events-auto"><ImmersiveTransition /></div>
              <div className="pointer-events-auto"><WorkShowcase /></div>
              <div className="pointer-events-auto"><FinalExperience onContact={() => setIsContactOpen(true)} /></div>
            </div>

            <div className="pointer-events-auto"><Footer /></div>
            
            {/* Global Floating Chatbot */}
            <div className="pointer-events-auto"><Chatbot /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}



// ==========================================
// CINEMATIC OVERLAYS
// ==========================================
function AnimatedGrain() {
  const { scrollYProgress } = useScroll();
  // 2. Parallax: grain layer moves slightly with scroll
  const grainY = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);

  return (
    <motion.div 
      className="fixed inset-[-10%] w-[120%] h-[120%] z-40 pointer-events-none mix-blend-overlay opacity-[0.06]"
      style={{ 
        y: grainY,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.95\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      }}
      animate={{
        backgroundPosition: ["0% 0%", "5% 5%", "-5% -5%", "10% -2%", "-2% 10%", "0% 0%"],
        scale: [1, 1.03, 1]
      }}
      transition={{ 
        backgroundPosition: { duration: 0.8, ease: "linear", repeat: Infinity },
        scale: { duration: 20, ease: "easeInOut", repeat: Infinity }
      }}
    />
  );
}

// ==========================================
// FULLSCREEN CINEMATIC MENU
// ==========================================
function FullscreenMenu({ isOpen, onClose, onNavigate, onOpenContact }: { isOpen: boolean; onClose: () => void; onNavigate: (id: string) => void; onOpenContact: () => void; }) {
  const menuItems = [
    { label: "Experience", action: () => onNavigate("#hero") },
    { label: "Vision", action: () => onNavigate("#immersive") },
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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020202]/80 backdrop-blur-[50px] overflow-hidden"
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
            <PremiumButton onClick={onClose} className="!px-8 !py-3 bg-transparent !border-transparent">
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
    >
      <motion.div 
        whileHover={{ x: 30 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] uppercase text-[#BFBFBF] group-hover:text-[#FFA94D] transition-colors duration-1000"
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
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none filter blur-xl mix-blend-screen"
      />
    </motion.div>
  );
}

// ==========================================
// SECTIONS (LUXURY EDITORIAL)
// ==========================================

function HeroIntro({ onEnter }: { onEnter: () => void }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section id="hero" className="relative w-full h-[180vh] pointer-events-none">
      <motion.div 
        style={{ y, opacity }}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-9xl font-extralight tracking-widest mb-6 uppercase leading-[1.1]"
          >
            Marzverse
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3, ease: [0.25, 1, 0.5, 1], delay: 0.6 }}
            className="text-sm md:text-base font-light tracking-[0.5em] uppercase text-[#D9D9D9] mb-2"
          >
            <span className="text-[#FF8A00]">AI</span> Systems
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3, ease: [0.25, 1, 0.5, 1], delay: 0.8 }}
            className="text-xs font-light tracking-[0.3em] uppercase text-[#BFBFBF]"
          >
            Enterprise-Grade Intelligence Architecture
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ImmersiveTransition() {
  return (
    <section id="immersive" className="relative w-full h-[220vh]">
      <div className="sticky top-0 h-screen w-full flex items-center px-12 md:px-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 2.5, ease: [0.25, 1, 0.5, 1] }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-extralight tracking-tight mb-8 leading-[1.1]">
              WE DESIGN<br/><span className="text-[#FF8A00]">DIGITAL</span> FUTURES
            </h2>
            <p className="text-lg md:text-xl font-light text-[#BFBFBF] max-w-xl leading-relaxed tracking-widest">
              AI systems, immersive interfaces, automation ecosystems, cinematic brand experiences.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FinalExperience({ onContact }: { onContact: () => void }) {
  return (
    <section id="final" className="relative w-full h-[180vh]">
      <div className="h-full w-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: false, margin: "-20%" }}
          transition={{ duration: 3, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col items-center justify-center"
        >
          <p className="text-xs font-light tracking-[0.5em] text-[#BFBFBF] uppercase mb-8">
            The Final Frontier
          </p>
          <h2 className="text-5xl md:text-7xl font-extralight tracking-tight mb-16 leading-[1.1]">
            Built for the<br/>Next Generation
          </h2>
          
          <PremiumButton onClick={onContact}>Start Your Project</PremiumButton>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// FOOTER & NAVBAR
// ==========================================

function Navbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 2 }}
      className="fixed top-0 left-0 z-50 w-full px-8 md:px-16 py-8 flex items-center justify-between pointer-events-none"
    >
      <div className="text-sm font-light tracking-[0.3em] uppercase mix-blend-difference pointer-events-auto flex items-center gap-4">
        <img src="/logo.png" alt="Marzverse" className="h-16 w-auto object-contain" />
        MARZ<span className="text-[#FF8A00]">VERSE</span>
      </div>
      <div className="pointer-events-auto">
        <PremiumButton onClick={onOpenMenu} className="!px-8 !py-3 bg-transparent !border-transparent">
          Menu
        </PremiumButton>
      </div>
    </motion.nav>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 w-full py-12 px-8 md:px-16 border-t border-white/10 bg-black/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-xs font-light tracking-[0.2em] uppercase text-[#BFBFBF]">
        © 2026 Marzverse
      </div>
      <div className="flex flex-wrap gap-8 text-xs font-light tracking-[0.2em] uppercase text-[#BFBFBF]">
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
          className="group flex items-center gap-2 hover:text-[#FFA94D] transition-colors"
        >
          <LinkedinIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        </a>
        <a 
          href="https://www.instagram.com/marz_verse_tech/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-2 hover:text-[#FFA94D] transition-colors"
        >
          <InstagramIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        </a>
      </div>
      <div className="text-xs font-light tracking-[0.2em] uppercase text-[#BFBFBF] hover:text-[#FFA94D] transition-colors cursor-pointer">
        hello@marzverse.com
      </div>
    </footer>
  );
}

// ==========================================
// LOADER
// ==========================================
function Loader() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "radial-gradient(circle at center, #050505 0%, #000000 100%)" }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.span 
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#FFFFFF] font-light tracking-[0.5em] uppercase text-xs"
        >
          Loading Experience
        </motion.span>
      </div>
    </motion.div>
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
      
      {/* Soft Orange Glows behind Spheres */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[30%] h-[50%] bg-[#FF8A00] opacity-[0.05] blur-[100px] rounded-full mix-blend-screen" />
      <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[30%] h-[50%] bg-[#FF8A00] opacity-[0.05] blur-[100px] rounded-full mix-blend-screen" />
      
      {/* Minimal Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            y: Math.random() * 1000 - 500,
            x: Math.random() * 1000 - 500 
          }}
          animate={{ 
            opacity: [0, 0.4, 0],
            y: `+=${Math.random() * 100 - 50}`,
            x: `+=${Math.random() * 100 - 50}` 
          }}
          transition={{ 
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute top-1/2 left-1/2 w-1 h-1 rounded-full blur-[1px] ${
            i % 3 === 0 ? "bg-[#FF8A00]" : i % 3 === 1 ? "bg-[#3B82F6]" : "bg-[#8B5CF6]"
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
