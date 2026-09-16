import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { Logo } from './Logo.js';

interface NavbarProps {
  onOpenBooking: (packageId?: string) => void;
  onNavigate: (route: string) => void;
  currentRoute: string;
  onOpenAdmin: () => void;
  customLogoUrl?: string;
  whatsappNumber?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onNavigate,
  currentRoute,
  onOpenAdmin,
  customLogoUrl,
  whatsappNumber = '212661000000'
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', route: 'home', hash: '#top' },
    { label: 'Le Studio', route: 'home', hash: '#studio' },
    { label: 'Nos 3 Packs', route: 'home', hash: '#packs' },
    { label: 'Équipements', route: 'home', hash: '#equipements' },
    { label: 'Pourquoi Kwan', route: 'home', hash: '#pourquoi-kwan' },
    { label: 'Blog', route: 'blog', hash: '' },
    { label: 'Contact', route: 'home', hash: '#contact' },
  ];

  const handleLinkClick = (item: { route: string; hash: string }) => {
    setMobileMenuOpen(false);
    if (item.route === 'blog') {
      onNavigate('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (currentRoute !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          if (item.hash) {
            const el = document.querySelector(item.hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else if (item.hash) {
        const el = document.querySelector(item.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07080c]/90 backdrop-blur-md py-3.5 border-b border-[#1f2533]/80 shadow-2xl shadow-black/60'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="focus:outline-none text-left"
            aria-label="Kwan Studio Accueil"
          >
            <Logo customLogoUrl={customLogoUrl} size={scrolled ? 'sm' : 'md'} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item)}
                className="px-3.5 py-2 text-sm font-medium text-[#c4ccd8] hover:text-[#f3e5ab] rounded-lg transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* WhatsApp Quick Link */}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Bonjour%20Kwan%20Studio%2C%20je%20souhaite%20r%C3%A9server%20une%20session%20de%20podcast.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#9ab0cd] hover:text-white bg-[#131722]/80 hover:bg-[#181d2a] border border-[#1f2637] rounded-lg transition-all"
              title="Discuter sur WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            {/* Admin Key Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#7e8b9f] hover:text-[#d4af37] bg-[#10141e]/50 hover:bg-[#161c2b] border border-[#1c2333] rounded-lg transition-all"
              title="Portail Administration"
              aria-label="Accès Administration"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => onOpenBooking()}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-[#0a0c10] font-semibold text-sm shadow-lg shadow-[#d4af37]/20 transition-all duration-300 hover:shadow-[#d4af37]/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Réserver mon studio</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenBooking()}
              className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-[#07080c] font-semibold text-xs"
            >
              Réserver
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#c4ccd8] hover:text-white rounded-lg bg-[#131722] border border-[#1e2434] focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0d14]/98 backdrop-blur-xl border-b border-[#1f2637] px-5 pt-4 pb-6 mt-3 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item)}
                className="w-full text-left px-4 py-3 text-base font-medium text-[#c4ccd8] hover:text-[#f3e5ab] hover:bg-[#141926] rounded-xl transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1a2130] flex flex-col gap-2">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Bonjour%20Kwan%20Studio%2C%20je%20souhaite%20r%C3%A9server.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[#1a2233] border border-[#232c42] rounded-xl"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>Contacter sur WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] font-bold text-sm text-center shadow-lg shadow-[#d4af37]/20"
            >
              Réserver mon studio
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 text-xs text-[#7e8b9f] hover:text-[#d4af37] text-center"
            >
              Accès Administration
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
