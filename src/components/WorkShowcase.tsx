"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export default function WorkShowcase() {
  return (
    <section id="work" className="relative w-full bg-transparent py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-32">
        <div className="text-left mb-16">
          <p className="text-xs font-light tracking-[0.5em] text-[#BFBFBF] uppercase mb-8">
            Select Engagements
          </p>
          <h2 className="text-4xl md:text-6xl font-extralight tracking-tight leading-[1.1]">
            REDEFINING<br/>THE STANDARD
          </h2>
        </div>

        {/* Cinematic Panels with Local Video Sources */}
        <div className="flex flex-col gap-40">
          <WorkPanel 
            title="AI Systems" 
            desc="Enterprise-grade intelligence architecture."
            videoSrc="/one.mp4"
          />
          <WorkPanel 
            title="Immersive Interfaces" 
            desc="Next-generation spatial computing."
            videoSrc="/two.mp4"
          />
          <WorkPanel 
            title="Cinematic Campaigns" 
            desc="Luxury digital brand experiences."
            videoSrc="/three.mp4"
          />
        </div>
      </div>
    </section>
  );
}

function WorkPanel({ title, desc, videoSrc }: { title: string, desc: string, videoSrc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Performance logic: only play when in viewport
  const isInView = useInView(ref, { margin: "200px 0px 200px 0px" });

  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 2.5, ease: [0.25, 1, 0.5, 1] }}
      whileHover="hover"
      className="relative w-full h-[60vh] md:h-[80vh] border border-[#3A3A3A] shadow-[0_0_60px_rgba(26,26,26,0.5)] group-hover:border-[rgba(255,255,255,0.3)] group-hover:shadow-[0_0_80px_rgba(255,255,255,0.08)] overflow-hidden group flex items-end p-8 md:p-16 transition-all duration-1000 bg-[#000000]"
    >
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video 
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
        />
        {/* Gradient mask to preserve text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-90" />
      </div>

      <div className="relative z-20 flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-8">
        <div>
          <h3 className="text-3xl md:text-5xl font-extralight tracking-[0.3em] uppercase mb-4 text-[#FFFFFF]">{title}</h3>
          <p className="text-sm font-light tracking-[0.3em] text-[#D9D9D9] uppercase">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
