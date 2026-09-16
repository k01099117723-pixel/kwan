import React from 'react';
import { Star, MessageCircle, Quote } from 'lucide-react';
import { Testimonial } from '../types.js';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="py-24 bg-[#07090e] relative border-t border-[#161c28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121622] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Retours d'Expérience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            Ils créent leur émission chez Kwan Studio.
          </h2>
          <p className="text-[#9bb0c7] text-base sm:text-lg leading-relaxed font-light">
            Découvrez comment podcasters indépendants, marques et dirigeants subliment leur prise de parole dans notre studio à Casablanca.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-3xl bg-[#0c1017] border border-[#1d2538] hover:border-[#d4af37]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-[#d4af37]">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-[#cbd6e5] leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-[#182030] flex items-center gap-3.5">
                {item.avatar_url ? (
                  <img
                    src={item.avatar_url}
                    alt={item.author_name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-[#d4af37]/30"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#161c28] border border-[#d4af37]/30 flex items-center justify-center font-bold text-white text-sm">
                    {item.author_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-white">{item.author_name}</div>
                  <div className="text-xs text-[#8292a8]">{item.role_company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
