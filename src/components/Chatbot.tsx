"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Globe,
  Bot,
  Workflow,
  FolderGit2,
  DollarSign,
  Send,
  Loader2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
}

interface ChatbotProps {
  onOpenContact?: () => void;
}

const VERIFIED_URLS = [
  'https://www.sadiesalteration.com/',
  'https://akcetinmuhendislik.com/',
  'https://xn--hacbey-r9a.com/',
  'https://www.globalbridgehealth.com/',
  'https://wa.me/905441445901',
  'mailto:contact@marzverse.com'
];

const emptySubscribe = () => () => {};

export default function Chatbot({ onOpenContact }: ChatbotProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      text: "Hello! I'm Marzy, the MarzVerse AI Assistant.\nHow can I help you grow your business today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && isMounted) {
      scrollToBottom();
      // Auto-focus input on desktop after mount
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        inputRef.current?.focus();
      }
    }
  }, [messages, isOpen, isMounted]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };

    // Prepare history
    const historyToSend = messages
      .filter((m) => m.id !== '1')
      .map((m) => ({
        role: (m.role === 'bot' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: m.text
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setShowTopics(false); // Collapse topics after conversation starts

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyToSend
        })
      });

      const data = await res.json().catch(() => null);
      const botReply = data?.reply || "I'm experiencing a temporary connection issue. Please contact us directly at contact@marzverse.com or via WhatsApp.";

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: botReply
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: "I couldn't complete your request due to a network issue. Please reach out to us at contact@marzverse.com or on WhatsApp at +90 544 144 59 01."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'start_project') {
      setIsOpen(false);
      if (onOpenContact) {
        onOpenContact();
      }
      return;
    }

    const promptMap: Record<string, string> = {
      websites: 'Tell me about your Website Design & Development services.',
      chatbots: 'Tell me about your AI Chatbots & Assistants.',
      automation: 'Tell me about your CRM & Business Automation systems.',
      projects: 'Can you show me some of your recent portfolio projects?',
      pricing: 'How does pricing work for your services?'
    };

    const promptText = promptMap[action];
    if (promptText) {
      handleSend(promptText);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'bot',
        text: "Conversation reset. How can I help you today?"
      }
    ]);
    setShowTopics(true);
  };

  // Safe renderer for message text that turns verified URLs and emails into secure links
  const renderMessageContent = (text: string) => {
    // Regex for URLs and mailto
    const urlPattern = /(https?:\/\/[^\s)]+|mailto:[^\s)]+|contact@marzverse\.com)/g;
    const parts = text.split(urlPattern);

    return parts.map((part, index) => {
      if (part === 'contact@marzverse.com' || part === 'mailto:contact@marzverse.com') {
        return (
          <a
            key={index}
            href="mailto:contact@marzverse.com"
            className="text-[#FF6A00] underline hover:text-[#FF8533] inline-flex items-center gap-0.5 break-all font-normal"
          >
            contact@marzverse.com
          </a>
        );
      }

      if (part.startsWith('http://') || part.startsWith('https://')) {
        const cleanUrl = part.replace(/[.,;!]$/, '');
        // Check if it's one of our verified domains or whatsapp
        const isVerified = VERIFIED_URLS.some((v) => cleanUrl.startsWith(v.split('?')[0])) || cleanUrl.includes('wa.me');

        if (isVerified) {
          return (
            <a
              key={index}
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6A00] underline hover:text-[#FF8533] inline-flex items-center gap-1 break-all font-medium"
            >
              <span>{cleanUrl.replace('https://', '').replace('www.', '').split('/')[0]}</span>
              <ExternalLink className="w-3 h-3 inline shrink-0" />
            </a>
          );
        }

        return (
          <span key={index} className="text-[#E0E0E0] break-all">
            {part}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence initial={false}>
        {!isOpen && (
          <motion.button
            key="chatbot-fab-button"
            initial={isMounted ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant chat"
            aria-expanded={isOpen}
            aria-controls="chatbot-dialog"
            className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-[calc(16px+env(safe-area-inset-right))] sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#FF6A00]/40 bg-[#050505]/90 backdrop-blur-xl flex items-center justify-center shadow-[0_0_25px_rgba(255,106,0,0.35)] hover:shadow-[0_0_35px_rgba(255,106,0,0.6)] hover:border-[#FF6A00] transition-all duration-300 group cursor-pointer"
          >
            <div className="w-full h-full rounded-full overflow-hidden p-0.5">
              <img
                src="/charachter.png"
                alt="Marzverse Assistant Avatar"
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Subtle Online Dot */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-[#FF6A00] border-2 border-[#050505] rounded-full shadow-[0_0_8px_#FF6A00]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbot-dialog-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            id="chatbot-dialog"
            role="dialog"
            aria-modal="false"
            aria-label="MarzVerse AI Assistant"
            className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] sm:bottom-20 right-3 sm:right-6 md:right-8 z-40 w-[calc(100vw-24px)] sm:w-[390px] max-w-[420px] bg-[#0B0B0B] border border-white/15 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-white/[0.04] to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#FF6A00]/40 shrink-0">
                  <img
                    src="/charachter.png"
                    alt="Marzverse Assistant Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold tracking-wider text-[#F5F5F5] flex items-center gap-1.5">
                    MARZVERSE <span className="text-[#FF6A00]">ASSISTANT</span>
                  </h3>
                  <p className="text-[10px] text-[#A3A3A3] tracking-widest uppercase">
                    AI AGENT • ONLINE
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 2 && (
                  <button
                    onClick={handleResetChat}
                    aria-label="Reset conversation"
                    title="Reset chat"
                    className="text-[#777777] hover:text-[#F5F5F5] p-1.5 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close AI Assistant chat"
                  className="text-[#A3A3A3] hover:text-[#F5F5F5] p-1.5 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div
              className="p-3.5 sm:p-4 h-[52vh] min-h-[320px] max-h-[440px] overflow-y-auto flex flex-col gap-4"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#262626 transparent' }}
            >
              {/* Messages list */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-[#FF6A00]/15 border border-[#FF6A00]/30 text-white rounded-br-xs'
                        : 'bg-[#141414] border border-white/8 text-[#D0D0D0] rounded-bl-xs'
                    }`}
                  >
                    {renderMessageContent(msg.text)}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#141414] border border-white/8 rounded-2xl rounded-bl-xs p-3 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-[#FF6A00] animate-spin" />
                    <span className="text-xs text-[#A3A3A3]">Marzy is thinking...</span>
                  </div>
                </div>
              )}

              {/* Quick Actions / Topics Section */}
              {showTopics && messages.length <= 2 && (
                <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] text-[#A3A3A3] tracking-widest uppercase">
                      QUICK ACTIONS
                    </p>
                    {messages.length > 1 && (
                      <button
                        onClick={() => setShowTopics(false)}
                        className="text-[10px] text-[#777777] hover:text-[#A3A3A3]"
                      >
                        Hide
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <QuickActionButton
                      icon={<Globe className="w-3.5 h-3.5 text-[#FF6A00]" />}
                      title="Websites"
                      onClick={() => handleQuickAction('websites')}
                    />
                    <QuickActionButton
                      icon={<Bot className="w-3.5 h-3.5 text-[#FF6A00]" />}
                      title="AI Assistants"
                      onClick={() => handleQuickAction('chatbots')}
                    />
                    <QuickActionButton
                      icon={<Workflow className="w-3.5 h-3.5 text-[#FF6A00]" />}
                      title="CRM & Automation"
                      onClick={() => handleQuickAction('automation')}
                    />
                    <QuickActionButton
                      icon={<FolderGit2 className="w-3.5 h-3.5 text-[#FF6A00]" />}
                      title="Our Projects"
                      onClick={() => handleQuickAction('projects')}
                    />
                    <QuickActionButton
                      icon={<DollarSign className="w-3.5 h-3.5 text-[#FF6A00]" />}
                      title="Pricing"
                      onClick={() => handleQuickAction('pricing')}
                    />
                    <QuickActionButton
                      icon={<Sparkles className="w-3.5 h-3.5 text-[#FF6A00]" />}
                      title="Start a Project"
                      highlight
                      onClick={() => handleQuickAction('start_project')}
                    />
                  </div>
                </div>
              )}

              {/* Conversation Footer CTAs (Always Accessible) */}
              {!showTopics && messages.length > 2 && (
                <div className="pt-2 flex flex-wrap gap-1.5 justify-end">
                  <button
                    onClick={() => handleQuickAction('start_project')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6A00]/15 hover:bg-[#FF6A00]/25 border border-[#FF6A00]/40 rounded-lg text-[11px] font-medium text-[#FF6A00] transition-colors cursor-pointer"
                  >
                    <span>Start a Project</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <a
                    href="https://wa.me/905441445901?text=Hello%20MarzVerse%2C%20I%E2%80%99m%20interested%20in%20your%20digital%20services.%20I%E2%80%99d%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-medium text-[#D0D0D0] hover:text-white transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-3.5 border-t border-white/10 bg-[#0B0B0B]">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Marzy a question..."
                  maxLength={1000}
                  aria-label="Type your message to MarzVerse AI Assistant"
                  className="w-full min-w-0 bg-[#141414] border border-white/10 rounded-lg py-2.5 pl-3.5 pr-11 text-xs sm:text-sm text-white placeholder-[#707070] focus:outline-none focus:border-[#FF6A00]/60 transition-colors"
                />
                <button
                  onClick={() => handleSend(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  aria-label="Send message to AI Assistant"
                  className="absolute right-1 w-8 h-8 bg-[#FF6A00] hover:bg-[#FF8533] rounded-md flex items-center justify-center text-[#050505] font-bold transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#050505]" strokeWidth={2} />
                </button>
              </div>

              {/* Updated Accurate UI Copy */}
              <div className="mt-2 flex items-center justify-center gap-1.5 px-1">
                <p className="text-[10px] text-[#808080] tracking-normal text-center leading-tight">
                  AI replies instantly. Project enquiries are reviewed by our team.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function QuickActionButton({
  icon,
  title,
  onClick,
  highlight = false
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left min-w-0 cursor-pointer ${
        highlight
          ? 'bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 border-[#FF6A00]/40 text-[#FF6A00]'
          : 'bg-[#141414] hover:bg-[#1C1C1C] border-white/5 text-[#D0D0D0] hover:text-white'
      }`}
    >
      <div className="shrink-0">{icon}</div>
      <span className="text-[11px] sm:text-xs font-medium truncate">{title}</span>
    </button>
  );
}
