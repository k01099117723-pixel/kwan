import React from 'react';
import { Check, Camera, Mic, Film, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { Package } from '../types.js';

interface PackagesSectionProps {
  packages: Package[];
  onSelectPackage: (pkg: Package) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ packages, onSelectPackage }) => {
  return (
    <section id="packs" className="py-24 bg-[#07090e] relative border-t border-[#151a26]">
      {/* Background glow behind popular pack */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[#d4af37]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121622] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Nos 3 Formules Clé en Main</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            Choisissez le pack adapté à votre ambition.
          </h2>
          <p className="text-[#9bb0c7] text-base sm:text-lg leading-relaxed font-light">
            De l'enregistrement audio pur au tournage vidéo 4K multi-caméras avec montage complet, chaque formule inclut notre ingénierie de pointe.
          </p>
        </div>

        {/* 3 Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isPopular = pkg.is_popular;
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#151c2a] via-[#0f1420] to-[#0a0d14] border-2 border-[#d4af37] shadow-2xl shadow-[#d4af37]/15 lg:-translate-y-2'
                    : 'bg-[#0c1017] border border-[#1e2536] hover:border-[#d4af37]/40 shadow-xl shadow-black/50'
                }`}
              >
                {/* Popular / Formula Badge */}
                {pkg.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md ${
                        isPopular
                          ? 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c]'
                          : 'bg-[#182030] text-[#d4af37] border border-[#d4af37]/30'
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Image header of package */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] mb-6 bg-[#121622] border border-[#1d2538]">
                    <img
                      src={pkg.image_url}
                      alt={pkg.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090c13] via-transparent to-black/30" />
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#d4af37]" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  {/* Header Title & Pricing */}
                  <div className="space-y-2 mb-6">
                    <h3 className="text-2xl font-bold font-display text-white">
                      {pkg.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8c9bb0] leading-relaxed min-h-[40px]">
                      {pkg.description}
                    </p>
                    <div className="pt-2">
                      <div className="text-2xl sm:text-3xl font-extrabold font-display text-white flex items-baseline gap-1">
                        <span className="text-[#f3e5ab]">{pkg.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specifications Matrix */}
                  <div className="space-y-3 py-4 border-y border-[#1a2233] text-xs text-[#b0bdcf]">
                    {/* Cameras */}
                    <div className="flex items-start gap-2.5">
                      <Camera className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Caméras : </span>
                        <span>{pkg.cameras_count > 0 ? `${pkg.cameras_count} Caméra(s) 4K Cinéma` : 'Audio pur (Sans vidéo)'}</span>
                      </div>
                    </div>

                    {/* Audio */}
                    <div className="flex items-start gap-2.5">
                      <Mic className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Prise de son : </span>
                        <span>{pkg.audio_services}</span>
                      </div>
                    </div>

                    {/* Video & Lighting */}
                    {pkg.cameras_count > 0 && (
                      <div className="flex items-start gap-2.5">
                        <Film className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-white">Tournage & Éclairage : </span>
                          <span>{pkg.video_services}</span>
                        </div>
                      </div>
                    )}

                    {/* Editing & Post-prod */}
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Post-production : </span>
                        <span>{pkg.editing_services}</span>
                      </div>
                    </div>
                  </div>

                  {/* Included features list */}
                  <div className="pt-5 space-y-2.5 mb-8">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#79889d]">
                      Inclus dans cette formule :
                    </div>
                    {pkg.additional_features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-[#cad5e4]">
                        <div className="w-4 h-4 rounded-full bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={() => onSelectPackage(pkg)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-[#07080c] shadow-lg shadow-[#d4af37]/25 hover:shadow-[#d4af37]/45 hover:scale-[1.01]'
                      : 'bg-[#141926] hover:bg-[#1d2436] text-white border border-[#252f44] hover:border-[#d4af37]/50'
                  }`}
                >
                  <span>Choisir ce pack</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            );
          })}
        </div>

        {/* Custom Needs Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#111624] via-[#0d111a] to-[#111624] border border-[#1f2738] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">Vous avez un projet sur-mesure ou une saison complète ?</h4>
            <p className="text-xs sm:text-sm text-[#8a98ab]">
              Tarification dégressive pour les séries de 5+ épisodes, résidences de marque et captations délocalisées.
            </p>
          </div>
          <button
            onClick={() => onSelectPackage(packages[1] || packages[0])}
            className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-[#1a2130] hover:bg-[#222c42] text-[#f3e5ab] text-xs font-bold border border-[#d4af37]/30 transition-colors"
          >
            Demander un devis sur-mesure
          </button>
        </div>

      </div>
    </section>
  );
};
