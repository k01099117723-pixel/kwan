import React, { useState, useEffect } from 'react';
import { MediaItem } from '../../types.js';
import { api } from '../../services/api.js';
import { UploadCloud, Trash2, Copy, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const loadMedia = async () => {
    try {
      const items = await api.getMedia();
      setMediaList(items);
    } catch (err: any) {
      setError(err.message || 'Erreur chargement médiathèque');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('alt_text', files[0].name);

      await api.uploadMedia(formData);
      await loadMedia();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’upload du fichier');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopy = (item: MediaItem) => {
    const fullUrl = window.location.origin + item.url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce fichier multimédia ?')) return;
    try {
      await api.deleteMedia(id);
      await loadMedia();
    } catch (err: any) {
      alert(err.message || 'Erreur suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">
          Médiathèque & Gestionnaire de Photos Réelles
        </h2>
        <p className="text-xs text-[#8c9bb0] mt-1">
          Téléversez vos photos réelles du studio, vos images de packs et votre logo pour les utiliser sur le site.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="p-8 rounded-3xl bg-[#0e131d] border-2 border-dashed border-[#232d42] hover:border-[#d4af37]/50 transition-colors text-center">
        <UploadCloud className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
        <h3 className="text-sm font-bold text-white mb-1">
          Déposer une photo réelle de Kwan Studio
        </h3>
        <p className="text-xs text-[#7e8f05] text-[#8697ae] mb-4">
          Formats acceptés : JPG, PNG, WEBP, SVG (Max 10 Mo)
        </p>

        <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171f2e] hover:bg-[#202b3d] text-white text-xs font-semibold border border-[#2b3952] transition-colors">
          <span>{uploading ? 'Téléversement en cours...' : 'Sélectionner un fichier'}</span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#8c9bb0]">Chargement de la médiathèque...</div>
      ) : mediaList.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#8c9bb0] rounded-2xl bg-[#0e131d] border border-[#1b2334]">
          Aucun fichier dans la médiathèque. Vous pouvez téléverser les photos réelles du studio ci-dessus.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaList.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-[#0e131d] border border-[#1b2334] overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-square relative overflow-hidden bg-[#141926]">
                <img
                  src={item.url}
                  alt={item.original_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-2.5 space-y-2 border-t border-[#171f2d]">
                <div className="text-[11px] text-white font-medium truncate" title={item.original_name}>
                  {item.original_name}
                </div>
                <div className="text-[10px] text-[#6f7e91]">
                  {(item.size / 1024).toFixed(0)} Ko
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleCopy(item)}
                    className="p-1.5 rounded-lg bg-[#141926] hover:bg-[#1b2233] text-[#8e9faf] hover:text-white text-[10px] flex items-center gap-1 transition-colors"
                    title="Copier l'URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-[#241416] hover:bg-[#331a1d] text-red-400 text-[10px] transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
