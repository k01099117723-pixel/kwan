import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Check, X, ArrowRight, Radio } from 'lucide-react';

export const AudioComparisonSlider: React.FC<{ onBookNow: () => void }> = ({ onBookNow }) => {
  const [activeMode, setActiveMode] = useState<'kwan' | 'home'>('kwan');

  return (
    <div className="py-20 bg-[#06080d] relative overflow-hidden border-t border-[#161c28]">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#d4af37]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121622] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Comparatif Audio & Acoustique</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white tracking-tight">
            La différence acoustique qui fait passer votre podcast de l'amateurisme à l'excellence.
          </h2>
          <p className="text-xs sm:text-sm text-[#91a2b7]">
            73% des auditeurs quittent un podcast dès les 30 premières secondes si le son présente de la réverbération ou un écho désagréable.
          </p>
        </div>

        {/* Comparison Toggle Controls */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 rounded-2xl bg-[#0e131d] border border-[#1e2638] inline-flex items-center gap-2">
            <button
              onClick={() => setActiveMode('home')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeMode === 'home'
                  ? 'bg-[#251b1e] text-red-300 border border-red-500/40 shadow-md'
                  : 'text-[#8495aa] hover:text-white'
              }`}
            >
              <X className="w-4 h-4 text-red-400" />
              <span>1. Enregistrement Domicile / Bureau</span>
            </button>

            <button
              onClick={() => setActiveMode('kwan')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeMode === 'kwan'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-black shadow-lg shadow-[#d4af37]/25 font-black'
                  : 'text-[#8495aa] hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>2. Acoustique Traitée Kwan Studio</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Home recording card */}
          <div
            onClick={() => setActiveMode('home')}
            className={`cursor-pointer p-8 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between ${
              activeMode === 'home'
                ? 'bg-[#121118] border-red-500/50 shadow-2xl scale-[1.01]'
                : 'bg-[#0b0e14] border-[#18202e] opacity-65 hover:opacity-90'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-[11px] font-bold text-red-300 uppercase tracking-wider">
                  Configuration Amateure
                </span>
                <span className="text-xs text-[#7d8d9f]">Enregistrement classique</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white">
                Chambre ou Bureau Non-Insonorisé
              </h3>

              <p className="text-xs text-[#909fb3] leading-relaxed">
                Les murs lisses créent des ondes stationnaires et un écho en boîte. Les bruits extérieurs (klaxons à Casablanca, climatiseur, ascenseur) s'infiltrent dans votre micro.
              </p>

              {/* Simulated noisy waveform */}
              <div className="p-4 rounded-2xl bg-[#090a0f] border border-red-500/20 space-y-2">
                <div className="text-[10px] uppercase font-bold text-red-400">Signal Audio Perturbé (Bruit de fond & écho)</div>
                <div className="h-12 flex items-center justify-center gap-1">
                  {[12, 34, 18, 50, 42, 10, 60, 38, 20, 65, 45, 15, 52, 70, 25, 40, 60, 18, 48, 22].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1.5 bg-red-500/60 rounded-full"
                    />
                  ))}
                </div>
              </div>

              <ul className="space-y-2 text-xs text-[#8e9faf]">
                <li className="flex items-center gap-2 text-red-300">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Réverbération désagréable sur les consonnes dures</span>
                </li>
                <li className="flex items-center gap-2 text-red-300">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Perte de crédibilité auprès des invités prestigieux</span>
                </li>
                <li className="flex items-center gap-2 text-red-300">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Heures perdues en post-production à tenter de nettoyer le bruit</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Kwan Studio Card */}
          <div
            onClick={() => setActiveMode('kwan')}
            className={`cursor-pointer p-8 rounded-3xl border transition-all duration-300 relative flex flex-col justify-between ${
              activeMode === 'kwan'
                ? 'bg-gradient-to-b from-[#151c2a] to-[#0c1017] border-2 border-[#d4af37] shadow-2xl shadow-[#d4af37]/20 scale-[1.01]'
                : 'bg-[#0b0e14] border-[#18202e] opacity-65 hover:opacity-90'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[11px] font-bold text-[#f3e5ab] uppercase tracking-wider">
                  Standard Broadcast
                </span>
                <span className="text-xs text-[#d4af37] font-semibold">Qualité Studio R-60</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white">
                Kwan Studio · Insonorisation Certifiée R-60
              </h3>

              <p className="text-xs text-[#a2b5cc] leading-relaxed">
                Isolation phonique intégrale avec sol flottant, double vitrage acoustique et panneaux de tasseaux en chêne. Votre voix est ronde, soyeuse et captée par les micros de référence mondiale.
              </p>

              {/* Simulated studio broadcast waveform */}
              <div className="p-4 rounded-2xl bg-[#080b11] border border-[#d4af37]/30 space-y-2">
                <div className="text-[10px] uppercase font-bold text-[#f3e5ab] flex items-center justify-between">
                  <span>Signal Pur 24-bit 96kHz (Dynamique Broadcast)</span>
                  <span className="text-[#4ade80]">Silence parfait (-65dB)</span>
                </div>
                <div className="h-12 flex items-center justify-center gap-1">
                  {[20, 45, 68, 85, 95, 75, 55, 30, 65, 90, 100, 80, 50, 70, 88, 60, 40, 25, 15, 10].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1.5 bg-gradient-to-t from-[#d4af37] to-[#f3e5ab] rounded-full animate-pulse"
                    />
                  ))}
                </div>
              </div>

              <ul className="space-y-2 text-xs text-[#cbd9ea]">
                <li className="flex items-center gap-2 text-[#f3e5ab]">
                  <Check className="w-4 h-4 shrink-0 text-[#d4af37]" />
                  <span>Isolation totale contre tous les bruits de circulation de Casablanca</span>
                </li>
                <li className="flex items-center gap-2 text-[#f3e5ab]">
                  <Check className="w-4 h-4 shrink-0 text-[#d4af37]" />
                  <span>Effet de proximité chaleureux avec préamplification broadcast</span>
                </li>
                <li className="flex items-center gap-2 text-[#f3e5ab]">
                  <Check className="w-4 h-4 shrink-0 text-[#d4af37]" />
                  <span>Pistes séparées prêtes pour la diffusion immédiate sur Spotify & Apple</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={onBookNow}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] font-black text-xs shadow-lg shadow-[#d4af37]/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <span>Faire l'expérience du son Kwan Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
