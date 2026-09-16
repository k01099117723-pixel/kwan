import React, { useState } from 'react';
import { Calculator, Sparkles, Clock, Users, Video, Mic, Film, Check, ArrowRight, Zap } from 'lucide-react';

interface CalculatorProps {
  onBookWithCustomConfig: (configSummary: string, estimatedPrice: number) => void;
}

export const SessionCostCalculator: React.FC<CalculatorProps> = ({ onBookWithCustomConfig }) => {
  const [format, setFormat] = useState<'audio' | 'video2' | 'video3'>('video2');
  const [hours, setHours] = useState(2);
  const [participants, setParticipants] = useState(2);
  const [postProd, setPostProd] = useState<'raw' | 'cut' | 'shorts' | 'full'>('cut');
  const [expressDelivery, setExpressDelivery] = useState(false);

  // Hourly rates
  const ratePerHour = format === 'audio' ? 600 : format === 'video2' ? 1200 : 1500;
  
  // Post-prod extra
  const postProdCost =
    postProd === 'raw' ? 0 : postProd === 'cut' ? 700 : postProd === 'shorts' ? 500 : 1000;

  // Express delivery extra
  const expressCost = expressDelivery ? 350 : 0;

  // Total
  const total = ratePerHour * hours + postProdCost + expressCost;

  const handleBook = () => {
    const formatName =
      format === 'audio'
        ? "L'Essentiel Audio (Micros Shure SM7B)"
        : format === 'video2'
        ? 'Le Visio Standard (2 Caméras Sony FX3 4K)'
        : "L'Élite Multi-Cam (3 Caméras Sony FX3 4K)";

    const postProdName =
      postProd === 'raw'
        ? 'Rushes bruts 4K sous 24h'
        : postProd === 'cut'
        ? 'Montage dynamique complet de l’épisode'
        : postProd === 'shorts'
        ? 'Pack 3 Shorts/Reels sous-titrés'
        : 'Montage complet + 3 Shorts/Reels optimisés';

    const summary = `Formule : ${formatName} | Durée : ${hours}h | Invités : ${participants} | Post-production : ${postProdName}${
      expressDelivery ? ' | Livraison Express 6h' : ''
    } | Estimation : ${total} MAD`;

    onBookWithCustomConfig(summary, total);
  };

  return (
    <div className="py-20 bg-[#07090e] relative border-t border-[#161c28]">
      {/* Background aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#d4af37]/6 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121622] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Simulateur Interactif de Session</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Calculez votre budget studio en temps réel.
          </h2>
          <p className="text-xs sm:text-sm text-[#93a2b7]">
            Transparence totale, aucun frais caché. Ajustez la durée, le nombre de caméras et la post-production selon vos objectifs.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form */}
          <div className="lg:col-span-7 space-y-6 p-6 sm:p-8 rounded-3xl bg-[#0c1017] border border-[#1e2638] shadow-2xl">
            
            {/* 1. Format */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                <Film className="w-4 h-4 text-[#d4af37]" />
                <span>1. Format de Tournage</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('audio')}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    format === 'audio'
                      ? 'bg-[#151d2c] border-[#d4af37] text-white shadow-md'
                      : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf] hover:text-white'
                  }`}
                >
                  <Mic className="w-4 h-4 text-[#d4af37] mb-1.5" />
                  <div className="font-bold text-xs text-white">Audio Pur</div>
                  <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">600 MAD / h</div>
                  <div className="text-[10px] text-[#718197] mt-1">Shure SM7B</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('video2')}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    format === 'video2'
                      ? 'bg-[#151d2c] border-[#d4af37] text-white shadow-md'
                      : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf] hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#d4af37] mb-1.5" />
                  <div className="font-bold text-xs text-white">Vidéo 2 Caméras</div>
                  <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">1 200 MAD / h</div>
                  <div className="text-[10px] text-[#718197] mt-1">Sony FX3 4K (Duo)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('video3')}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    format === 'video3'
                      ? 'bg-[#151d2c] border-[#d4af37] text-white shadow-md'
                      : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#d4af37] mb-1.5" />
                  <div className="font-bold text-xs text-white">Vidéo 3 Caméras</div>
                  <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">1 500 MAD / h</div>
                  <div className="text-[10px] text-[#718197] mt-1">Multi-angles Élite</div>
                </button>
              </div>
            </div>

            {/* 2. Duration Slider */}
            <div className="space-y-2.5 pt-4 border-t border-[#182132]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d4af37]" />
                  <span>2. Durée d'Enregistrement</span>
                </label>
                <span className="text-sm font-extrabold text-[#f3e5ab]">{hours} Heure{hours > 1 ? 's' : ''}</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-2 bg-[#171f2e] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
              />
              <div className="flex justify-between text-[10px] text-[#728399] px-1">
                <span>1h (Flash)</span>
                <span>2h (Standard)</span>
                <span>4h (Demi-journée)</span>
                <span>8h (Journée complète)</span>
              </div>
            </div>

            {/* 3. Participants */}
            <div className="space-y-2.5 pt-4 border-t border-[#182132]">
              <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#d4af37]" />
                <span>3. Nombre d'Intervenants au Micro</span>
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setParticipants(num)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      participants === num
                        ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-md'
                        : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf] hover:text-white'
                    }`}
                  >
                    {num} {num === 1 ? 'Solo' : num === 2 ? 'Duo' : 'Invités'}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Post-Production Options */}
            <div className="space-y-2.5 pt-4 border-t border-[#182132]">
              <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>4. Post-Production & Montage Vidéo</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPostProd('raw')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    postProd === 'raw'
                      ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                      : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Rushes Bruts (Inclus)</div>
                  <div className="text-[11px] text-[#4ade80] font-semibold mt-0.5">Gratuit (Inclus)</div>
                  <div className="text-[10px] text-[#718197]">Fichiers ISO 4K séparés</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPostProd('cut')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    postProd === 'cut'
                      ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                      : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Montage Complet Épisode</div>
                  <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">+ 700 MAD</div>
                  <div className="text-[10px] text-[#718197]">Switching dynamique & titrage</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPostProd('shorts')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    postProd === 'shorts'
                      ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                      : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Pack 3 Shorts / TikToks</div>
                  <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">+ 500 MAD</div>
                  <div className="text-[10px] text-[#718197]">Sous-titres animés viraux</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPostProd('full')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    postProd === 'full'
                      ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                      : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                  }`}
                >
                  <div className="font-bold text-xs text-white">Pack Intégral Clé en Main</div>
                  <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">+ 1 000 MAD</div>
                  <div className="text-[10px] text-[#718197]">Montage + 3 Shorts complets</div>
                </button>
              </div>
            </div>

            {/* Express Delivery Option */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#111724] border border-[#20293d] cursor-pointer hover:border-[#d4af37]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={expressDelivery}
                  onChange={(e) => setExpressDelivery(e.target.checked)}
                  className="rounded border-[#29354c] text-[#d4af37] focus:ring-0 w-4 h-4"
                />
                <div className="flex-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Option Livraison Rushes Express (Sous 6 Heures)</span>
                  </div>
                  <div className="text-[11px] text-[#8192a7]">Traitement prioritaire en régie (+ 350 MAD)</div>
                </div>
              </label>
            </div>

          </div>

          {/* Realtime Live Price Summary Card */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#151d2d] via-[#0f1422] to-[#0a0e16] border-2 border-[#d4af37] shadow-2xl shadow-[#d4af37]/15 space-y-6">
              
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider">
                  Votre Devis Personnalisé
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  Récapitulatif de la Session
                </h3>
              </div>

              {/* Breakdown lines */}
              <div className="space-y-3 py-4 border-y border-[#202a3d] text-xs text-[#9bb0c7]">
                <div className="flex justify-between">
                  <span>Tournage ({hours}h x {ratePerHour} MAD) :</span>
                  <span className="font-bold text-white">{hours * ratePerHour} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span>Configuration :</span>
                  <span className="font-medium text-[#f3e5ab]">{participants} Intervenant(s)</span>
                </div>
                {postProdCost > 0 && (
                  <div className="flex justify-between">
                    <span>Post-production :</span>
                    <span className="font-bold text-white">+{postProdCost} MAD</span>
                  </div>
                )}
                {expressDelivery && (
                  <div className="flex justify-between">
                    <span>Livraison Express 6h :</span>
                    <span className="font-bold text-white">+{expressCost} MAD</span>
                  </div>
                )}
              </div>

              {/* Big Price Display */}
              <div className="space-y-1">
                <div className="text-[11px] text-[#8c9bb0] uppercase font-semibold">Total Estimé TTC</div>
                <div className="text-4xl sm:text-5xl font-black font-display text-white flex items-baseline gap-2">
                  <span className="gold-gradient-text">{total.toLocaleString('fr-FR')}</span>
                  <span className="text-lg font-bold text-[#d4af37]">MAD</span>
                </div>
                <div className="text-[11px] text-[#6d7f95]">
                  Café de spécialité & régisseur son inclus durant toute la session
                </div>
              </div>

              {/* CTA with animated gold flow & shine sweep */}
              <button
                onClick={handleBook}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] animate-gold-flow text-[#07080c] font-black text-sm shadow-xl shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
                <span className="relative z-10">Réserver cette configuration</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <div className="text-[11px] text-[#718296] text-center">
                Paiement sur place le jour de l'enregistrement (Espèces, Virement ou Carte).
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
