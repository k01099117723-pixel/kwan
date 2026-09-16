import React, { useState } from 'react';
import { Star, MessageCircle, Quote } from 'lucide-react';
import { Testimonial } from '../types.js';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

interface TestimonialCardProps {
  item: Testimonial;
}

const TestimonialCardItem: React.FC<TestimonialCardProps> = ({ item }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-8 rounded-3xl bg-[#0c1017]/90 backdrop-blur-xl border border-[#1d2538] hover:border-[#d4af37]/50 hover:shadow-2xl hover:shadow-[#d4af37]/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
    >
      {/* Pointer Spotlight inside card */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.08), transparent 70%)`
        }}
      />

      {/* Elegant watermark quote icon in the top right */}
      <Quote className="absolute top-6 right-6 w-12 h-12 text-[#d4af37]/10 pointer-events-none group-hover:text-[#d4af37]/20 transition-colors duration-300" />

      <div className="space-y-4 relative z-10">
        {/* Rating stars with gentle glow */}
        <div className="flex items-center gap-1 text-[#d4af37]">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]" />
          ))}
        </div>

        {/* Quote */}
        <p className="text-sm text-[#cbd6e5] leading-relaxed italic font-light">
          "{item.quote}"
        </p>
      </div>

      {/* Author Footer */}
      <div className="pt-6 mt-6 border-t border-[#182030] flex items-center gap-3.5 relative z-10">
        {item.avatar_url ? (
          <img
            src={item.avatar_url}
            alt={item.author_name}
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-full object-cover border border-[#d4af37]/40 shadow-sm"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#161c28] border border-[#d4af37]/35 flex items-center justify-center font-bold text-white text-sm shadow-sm">
            {item.author_name.charAt(0)}
          </div>
        )}
        <div>
          <div className="text-sm font-bold text-white group-hover:text-[#f3e5ab] transition-colors">{item.author_name}</div>
          <div className="text-xs text-[#8292a8]">{item.role_company}</div>
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="py-24 bg-[#07090e] relative border-t border-[#161c28] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#d4af37]/5 rounded-full blur-[170px] pointer-events-none animate-slow-orbit" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
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
            <TestimonialCardItem key={item.id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
};
