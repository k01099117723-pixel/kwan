import React from 'react';
import { ArrowRight, Sparkles, Video, Mic, Clock, Shield, Play } from 'lucide-react';
import { AudioVisualizerWave } from './AudioVisualizerWave.js';

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  onOpenBooking: () => void;
  onExplorePacks: () => void;
  heroImageUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title = 'Votre espace premium pour créer des podcasts qui marquent.',
  subtitle = "Studio de tournage et d'enregistrement haute fidélité au cœur de Casablanca. Caméras 4K Cinéma, micros broadcast et réalisation sur-mesure pour créateurs d'exception.",
  primaryCtaText = 'Réserver mon studio',
  secondaryCtaText = 'Découvrir nos packs',
  onOpenBooking,
  onExplorePacks,
  heroImageUrl = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop'
}) => {
  return (
    <section id="top" className="relative min-h-[96vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Ambient Lighting & High-End Studio Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-[#d4af37]/15 via-[#f3e5ab]/8 to-transparent rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-2/3 right-10 w-[420px] h-[420px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[380px] h-[380px] bg-blue-900/15 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Subtle Moroccan Architectural Line Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #d4af37 1.5px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7">
            
            {/* Moroccan Identity & Broadcast Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111624] border border-[#d4af37]/35 shadow-lg shadow-[#d4af37]/10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#f3e5ab]">
                Casablanca, Maroc · Plateau Broadcast Prêt à Tourner
              </span>
            </div>

            {/* Brand Title */}
            <div className="space-y-3">
              <h2 className="text-xs sm:text-sm font-black tracking-[0.4em] text-[#d4af37] uppercase font-sans">
                KWAN STUDIO CASABLANCA
              </h2>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.12]">
                Votre espace <span className="gold-gradient-text">cinématographique</span> pour créer des podcasts d'autorité.
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-[#9ab0c8] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-[#07080c] font-black text-sm sm:text-base shadow-xl shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>

              <button
                onClick={onExplorePacks}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#111522] hover:bg-[#181f30] text-white font-bold text-sm sm:text-base border border-[#232c42] hover:border-[#d4af37]/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>{secondaryCtaText}</span>
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#192233]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#131926] border border-[#212b3e] flex items-center justify-center text-[#d4af37] shadow-sm">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">4K UHD Sony</div>
                  <div className="text-[10px] text-[#7d8ea3]">FX3 Cinema Line</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#131926] border border-[#212b3e] flex items-center justify-center text-[#d4af37] shadow-sm">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Shure SM7B</div>
                  <div className="text-[10px] text-[#7d8ea3]">Micros Broadcast</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#131926] border border-[#212b3e] flex items-center justify-center text-[#d4af37] shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">24 Heures</div>
                  <div className="text-[10px] text-[#7d8ea3]">Livraison Rushes</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#131926] border border-[#212b3e] flex items-center justify-center text-[#d4af37] shadow-sm">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">R-60 Iso</div>
                  <div className="text-[10px] text-[#7d8ea3]">Acoustique Noble</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D-inspired Cinematic Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Decorative Frame with Subtle Gold Border */}
              <div className="relative rounded-3xl overflow-hidden p-2 bg-gradient-to-b from-[#d4af37]/50 via-[#1e2638] to-[#0c0f17] shadow-2xl shadow-black">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#0c0f16]">
                  <img
                    src={heroImageUrl}
                    alt="Kwan Studio - Plateau de tournage podcast haut de gamme à Casablanca"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-black/25" />

                  {/* On-Air Live Indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-red-500/50">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[11px] font-black text-white tracking-widest uppercase">ON AIR · DIRECT</span>
                  </div>

                  {/* Audio Waveform Micro-Visualizer on Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3.5 rounded-2xl bg-[#0b0f17]/90 backdrop-blur-md border border-[#222d42]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/35 flex items-center justify-center text-[#f3e5ab]">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Plateau A · Setup Duo & Multi-guests</div>
                        <div className="text-[10px] text-[#8697ae]">Acoustique feutrée & Éclairage doux 3 points</div>
                      </div>
                    </div>
                    {/* Simulated visualizer bars */}
                    <div className="flex items-end gap-1 h-5">
                      <span className="w-1 bg-[#d4af37] h-2.5 rounded-full animate-bounce" />
                      <span className="w-1 bg-[#d4af37] h-5 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1 bg-[#d4af37] h-3.5 rounded-full animate-bounce [animation-delay:0.3s]" />
                      <span className="w-1 bg-[#d4af37] h-4.5 rounded-full animate-bounce [animation-delay:0.45s]" />
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Quality Stamp */}
              <div className="hidden sm:flex absolute -top-4 -right-4 items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141926]/95 backdrop-blur-md border border-[#27324a] shadow-xl">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-bold text-white">Standard International</span>
              </div>

            </div>
          </div>

        </div>

        {/* Live Audio Acoustic Waveform Visualizer Banner */}
        <div className="pt-4">
          <AudioVisualizerWave />
        </div>

      </div>
    </section>
  );
};
