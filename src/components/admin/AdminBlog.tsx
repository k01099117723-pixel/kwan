import React, { useState } from 'react';
import { BlogPost } from '../../types.js';
import { api } from '../../services/api.js';
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, Eye, EyeOff, Save, X } from 'lucide-react';

interface AdminBlogProps {
  posts: BlogPost[];
  onRefresh: () => void;
}

export const AdminBlog: React.FC<AdminBlogProps> = ({ posts, onRefresh }) => {
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingPost({
      title: '',
      slug: '',
      category: 'Conseils Production',
      excerpt: '',
      content: '',
      featured_image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
      tags: ['podcast', 'casablanca', 'kwanstudio'],
      seo_title: '',
      meta_description: '',
      is_published: true,
      reading_time: '4 min'
    });
  };

  const handleStartEdit = (post: BlogPost) => {
    setIsCreating(false);
    setEditingPost({ ...post });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer définitivement cet article ?')) return;
    try {
      await api.deleteBlogPost(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editingPost.title) return;
    setLoading(true);
    setMsg(null);

    // Auto-generate slug if empty
    const slug = editingPost.slug || editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      if (isCreating) {
        await api.createBlogPost({
          ...editingPost,
          slug
        });
        setMsg({ type: 'success', text: 'Nouvel article créé avec succès !' });
      } else if (editingPost.id) {
        await api.updateBlogPost(editingPost.id, {
          ...editingPost,
          slug
        });
        setMsg({ type: 'success', text: 'Article mis à jour avec succès !' });
      }
      onRefresh();
      setEditingPost(null);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Erreur sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Gestion du Blog & Rédaction SEO
          </h2>
          <p className="text-xs text-[#8c9bb0] mt-1">
            Rédigez et publiez des articles pour attirer les créateurs de podcasts et optimiser le référencement Google.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] font-bold text-xs shadow-md shadow-[#d4af37]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel Article</span>
        </button>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl flex items-center gap-2 text-xs ${
          msg.type === 'success' ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-200' : 'bg-red-950/40 border border-red-500/40 text-red-200'
        }`}>
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Posts Table */}
      <div className="rounded-2xl bg-[#0e131d] border border-[#1e273a] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#121824] border-b border-[#1c2435] text-[#8292a8]">
              <th className="py-3.5 px-4 font-semibold">Titre & Slug</th>
              <th className="py-3.5 px-4 font-semibold">Catégorie</th>
              <th className="py-3.5 px-4 font-semibold">Statut</th>
              <th className="py-3.5 px-4 font-semibold">Date</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#171f2d]">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-[#121824]/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-white max-w-md truncate">{post.title}</div>
                  <div className="text-[11px] text-[#718196]">/blog/{post.slug}</div>
                </td>
                <td className="py-3 px-4 text-[#9fb0c4]">{post.category}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    post.is_published
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    {post.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#79899d]">
                  {post.published_at?.split('T')[0] || post.created_at?.split('T')[0]}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleStartEdit(post)}
                      className="p-1.5 rounded-lg bg-[#141926] hover:bg-[#1c2436] text-[#8ea0b7] hover:text-white border border-[#242e42] transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded-lg bg-[#241416] hover:bg-[#331a1d] text-red-400 border border-red-500/20 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-[#0d121c] border border-[#222c40] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1c2435] pb-4">
              <h3 className="text-xl font-bold font-display text-white">
                {isCreating ? 'Rédiger un nouvel article' : 'Modifier l’article'}
              </h3>
              <button
                onClick={() => setEditingPost(null)}
                className="p-2 rounded-xl bg-[#141926] text-[#8394a8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Titre de l’article *</label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Slug URL (laisser vide pour auto)</label>
                  <input
                    type="text"
                    value={editingPost.slug || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Catégorie</label>
                  <select
                    value={editingPost.category || 'Conseils Production'}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  >
                    <option value="Conseils Production">Conseils Production</option>
                    <option value="Matériel & Technique">Matériel & Technique</option>
                    <option value="Stratégie & Visibilité">Stratégie & Visibilité</option>
                    <option value="Actualités Studio">Actualités Studio</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#a8b8cd] font-medium">Temps de lecture estimé</label>
                  <input
                    type="text"
                    value={editingPost.reading_time || '5 min'}
                    onChange={(e) => setEditingPost({ ...editingPost, reading_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#a8b8cd] font-medium">Image à la une (URL)</label>
                <input
                  type="text"
                  required
                  value={editingPost.featured_image || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, featured_image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#a8b8cd] font-medium">Extrait / Résumé (Excerpt)</label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#a8b8cd] font-medium">Contenu de l'article (Markdown / HTML supporté)</label>
                <textarea
                  rows={8}
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#121724] border border-[#20293d] text-white font-mono"
                />
              </div>

              {/* SEO parameters */}
              <div className="p-4 rounded-xl bg-[#111520] border border-[#1b2334] space-y-3">
                <div className="text-xs font-bold text-[#d4af37]">Paramètres SEO Google</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#8e9faf]">Titre SEO</label>
                    <input
                      type="text"
                      placeholder="Balise <title>"
                      value={editingPost.seo_title || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, seo_title: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141926] border border-[#20293d] text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#8e9faf]">Meta Description</label>
                    <input
                      type="text"
                      placeholder="150 - 160 caractères"
                      value={editingPost.meta_description || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, meta_description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141926] border border-[#20293d] text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Publication toggle */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-[#cad6e6]">
                  <input
                    type="checkbox"
                    checked={editingPost.is_published ?? true}
                    onChange={(e) => setEditingPost({ ...editingPost, is_published: e.target.checked })}
                    className="rounded border-[#263147] text-[#d4af37] focus:ring-0"
                  />
                  <span>Publier immédiatement sur le site</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#151b27] text-[#8e9faf] hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] font-bold shadow-md"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer l’article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
