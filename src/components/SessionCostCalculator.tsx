import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  Clock,
  Users,
  Video,
  Mic,
  Film,
  Check,
  ArrowRight,
  Zap,
  Camera,
  Layers
} from 'lucide-react';

interface CalculatorProps {
  onBookWithCustomConfig: (
    configSummary: string,
    estimatedPrice: number,
    packageId?: string,
    tierName?: string
  ) => void;
}

type PackFormat =
  | 'pack-podcast-brut'
  | 'pack-podcast-montage'
  | 'pack-shooting-photo'
  | 'pack-shooting-produit'
  | 'pack-creation-contenu';

interface PackFormatOption {
  id: PackFormat;
  name: string;
  badge: string;
  priceLabel: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PACK_FORMATS: PackFormatOption[] = [
  {
    id: 'pack-podcast-brut',
    name: 'Podcast Tournage Brut',
    badge: 'Captation Brute',
    priceLabel: '600 DH / 1H',
    tagline: '2 Caméras Sony FX3 • 2 Micros • Rushes 4K',
    icon: Mic
  },
  {
    id: 'pack-podcast-montage',
    name: 'Podcast + Montage',
    badge: 'Populaire',
    priceLabel: '1 000 DH / 1H',
    tagline: '2 Caméras Sony • Montage complet + Teaser inclus',
    icon: Film
  },
  {
    id: 'pack-shooting-photo',
    name: 'Shooting Photo',
    badge: 'Photo HD',
    priceLabel: '300 DH',
    tagline: '12 Photos retouchées PNG • Éclairage pro studio',
    icon: Camera
  },
  {
    id: 'pack-shooting-produit',
    name: 'Shooting Produit & UGC',
    badge: 'E-commerce & Ads',
    priceLabel: '450 - 500 DH',
    tagline: 'Packshot studio & Vidéo courte UGC avec montage',
    icon: Video
  },
  {
    id: 'pack-creation-contenu',
    name: 'Création de Contenu',
    badge: 'Reels Mensuels',
    priceLabel: 'Dès 3 500 DH',
    tagline: 'Starter (4 Reels), Standard (8) ou Premium (12)',
    icon: Sparkles
  }
];

export const SessionCostCalculator: React.FC<CalculatorProps> = ({ onBookWithCustomConfig }) => {
  const [selectedFormat, setSelectedFormat] = useState<PackFormat>('pack-podcast-montage');

  // Podcast state
  const [podcastHours, setPodcastHours] = useState(1);
  const [podcastParticipants, setPodcastParticipants] = useState(2);
  const [podcastPostProd, setPodcastPostProd] = useState<'included' | 'shorts3' | 'shorts6'>('included');
  const [brutPostProd, setBrutPostProd] = useState<'raw' | 'cut' | 'shorts' | 'full'>('raw');
  const [liveSupplement, setLiveSupplement] = useState(false);

  // Photo state
  const [photoOption, setPhotoOption] = useState<'standard' | 'pack18' | 'pack24'>('standard');
  const [photoExpress, setPhotoExpress] = useState(false);

  // Produit state
  const [produitOption, setProduitOption] = useState<'single' | 'double' | 'triple'>('single');
  const [produitExpress, setProduitExpress] = useState(false);

  // Creation contenu state
  const [creationTier, setCreationTier] = useState<'Starter' | 'Standard' | 'Premium'>('Starter');

  // Pricing calculation
  let total = 0;
  let summaryText = '';
  let activePackageId = selectedFormat;
  let activeTier: string | undefined = undefined;

  if (selectedFormat === 'pack-podcast-brut') {
    const hourlyRate = 600;
    const postCost =
      brutPostProd === 'raw' ? 0 : brutPostProd === 'cut' ? 400 : brutPostProd === 'shorts' ? 300 : 600;
    const liveCost = liveSupplement ? 200 : 0;
    total = hourlyRate * podcastHours + postCost + liveCost;

    const postName =
      brutPostProd === 'raw'
        ? 'Rushes bruts 4K (Sans montage)'
        : brutPostProd === 'cut'
        ? 'Montage complet de l’épisode (+400 DH)'
        : brutPostProd === 'shorts'
        ? 'Pack 3 Shorts/Reels sous-titrés (+300 DH)'
        : 'Montage complet + 3 Shorts (+600 DH)';

    summaryText = `Pack : Podcast Tournage Brut (600 DH/h) | Durée : ${podcastHours}h | Intervenants : ${podcastParticipants} | Post-production : ${postName}${
      liveSupplement ? ' | Option Montage Live sous 2h (+200 DH)' : ''
    }`;
  } else if (selectedFormat === 'pack-podcast-montage') {
    const hourlyRate = 1000;
    const postCost =
      podcastPostProd === 'included' ? 0 : podcastPostProd === 'shorts3' ? 300 : 500;
    const liveCost = liveSupplement ? 200 : 0;
    total = hourlyRate * podcastHours + postCost + liveCost;

    const postName =
      podcastPostProd === 'included'
        ? 'Montage complet + Teaser inclus (0 DH)'
        : podcastPostProd === 'shorts3'
        ? '+3 Shorts/Reels additionnels (+300 DH)'
        : '+6 Shorts/Reels additionnels (+500 DH)';

    summaryText = `Pack : Podcast + Montage (1 000 DH/h) | Durée : ${podcastHours}h | Intervenants : ${podcastParticipants} | Post-production : ${postName}${
      liveSupplement ? ' | Option Montage Live sous 2h (+200 DH)' : ''
    }`;
  } else if (selectedFormat === 'pack-shooting-photo') {
    const basePhoto = 300;
    const extraPhoto = photoOption === 'standard' ? 0 : photoOption === 'pack18' ? 150 : 250;
    const expressCost = photoExpress ? 100 : 0;
    total = basePhoto + extraPhoto + expressCost;

    const optName =
      photoOption === 'standard'
        ? '12 Photos retouchées HD PNG'
        : photoOption === 'pack18'
        ? '18 Photos retouchées HD (+150 DH)'
        : '24 Photos retouchées HD (+250 DH)';

    summaryText = `Pack : Shooting Photo (300 DH) | Formule : ${optName}${
      photoExpress ? ' | Livraison Express 24h (+100 DH)' : ''
    }`;
  } else if (selectedFormat === 'pack-shooting-produit') {
    const baseProduit = 450;
    const extraProduit = produitOption === 'single' ? 0 : produitOption === 'double' ? 350 : 600;
    const expressCost = produitExpress ? 150 : 0;
    total = baseProduit + extraProduit + expressCost;

    const optName =
      produitOption === 'single'
        ? '1 Produit Packshot ou 1 Vidéo UGC avec montage'
        : produitOption === 'double'
        ? '2 Produits / 2 Vidéos UGC (+350 DH)'
        : '3 Produits / 3 Vidéos UGC (+600 DH)';

    summaryText = `Pack : Shooting Produit & UGC (450 DH) | Formule : ${optName}${
      produitExpress ? ' | Livraison Express 24h (+150 DH)' : ''
    }`;
  } else if (selectedFormat === 'pack-creation-contenu') {
    activeTier = creationTier;
    if (creationTier === 'Starter') {
      total = 3500;
      summaryText = `Pack : Création de Contenu - Starter (3 500 DH) | 4 Reels/mois + idées + scripts + 1 tournage + montage`;
    } else if (creationTier === 'Standard') {
      total = 6000;
      summaryText = `Pack : Création de Contenu - Standard (6 000 DH) | 8 Reels/mois + idées + scripts + 1/2 journées de tournage + montage`;
    } else {
      total = 9000;
      summaryText = `Pack : Création de Contenu - Premium (9 000 DH) | 12 Reels/mois + stratégie + scripts + tournage régulier + montage avancé`;
    }
  }

  const handleBook = () => {
    onBookWithCustomConfig(summaryText, total, activePackageId, activeTier);
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
            Calculez votre budget studio selon les formules officielles.
          </h2>
          <p className="text-xs sm:text-sm text-[#93a2b7]">
            Tarifs transparents 100% alignés sur les packs Kwan Studio. Ajustez les options, la durée et les services inclus en temps réel.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-7 space-y-6 p-6 sm:p-8 rounded-3xl bg-[#0c1017] border border-[#1e2638] shadow-2xl">
            {/* 1. Format de Tournage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#d4af37]" />
                  <span>1. Format de Tournage</span>
                </label>
                <span className="text-[10px] font-semibold text-[#f3e5ab] bg-[#d4af37]/10 px-2 py-0.5 rounded-full border border-[#d4af37]/25">
                  Conforme aux Packs Kwan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {PACK_FORMATS.map((item) => {
                  const active = selectedFormat === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedFormat(item.id)}
                      className={`p-3 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                        active
                          ? 'bg-gradient-to-b from-[#182236] to-[#101726] border-[#d4af37] text-white shadow-lg shadow-[#d4af37]/15 ring-1 ring-[#d4af37]'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf] hover:text-white hover:border-[#2f3d57]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <Icon className={`w-4 h-4 ${active ? 'text-[#d4af37]' : 'text-[#8ca0b8]'}`} />
                        <span className="text-[9px] font-bold text-[#d4af37] bg-[#d4af37]/10 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-xs text-white leading-tight">{item.name}</div>
                        <div className="text-[11px] text-[#f3e5ab] font-bold mt-1">{item.priceLabel}</div>
                        <p className="text-[10px] text-[#718197] line-clamp-2 mt-1 leading-snug">
                          {item.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Controls based on chosen format */}

            {/* A. If PODCAST TOURNAGE BRUT */}
            {selectedFormat === 'pack-podcast-brut' && (
              <div className="space-y-5 pt-4 border-t border-[#182132] animate-in fade-in duration-300">
                {/* Duration */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#d4af37]" />
                      <span>2. Durée du Tournage Brut</span>
                    </label>
                    <span className="text-sm font-extrabold text-[#f3e5ab]">
                      {podcastHours} Heure{podcastHours > 1 ? 's' : ''} ({podcastHours * 600} DH)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    value={podcastHours}
                    onChange={(e) => setPodcastHours(Number(e.target.value))}
                    className="w-full h-2 bg-[#171f2e] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                  />
                  <div className="flex justify-between text-[10px] text-[#728399] px-1">
                    <span>1h (600 DH)</span>
                    <span>2h (1 200 DH)</span>
                    <span>3h (1 800 DH)</span>
                    <span>4h (2 400 DH)</span>
                    <span>6h (3 600 DH)</span>
                  </div>
                </div>

                {/* Participants */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#d4af37]" />
                    <span>3. Intervenants au Micro (Shure SM7B)</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPodcastParticipants(num)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          podcastParticipants === num
                            ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-md'
                            : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf] hover:text-white'
                        }`}
                      >
                        {num} {num === 1 ? 'Solo' : num === 2 ? 'Duo' : 'Invités'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Post-Production options for Brut */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span>4. Option de Montage & Rushes</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setBrutPostProd('raw')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        brutPostProd === 'raw'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">Rushes Bruts 4K (Inclus)</div>
                      <div className="text-[11px] text-[#4ade80] font-semibold mt-0.5">Inclus (0 DH)</div>
                      <div className="text-[10px] text-[#718197]">Remise des fichiers sous 3 jours</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBrutPostProd('cut')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        brutPostProd === 'cut'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">Montage Complet Épisode</div>
                      <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">+ 400 DH</div>
                      <div className="text-[10px] text-[#718197]">Switching caméras & colorimétrie</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBrutPostProd('shorts')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        brutPostProd === 'shorts'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">Pack 3 Shorts / Reels</div>
                      <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">+ 300 DH</div>
                      <div className="text-[10px] text-[#718197]">Sous-titres dynamiques viraux</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBrutPostProd('full')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        brutPostProd === 'full'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">Montage Épisode + 3 Shorts</div>
                      <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">+ 600 DH</div>
                      <div className="text-[10px] text-[#718197]">Formule vidéo intégrale</div>
                    </button>
                  </div>
                </div>

                {/* Supplement officiel Kwan flyer (+200 DH) */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#111726] to-[#0c1017] border border-[#d4af37]/35 cursor-pointer hover:border-[#d4af37] transition-all">
                    <input
                      type="checkbox"
                      checked={liveSupplement}
                      onChange={(e) => setLiveSupplement(e.target.checked)}
                      className="rounded border-[#29354c] text-[#d4af37] focus:ring-0 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#f3e5ab] flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Supplément Officiel : Montage Live + Livraison sous 2h (+200 DH)</span>
                      </div>
                      <div className="text-[11px] text-[#8192a7]">
                        Réalisé en direct en régie par notre technicien vidéo.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* B. If PODCAST + MONTAGE */}
            {selectedFormat === 'pack-podcast-montage' && (
              <div className="space-y-5 pt-4 border-t border-[#182132] animate-in fade-in duration-300">
                {/* Duration */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#d4af37]" />
                      <span>2. Durée (Tournage + Montage complet inclus)</span>
                    </label>
                    <span className="text-sm font-extrabold text-[#f3e5ab]">
                      {podcastHours} Heure{podcastHours > 1 ? 's' : ''} ({podcastHours * 1000} DH)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    value={podcastHours}
                    onChange={(e) => setPodcastHours(Number(e.target.value))}
                    className="w-full h-2 bg-[#171f2e] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                  />
                  <div className="flex justify-between text-[10px] text-[#728399] px-1">
                    <span>1h (1 000 DH)</span>
                    <span>2h (2 000 DH)</span>
                    <span>3h (3 000 DH)</span>
                    <span>4h (4 000 DH)</span>
                    <span>6h (6 000 DH)</span>
                  </div>
                </div>

                {/* Participants */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#d4af37]" />
                    <span>3. Intervenants au Micro (Shure SM7B)</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPodcastParticipants(num)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          podcastParticipants === num
                            ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-md'
                            : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf] hover:text-white'
                        }`}
                      >
                        {num} {num === 1 ? 'Solo' : num === 2 ? 'Duo' : 'Invités'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Post-Production for Podcast + Montage */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span>4. Montage & Shorts Viraux</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPodcastPostProd('included')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        podcastPostProd === 'included'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">Montage Épisode + Teaser</div>
                      <div className="text-[11px] text-[#4ade80] font-semibold mt-0.5">Inclus dans le pack</div>
                      <div className="text-[10px] text-[#718197]">Teaser début + Titrage complet</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPodcastPostProd('shorts3')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        podcastPostProd === 'shorts3'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">+ 3 Shorts / TikToks</div>
                      <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">+ 300 DH</div>
                      <div className="text-[10px] text-[#718197]">Extraits optimisés réseaux</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPodcastPostProd('shorts6')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        podcastPostProd === 'shorts6'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white shadow-sm'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">+ 6 Shorts / TikToks</div>
                      <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">+ 500 DH</div>
                      <div className="text-[10px] text-[#718197]">Stratégie de diffusion continue</div>
                    </button>
                  </div>
                </div>

                {/* Supplement officiel Kwan flyer (+200 DH) */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#111726] to-[#0c1017] border border-[#d4af37]/35 cursor-pointer hover:border-[#d4af37] transition-all">
                    <input
                      type="checkbox"
                      checked={liveSupplement}
                      onChange={(e) => setLiveSupplement(e.target.checked)}
                      className="rounded border-[#29354c] text-[#d4af37] focus:ring-0 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#f3e5ab] flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Supplément Officiel : Montage Live + Livraison sous 2h (+200 DH)</span>
                      </div>
                      <div className="text-[11px] text-[#8192a7]">
                        Repartez avec votre épisode monté dès la fin de votre enregistrement.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* C. If SHOOTING PHOTO */}
            {selectedFormat === 'pack-shooting-photo' && (
              <div className="space-y-5 pt-4 border-t border-[#182132] animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#d4af37]" />
                    <span>2. Nombre de Photos Retouchées (Haute Qualité PNG)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPhotoOption('standard')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        photoOption === 'standard'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">12 Photos (Pack Standard)</div>
                      <div className="text-[11px] text-[#4ade80] font-semibold mt-0.5">300 DH Inclus</div>
                      <div className="text-[10px] text-[#718197]">Studio équipé & retouche HD</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoOption('pack18')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        photoOption === 'pack18'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">18 Photos Retouchées</div>
                      <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">450 DH (+150 DH)</div>
                      <div className="text-[10px] text-[#718197]">Sélection élargie & angles variés</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoOption('pack24')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        photoOption === 'pack24'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">24 Photos Retouchées</div>
                      <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">550 DH (+250 DH)</div>
                      <div className="text-[10px] text-[#718197]">Book complet artiste / corporate</div>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#111724] border border-[#20293d] cursor-pointer hover:border-[#d4af37]/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={photoExpress}
                      onChange={(e) => setPhotoExpress(e.target.checked)}
                      className="rounded border-[#29354c] text-[#d4af37] focus:ring-0 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Option Retouche & Livraison Express sous 24h (+100 DH)</span>
                      </div>
                      <div className="text-[11px] text-[#8192a7]">Traitement prioritaire en laboratoire photo.</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* D. If SHOOTING PRODUIT & UGC */}
            {selectedFormat === 'pack-shooting-produit' && (
              <div className="space-y-5 pt-4 border-t border-[#182132] animate-in fade-in duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#d4af37]" />
                    <span>2. Formule Produit & Vidéo UGC</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setProduitOption('single')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        produitOption === 'single'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">1 Produit / Vidéo UGC</div>
                      <div className="text-[11px] text-[#4ade80] font-semibold mt-0.5">450 DH Inclus</div>
                      <div className="text-[10px] text-[#718197]">Prise de vue + Montage court</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProduitOption('double')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        produitOption === 'double'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">2 Produits / 2 Vidéos UGC</div>
                      <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">800 DH (+350 DH)</div>
                      <div className="text-[10px] text-[#718197]">Mise en scène lifestyle salon/bureau</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProduitOption('triple')}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        produitOption === 'triple'
                          ? 'bg-[#151e2e] border-[#d4af37] text-white'
                          : 'bg-[#10141e] border-[#1d2538] text-[#8e9faf]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">3 Produits / 3 Vidéos UGC</div>
                      <div className="text-[11px] text-[#f3e5ab] font-semibold mt-0.5">1 050 DH (+600 DH)</div>
                      <div className="text-[10px] text-[#718197]">Idéal pour campagne TikTok Ads</div>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#111724] border border-[#20293d] cursor-pointer hover:border-[#d4af37]/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={produitExpress}
                      onChange={(e) => setProduitExpress(e.target.checked)}
                      className="rounded border-[#29354c] text-[#d4af37] focus:ring-0 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Livraison Vidéo Express sous 24h (+150 DH)</span>
                      </div>
                      <div className="text-[11px] text-[#8192a7]">Montage rapide prêt à diffuser.</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* E. If CREATION DE CONTENU (REELS) */}
            {selectedFormat === 'pack-creation-contenu' && (
              <div className="space-y-4 pt-4 border-t border-[#182132] animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#b4c3d6] uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span>2. Niveau d'Abonnement Mensuel (Reels)</span>
                  </label>
                  <span className="text-[10px] text-[#d4af37] font-semibold bg-[#d4af37]/10 px-2 py-0.5 rounded">
                    Clé en main
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCreationTier('Starter')}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      creationTier === 'Starter'
                        ? 'bg-gradient-to-b from-[#182338] to-[#101725] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                        : 'bg-[#0d121c] border-[#1d2639] text-[#8e9faf]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-sm text-white">Starter</span>
                        <span className="text-[10px] font-bold text-[#d4af37]">4 Reels/mois</span>
                      </div>
                      <p className="text-[11px] text-[#9bb0c7] leading-relaxed">
                        4 Reels/mois + idées + scripts + 1 tournage + montage
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 text-xs font-bold text-[#f3e5ab]">
                      3 500 DH / mois
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreationTier('Standard')}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      creationTier === 'Standard'
                        ? 'bg-gradient-to-b from-[#182338] to-[#101725] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                        : 'bg-[#0d121c] border-[#1d2639] text-[#8e9faf]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-sm text-white">Standard</span>
                        <span className="text-[10px] font-bold text-[#d4af37]">8 Reels/mois</span>
                      </div>
                      <p className="text-[11px] text-[#9bb0c7] leading-relaxed">
                        8 Reels/mois + idées + scripts + 1/2 journées tournage + montage
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 text-xs font-bold text-[#f3e5ab]">
                      6 000 DH / mois
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreationTier('Premium')}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      creationTier === 'Premium'
                        ? 'bg-gradient-to-b from-[#182338] to-[#101725] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                        : 'bg-[#0d121c] border-[#1d2639] text-[#8e9faf]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-sm text-white">Premium</span>
                        <span className="text-[10px] font-bold text-[#d4af37]">12 Reels/mois</span>
                      </div>
                      <p className="text-[11px] text-[#9bb0c7] leading-relaxed">
                        12 Reels/mois + stratégie + scripts + tournage régulier + montage avancé
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 text-xs font-bold text-[#f3e5ab]">
                      9 000 DH / mois
                    </div>
                  </button>
                </div>
              </div>
            )}
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
                <div className="flex justify-between items-start gap-2">
                  <span>Pack sélectionné :</span>
                  <span className="font-bold text-white text-right">
                    {PACK_FORMATS.find((p) => p.id === selectedFormat)?.name}
                  </span>
                </div>

                {selectedFormat === 'pack-podcast-brut' && (
                  <>
                    <div className="flex justify-between">
                      <span>Tournage brut ({podcastHours}h x 600 DH) :</span>
                      <span className="font-bold text-white">{podcastHours * 600} DH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intervenants :</span>
                      <span className="font-medium text-[#f3e5ab]">{podcastParticipants} Intervenants</span>
                    </div>
                    {brutPostProd !== 'raw' && (
                      <div className="flex justify-between">
                        <span>Option montage :</span>
                        <span className="font-bold text-white">
                          +{brutPostProd === 'cut' ? 400 : brutPostProd === 'shorts' ? 300 : 600} DH
                        </span>
                      </div>
                    )}
                    {liveSupplement && (
                      <div className="flex justify-between">
                        <span>Montage Live sous 2h :</span>
                        <span className="font-bold text-white">+200 DH</span>
                      </div>
                    )}
                  </>
                )}

                {selectedFormat === 'pack-podcast-montage' && (
                  <>
                    <div className="flex justify-between">
                      <span>Tournage + Montage ({podcastHours}h x 1 000 DH) :</span>
                      <span className="font-bold text-white">{podcastHours * 1000} DH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intervenants :</span>
                      <span className="font-medium text-[#f3e5ab]">{podcastParticipants} Intervenants</span>
                    </div>
                    {podcastPostProd !== 'included' && (
                      <div className="flex justify-between">
                        <span>Shorts supplémentaires :</span>
                        <span className="font-bold text-white">
                          +{podcastPostProd === 'shorts3' ? 300 : 500} DH
                        </span>
                      </div>
                    )}
                    {liveSupplement && (
                      <div className="flex justify-between">
                        <span>Montage Live sous 2h :</span>
                        <span className="font-bold text-white">+200 DH</span>
                      </div>
                    )}
                  </>
                )}

                {selectedFormat === 'pack-shooting-photo' && (
                  <>
                    <div className="flex justify-between">
                      <span>Séance Photo Studio (12 photos PNG) :</span>
                      <span className="font-bold text-white">300 DH</span>
                    </div>
                    {photoOption !== 'standard' && (
                      <div className="flex justify-between">
                        <span>Photos supplémentaires :</span>
                        <span className="font-bold text-white">
                          +{photoOption === 'pack18' ? 150 : 250} DH
                        </span>
                      </div>
                    )}
                    {photoExpress && (
                      <div className="flex justify-between">
                        <span>Livraison Express 24h :</span>
                        <span className="font-bold text-white">+100 DH</span>
                      </div>
                    )}
                  </>
                )}

                {selectedFormat === 'pack-shooting-produit' && (
                  <>
                    <div className="flex justify-between">
                      <span>Session Produit & UGC de base :</span>
                      <span className="font-bold text-white">450 DH</span>
                    </div>
                    {produitOption !== 'single' && (
                      <div className="flex justify-between">
                        <span>Vidéos / Produits additionnels :</span>
                        <span className="font-bold text-white">
                          +{produitOption === 'double' ? 350 : 600} DH
                        </span>
                      </div>
                    )}
                    {produitExpress && (
                      <div className="flex justify-between">
                        <span>Livraison Express 24h :</span>
                        <span className="font-bold text-white">+150 DH</span>
                      </div>
                    )}
                  </>
                )}

                {selectedFormat === 'pack-creation-contenu' && (
                  <>
                    <div className="flex justify-between">
                      <span>Abonnement Récurrent :</span>
                      <span className="font-bold text-[#f3e5ab]">{creationTier}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#78889d]">
                      <span>Volume mensuel :</span>
                      <span className="text-white">
                        {creationTier === 'Starter'
                          ? '4 Reels / mois'
                          : creationTier === 'Standard'
                          ? '8 Reels / mois'
                          : '12 Reels / mois'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Big Price Display */}
              <div className="space-y-1">
                <div className="text-[11px] text-[#8c9bb0] uppercase font-semibold">Total Estimé TTC</div>
                <div className="text-4xl sm:text-5xl font-black font-display text-white flex items-baseline gap-2">
                  <span className="gold-gradient-text">{total.toLocaleString('fr-FR')}</span>
                  <span className="text-lg font-bold text-[#d4af37]">DH</span>
                </div>
                <div className="text-[11px] text-[#6d7f95]">
                  Studio équipé (2 Caméras Sony & micros broadcast) + accompagnement inclus
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleBook}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] animate-gold-flow text-[#07080c] font-black text-sm shadow-xl shadow-[#d4af37]/30 hover:shadow-[#d4af37]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
                <span className="relative z-10">Réserver cette configuration</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <div className="text-[11px] text-[#718296] text-center">
                Conforme aux tarifs officiels Kwan Studio. Aucun paiement en ligne requis.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
