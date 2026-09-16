import React from 'react';

interface LogoProps {
  customLogoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ customLogoUrl, size = 'md', className = '' }) => {
  if (customLogoUrl) {
    return (
      <img
        src={customLogoUrl}
        alt="KWAN STUDIO"
        referrerPolicy="no-referrer"
        className={`object-contain ${
          size === 'sm' ? 'h-7' : size === 'lg' ? 'h-14' : 'h-10'
        } ${className}`}
      />
    );
  }

  // Bespoke luxury geometric logo: Monogram with Moroccan brass architectural lines & clean editorial typography
  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1c2230] via-[#10141d] to-[#0a0d14] border border-[#d4af37]/30 shadow-lg shadow-[#d4af37]/5 transition-transform duration-300 group-hover:scale-105 ${
        size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
      }`}>
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0.5 rounded-lg border border-[#d4af37]/15 opacity-60 pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`}
        >
          {/* Stylized K inspired by acoustic waves and Moroccan geometric cuts */}
          <path
            d="M5 4V20"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M17 5L7 13"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M10 10.5L19 19"
            stroke="url(#goldGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="17.5" cy="5" r="1.5" fill="#f3e5ab" />
          <circle cx="19.5" cy="19" r="1.5" fill="#d4af37" />
          <defs>
            <linearGradient id="goldGrad" x1="5" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="0.5" stopColor="#f3e5ab" />
              <stop offset="1" stopColor="#d4af37" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-display font-bold tracking-[0.18em] text-white leading-none ${
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'
          }`}>
            KWAN
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
        </div>
        <span className={`font-sans tracking-[0.32em] text-[#8e98aa] uppercase font-semibold mt-0.5 ${
          size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]'
        }`}>
          STUDIO
        </span>
      </div>
    </div>
  );
};
