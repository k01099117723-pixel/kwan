import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../types.js';

interface ContactSectionProps {
  settings: SiteSettings;
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, onOpenBooking }) => {
  const [formSent, setFormSent] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [message, setMessage] = useState('');

  const phone = settings.contact_phone || '+212 6 61 00 00 00';
  const whatsapp = settings.contact_whatsapp || '212661000000';
  const email = settings.contact_email || 'contact@kwanstudio.ma';
  const address = settings.studio_address || 'Quartier Racine, Boulevard d’Anfa, Casablanca, Maroc';
  const hours = settings.opening_hours || 'Lundi au Samedi : 09h00 – 21h00 (Dimanche sur réservation)';

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderContact || !message) return;
    setFormSent(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#07090e] relative border-t border-[#151b27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121622] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Contact & Accès</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            Prêt à enregistrer votre prochain épisode ?
          </h2>
          <p className="text-[#9bb0c7] text-base sm:text-lg leading-relaxed font-light">
            Contactez notre équipe de production ou venez visiter le studio avant votre premier tournage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* WhatsApp Highlight Card */}
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Bonjour%20Kwan%20Studio%2C%20je%20souhaite%20des%20informations%20sur%20les%20r%C3%A9servations.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-gradient-to-r from-[#12281a] via-[#0e1c14] to-[#0c131a] border border-[#25D366]/40 hover:border-[#25D366] transition-all flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#25D366]">
                    Réponse Instantanée
                  </div>
                  <div className="text-base font-bold text-white group-hover:text-[#25D366] transition-colors">
                    Échanger sur WhatsApp
                  </div>
                  <div className="text-xs text-[#8ca094]">
                    Discutez directement avec le studio manager
                  </div>
                </div>
              </div>
            </a>

            {/* Phone */}
            <div className="p-6 rounded-2xl bg-[#0c1017] border border-[#1b2334] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#141a27] border border-[#222c40] flex items-center justify-center text-[#d4af37]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#7e8eab]">Téléphone Direct</div>
                <a href={`tel:${phone}`} className="text-base font-bold text-white hover:text-[#d4af37] transition-colors">
                  {phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-6 rounded-2xl bg-[#0c1017] border border-[#1b2334] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#141a27] border border-[#222c40] flex items-center justify-center text-[#d4af37]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#7e8eab]">Email Production</div>
                <a href={`mailto:${email}`} className="text-base font-bold text-white hover:text-[#d4af37] transition-colors">
                  {email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="p-6 rounded-2xl bg-[#0c1017] border border-[#1b2334] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#141a27] border border-[#222c40] flex items-center justify-center text-[#d4af37]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#7e8eab]">Adresse du Studio</div>
                <div className="text-sm font-semibold text-white">
                  {address}
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-6 rounded-2xl bg-[#0c1017] border border-[#1b2334] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#141a27] border border-[#222c40] flex items-center justify-center text-[#d4af37]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#7e8eab]">Horaires d'Ouverture</div>
                <div className="text-xs sm:text-sm font-semibold text-white">
                  {hours}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Message Form or Fast Booking */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0c1017] border border-[#1e273a] shadow-xl">
              <h3 className="text-2xl font-bold font-display text-white mb-2">
                Envoyez-nous un message direct
              </h3>
              <p className="text-xs sm:text-sm text-[#8c9bb0] mb-6">
                Une question sur un format spécifique, une location à la journée ou une diffusion en direct ?
              </p>

              {formSent ? (
                <div className="p-6 rounded-2xl bg-[#131b28] border border-[#d4af37]/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#d4af37] mx-auto" />
                  <h4 className="text-lg font-bold text-white">Message Reçu</h4>
                  <p className="text-xs sm:text-sm text-[#9cb0c8]">
                    Merci {senderName}. Notre équipe vous répondra par WhatsApp ou par téléphone sous les plus brefs délais.
                  </p>
                  <button
                    onClick={() => {
                      setFormSent(false);
                      setSenderName('');
                      setSenderContact('');
                      setMessage('');
                    }}
                    className="mt-2 text-xs font-semibold text-[#d4af37] hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-[#adbcd0] font-medium">Votre nom *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Sarah Alami"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-sm focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-[#adbcd0] font-medium">Téléphone ou Email *</label>
                      <input
                        type="text"
                        required
                        placeholder="+212 6... ou email"
                        value={senderContact}
                        onChange={(e) => setSenderContact(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-sm focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-[#adbcd0] font-medium">Votre message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Décrivez votre projet, vos questions ou le format envisagé..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-sm focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-[#07080c] font-bold text-sm shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Transmettre mon message</span>
                      <Send className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={onOpenBooking}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#141a27] hover:bg-[#1c2436] text-white font-semibold text-sm border border-[#252f44] transition-colors"
                    >
                      Réserver un créneau directement
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
