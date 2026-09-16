import React from 'react';
import { Logo } from './Logo.js';
import { Lock, Instagram, Youtube, Linkedin, Radio } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigate: (route: string) => void;
  customLogoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onNavigate, customLogoUrl }) => {
  return (
    <footer className="bg-[#050609] border-t border-[#141824] pt-16 pb-12 text-[#8292a8] relative overflow-hidden">
      {/* Ambient background light orb */}
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[250px] bg-[#d4af37]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#141824]">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <Logo customLogoUrl={customLogoUrl} size="md" />
            <p className="text-sm text-[#93a2b8] leading-relaxed max-w-sm font-light">
              Kwan Studio est le studio d'enregistrement et de tournage de podcasts de référence à Casablanca. Équipements broadcast 4K, traitement acoustique noble et réalisation sur-mesure pour les créateurs, entreprises et médias exigeants.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0e121a] border border-[#1b2333] flex items-center justify-center text-[#8e9faf] hover:text-[#d4af37] hover:border-[#d4af37]/50 hover:shadow-md hover:shadow-[#d4af37]/10 hover:-translate-y-0.5 transition-all"
                aria-label="Instagram Kwan Studio"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0e121a] border border-[#1b2333] flex items-center justify-center text-[#8e9faf] hover:text-[#d4af37] hover:border-[#d4af37]/50 hover:shadow-md hover:shadow-[#d4af37]/10 hover:-translate-y-0.5 transition-all"
                aria-label="YouTube Kwan Studio"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0e121a] border border-[#1b2333] flex items-center justify-center text-[#8e9faf] hover:text-[#d4af37] hover:border-[#d4af37]/50 hover:shadow-md hover:shadow-[#d4af37]/10 hover:-translate-y-0.5 transition-all"
                aria-label="LinkedIn Kwan Studio"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0e121a] border border-[#1b2333] flex items-center justify-center text-[#8e9faf] hover:text-[#d4af37] hover:border-[#d4af37]/50 hover:shadow-md hover:shadow-[#d4af37]/10 hover:-translate-y-0.5 transition-all"
                aria-label="Spotify Kwan Studio"
              >
                <Radio className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#top" className="hover:text-[#f3e5ab] transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Accueil</span>
                </a>
              </li>
              <li>
                <a href="#studio" className="hover:text-[#f3e5ab] transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Le Studio</span>
                </a>
              </li>
              <li>
                <a href="#packs" className="hover:text-[#f3e5ab] transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Nos 3 Formules</span>
                </a>
              </li>
              <li>
                <a href="#equipements" className="hover:text-[#f3e5ab] transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Équipements Broadcast</span>
                </a>
              </li>
              <li>
                <a href="#pourquoi-kwan" className="hover:text-[#f3e5ab] transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Pourquoi Kwan Studio</span>
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-[#f3e5ab] transition-colors text-left inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Blog & Conseils Podcast</span>
                </button>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#f3e5ab] transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Contact & Accès</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Legal */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Kwan Studio Casablanca
            </h4>
            <p className="text-sm text-[#93a2b8] leading-relaxed font-light">
              Quartier Racine, Boulevard d’Anfa<br />
              20050 Casablanca, Maroc<br />
              Tél: +212 6 61 00 00 00<br />
              Email: contact@kwanstudio.ma
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#0e131d] border border-[#1d273a] text-xs text-[#d4af37] font-medium">
                🇲🇦 Fièrement ancré au Maroc
              </span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6e7d91]">
          <div>
            © {new Date().getFullYear()} KWAN STUDIO. Tous droits réservés.
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-[#6e7d91] hover:text-[#d4af37] transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Accès Espace Administration</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
