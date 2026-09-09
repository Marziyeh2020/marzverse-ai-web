/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import OrangeParticles from "./OrangeParticles";

const scenes = [
  {
    src: "/1.png",
    title: "Web Tasarım",
    desc: "Premium markaları zirveye taşıyan özel dijital platformlar inşa ediyoruz.",
    btn1: "Hizmetleri İncele",
    target1: 1,
    btn2: "Yaklaşımımız",
    target2: 2
  },
  {
    src: "/2.png",
    title: "Landing Page Tasarımı",
    desc: "Maksimum etkileşim için özel olarak tasarlanmış, yüksek etkili tek sayfa deneyimleri.",
    btn1: "Örnekleri Gör",
    target1: 7,
    btn2: "Projeye Başla",
    target2: 8
  },
  {
    src: "/3.png",
    title: "Premium Dijital Deneyimler",
    desc: "Zarif estetiği kusursuz modern web mimarisiyle birleştiriyoruz.",
    btn1: "Felsefemiz",
    target1: 2,
    btn2: "Stüdyoya Ulaş",
    target2: 8
  },
  {
    src: "/4.png",
    title: "Modern Marka Web Sitesi",
    desc: "Vizyoner şirketler için güçlü, estetik ve kalıcı çevrimiçi kimlikler oluşturuyoruz.",
    btn1: "Portfolyoyu İncele",
    target1: 7,
    btn2: "İletişime Geç",
    target2: 8
  },
  {
    src: "/5.png",
    title: "Yeniden Tasarım Hizmetleri",
    desc: "Eski arayüzlerinizi nefes kesen, yüksek performanslı premium ortamlara dönüştürüyoruz.",
    btn1: "Öncesi & Sonrası",
    target1: 7,
    btn2: "Sitenizi İnceleyelim",
    target2: 8
  },
  {
    src: "/6.png",
    title: "Duyarlı Web Tasarımı",
    desc: "Her cihaza ve ekrana kusursuz uyum sağlayan piksel hassasiyetinde düzenler.",
    btn1: "Teknik Detaylar",
    target1: 2,
    btn2: "İşleri İncele",
    target2: 7
  },
  {
    src: "/7.png",
    title: "Dönüşüm Odaklı Tasarım",
    desc: "Kullanıcı aksiyonunu ve büyümeyi tetiklemek için titizlikle kurgulanmış stratejik arayüzler.",
    btn1: "Vaka Çalışmaları",
    target1: 7,
    btn2: "Danışmanlık",
    target2: 8
  },
  {
    src: "/8.png",
    title: "Seçilmiş İşler",
    desc: "Web tasarım projelerimizin en iyilerinden özenle seçilmiş premium koleksiyon.",
    btn1: "Tüm Portfolyo",
    target1: 7,
    btn2: "Müşteri Listesi",
    target2: 2
  },
  {
    src: "/9.png",
    title: "Proje Başlatın",
    desc: "Dijital varlığınızı yükseltmeye hazır mısınız? Birlikte olağanüstü bir şey inşa edelim.",
    btn1: "Bize Ulaşın",
    target1: 8,
    btn2: "E-posta Gönder",
    target2: 8
  }
];

export default function WheelSceneSequence() {
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { damping: 30, stiffness: 100, mass: 1 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Update local state so we can highlight active navbar items
    const unsubscribe = smoothProgress.on("change", (v) => {
      setActiveIndex(Math.round(v));
    });
    return unsubscribe;
  }, [smoothProgress]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const current = progress.get();
      const step = e.deltaY * 0.003;
      let next = current + step;
      if (next < 0) next = 0;
      if (next > scenes.length - 1) next = scenes.length - 1;
      progress.set(next);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [progress]);

  const goToScene = (index: number) => {
    progress.set(index);
  };

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#111]">
      
      {/* 1. BACKGROUND IMAGES */}
      {scenes.map((scene, index) => {
        return (
          <BackgroundImage 
            key={`img-${index}`} 
            src={scene.src} 
            index={index} 
            progress={smoothProgress} 
          />
        );
      })}

      {/* 1.5 WARM NEON PARTICLES */}
      <OrangeParticles />

      {/* 2. CINEMATIC OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#111]/20 to-black/70 pointer-events-none z-10" />

      {/* 3. NAVBAR */}
      <Navbar activeIndex={activeIndex} goToScene={goToScene} />

      {/* 4. SCENE CONTENT (TEXT & BUTTONS) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-6">
        {scenes.map((scene, index) => {
          return (
            <SceneContent 
              key={`content-${index}`} 
              scene={scene} 
              index={index} 
              progress={smoothProgress} 
              goToScene={goToScene}
            />
          );
        })}
      </div>

    </div>
  );
}

function Navbar({ activeIndex, goToScene }: { activeIndex: number; goToScene: (index: number) => void }) {
  // Map standard pages to an array of scene indices they represent
  const navLinks = [
    { label: "Ana Sayfa", targets: [0] },
    { label: "Hakkımızda", targets: [2] },
    { label: "Hizmetler", targets: [1, 3, 4, 5, 6] },
    { label: "İşler", targets: [7] },
    { label: "İletişim", targets: [8] }
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 1.5 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl flex items-center justify-between px-8 py-5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto"
    >
      <button 
        onClick={() => goToScene(0)}
        className="text-xl font-light tracking-widest text-white uppercase drop-shadow-sm hover:opacity-80 transition-opacity"
      >
        Global Bridge
      </button>
      <div className="hidden md:flex items-center gap-10 text-sm font-light text-white/80">
        {navLinks.map((link) => {
          // It's active if the current scene index is anywhere inside the targets array
          const isActive = link.targets.includes(activeIndex);
          return (
            <button 
              key={link.label}
              // Clicking the parent link takes you to the first target scene in its group
              onClick={() => goToScene(link.targets[0])}
              className={`transition-colors duration-500 relative ${isActive ? "text-brand-neon drop-shadow-[0_0_8px_rgba(255,94,26,0.4)]" : "hover:text-brand-neon hover:drop-shadow-[0_0_8px_rgba(255,94,26,0.3)]"}`}
            >
              {link.label}
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-neon rounded-full shadow-[0_0_8px_var(--color-brand-neon)]"
                />
              )}
            </button>
          );
        })}
      </div>
      <button 
        onClick={() => goToScene(8)}
        className="text-sm uppercase tracking-widest px-6 py-2 rounded-full border border-white/30 text-white hover:bg-brand-neon hover:border-brand-neon transition-colors duration-500 font-medium hover:shadow-[0_0_15px_rgba(255,94,26,0.3)]"
      >
        Başlat
      </button>
    </motion.nav>
  );
}

function BackgroundImage({ src, index, progress }: { src: string; index: number; progress: MotionValue<number> }) {
  const opacity = useTransform(
    progress,
    [index - 1.2, index, index + 1.2],
    [0, 1, 0]
  );

  const scale = useTransform(
    progress,
    [index - 1, index, index + 1],
    [1.05, 1, 1.05]
  );

  return (
    <motion.img
      src={src}
      alt={`Scene ${index}`}
      style={{ opacity, scale }}
      className="absolute inset-0 w-full h-full object-cover saturate-50 sepia-[0.1] contrast-105 brightness-[0.85] pointer-events-none"
    />
  );
}

function SceneContent({ scene, index, progress, goToScene }: { scene: any; index: number; progress: MotionValue<number>; goToScene: (index: number) => void }) {
  const opacity = useTransform(
    progress,
    [index - 0.7, index, index + 0.7],
    [0, 1, 0]
  );

  const y = useTransform(
    progress,
    [index - 0.7, index, index + 0.7],
    [30, 0, -30]
  );

  const blur = useTransform(
    progress,
    [index - 0.7, index, index + 0.7],
    ["blur(15px)", "blur(0px)", "blur(15px)"]
  );

  return (
    <motion.div
      style={{ opacity, y, filter: blur }}
      className="absolute w-full max-w-5xl flex flex-col items-center text-center pointer-events-auto"
    >
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 text-white drop-shadow-sm leading-[1.1]">
        {/* Subtle orange accent on the very first letter of each title for that premium touch */}
        <span className="text-brand-neon drop-shadow-[0_0_12px_rgba(255,94,26,0.5)]">{scene.title.charAt(0)}</span>
        {scene.title.slice(1)}
      </h1>
      
      <p className="text-lg md:text-xl text-[#e0e0e0] font-light max-w-2xl mb-12 leading-relaxed drop-shadow-sm">
        {scene.desc}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 pointer-events-auto">
        <button 
          onClick={() => goToScene(scene.target1)}
          className="px-10 py-4 rounded-full bg-white text-black font-medium text-sm tracking-widest uppercase hover:scale-105 hover:bg-brand-neon hover:text-white hover:shadow-[0_0_20px_rgba(255,94,26,0.6)] transition-all duration-500 shadow-xl border border-transparent"
        >
          {scene.btn1}
        </button>
        <button 
          onClick={() => goToScene(scene.target2)}
          className="px-10 py-4 rounded-full bg-transparent border border-white/40 text-white font-medium text-sm tracking-widest uppercase hover:border-brand-neon hover:text-brand-neon hover:bg-brand-neon/10 hover:shadow-[0_0_15px_rgba(255,94,26,0.3)] transition-all duration-500"
        >
          {scene.btn2}
        </button>
      </div>
    </motion.div>
  );
}
