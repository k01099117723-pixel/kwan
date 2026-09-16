import React, { useState } from 'react';
import { BlogPost } from '../types.js';
import { Calendar, Clock, ArrowRight, Sparkles, Search, Tag } from 'lucide-react';

interface BlogListingProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onOpenBooking: () => void;
}

export const BlogListing: React.FC<BlogListingProps> = ({ posts, onSelectPost, onOpenBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Tous', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filteredPosts = posts.filter(p => {
    const matchesCat = selectedCategory === 'Tous' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#07090e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121622] border border-[#d4af37]/30 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Kwan Studio Editorial</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            Conseils, Matériel & Stratégies Podcast.
          </h1>
          <p className="text-[#9bb0c7] text-base sm:text-lg leading-relaxed font-light">
            Découvrez nos guides de production, comparatifs d'équipements et méthodologies pour lancer et professionnaliser votre podcast au Maroc.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d1119] border border-[#1b2333]">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37] text-[#07080c] shadow-md shadow-[#d4af37]/20 font-bold'
                    : 'bg-[#141926] text-[#8e9faf] hover:text-white hover:bg-[#1a2233]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#758499] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#111622] border border-[#212b3e] text-white text-xs focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl bg-[#0d1119] border border-[#1a2233]">
            <p className="text-base text-[#8e9faf]">Aucun article ne correspond à votre recherche.</p>
            <button
              onClick={() => {
                setSelectedCategory('Tous');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-[#141926] text-[#d4af37] text-xs font-semibold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group rounded-3xl overflow-hidden bg-[#0c1017] border border-[#1c2435] hover:border-[#d4af37]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#121622]">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-semibold text-[#f3e5ab] border border-[#d4af37]/30">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-[#7e8eab]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{post.reading_time || '5 min'}</span>
                      </span>
                      <span>•</span>
                      <span>{post.published_at?.split('T')[0] || '2026'}</span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-[#f3e5ab] transition-colors leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#8c9bb0] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#161d2b]/80 mt-4 flex items-center justify-between text-xs font-bold text-[#d4af37]">
                  <span>Lire l'article complet</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#141a26] via-[#0d121c] to-[#141a26] border border-[#d4af37]/30 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
            Passez de la théorie à la pratique dans notre studio.
          </h2>
          <p className="text-sm sm:text-base text-[#9ab0c8] max-w-xl mx-auto">
            Nos ingénieurs son et nos caméras 4K Sony FX3 vous attendent à Casablanca pour enregistrer votre émission dans les meilleures conditions.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] font-bold text-sm shadow-xl shadow-[#d4af37]/25 hover:scale-105 transition-all"
            >
              Réserver une session de tournage
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
