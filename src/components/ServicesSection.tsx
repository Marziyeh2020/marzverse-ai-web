"use client";

import { motion } from "framer-motion";
import { Globe, Bot, Workflow, Check, ArrowRight } from "lucide-react";

interface ServicesSectionProps {
  onContact: (serviceTitle?: string) => void;
}

const services = [
  {
    id: "websites",
    icon: Globe,
    title: "Website Design & Development",
    description: "Fast, responsive and conversion-focused websites designed to turn visitors into customers.",
    features: [
      "Custom business websites",
      "Mobile-first development",
      "SEO-ready structure",
      "Performance optimization",
    ],
  },
  {
    id: "chatbots",
    icon: Bot,
    title: "AI Chatbots & Assistants",
    description: "Intelligent assistants that answer questions, capture leads and support customers around the clock.",
    features: [
      "Website AI chatbots",
      "Lead qualification",
      "Customer support automation",
      "Multilingual experiences",
    ],
  },
  {
    id: "automation",
    icon: Workflow,
    title: "CRM & Business Automation",
    description: "Connected systems that organize customers, automate repetitive tasks and simplify daily operations.",
    features: [
      "Customer and lead management",
      "Booking and follow-up workflows",
      "Automated notifications",
      "Custom business dashboards",
    ],
  },
];

export default function ServicesSection({ onContact }: ServicesSectionProps) {
  return (
    <section id="services" className="relative w-full py-20 sm:py-24 md:py-28 lg:py-32 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="text-left max-w-3xl mb-12 sm:mb-16 md:mb-20"
        >
          <p className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-[#A3A3A3] mb-3 sm:mb-4">
            OUR SERVICES
          </p>
          <h2 className="text-[30px] min-[390px]:text-[34px] sm:text-[42px] md:text-[50px] lg:text-[56px] font-extralight tracking-tight leading-[1.12] text-[#F5F5F5] mb-5 sm:mb-6">
            Digital Systems Built for <span className="text-[#FF6A00] font-normal">Real Business Growth</span>
          </h2>
          <p className="text-[15px] sm:text-[16px] md:text-[18px] font-light text-[#B8B8B8] leading-[1.7] max-w-2xl">
            From high-performance websites to AI-powered customer systems, we build practical digital solutions that help businesses attract customers, save time and grow.
          </p>
        </motion.div>

        {/* 3 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 1.2, delay: index * 0.15, ease: [0.25, 1, 0.5, 1] }}
                className="group relative bg-[#0B0B0B] border border-white/10 hover:border-[#FF6A00]/40 rounded-xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,106,0,0.08)] hover:-translate-y-1"
              >
                {/* Card Header & Content */}
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-lg bg-[#FF6A00]/10 border border-[#FF6A00]/20 flex items-center justify-center mb-6 group-hover:bg-[#FF6A00]/15 group-hover:border-[#FF6A00]/40 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#FF6A00]" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-light tracking-tight text-[#F5F5F5] mb-3 group-hover:text-white transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-[15px] font-light text-[#B8B8B8] leading-[1.65] mb-6">
                    {service.description}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 mb-8 border-t border-white/5 pt-6" aria-label={`${service.title} key features`}>
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm font-light text-[#D0D0D0]">
                        <span className="w-4 h-4 rounded-full bg-[#FF6A00]/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-[#FF6A00]" strokeWidth={2.5} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action: Learn More Button */}
                <div className="pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => onContact(service.title)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-[#FF6A00] hover:text-[#FF8533] transition-colors duration-300 group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] rounded-sm py-2 cursor-pointer min-h-[44px]"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" strokeWidth={1.75} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
