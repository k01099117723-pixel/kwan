import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, MessageSquare, AlertCircle, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Package } from '../types.js';
import { api } from '../services/api.js';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: Package | null;
  packages: Package[];
  whatsappNumber?: string;
  initialMessage?: string;
}

const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tanger',
  'Agadir',
  'Fès',
  'Autre ville'
];

const TIME_SLOTS = [
  'Matin (09h30 - 12h30)',
  'Après-midi (14h00 - 17h00)',
  'Fin de journée (17h30 - 20h30)',
  'Soirée VIP (20h30 - 23h30)',
  'Journée entière / Sur-mesure'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  packages,
  whatsappNumber = '212661000000',
  initialMessage = ''
}) => {
  const [packageId, setPackageId] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[1]);
  const [participants, setParticipants] = useState(2);
  const [message, setMessage] = useState(initialMessage);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<number | null>(null);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (selectedPackage) {
      setPackageId(selectedPackage.id);
    } else if (packages.length > 0 && !packageId) {
      setPackageId(packages[1]?.id || packages[0].id);
    }
  }, [selectedPackage, packages]);

  // Set min date to tomorrow
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  if (!isOpen) return null;

  const currentPkg = packages.find(p => p.id === packageId) || packages[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Veuillez renseigner votre nom complet.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Veuillez renseigner un numéro de téléphone valide (ex: +212 6 XX XX XX XX).');
      return;
    }

    if (!preferredDate) {
      setErrorMessage('Veuillez choisir une date souhaitée.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.submitBooking({
        full_name: fullName.trim(),
        city,
        phone: phone.trim(),
        email: email.trim() || undefined,
        package_id: currentPkg.id,
        package_name: currentPkg.name,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        participants: Number(participants) || 2,
        message: message.trim() || undefined
      });

      setIsSuccess(true);
      setSubmittedBookingId(res.bookingId);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f3e5ab', '#ffffff']
        });
      } catch (c) {}

    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de l’envoi de votre réservation.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c1017] border border-[#222a3d] rounded-3xl shadow-2xl shadow-black/80 overflow-hidden">
        
        {/* Header decoration bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37]" />

        {/* Close button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2.5 rounded-xl bg-[#131824] hover:bg-[#1a2233] text-[#8e9caf] hover:text-white border border-[#21293a] transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          // Confirmation View
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Demande de Réservation Transmise
              </h3>
              <p className="text-base text-[#cad5e4] max-w-lg mx-auto leading-relaxed">
                Merci pour votre demande. Notre équipe <span className="text-[#f3e5ab] font-semibold">Kwan Studio</span> vous contactera prochainement pour confirmer votre réservation.
              </p>
            </div>

            {/* Summary card */}
            <div className="p-4 rounded-2xl bg-[#111622] border border-[#1e273a] text-left text-xs sm:text-sm text-[#9bb0c7] space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span>Formule choisie :</span>
                <span className="font-bold text-white">{currentPkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Créneau :</span>
                <span className="font-bold text-white">{preferredDate} · {preferredTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Ville :</span>
                <span className="font-bold text-white">{city}</span>
              </div>
              <div className="flex justify-between">
                <span>Téléphone :</span>
                <span className="font-bold text-white">{phone}</span>
              </div>
            </div>

            {/* WhatsApp direct CTA */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Bonjour%20Kwan%20Studio%2C%20je%20viens%20de%20d%C3%A9poser%20la%20demande%20de%20r%C3%A9servation%20N%C2%B0${submittedBookingId}%20pour%20le%20${encodeURIComponent(currentPkg.name)}%20le%20${preferredDate}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Accélérer via WhatsApp</span>
              </a>

              <button
                onClick={handleResetAndClose}
                className="px-6 py-3.5 rounded-xl bg-[#161c2a] hover:bg-[#1e2638] text-white font-semibold text-sm border border-[#273248] transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          // Booking Form View
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141926] border border-[#d4af37]/30 text-[#f3e5ab] text-[11px] font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span>Réservation Immédiate</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Réserver votre session chez Kwan Studio
              </h3>
              <p className="text-xs sm:text-sm text-[#8a98ac]">
                Remplissez les informations ci-dessous. Notre responsable de studio vous rappelle sous 2 heures.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Package selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#9bb0c7]">
                Formule sélectionnée
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {packages.map((pkg) => {
                  const active = pkg.id === packageId;
                  return (
                    <button
                      type="button"
                      key={pkg.id}
                      onClick={() => setPackageId(pkg.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        active
                          ? 'bg-[#182133] border-[#d4af37] shadow-md shadow-[#d4af37]/10'
                          : 'bg-[#0e121a] border-[#1d2538] hover:border-[#2b354d]'
                      }`}
                    >
                      <div className="font-bold text-xs text-white leading-tight">{pkg.name}</div>
                      <div className="text-[11px] font-semibold text-[#d4af37] mt-1">{pkg.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#adbcd0]">Nom & Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Youssef Bennani"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#adbcd0]">Ville *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                >
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-[#111622]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#adbcd0]">Téléphone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+212 6 XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#adbcd0]">Email (optionnel)</label>
                <input
                  type="email"
                  placeholder="youssef@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>
            </div>

            {/* Date & Time Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#adbcd0] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Date souhaitée *</span>
                </label>
                <input
                  type="date"
                  required
                  min={tomorrowStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#adbcd0] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Créneau horaire *</span>
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot} className="bg-[#111622]">
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#adbcd0] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Intervenants au micro</span>
                </label>
                <select
                  value={participants}
                  onChange={(e) => setParticipants(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                >
                  <option value={1} className="bg-[#111622]">1 personne (Solo)</option>
                  <option value={2} className="bg-[#111622]">2 personnes (Duo)</option>
                  <option value={3} className="bg-[#111622]">3 personnes (Trio)</option>
                  <option value={4} className="bg-[#111622]">4 personnes (Table ronde)</option>
                </select>
              </div>
            </div>

            {/* Additional Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#adbcd0]">Détails ou besoins spécifiques (optionnel)</label>
              <textarea
                rows={2}
                placeholder="Thématique du podcast, besoin de sous-titres, prompteur, boissons..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>

            {/* Form Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-[#07080c] font-bold text-base shadow-xl shadow-[#d4af37]/25 hover:shadow-[#d4af37]/45 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Transmission en cours...</span>
                ) : (
                  <>
                    <span>Confirmer ma demande de réservation</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-[#6d7b8f] text-center mt-2.5">
                🔒 Vos informations sont confidentielles. Aucun paiement n'est exigé à cette étape.
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
