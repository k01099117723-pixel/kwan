import React, { useState } from 'react';
import { Sparkles, Mic, Camera, Sliders, Sun, ShieldCheck, Check, ArrowRight } from 'lucide-react';

interface Hotspot {
  id: string;
  name: string;
  category: string;
  x: number; // percentage
  y: number; // percentage
  icon: any;
  tagline: string;
  description: string;
  specs: string[];
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'mic',
    name: 'Micros Shure SM7B Broadcast',
    category: 'Prise de Son Voix',
    x: 38,
    y: 52,
    icon: Mic,
    tagline: 'Le standard absolu des plus grands podcasts mondiaux',
    description: 'Capsule dynamique cardioïde optimisée pour la voix parlée. Filtre anti-pop interne et réjection des bruits mécaniques pour une clarté et une chaleur incomparables.',
    specs: ['Directivité cardioïde uniforme', 'Isolation acoustique interne pneumatique', 'Câblage Mogami Gold studio', 'Bras articulés K&M silencieux']
  },
  {
    id: 'camera',
    name: 'Caméras Sony FX3 Cinema Line 4K',
    category: 'Vidéo 4K Cinéma',
    x: 18,
    y: 35,
    icon: Camera,
    tagline: 'Rendu cinématographique 10-bit & teintes naturelles',
    description: 'Capteur plein format 4K 120fps avec le profil colorimétrique S-Cinetone de Sony. Vos visages sont magnifiés avec une profondeur de champ digne des longs-métrages.',
    specs: ['Capteur 35mm plein format', 'Optiques Sony GM f/2.8 & f/1.2', 'Double base ISO pour faible lumière', 'Enregistrement 4K All-Intra']
  },
  {
    id: 'acoustics',
    name: 'Acoustique Noble en Tasseaux de Chêne',
    category: 'Insonorisation R-60',
    x: 82,
    y: 30,
    icon: ShieldCheck,
    tagline: 'Silence absolu & absorption de réverbération',
    description: 'Revêtement mural sur-mesure combinant tasseaux de chêne naturel et laine acoustique haute densité. Aucun effet d’écho de boîte, son sec et intime.',
    specs: ['Coefficient d’absorption NRC 0.85', 'Isolation phonique R-60 certifiée', 'Design organique contemporain', 'Éclairage LED d’ambiance intégré']
  },
  {
    id: 'regie',
    name: 'Console & Régie Rødecaster Pro II',
    category: 'Régie Technique Live',
    x: 62,
    y: 65,
    icon: Sliders,
    tagline: 'Traitement audio broadcast en temps réel',
    description: 'Préamplis Revolution ultra-faible bruit (-131.5dBV). Traitement dynamique APHEX (compresseur, de-esser, noise gate) appliqué en temps réel par notre ingénieur.',
    specs: ['Enregistrement WAV 32-bit float', '4 sorties casques indépendantes', 'Traitement APHEX Aural Exciter', 'Mix-minus pour appels distants']
  },
  {
    id: 'light',
    name: 'Éclairage Cinéma Aputure & Dômes Doux',
    category: 'Lumière Studio Flatteuse',
    x: 52,
    y: 18,
    icon: Sun,
    tagline: 'Teintes de peau sublimées sans ombres dures',
    description: 'Sources LED professionnelles haute fidélité (CRI 96+) avec diffuseurs Lantern et Light Dome pour un éclairage doux qui ne fatigue pas les yeux durant vos sessions.',
    specs: ['Indice CRI 96+ & TLCI 97+', 'Diffusions douces 360°', 'Éclairage d’accentuation RGB d’ambiance', 'Contrôle à distance depuis la régie']
  }
];

export const InteractiveHotspotStudio: React.FC<{ onBookNow: () => void }> = ({ onBookNow }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot>(HOTSPOTS[0]);

  return (
    <div className="py-16 bg-[#080b12] relative overflow-hidden border-t border-[#161c2b]">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#d4af37]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141926] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Exploration Interactive du Studio</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Cliquez sur les détails qui font l'excellence de Kwan.
          </h2>
          <p className="text-xs sm:text-sm text-[#95a6bc]">
            Découvrez chaque équipement stratégique placé au millimètre pour garantir votre confort et un rendu broadcast international.
          </p>
        </div>

        {/* Interactive Studio Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Visual Stage with Hotspot Pins */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-[#0c1017] border border-[#222b3e] shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
                alt="Studio Plateau Kwan Studio"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.88] group-hover:brightness-95 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b12]/80 via-transparent to-black/30" />

              {/* Hotspot Markers */}
              {HOTSPOTS.map((spot) => {
                const isSelected = selectedHotspot.id === spot.id;
                const Icon = spot.icon;
                return (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedHotspot(spot)}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin focus:outline-none"
                    aria-label={spot.name}
                  >
                    {/* Pulsing ring */}
                    <span
                      className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                        isSelected ? 'bg-[#f3e5ab] scale-150' : 'bg-[#d4af37]'
                      }`}
                    />
                    {/* Pin button */}
                    <span
                      className={`relative flex items-center justify-center rounded-full transition-all duration-300 shadow-xl ${
                        isSelected
                          ? 'w-11 h-11 bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black scale-110 ring-4 ring-[#d4af37]/40'
                          : 'w-9 h-9 bg-[#111624]/90 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/50 hover:scale-110 hover:border-[#d4af37]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>

                    {/* Tooltip on hover */}
                    <span className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[10px] font-bold text-white whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity border border-white/10 pointer-events-none shadow-lg">
                      {spot.name}
                    </span>
                  </button>
                );
              })}

              {/* Bottom bar indicator */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <span className="text-[11px] text-[#cad6e4]">
                  Point actif : <strong className="text-[#f3e5ab]">{selectedHotspot.name}</strong>
                </span>
                <span className="text-[10px] text-[#8ea0b5]">5 points d'ingénierie</span>
              </div>
            </div>
          </div>

          {/* Details Card for Selected Hotspot */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111624] via-[#0d121c] to-[#0a0e16] border border-[#d4af37]/30 shadow-2xl relative space-y-5">
              
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182132] border border-[#d4af37]/30 text-[11px] font-bold text-[#f3e5ab] uppercase tracking-wider">
                  {selectedHotspot.category}
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#172030] border border-[#27354f] flex items-center justify-center text-[#d4af37]">
                  {React.createElement(selectedHotspot.icon, { className: 'w-5 h-5' })}
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {selectedHotspot.name}
                </h3>
                <p className="text-xs text-[#d4af37] font-medium mt-0.5">
                  {selectedHotspot.tagline}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#93a4b9] leading-relaxed">
                {selectedHotspot.description}
              </p>

              {/* Specs checklist */}
              <div className="space-y-2 pt-3 border-t border-[#1b2536]">
                <div className="text-[11px] font-bold text-[#74859a] uppercase tracking-wider">
                  Avantages Clés :
                </div>
                {selectedHotspot.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#cbd8e8]">
                    <div className="w-4 h-4 rounded-full bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={onBookNow}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <span>Réserver une session avec ce setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
