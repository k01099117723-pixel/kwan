import React from 'react';
import { Camera, Mic, Sliders, Sun, HardDrive, Monitor, Sparkles } from 'lucide-react';

export const EquipmentSection: React.FC = () => {
  const categories = [
    {
      icon: Mic,
      category: 'Audio Broadcast & Prise de son',
      items: [
        { name: 'Shure SM7B', desc: 'Micros dynamiques légendaires avec réjection hors axe' },
        { name: 'Rødecaster Pro II', desc: 'Interface de production audio multicanale 32-bit float' },
        { name: 'Beyerdynamic DT 770 Pro', desc: 'Casques de studio fermés pour un monitoring d’une précision chirurgicale' },
        { name: 'Cloudlifter CL-1 & Câblage Mogami', desc: 'Préamplification ultra-propre et zéro interférence' }
      ]
    },
    {
      icon: Camera,
      category: 'Vidéo Cinéma & Optiques',
      items: [
        { name: 'Sony FX3 Cinema Line', desc: 'Capteur plein format 4K 120fps, profil S-Cinetone et dynamique 15+ stops' },
        { name: 'Sony G Master 24-70mm f/2.8 II', desc: 'Piqué optique extrême pour les plans d’ensemble et gros plans' },
        { name: 'Trépieds Fluides Manfrotto Nitrotech', desc: 'Stabilité absolue et mouvements fluides sans tremblement' },
        { name: 'Prompteur 4K & Retours Invités', desc: 'Confort optimal pour les introductions et conducteurs d’émission' }
      ]
    },
    {
      icon: Sun,
      category: 'Éclairage Studio & Atmosphère',
      items: [
        { name: 'Aputure Light Storm 300d II', desc: 'Sources LED principales lumière du jour avec dôme de diffusion' },
        { name: 'Aputure Amaran Tube T2c RGB', desc: 'Lumières d’accentuation d’arrière-plan personnalisables selon votre marque' },
        { name: 'Diffusions Lantern 360°', desc: 'Éclairage d’ambiance doux et flatteur pour tous les visages' },
        { name: 'Gradation DMX centralisée', desc: 'Contrôle instantané des ambiances depuis la régie' }
      ]
    },
    {
      icon: HardDrive,
      category: 'Régie & Sauvegarde Cloud',
      items: [
        { name: 'Blackmagic ATEM Extreme ISO', desc: 'Enregistrement ISO 4 pistes vidéo simultanées et réalisation live' },
        { name: 'Stockage SSD NVMe Ultra-Rapide', desc: 'Rushes dupliqués en temps réel sur disques sécurisés' },
        { name: 'Lien Fibre Dédié 1Gbps', desc: 'Upload direct de vos fichiers sur votre espace Cloud privé sous 24h' },
        { name: 'Onduleurs APC Studio', desc: 'Protection électrique totale contre toute coupure inattendue' }
      ]
    }
  ];

  return (
    <section id="equipements" className="py-24 bg-[#080b11] relative border-t border-[#151b27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121724] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Spécifications Techniques</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            Le standard des plus grandes productions internationales.
          </h2>
          <p className="text-[#9bb0c7] text-base sm:text-lg leading-relaxed font-light">
            Chaque équipement au sein de Kwan Studio a été sélectionné pour sa fiabilité et sa fidélité acoustique et optique sans compromis.
          </p>
        </div>

        {/* Equipment Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#0c1017] border border-[#1d2638] hover:border-[#d4af37]/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-[#182132]">
                  <div className="w-10 h-10 rounded-xl bg-[#141a26] border border-[#232d42] flex items-center justify-center text-[#d4af37]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-white">
                    {cat.category}
                  </h3>
                </div>

                <div className="space-y-4">
                  {cat.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-white">{item.name}</div>
                        <div className="text-xs text-[#8291a5] leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
