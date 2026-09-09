"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { ExternalLink, Lock, Clock, Sparkles } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  ctaType: "link" | "status";
  ctaText: string;
  url?: string;
  mediaType: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  statusIcon?: typeof Lock | typeof Clock | typeof Sparkles;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: "sadies",
    title: "Sadie’s Alteration",
    category: "BUSINESS WEBSITE",
    description: "A modern, responsive website for an alteration studio, designed to showcase services and make customer contact and booking easier.",
    features: [
      "Mobile Friendly",
      "Online Booking",
      "Service Showcase",
      "Easy Contact",
    ],
    ctaType: "link",
    ctaText: "View Live Website",
    url: "https://www.sadiesalteration.com/",
    mediaType: "video",
    mediaSrc: "/one.mp4",
    posterSrc: "/1.png",
  },
  {
    id: "akcetin",
    title: "Akçetin Mühendislik",
    category: "CORPORATE WEBSITE",
    description: "A mobile-responsive and SEO-focused corporate website presenting engineering services, application areas and company expertise.",
    features: [
      "Mobile Friendly",
      "SEO Optimized",
      "Detailed Service Pages",
      "Fast Performance",
    ],
    ctaType: "link",
    ctaText: "View Live Website",
    url: "https://akcetinmuhendislik.com/",
    mediaType: "video",
    mediaSrc: "/two.mp4",
    posterSrc: "/2.png",
  },
  {
    id: "hacibey",
    title: "Hacıbey",
    category: "ORDERING WEB APP",
    description: "A mobile-first PWA for customer ordering and administrative management, including products, categories and order organization.",
    features: [
      "Mobile Ordering",
      "Admin Dashboard",
      "Product Management",
      "Installable Web App",
    ],
    ctaType: "link",
    ctaText: "View Live App",
    url: "https://xn--hacbey-r9a.com/",
    mediaType: "video",
    mediaSrc: "/three.mp4",
    posterSrc: "/3.png",
  },
  {
    id: "faturaasistan",
    title: "FaturaAsistan",
    category: "MOBILE SAAS CONCEPT",
    description: "A mobile-first invoice management system designed for document uploads, AI summaries and organized financial reporting.",
    features: [
      "Invoice Upload",
      "AI-Powered Summaries",
      "Excel Reports",
      "Mobile-First System",
    ],
    ctaType: "status",
    ctaText: "Private Project",
    mediaType: "video",
    mediaSrc: "/scene_2.mp4",
    posterSrc: "/4.png",
    statusIcon: Lock,
  },
  {
    id: "globalbridge",
    title: "Global Bridge Health",
    category: "HEALTHCARE WEBSITE",
    description: "A responsive healthcare platform designed to help users explore health-related information and access digital services through a clear, user-friendly experience.",
    features: [
      "Mobile Friendly",
      "Health Cost Comparison",
      "Clear Navigation",
      "AI Chatbot Support",
    ],
    ctaType: "link",
    ctaText: "View Live Website",
    url: "https://www.globalbridgehealth.com/",
    mediaType: "image",
    mediaSrc: "/5.png",
    featured: true,
  },
];

export default function WorkShowcase() {
  return (
    <section id="work" className="relative w-full bg-transparent py-20 sm:py-24 md:py-28 lg:py-32 px-6 sm:px-12 lg:px-24 scroll-mt-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16 md:gap-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="text-left max-w-3xl"
        >
          <p className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-[#A3A3A3] mb-3 sm:mb-4">
            SELECTED WORK
          </p>
          <h2 className="text-[30px] min-[390px]:text-[34px] sm:text-[42px] md:text-[50px] lg:text-[56px] font-extralight tracking-tight leading-[1.12] text-[#F5F5F5] mb-4 sm:mb-6">
            Real Projects. <span className="text-[#FF6A00] font-normal">Practical Results.</span>
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] font-light text-[#B8B8B8] leading-[1.7] max-w-2xl">
            A selection of websites and digital products designed and developed by MarzVerse.
          </p>
        </motion.div>

        {/* 5 Projects Grid: 2-column desktop grid with 5th featured card spanning 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { margin: "100px 0px 100px 0px" });

  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  const StatusIcon = project.statusIcon;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 1.2, delay: (index % 2) * 0.15, ease: [0.25, 1, 0.5, 1] }}
      className={`group bg-[#0B0B0B] border border-white/10 hover:border-[#FF6A00]/40 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,106,0,0.1)] ${
        project.featured ? "lg:col-span-2 lg:flex-row" : "justify-between"
      }`}
    >
      {/* Media Preview Container */}
      <div
        className={`relative bg-[#050505] overflow-hidden ${
          project.featured
            ? "w-full lg:w-1/2 aspect-[16/10] border-b lg:border-b-0 lg:border-r border-white/5 shrink-0"
            : "w-full aspect-[16/10] border-b border-white/5"
        }`}
      >
        {project.mediaType === "video" ? (
          <video
            ref={videoRef}
            src={project.mediaSrc}
            poster={project.posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
          />
        ) : (
          <img
            src={project.mediaSrc}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
          />
        )}
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div
        className={`p-6 sm:p-8 flex flex-col justify-between flex-1 ${
          project.featured ? "lg:p-10" : ""
        }`}
      >
        <div>
          {/* Category */}
          <p className="text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#FF6A00] mb-2 sm:mb-2.5">
            {project.category}
          </p>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-light text-[#F5F5F5] group-hover:text-white transition-colors duration-300 mb-3">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-[15px] font-light text-[#B8B8B8] leading-[1.65] mb-6">
            {project.description}
          </p>

          {/* Customer-Friendly Feature Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.features.map((feature) => (
              <span
                key={feature}
                className="text-[11px] sm:text-xs font-normal text-[#D0D0D0] bg-white/[0.04] border border-white/10 px-2.5 py-1 rounded-md tracking-wide"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* CTA / Status Section */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          {project.ctaType === "link" && project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-[#050505] bg-[#FF6A00] hover:bg-[#FF8533] px-5 py-3 rounded-sm shadow-[0_0_15px_rgba(255,106,0,0.25)] hover:shadow-[0_0_25px_rgba(255,106,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] min-h-[44px]"
              aria-label={`Open live website for ${project.title}`}
            >
              <span>{project.ctaText}</span>
              <ExternalLink className="w-4 h-4" strokeWidth={2} />
            </a>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-[#A3A3A3] bg-white/[0.04] border border-white/10 px-4 py-2.5 rounded-sm select-none min-h-[44px]">
              {StatusIcon && <StatusIcon className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={2} />}
              <span>{project.ctaText}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
