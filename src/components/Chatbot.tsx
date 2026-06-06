"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Globe, Zap, DollarSign, Mail, Send, ChevronRight, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: "Hello, I'm Marzverse Assistant.\nHow can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() })
      });
      const data = await res.json();
      
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', text: data.reply || "Error connecting to AI." };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: "Sorry, an error occurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(inputValue);
    }
  };

  const handleTopicClick = (topic: string) => {
    handleSend(topic);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full border border-[#FF8A00] bg-black/50 backdrop-blur-md flex items-center justify-center text-[#FF8A00] shadow-[0_0_20px_rgba(255,138,0,0.3)] hover:shadow-[0_0_30px_rgba(255,138,0,0.5)] transition-shadow duration-300 group"
          >
            <Bot className="w-7 h-7 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chatbot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed bottom-24 md:bottom-28 left-0 right-0 mx-auto md:mx-0 md:left-auto md:right-8 z-50 w-[90vw] md:w-[380px] max-w-[420px] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
          >
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="flex items-center gap-4">
                <div className="text-[#FF8A00]">
                  <Bot className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wider text-white">
                    MARZVERSE <span className="text-[#FF8A00]">ASSISTANT</span>
                  </h3>
                  <p className="text-[10px] text-[#BFBFBF] tracking-widest uppercase mt-0.5">AI POWERED</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[#BFBFBF] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-5 md:p-5 h-[50vh] min-h-[350px] max-h-[400px] md:h-[400px] overflow-y-auto flex flex-col gap-8 md:gap-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
              
              {messages.length === 1 && (
                <div>
                  <p className="text-[10px] text-[#BFBFBF] tracking-widest uppercase mb-3 px-1">POPULAR TOPICS</p>
                  <div className="flex flex-col gap-3 md:gap-2">
                    <TopicButton onClick={() => handleTopicClick("Website Development")} icon={<Globe className="w-4 h-4 text-[#FF8A00]" strokeWidth={1.5} />} title="Website Development" desc="Modern websites 1-4 pages" />
                    <TopicButton onClick={() => handleTopicClick("AI Chatbots")} icon={<Bot className="w-4 h-4 text-[#FF8A00]" strokeWidth={1.5} />} title="AI Chatbots" desc="Smart chatbot solutions" />
                    <TopicButton onClick={() => handleTopicClick("AI Automation")} icon={<Zap className="w-4 h-4 text-[#FF8A00]" strokeWidth={1.5} />} title="AI Automation" desc="Automate your business" />
                    <TopicButton onClick={() => handleTopicClick("Pricing")} icon={<DollarSign className="w-4 h-4 text-[#FF8A00]" strokeWidth={1.5} />} title="Pricing" desc="Plans & custom quotes" />
                    <TopicButton onClick={() => handleTopicClick("Contact")} icon={<Mail className="w-4 h-4 text-[#FF8A00]" strokeWidth={1.5} />} title="Contact" desc="Get in touch with us" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-5 md:gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] md:max-w-[85%] rounded-2xl md:rounded-xl p-5 md:p-4 relative ${msg.role === 'user' ? 'bg-[#FF8A00]/10 border border-[#FF8A00]/20' : 'bg-[#141414] border border-white/5'}`}>
                      {msg.role === 'bot' && msg.id === '1' && (
                        <p className="text-[#FF8A00] font-medium text-sm mb-2 md:mb-1">Hello, I'm Marzverse Assistant.</p>
                      )}
                      <p className={`text-[15px] md:text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : 'text-[#BFBFBF]'}`}>
                        {msg.role === 'bot' && msg.id === '1' ? msg.text.split('\n')[1] : msg.text}
                      </p>
                      {msg.role === 'bot' && (
                        <div className="absolute bottom-4 right-4 w-1.5 h-1.5 md:w-1 md:h-1 rounded-full bg-[#FF8A00]"></div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#141414] border border-white/5 rounded-xl p-4 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-[#FF8A00] animate-spin" />
                      <span className="text-sm text-[#BFBFBF]">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-5 border-t border-white/10 bg-[#0A0A0A]">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question..." 
                  className="w-full bg-[#141414] border border-white/10 rounded-lg py-3 md:py-3 pl-4 pr-14 text-[15px] md:text-sm text-white placeholder-[#BFBFBF]/50 focus:outline-none focus:border-[#FF8A00]/50 transition-colors"
                />
                <button 
                  onClick={() => handleSend(inputValue)}
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-2 w-9 h-9 md:w-8 md:h-8 bg-[#FF8A00] rounded-md flex items-center justify-center text-white hover:bg-[#FF8A00]/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 md:w-4 md:h-4" strokeWidth={1.5} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <p className="text-[10px] md:text-[10px] text-[#BFBFBF] tracking-wider">We typically reply instantly.</p>
                <div className="w-1 h-1 rounded-full bg-[#FF8A00]"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TopicButton({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] border border-white/5 transition-colors group text-left">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#FF8A00]/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#E5E5E5] group-hover:text-white transition-colors">{title}</h4>
          <p className="text-[11px] text-[#808080] mt-0.5">{desc}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-[#404040] group-hover:text-[#BFBFBF] transition-colors" strokeWidth={1.5} />
    </button>
  );
}
