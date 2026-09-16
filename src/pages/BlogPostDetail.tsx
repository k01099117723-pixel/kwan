import React from 'react';
import { BlogPost } from '../types.js';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Sparkles, MessageSquare, Check } from 'lucide-react';

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
  onOpenBooking: () => void;
  whatsappNumber?: string;
}

export const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
  post,
  onBack,
  onOpenBooking,
  whatsappNumber = '212661000000'
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <article className="pt-28 pb-24 min-h-screen bg-[#07090e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111622] hover:bg-[#182030] text-[#93a2b7] hover:text-white border border-[#20293d] transition-colors text-xs font-semibold mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux articles</span>
        </button>

        {/* Category & Meta */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-[#141a27] border border-[#d4af37]/40 text-xs font-bold text-[#f3e5ab] uppercase tracking-wider">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#7e8f05] text-[#8393a8]">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{post.reading_time || '5 min de lecture'}</span>
            </div>
            <span className="text-[#3c4a60]">•</span>
            <div className="flex items-center gap-1.5 text-xs text-[#8393a8]">
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{post.published_at?.split('T')[0] || '2026'}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[#a2b2c7] font-light leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] mb-12 border border-[#1e273b] shadow-2xl bg-[#0f131d]">
          <img
            src={post.featured_image}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-95"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-[#b4c3d6] prose-p:leading-relaxed prose-p:text-base prose-strong:text-[#f3e5ab] prose-li:text-[#b4c3d6] prose-a:text-[#d4af37] space-y-6">
          {post.content ? (
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />
          ) : (
            <p>Contenu en cours de rédaction...</p>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#182132] flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#738297] font-medium mr-2">Mots-clés :</span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-[#111622] text-[#8e9faf] text-xs border border-[#1e273a]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share & WhatsApp Action Bar */}
        <div className="mt-8 p-6 rounded-2xl bg-[#0d121b] border border-[#1c2435] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-[#141a27] hover:bg-[#1a2233] text-white text-xs font-semibold border border-[#232c40] flex items-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Lien copié !' : 'Partager l’article'}</span>
            </button>

            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Bonjour%20Kwan%20Studio%2C%20j'ai%20lu%20votre%20article%20sur%20${encodeURIComponent(post.title)}%20et%20je%20souhaite%20en%20savoir%20plus.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#141a27] hover:bg-[#1a2233] text-[#25D366] text-xs font-semibold border border-[#232c40] flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Commenter sur WhatsApp</span>
            </a>
          </div>

          <button
            onClick={onOpenBooking}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] text-xs font-bold shadow-md shadow-[#d4af37]/20 hover:scale-105 transition-all"
          >
            Réserver mon tournage
          </button>
        </div>

      </div>
    </article>
  );
};
