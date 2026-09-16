import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQ } from '../types.js';

interface FaqSectionProps {
  faqs: FAQ[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id || null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#090c13] relative border-t border-[#161c28] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none animate-slow-orbit" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141926] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Questions Fréquentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Tout ce que vous devez savoir avant votre session.
          </h2>
          <p className="text-[#9bb0c7] text-sm sm:text-base leading-relaxed font-light">
            Une question spécifique ? Notre équipe studio est joignable 7j/7 pour vous assister.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl backdrop-blur-md transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0f1422]/90 border border-[#d4af37]/45 shadow-xl shadow-black/50'
                    : 'bg-[#0d1119]/80 border border-[#1b2334] hover:border-[#d4af37]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none group cursor-pointer"
                >
                  <span className={`font-bold text-sm sm:text-base transition-colors ${isOpen ? 'text-[#f3e5ab]' : 'text-white group-hover:text-[#f3e5ab]'}`}>
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-lg border transition-all duration-300 shrink-0 ${
                    isOpen
                      ? 'bg-[#d4af37]/20 border-[#d4af37]/50 text-[#f3e5ab] rotate-180'
                      : 'bg-[#141a27] border-[#222c40] text-[#d4af37] group-hover:border-[#d4af37]/40'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-[#93a2b7] leading-relaxed border-t border-[#182236] animate-in fade-in duration-300">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
