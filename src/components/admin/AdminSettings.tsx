import React, { useState } from 'react';
import { SiteSettings } from '../../types.js';
import { api } from '../../services/api.js';
import { Save, CheckCircle, AlertCircle, KeyRound, Globe, Share2 } from 'lucide-react';

interface AdminSettingsProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onRefresh }) => {
  const [form, setForm] = useState<SiteSettings>({ ...settings });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      await api.updateSettings(form);
      setMsg({ type: 'success', text: 'Paramètres mis à jour avec succès !' });
      onRefresh();
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Erreur mise à jour paramètres' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPwLoading(true);
    setPwMsg(null);

    try {
      await api.changeAdminPassword(currentPassword, newPassword);
      setPwMsg({ type: 'success', text: 'Mot de passe administrateur changé avec succès !' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.message || 'Erreur changement mot de passe' });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">
          Paramètres du Studio & Configuration Globale
        </h2>
        <p className="text-xs text-[#8c9bb0] mt-1">
          Gérez les coordonnées de contact, vos liens de réseaux sociaux, vos textes principaux et les accès de sécurité.
        </p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl flex items-center gap-2 text-xs ${
          msg.type === 'success' ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200' : 'bg-red-950/40 border border-red-500/40 text-red-200'
        }`}>
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Contact info box */}
        <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-[#1b2435] pb-3">
            <Globe className="w-4 h-4 text-[#d4af37]" />
            <span>Coordonnées & Horaires (Casablanca)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[#a7b7cd]">Téléphone Studio</label>
              <input
                type="text"
                value={form.contact_phone || ''}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a7b7cd]">Numéro WhatsApp (Format international sans +)</label>
              <input
                type="text"
                value={form.contact_whatsapp || ''}
                onChange={(e) => setForm({ ...form, contact_whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a7b7cd]">Email Général</label>
              <input
                type="email"
                value={form.contact_email || ''}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a7b7cd]">Horaires d'ouverture</label>
              <input
                type="text"
                value={form.opening_hours || ''}
                onChange={(e) => setForm({ ...form, opening_hours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-[#a7b7cd]">Adresse Physique du Studio à Casablanca</label>
            <input
              type="text"
              value={form.studio_address || ''}
              onChange={(e) => setForm({ ...form, studio_address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
            />
          </div>
        </div>

        {/* Branding & Copy */}
        <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-[#1b2435] pb-3">
            <Share2 className="w-4 h-4 text-[#d4af37]" />
            <span>Textes d'Accroche & Identité Visuelle</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[#a7b7cd]">Titre Principal Hero (H1)</label>
              <input
                type="text"
                value={form.hero_title || ''}
                onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a7b7cd]">Sous-titre Hero</label>
              <textarea
                rows={2}
                value={form.hero_subtitle || ''}
                onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a7b7cd]">URL Logo Personnalisé (optionnel)</label>
              <input
                type="text"
                placeholder="https://... ou /uploads/logo.png"
                value={form.custom_logo_url || ''}
                onChange={(e) => setForm({ ...form, custom_logo_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-4">
          <div className="text-sm font-bold text-white border-b border-[#1b2435] pb-3">
            Réseaux Sociaux
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[#a7b7cd]">Instagram URL</label>
              <input
                type="text"
                value={form.social_instagram || ''}
                onChange={(e) => setForm({ ...form, social_instagram: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a7b7cd]">YouTube URL</label>
              <input
                type="text"
                value={form.social_youtube || ''}
                onChange={(e) => setForm({ ...form, social_youtube: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a7b7cd]">LinkedIn URL</label>
              <input
                type="text"
                value={form.social_linkedin || ''}
                onChange={(e) => setForm({ ...form, social_linkedin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a7b7cd]">Spotify Show URL</label>
              <input
                type="text"
                value={form.social_spotify || ''}
                onChange={(e) => setForm({ ...form, social_spotify: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] font-bold text-xs shadow-md shadow-[#d4af37]/20 hover:scale-[1.01] transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Enregistrement...' : 'Sauvegarder les Paramètres'}</span>
        </button>
      </form>

      {/* Change Password Card */}
      <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-[#1b2435] pb-3">
          <KeyRound className="w-4 h-4 text-[#d4af37]" />
          <span>Sécurité : Modifier le mot de passe administrateur</span>
        </div>

        {pwMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            pwMsg.type === 'success' ? 'bg-emerald-950/40 text-emerald-200 border border-emerald-500/30' : 'bg-red-950/40 text-red-200 border border-red-500/30'
          }`}>
            <span>{pwMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md text-xs">
          <div className="space-y-1">
            <label className="text-[#a8b8cd]">Mot de passe actuel</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#a8b8cd]">Nouveau mot de passe (min 6 caractères)</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={pwLoading}
              className="px-5 py-2.5 rounded-xl bg-[#171f2d] hover:bg-[#202a3d] text-white font-semibold text-xs border border-[#29364d] transition-colors"
            >
              {pwLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
