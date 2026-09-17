import React, { useState } from 'react';
import { Package } from '../../types.js';
import { api } from '../../services/api.js';
import { Edit2, Save, CheckCircle, AlertCircle, Camera, Mic, Film } from 'lucide-react';

interface AdminPackagesProps {
  packages: Package[];
  onRefresh: () => void;
}

export const AdminPackages: React.FC<AdminPackagesProps> = ({ packages, onRefresh }) => {
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleEdit = (pkg: Package) => {
    setEditingPkg({ ...pkg });
    setMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    setLoading(true);
    setMsg(null);

    try {
      await api.updatePackage(editingPkg.id, editingPkg);
      setMsg({ type: 'success', text: 'Pack mis à jour avec succès !' });
      onRefresh();
      setEditingPkg(null);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Erreur lors de la mise à jour' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">
          Configuration des Formules & Tarifs
        </h2>
        <p className="text-xs text-[#8c9bb0] mt-1">
          Modifiez les prix, les options techniques et les descriptions des formules de tournage, shootings et création.
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

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="p-6 rounded-2xl bg-[#0e131d] border border-[#1d2638] flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#121724]">
                <img
                  src={pkg.image_url}
                  alt={pkg.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {pkg.badge && (
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-[#d4af37] border border-[#d4af37]/30">
                    {pkg.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                <div className="text-base font-extrabold text-[#f3e5ab] mt-1">{pkg.price}</div>
                <div className="text-xs text-[#7e8eab]">{pkg.duration}</div>
              </div>

              <p className="text-xs text-[#95a6bc] leading-relaxed">
                {pkg.description}
              </p>

              <div className="text-xs text-[#8293aa] space-y-1 pt-2 border-t border-[#1a2334]">
                <div>• Caméras : <span className="text-white font-medium">{pkg.cameras_count}</span></div>
                <div>• Audio : <span className="text-white font-medium">{pkg.audio_services}</span></div>
                <div>• Montage : <span className="text-white font-medium">{pkg.editing_services}</span></div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => handleEdit(pkg)}
                className="w-full py-2.5 rounded-xl bg-[#151c2a] hover:bg-[#1f283b] text-white text-xs font-semibold border border-[#253147] transition-colors flex items-center justify-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Modifier cette formule</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#0d121c] border border-[#222c40] rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold font-display text-white">
              Modifier la formule : {editingPkg.name}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Nom de la formule</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.name}
                    onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Badge (ex: Populaire, Clé en main)</label>
                  <input
                    type="text"
                    value={editingPkg.badge || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Tarif affiché</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.price}
                    onChange={(e) => setEditingPkg({ ...editingPkg, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Durée incluse</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.duration}
                    onChange={(e) => setEditingPkg({ ...editingPkg, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#a8b8cd] font-medium">URL de l'image</label>
                <input
                  type="text"
                  required
                  value={editingPkg.image_url}
                  onChange={(e) => setEditingPkg({ ...editingPkg, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#a8b8cd] font-medium">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingPkg.description}
                  onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Nombre de caméras 4K</label>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={editingPkg.cameras_count}
                    onChange={(e) => setEditingPkg({ ...editingPkg, cameras_count: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Service Audio</label>
                  <input
                    type="text"
                    value={editingPkg.audio_services}
                    onChange={(e) => setEditingPkg({ ...editingPkg, audio_services: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Service Montage</label>
                  <input
                    type="text"
                    value={editingPkg.editing_services}
                    onChange={(e) => setEditingPkg({ ...editingPkg, editing_services: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#151b27] text-[#8e9faf] hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] font-bold shadow-md"
                >
                  {loading ? 'Sauvegarde...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
