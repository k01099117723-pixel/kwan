import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Sliders, Mic2, Camera, Sparkles } from 'lucide-react';

interface StudioImage {
  url: string;
  title: string;
  category: string;
  description: string;
}

const DEFAULT_STUDIO_IMAGES: StudioImage[] = [
  {
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    title: 'Plateau Principal & Configuration Duo / Invités',
    category: 'Plateau Tournage',
    description: 'Table acoustique sur-mesure en chêne foncé, fauteuils grand confort et micros Shure SM7B montés sur bras silencieux.'
  },
  {
    url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop',
    title: 'Captation Micro Broadcast & Traitement Acoustique',
    category: 'Audio & Voix',
    description: 'Micros Shure SM7B avec capsules cardioïdes isolées et filtres anti-pop intégrés, adossés à des diffuseurs en bois noble.'
  },
  {
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    title: 'Régie Audio & Console de Réalisation en Direct',
    category: 'Régie Technique',
    description: 'Interface Rødecaster Pro II avec monitoring indépendant pour chaque intervenant et enregistrement multicanal non compressé.'
  },
  {
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
    title: 'Dispositif Caméras 4K Cinéma Sony FX3',
    category: 'Vidéo 4K',
    description: 'Capteurs plein format avec optiques cinéma GM pour une profondeur de champ flatteuse et un rendu cinéma haut de gamme.'
  }
];

export const StudioSection: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % DEFAULT_STUDIO_IMAGES.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + DEFAULT_STUDIO_IMAGES.length) % DEFAULT_STUDIO_IMAGES.length);
    }
  };

  return (
    <section id="studio" className="py-24 bg-[#090c13] relative border-t border-[#161c28] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#d4af37]/6 rounded-full blur-[150px] pointer-events-none animate-slow-orbit" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141926] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>L'Espace Kwan Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Un studio conçu pour sublimer votre image et votre voix.
          </h2>
          <p className="text-[#9bb0c7] text-base sm:text-lg leading-relaxed font-light">
            Une acoustique sur-mesure aux normes broadcast, des caméras cinéma 4K et un décor alliant élégance contemporaine et chaleur des matières nobles.
          </p>
        </div>

        {/* Studio Specs Bar with glassmorphism & hover illumination */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group p-6 rounded-2xl bg-[#0f131c]/90 backdrop-blur-md border border-[#1d2536] hover:border-[#d4af37]/50 hover:shadow-xl hover:shadow-[#d4af37]/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#161c2b] border border-[#242e44] group-hover:border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-105 transition-all duration-300">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#f3e5ab] transition-colors">
              Caméras Sony FX3 Cinema Line
            </h3>
            <p className="text-sm text-[#8796ab] leading-relaxed">
              3 angles de prise de vue 4K 10-bit en simultané. Rendu colorimétrique cinématographique S-Cinetone pour des teintes de peau naturelles.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-[#0f131c]/90 backdrop-blur-md border border-[#1d2536] hover:border-[#d4af37]/50 hover:shadow-xl hover:shadow-[#d4af37]/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#161c2b] border border-[#242e44] group-hover:border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-105 transition-all duration-300">
              <Mic2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#f3e5ab] transition-colors">
              Micros Broadcast Shure SM7B
            </h3>
            <p className="text-sm text-[#8796ab] leading-relaxed">
              La référence mondiale des plus grands podcasts. Clarté vocale exceptionnelle, réjection totale des bruits d'ambiance et présence chaleureuse.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-[#0f131c]/90 backdrop-blur-md border border-[#1d2536] hover:border-[#d4af37]/50 hover:shadow-xl hover:shadow-[#d4af37]/5 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#161c2b] border border-[#242e44] group-hover:border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-105 transition-all duration-300">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#f3e5ab] transition-colors">
              Traitement Acoustique & Régie
            </h3>
            <p className="text-sm text-[#8796ab] leading-relaxed">
              Panneaux absorbants en tasseaux de bois naturel, insonorisation studio certifiée et régie technique dédiée pilotée par nos ingénieurs son.
            </p>
          </div>
        </div>

        {/* Gallery Grid with smooth zoom and shine sweep */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DEFAULT_STUDIO_IMAGES.map((img, index) => (
            <div
              key={index}
              onClick={() => openLightbox(index)}
              className="group relative rounded-2xl overflow-hidden bg-[#111520] border border-[#1e2638] hover:border-[#d4af37]/60 transition-all duration-500 cursor-pointer shadow-xl shadow-black/60 hover:-translate-y-1"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Diagonal light shine sheen on hover */}
                <span className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

                {/* Lightbox Trigger Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                  <Maximize2 className="w-4 h-4 text-[#f3e5ab]" />
                </div>

                {/* Category Pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[#0e121c]/85 backdrop-blur-md border border-[#d4af37]/35 text-[11px] font-semibold text-[#f3e5ab] uppercase tracking-wider shadow-sm">
                  {img.category}
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-5 left-5 right-5 space-y-1.5 z-10">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-[#f3e5ab] transition-colors">
                    {img.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94a4b8] leading-snug">
                    {img.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal with smooth backdrop blur */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 rounded-xl bg-[#141926] text-white hover:text-[#d4af37] border border-[#242e44] z-50 transition-colors"
            aria-label="Fermer la vue plein écran"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevLightbox}
            className="absolute left-6 p-3 rounded-xl bg-[#141926] text-white hover:text-[#d4af37] border border-[#242e44] z-50 transition-colors hidden sm:flex items-center justify-center"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextLightbox}
            className="absolute right-6 p-3 rounded-xl bg-[#141926] text-white hover:text-[#d4af37] border border-[#242e44] z-50 transition-colors hidden sm:flex items-center justify-center"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full mx-auto space-y-4">
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-[#0c1017] border border-[#222c42] shadow-2xl">
              <img
                src={DEFAULT_STUDIO_IMAGES[lightboxIndex].url}
                alt={DEFAULT_STUDIO_IMAGES[lightboxIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">
                {DEFAULT_STUDIO_IMAGES[lightboxIndex].category}
              </span>
              <h4 className="text-xl font-bold font-display text-white">
                {DEFAULT_STUDIO_IMAGES[lightboxIndex].title}
              </h4>
              <p className="text-sm text-[#8f9faf] max-w-xl mx-auto">
                {DEFAULT_STUDIO_IMAGES[lightboxIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
