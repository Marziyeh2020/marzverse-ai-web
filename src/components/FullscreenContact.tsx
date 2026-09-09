"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Mail, CheckCircle2, AlertCircle, Loader2, ArrowUpRight } from "lucide-react";

interface FullscreenContactProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

const SERVICE_OPTIONS = [
  "Website Design & Development",
  "AI Chatbots & Assistants",
  "CRM & Business Automation",
  "Other",
];

const WHATSAPP_URL =
  "https://wa.me/905441445901?text=Hello%20MarzVerse%2C%20I%E2%80%99m%20interested%20in%20your%20digital%20services.%20I%E2%80%99d%20like%20to%20discuss%20a%20project.";

export default function FullscreenContact({
  isOpen,
  onClose,
  initialService = "",
}: FullscreenContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState(
    initialService && SERVICE_OPTIONS.includes(initialService)
      ? initialService
      : SERVICE_OPTIONS[0]
  );
  const [prevInitialService, setPrevInitialService] = useState(initialService);
  if (prevInitialService !== initialService) {
    setPrevInitialService(initialService);
    setService(
      initialService && SERVICE_OPTIONS.includes(initialService)
        ? initialService
        : SERVICE_OPTIONS[0]
    );
  }

  const [details, setDetails] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(""); // Honeypot bot protection

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const statusRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Manage body scroll locking and keyboard focus restoration
  useEffect(() => {
    if (isOpen) {
      // Capture currently focused element to restore on close
      triggerElementRef.current = document.activeElement as HTMLElement;
      // Lock background scrolling
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      // Restore focus on close
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    }
  }, [isOpen]);

  // Focus status box on status change for accessibility
  useEffect(() => {
    if (status !== "idle" && statusRef.current) {
      statusRef.current.focus();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Client-side quick check
    if (!name.trim() || !email.trim() || !service.trim() || !details.trim() || !consent) {
      setStatus("error");
      setErrorMessage("Please complete all required fields and accept the consent checkbox.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          service: service.trim(),
          details: details.trim(),
          consent,
          hp: hp.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        setStatus("success");
        // Clear form only on verified success
        setName("");
        setEmail("");
        setCompany("");
        setService(SERVICE_OPTIONS[0]);
        setDetails("");
        setConsent(false);
        setHp("");
      } else {
        setStatus("error");
        setErrorMessage(
          data?.error || "We couldn’t send your request. Please try again or reach out directly."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Please try again or reach us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset status after modal animation
    setTimeout(() => {
      setStatus("idle");
      setErrorMessage("");
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#050505]/95 backdrop-blur-2xl pointer-events-auto"
        >
          {/* Subtle Ambient Background Gradients */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-[10%] right-[10%] w-[40%] h-[40%] bg-[#FF6A00] opacity-[0.04] blur-[140px] rounded-full" />
            <div className="absolute -bottom-[10%] left-[10%] w-[40%] h-[40%] bg-[#3B82F6] opacity-[0.03] blur-[140px] rounded-full" />
          </div>

          {/* Fixed Accessible Close Button */}
          <div className="fixed top-5 right-5 sm:top-8 sm:right-8 z-30">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close contact dialog"
              className="group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#141414] hover:bg-[#1F1F1F] border border-white/10 hover:border-[#FF6A00]/50 text-[#A3A3A3] hover:text-white transition-all duration-300 cursor-pointer shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.75} />
            </button>
          </div>

          {/* Modal Content Scroll Wrapper */}
          <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 pb-20 max-w-4xl mx-auto">
            {/* Modal Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full text-left max-w-2xl mb-8 sm:mb-10"
            >
              <p className="text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase text-[#FF6A00] mb-2 sm:mb-3">
                START A PROJECT
              </p>
              <h2
                id="contact-modal-title"
                className="text-2xl sm:text-3xl md:text-4xl font-extralight tracking-tight text-[#F5F5F5] mb-3 leading-[1.15]"
              >
                Let’s Build Something That Works
              </h2>
              <p className="text-sm sm:text-[15px] font-light text-[#B8B8B8] leading-[1.6]">
                Tell us what you need and we’ll get back to you with the next steps.
              </p>
            </motion.div>

            {/* Main Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-2xl bg-[#0B0B0B] border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Success Feedback Box */}
              {status === "success" && (
                <div
                  ref={statusRef}
                  tabIndex={-1}
                  className="mb-8 p-6 rounded-xl bg-[#0E1A11] border border-emerald-500/30 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-start gap-3.5 mb-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2} />
                    <div>
                      <h3 className="text-base sm:text-lg font-medium text-emerald-200">
                        Thank you — your request has been sent.
                      </h3>
                      <p className="text-xs sm:text-sm font-light text-emerald-300/80 mt-1 leading-relaxed">
                        We’ve received your project details and will get back to you as soon as possible.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#050505] font-semibold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Error Feedback Box */}
              {status === "error" && (
                <div
                  ref={statusRef}
                  tabIndex={-1}
                  className="mb-8 p-5 rounded-xl bg-[#1A0D0D] border border-red-500/30 text-left focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" strokeWidth={2} />
                    <div>
                      <h3 className="text-sm sm:text-base font-medium text-red-200">
                        We couldn’t send your request.
                      </h3>
                      <p className="text-xs sm:text-sm font-light text-red-300/80 mt-1">
                        {errorMessage || "Please try again, email us directly, or contact us on WhatsApp."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Element */}
              {status !== "success" && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
                  {/* Visually Hidden Honeypot Input for Anti-Spam */}
                  <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                    <label htmlFor="hp-field">Leave this empty</label>
                    <input
                      id="hp-field"
                      type="text"
                      name="hp"
                      value={hp}
                      onChange={(e) => setHp(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* 1. Name & 2. Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium uppercase tracking-wider text-[#D0D0D0] mb-2">
                        Name <span className="text-[#FF6A00]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        maxLength={100}
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-colors disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-medium uppercase tracking-wider text-[#D0D0D0] mb-2">
                        Email <span className="text-[#FF6A00]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        maxLength={254}
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* 3. Company (Optional) & 4. Service Needed Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label htmlFor="contact-company" className="block text-xs font-medium uppercase tracking-wider text-[#D0D0D0] mb-2">
                        Company <span className="text-[#777777] font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        maxLength={150}
                        placeholder="Company name"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-colors disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-service" className="block text-xs font-medium uppercase tracking-wider text-[#D0D0D0] mb-2">
                        Service Needed <span className="text-[#FF6A00]">*</span>
                      </label>
                      <select
                        id="contact-service"
                        required
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#141414] text-[#F5F5F5]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 5. Project Details */}
                  <div>
                    <label htmlFor="contact-details" className="block text-xs font-medium uppercase tracking-wider text-[#D0D0D0] mb-2">
                      Project Details <span className="text-[#FF6A00]">*</span>
                    </label>
                    <textarea
                      id="contact-details"
                      required
                      rows={4}
                      maxLength={3000}
                      placeholder="Tell us briefly about your business, project goals and what you need help with."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-colors resize-none disabled:opacity-50"
                    />
                  </div>

                  {/* 6. Consent Checkbox */}
                  <div className="flex items-start gap-3 pt-1">
                    <input
                      id="contact-consent"
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={isSubmitting}
                      className="w-4 h-4 rounded border-white/20 bg-[#141414] text-[#FF6A00] focus:ring-[#FF6A00] focus:ring-offset-0 mt-0.5 accent-[#FF6A00] cursor-pointer"
                    />
                    <label htmlFor="contact-consent" className="text-xs text-[#A3A3A3] leading-relaxed cursor-pointer select-none">
                      I agree that MarzVerse may use my information to respond to this project request.
                    </label>
                  </div>

                  {/* 7. Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#FF6A00] hover:bg-[#FF8533] text-[#050505] font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase rounded-lg shadow-[0_0_20px_rgba(255,106,0,0.25)] hover:shadow-[0_0_30px_rgba(255,106,0,0.45)] transition-all duration-300 disabled:opacity-50 cursor-pointer min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#050505]" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send Project Request</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Visual Divider: OR CONTACT US DIRECTLY */}
              <div className="relative my-8 sm:my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0B0B0B] px-4 text-[10px] sm:text-[11px] font-medium tracking-[0.25em] text-[#A3A3A3]">
                    OR CONTACT US DIRECTLY
                  </span>
                </div>
              </div>

              {/* Direct Contact Actions: WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* WhatsApp Action */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 hover:border-[#FF6A00]/40 transition-all duration-300 cursor-pointer min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
                  aria-label="Chat on WhatsApp for a quick project conversation"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center shrink-0 group-hover:bg-[#FF6A00]/20 transition-colors">
                      <MessageSquare className="w-5 h-5 text-[#FF6A00]" strokeWidth={1.75} />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-[#F5F5F5] group-hover:text-white truncate">
                        Chat on WhatsApp
                      </div>
                      <div className="text-[11px] text-[#888888] truncate mt-0.5">
                        For a quick project conversation
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#777777] group-hover:text-[#FF6A00] transition-colors shrink-0 ml-2" />
                </a>

                {/* Direct Email Action */}
                <a
                  href="mailto:contact@marzverse.com"
                  className="group flex items-center justify-between p-4 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 hover:border-[#FF6A00]/40 transition-all duration-300 cursor-pointer min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
                  aria-label="Send us an email at contact@marzverse.com"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center shrink-0 group-hover:bg-[#FF6A00]/20 transition-colors">
                      <Mail className="w-5 h-5 text-[#FF6A00]" strokeWidth={1.75} />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-[#F5F5F5] group-hover:text-white truncate">
                        contact@marzverse.com
                      </div>
                      <div className="text-[11px] text-[#888888] truncate mt-0.5">
                        Send us an email
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#777777] group-hover:text-[#FF6A00] transition-colors shrink-0 ml-2" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
