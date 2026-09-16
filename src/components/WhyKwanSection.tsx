import React from 'react';
import { VolumeX, Video, Cpu, ShieldCheck, Award, Sparkles } from 'lucide-react';

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
    <section id="pourquoi-kwan" className="py-24 bg-[#0a0d14] relative border-t border-[#151b27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#0e121b] border border-[#1b2333] hover:border-[#d4af37]/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#161c28] border border-[#232c40] flex items-center justify-center text-[#d4af37] mb-6 group-hover:scale-110 group-hover:border-[#d4af37]/50 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-white mb-3 group-hover:text-[#f3e5ab] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8c9bb0] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#182030] flex items-center gap-2 text-[11px] font-semibold text-[#d4af37]">
                  <Sparkles className="w-3 h-3" />
                  <span>Standard Broadcast 2026</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
