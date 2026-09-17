import React, { useState } from 'react';
import { Check, Camera, Mic, Film, Sparkles, ArrowRight, Clock, Shield, MessageCircle, Layers, Video, Image as ImageIcon } from 'lucide-react';
import { Package } from '../types.js';

interface PackagesSectionProps {
  packages: Package[];
  onSelectPackage: (pkg: Package, tierName?: string) => void;
}

interface PackageCardProps {
  pkg: Package;
  onSelect: (tierName?: string) => void;
}

const PackageCardItem: React.FC<PackageCardProps> = ({ pkg, onSelect }) => {
  const isPopular = pkg.is_popular;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [selectedTierName, setSelectedTierName] = useState<string>(
    pkg.tiers && pkg.tiers.length > 0 ? pkg.tiers[0].name : ''
  );

  const chosenTier = pkg.tiers?.find(t => t.name.toLowerCase() === selectedTierName.toLowerCase()) || pkg.tiers?.[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const currentPriceDisplay = chosenTier ? chosenTier.price : pkg.price;

  const whatsappMessage = encodeURIComponent(
    chosenTier
      ? `Bonjour Kwan Studio, je souhaite réserver ou me renseigner sur la formule : *${pkg.name} — Niveau ${chosenTier.name}* (${chosenTier.price}).`
      : `Bonjour Kwan Studio, je souhaite réserver ou me renseigner sur la formule : *${pkg.name}* (${pkg.price}).`
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-xl ${
        isPopular
          ? 'bg-gradient-to-b from-[#141b29]/95 via-[#0d121c]/95 to-[#080b11]/95 border-2 border-[#d4af37] shadow-2xl shadow-[#d4af37]/20 hover:shadow-[#d4af37]/35'
          : 'bg-[#0c1017]/90 border border-[#1e2536] hover:border-[#d4af37]/50 shadow-xl shadow-black/50 hover:shadow-[#d4af37]/10'
      }`}
    >
      {/* Pointer Spotlight Overlay inside card */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 overflow-hidden"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.09), transparent 70%)`
        }}
      />

      {/* Popular / Category Badge */}
      {pkg.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span
            className={`px-4 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-lg transition-transform duration-300 group-hover:scale-105 whitespace-nowrap ${
              isPopular
                ? 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] shadow-[#d4af37]/30'
                : 'bg-[#182030] text-[#d4af37] border border-[#d4af37]/35'
            }`}
          >
            {pkg.badge}
          </span>
        </div>
      )}

      <div className="relative z-10">
        {/* Image header of package with zoom and shine sweep */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-5 bg-[#121622] border border-[#1d2538] group-hover:border-[#d4af37]/30 transition-colors">
          <img
            src={pkg.image_url}
            alt={pkg.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090c13] via-transparent to-black/30" />

          {/* Diagonal light shine sweep across image */}
          <span className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1.5 border border-white/10">
            <Clock className="w-3 h-3 text-[#d4af37]" />
            <span>{pkg.duration}</span>
          </div>

          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#0b0e14]/85 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-[#f3e5ab] border border-[#d4af37]/30">
            Kwan Studio
          </div>
        </div>

        {/* Header Title & Pricing */}
        <div className="space-y-2 mb-5">
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-[#f3e5ab] transition-colors leading-tight">
            {pkg.name}
          </h3>
          <p className="text-xs text-[#8c9bb0] leading-relaxed min-h-[38px]">
            {pkg.description}
          </p>
          <div className="pt-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-[#f3e5ab] flex items-baseline gap-1">
              <span>{currentPriceDisplay}</span>
            </div>
            {chosenTier && (
              <div className="text-[11px] font-semibold text-[#d4af37] mt-0.5">
                Niveau sélectionné : {chosenTier.name}
              </div>
            )}
          </div>
        </div>

        {/* Technical Specifications Matrix */}
        <div className="space-y-2.5 py-3.5 border-y border-[#1a2233] text-xs text-[#b0bdcf]">
          {/* Cameras */}
          <div className="flex items-start gap-2.5">
            <Camera className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Équipement vidéo : </span>
              <span>{pkg.cameras_count > 0 ? `${pkg.cameras_count} Caméras Sony` : 'Audio pur (Sans vidéo)'}</span>
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

          {/* Video & Décor */}
          <div className="flex items-start gap-2.5">
            <Film className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Plateau & Décor : </span>
              <span>{pkg.video_services}</span>
            </div>
          </div>

          {/* Post-production */}
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Post-production : </span>
              <span>{pkg.editing_services}</span>
            </div>
          </div>
        </div>

        {/* Special Supplement Banner (e.g. for Podcast + Montage: +200 DH Montage Live) */}
        {pkg.supplement && (
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#d4af37]/15 via-[#f3e5ab]/10 to-[#d4af37]/15 border border-[#d4af37]/40 shadow-inner">
            <div className="text-[11px] font-bold text-[#f3e5ab] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span>{pkg.supplement}</span>
            </div>
          </div>
        )}

        {/* Embedded Tiers Grid if available (e.g. Création de Contenu Starter / Standard / Premium) */}
        {pkg.tiers && pkg.tiers.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#d4af37]">
              <span>Niveaux au choix :</span>
              <span className="text-[10px] text-[#8c9bb0] font-normal">Cliquez pour choisir</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {pkg.tiers.map((tier, idx) => {
                const isSelected = selectedTierName.toLowerCase() === tier.name.toLowerCase();
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedTierName(tier.name)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#172033] to-[#121927] border-[#d4af37] shadow-md shadow-[#d4af37]/20 ring-1 ring-[#d4af37]'
                        : 'bg-[#101522] border-[#1e273b] hover:border-[#d4af37]/50 text-[#8c9bb0]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] shrink-0 ${
                          isSelected
                            ? 'bg-[#d4af37] border-[#d4af37] text-black font-bold'
                            : 'border-[#303c52] text-transparent'
                        }`}
                      >
                        ✓
                      </div>
                      <div>
                        <span className={`font-bold block ${isSelected ? 'text-white' : 'text-[#c0cfe3]'}`}>
                          {tier.name}
                        </span>
                        <span className="text-[10px] text-[#8c9bb0] line-clamp-1 leading-tight">
                          {tier.content}
                        </span>
                      </div>
                    </div>
                    <span className={`font-bold shrink-0 text-xs ml-2 whitespace-nowrap ${isSelected ? 'text-[#f3e5ab]' : 'text-[#a9b8cc]'}`}>
                      {tier.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Included features list */}
        <div className="pt-4 space-y-2 mb-6">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#79889d]">
            Inclus dans cette offre :
          </div>
          {pkg.additional_features.map((feature, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#cad5e4]">
              <div className="w-4 h-4 rounded-full bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <span className="leading-snug">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: Booking Modal CTA + WhatsApp direct */}
      <div className="space-y-2 pt-2 border-t border-[#171e2e] relative z-10">
        <button
          onClick={() => onSelect(selectedTierName || undefined)}
          className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden active:scale-[0.98] ${
            isPopular
              ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-[#07080c] shadow-lg shadow-[#d4af37]/25 hover:shadow-[#d4af37]/45 hover:scale-[1.01]'
              : 'bg-[#141926] hover:bg-[#1d2436] text-white border border-[#252f44] hover:border-[#d4af37]/50'
          }`}
        >
          <span>{chosenTier ? `Réserver : ${chosenTier.name}` : 'Réserver ce pack'}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        <a
          href={`https://wa.me/212661000000?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#8ca0b8] hover:text-[#25D366] bg-[#0c1017] hover:bg-[#121824] border border-[#1b2233] hover:border-[#25D366]/40 transition-all duration-300 flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
          <span>Poser une question sur WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export const PackagesSection: React.FC<PackagesSectionProps> = ({ packages, onSelectPackage }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'podcast' | 'shooting' | 'content'>('all');

  const filteredPackages = packages.filter((pkg) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'podcast') {
      return pkg.id.includes('podcast') || pkg.category === 'podcast';
    }
    if (activeCategory === 'shooting') {
      return pkg.id.includes('shooting') || pkg.category === 'shooting';
    }
    if (activeCategory === 'content') {
      return pkg.id.includes('content') || pkg.id.includes('creation') || pkg.category === 'content';
    }
    return true;
  });

  return (
    <section id="packs" className="py-24 bg-[#07090e] relative border-t border-[#151a26] overflow-hidden">
      {/* Ambient studio light glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-[#d4af37]/10 rounded-full blur-[180px] pointer-events-none animate-slow-orbit" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121622] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Tarifs & Formules Kwan Studio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            Des formules conçues pour chaque étape de votre création.
          </h2>
          <p className="text-[#9bb0c7] text-base sm:text-lg leading-relaxed font-light">
            Retrouvez l’ensemble de nos offres officielles : tournage podcast brut, podcast avec montage complet, séances shooting photo & produit UGC, ainsi que nos abonnements mensuels de création de contenu.
          </p>

          {/* Category Filter Tabs */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] shadow-lg shadow-[#d4af37]/20'
                  : 'bg-[#121722] text-[#8fa0b5] hover:text-white border border-[#1e273a]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Toutes les formules ({packages.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('podcast')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === 'podcast'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] shadow-lg shadow-[#d4af37]/20'
                  : 'bg-[#121722] text-[#8fa0b5] hover:text-white border border-[#1e273a]'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Podcasts Studio</span>
            </button>

            <button
              onClick={() => setActiveCategory('shooting')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === 'shooting'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] shadow-lg shadow-[#d4af37]/20'
                  : 'bg-[#121722] text-[#8fa0b5] hover:text-white border border-[#1e273a]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Shootings & UGC</span>
            </button>

            <button
              onClick={() => setActiveCategory('content')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeCategory === 'content'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] shadow-lg shadow-[#d4af37]/20'
                  : 'bg-[#121722] text-[#8fa0b5] hover:text-white border border-[#1e273a]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Création de Contenu (Reels)</span>
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredPackages.map((pkg) => (
            <PackageCardItem
              key={pkg.id}
              pkg={pkg}
              onSelect={(tierName) => onSelectPackage(pkg, tierName)}
            />
          ))}
        </div>

        {/* Kwan Studio Guarantees Banner */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0d121c]/80 border border-[#1b2334] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#f3e5ab] shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Matériel Sony Broadcast</div>
              <div className="text-[11px] text-[#8a9bb0]">2 caméras Sony professionnelles et micros studio</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d121c]/80 border border-[#1b2334] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#f3e5ab] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Livraison Sous 3 Jours</div>
              <div className="text-[11px] text-[#8a9bb0]">Option express 2h disponible avec montage live</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d121c]/80 border border-[#1b2334] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#f3e5ab] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Sauvegarde Garantie 7 Jours</div>
              <div className="text-[11px] text-[#8a9bb0]">Archivage cloud sécurisé de tous vos fichiers</div>
            </div>
          </div>
        </div>

        {/* Custom Needs Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111624] via-[#0d111a] to-[#111624] border border-[#1f2738] hover:border-[#d4af37]/40 transition-colors flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#f3e5ab] text-[11px] font-bold uppercase tracking-wider border border-[#d4af37]/30 inline-block mb-2">
              Projet Personnalisé ou Saison Complète
            </span>
            <h4 className="text-lg sm:text-xl font-bold font-display text-white">
              Vous avez un format spécifique, une série d'émissions ou un besoin entreprise ?
            </h4>
            <p className="text-xs sm:text-sm text-[#8a98ab] mt-1">
              Notre régie adapte le studio à votre charte : scénographie, prompteur, multi-angles et habillage graphique sur-mesure.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectPackage(packages[1] || packages[0])}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] text-xs sm:text-sm font-bold shadow-lg shadow-[#d4af37]/20 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
            >
              Demander un devis sur-mesure
            </button>
            <a
              href="https://wa.me/212661000000?text=Bonjour%20Kwan%20Studio%2C%20j%27ai%20un%20projet%20sp%C3%A9cifique%20et%20je%20souhaite%20un%20devis."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-[#141926] text-white hover:text-[#25D366] text-xs sm:text-sm font-semibold border border-[#222a3d] hover:border-[#25D366]/40 transition-all duration-300 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
