import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@kwanstudio.ma');
  const [password, setPassword] = useState('KwanStudio2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.loginAdmin(email.trim(), password);
      login(res.token, res.user);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0d111a] border border-[#232c40] rounded-3xl shadow-2xl p-8">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#141926] text-[#7d8fa5] hover:text-white border border-[#222c40] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Portail Administration
          </h2>
          <p className="text-xs text-[#8c9bb0]">
            Espace réservé à l'équipe de production Kwan Studio.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#a7b7cc]">Email Administrateur</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6e7f96] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121724] border border-[#20293d] text-white text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#a7b7cc]">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6e7f96] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121724] border border-[#20293d] text-white text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] font-bold text-sm shadow-lg shadow-[#d4af37]/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 text-center text-[11px] text-[#6d7b8f]">
            Identifiant par défaut : <code className="text-[#d4af37]">admin@kwanstudio.ma</code> / <code className="text-[#d4af37]">KwanStudio2026!</code>
          </div>
        </form>

      </div>
    </div>
  );
};
