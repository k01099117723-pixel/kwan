import React, { useState } from 'react';
import { VolumeX, Video, Cpu, ShieldCheck, Award, Sparkles } from 'lucide-react';

interface PillarCardProps {
  pillar: {
    icon: any;
    title: string;
    description: string;
  };
}

const PillarCard: React.FC<PillarCardProps> = ({ pillar }) => {
  const Icon = pillar.icon;
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
      className="group relative p-8 rounded-3xl bg-[#0e121b]/90 backdrop-blur-xl border border-[#1b2333] hover:border-[#d4af37]/50 hover:shadow-2xl hover:shadow-[#d4af37]/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
    >
      {/* Pointer Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.08), transparent 70%)`
        }}
      />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-[#161c28] border border-[#232c40] flex items-center justify-center text-[#d4af37] mb-6 group-hover:scale-105 group-hover:border-[#d4af37]/50 group-hover:shadow-lg group-hover:shadow-[#d4af37]/10 transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold font-display text-white mb-3 group-hover:text-[#f3e5ab] transition-colors">
          {pillar.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#8c9bb0] leading-relaxed">
          {pillar.description}
        </p>
      </div>

      <div className="relative z-10 mt-6 pt-4 border-t border-[#182030] flex items-center gap-2 text-[11px] font-semibold text-[#d4af37]">
        <Sparkles className="w-3 h-3" />
        <span>Standard Broadcast 2026</span>
      </div>
    </div>
  );
};

export const WhyKwanSection: React.FC = () => {
  const pillars = [
    {
      icon: VolumeX,
      title: "Silence Absolu & Traitement Acoustique",
      description: "Cabine insonorisée certifiée R-60. Zéro écho, zéro réverbération parasite, pour un timbre de voix riche, chaud et intime qui captive vos auditeurs."
    },
    {
      icon: Video,
      title: "Rendu Visuel 4K Cinématographique",
      description: "Nos capteurs plein format Sony FX3 et nos optiques Sony G Master délivrent une profondeur de champ d'élite et des teintes flatteuses dès le tournage."
    },
    {
      icon: Cpu,
      title: "Régie Technique Complète sur Place",
      description: "Ne perdez plus votre énergie dans les réglages. Un ingénieur du son et un cadreur réalisateur veillent sur votre enregistrement du début à la fin."
    },
    {
      icon: ShieldCheck,
      title: "Confidentialité & Accueil VIP",
      description: "Situé dans un cadre discret à Casablanca (Quartier Racine). Salon d'accueil privé, café de spécialité et discrétion absolue pour vos personnalités invitées."
    }
  ];

  return (
    <section id="pourquoi-kwan" className="py-24 bg-[#0a0d14] relative border-t border-[#151b27] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#d4af37]/5 rounded-full blur-[180px] pointer-events-none animate-slow-orbit" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141926] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Excellence & Savoir-faire</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            Pourquoi les créateurs de référence choisissent Kwan Studio.
          </h2>
          <p className="text-[#9bb0c7] text-base sm:text-lg leading-relaxed font-light">
            Une exigence sans compromis sur l'image et le son. Donnez à votre podcast l'envergure qu'il mérite dès le premier épisode.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <PillarCard key={idx} pillar={pillar} />
          ))}
        </div>

      </div>
    </section>
  );
};
