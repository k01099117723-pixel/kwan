import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Types
export interface Booking {
  id: number;
  full_name: string;
  city: string;
  phone: string;
  email?: string;
  package_id: string;
  package_name: string;
  preferred_date: string;
  preferred_time: string;
  participants: number;
  message?: string;
  status: 'New' | 'Contacted' | 'Confirmed' | 'Completed' | 'Cancelled';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface PackageTier {
  name: string;
  content: string;
  price: string;
}

export interface Package {
  id: string;
  name: string;
  badge?: string;
  price: string;
  duration: string;
  category?: 'podcast' | 'shooting' | 'content';
  description: string;
  image_url: string;
  cameras_count: number;
  audio_services: string;
  video_services: string;
  editing_services: string;
  additional_features: string[];
  supplement?: string;
  tiers?: PackageTier[];
  is_popular?: boolean;
  sort_order: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  seo_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string;
  is_published: boolean;
  reading_time?: string;
  views_count?: number;
  published_at?: string;
  created_at: string;
}

export interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size: number;
  alt_text?: string;
  section_tag?: string;
  created_at: string;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface Testimonial {
  id: number;
  author_name: string;
  role_company: string;
  quote: string;
  rating: number;
  avatar_url?: string;
  project_title?: string;
  is_featured: boolean;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

// Initial defaults - 6 packs matching official Kwan Studio flyers
const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'pack-podcast-brut',
    name: 'Podcast Tournage Brut',
    badge: 'Captation Brute',
    price: '600 DH / 1H',
    duration: '1 Heure',
    category: 'podcast',
    description: 'Tournage studio professionnel multi-caméras Sony avec micros broadcast, choix de décor et remise des rushes.',
    image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',
    cameras_count: 2,
    audio_services: '2 micros podcast broadcast haute clarté',
    video_services: 'Studio équipé (2 caméras Sony) avec accompagnement sur place',
    editing_services: 'Envoi des fichiers sous 3 jours ouvrés + sauvegarde 7 jours',
    additional_features: [
      'Studio équipé (2 caméras Sony, 2 micros podcast)',
      'Notre équipe vous accompagne sur place',
      'Choix du décor',
      'Adaptation des formats pour réseaux sociaux',
      'Envoi des fichiers sous 3 jours ouvrés',
      'Sauvegarde des fichiers pendant 7 jours'
    ],
    is_popular: false,
    sort_order: 1
  },
  {
    id: 'pack-podcast-montage',
    name: 'Podcast + Montage',
    badge: 'Le Plus Populaire',
    price: '1 000 DH / 1H',
    duration: '1 Heure + Montage',
    category: 'podcast',
    description: 'La formule clé en main : tournage multi-caméras, montage complet de votre épisode et teaser dynamique au début.',
    image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    cameras_count: 2,
    audio_services: '2 micros podcast haute fidélité avec monitoring direct',
    video_services: '2 caméras Sony + cadreur & régisseur dédié',
    editing_services: 'Montage complet de votre épisode + Teaser au début',
    additional_features: [
      'Studio équipé (2 caméras Sony, 2 micros podcast)',
      'Notre équipe vous accompagne sur place',
      'Choix du décor sur-mesure',
      'Adaptation des formats pour réseaux sociaux',
      'Montage de votre épisode',
      'Teaser au début de l’épisode',
      'Envoi des fichiers sous 3 jours ouvrés',
      'Sauvegarde des fichiers pendant 7 jours'
    ],
    supplement: 'Suppléments (200 DH) : Montage Live + Livraison sous 2h',
    is_popular: true,
    sort_order: 2
  },
  {
    id: 'pack-shooting-photo',
    name: 'Shooting Photo',
    badge: 'Studio Photo HD',
    price: '300 DH',
    duration: 'Session Studio Photo',
    category: 'shooting',
    description: 'Séance photo professionnelle en studio pour artistes, experts, créateurs de contenu ou profils corporate.',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    cameras_count: 2,
    audio_services: 'Ambiance lounge musicale sur place',
    video_services: 'Studio équipé (2 caméras Sony & lumières photo pro)',
    editing_services: '12 photos sélectionnées et retouchées en PNG haute qualité',
    additional_features: [
      'Nombre de photos (12 photos)',
      'Studio équipé (2 caméras Sony)',
      'Notre équipe vous accompagne sur place',
      'Haute qualité PNG non compressé',
      'Envoi des fichiers sous 3 jours ouvrés',
      'Sauvegarde des fichiers pendant 7 jours'
    ],
    is_popular: false,
    sort_order: 3
  },
  {
    id: 'pack-shooting-produit',
    name: 'Shooting Produit',
    badge: 'Packshot & E-commerce',
    price: '500 DH',
    duration: 'Session Produit',
    category: 'shooting',
    description: 'Mise en valeur esthétique de vos produits, packshots e-commerce et vitrines de marque avec décors adaptés.',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    cameras_count: 2,
    audio_services: 'Captation ambiance sonore',
    video_services: 'Studio équipé (2 caméras Sony) avec angles dédiés aux produits',
    editing_services: 'Adaptation et optimisation des formats pour réseaux sociaux',
    additional_features: [
      'Studio équipé (2 caméras Sony)',
      'Notre équipe vous accompagne sur place',
      'Choix du décor',
      'Adaptation des formats pour réseaux sociaux',
      'Envoi des fichiers sous 3 jours ouvrés',
      'Sauvegarde des fichiers pendant 7 jours'
    ],
    is_popular: false,
    sort_order: 4
  },
  {
    id: 'pack-shooting-produit-ugc',
    name: 'Shooting Produit UGC',
    badge: 'Vidéo UGC Tendance',
    price: '400 - 500 DH',
    duration: 'Session Vidéo Produit UGC',
    category: 'shooting',
    description: 'Captation vidéo authentique style UGC avec mise en scène réaliste, démonstration produit et montage vidéo inclus.',
    image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    cameras_count: 2,
    audio_services: 'Micros dédiés pour voix off et prise de son directe',
    video_services: 'Studio équipé (2 caméras Sony, micros) en décor lifestyle',
    editing_services: 'Montage complet de la vidéo UGC prêt pour les Reels / TikTok',
    additional_features: [
      'Studio équipé (2 caméras Sony, micros)',
      'Notre équipe vous accompagne sur place',
      'Choix du décor (cuisine, salon, bureau)',
      'Haute qualité de vidéo',
      'Montage de la vidéo inclus',
      'Envoi des fichiers sous 3 jours ouvrés',
      'Sauvegarde des fichiers pendant 7 jours'
    ],
    is_popular: true,
    sort_order: 5
  },
  {
    id: 'pack-creation-contenu',
    name: 'Création de Contenu',
    badge: 'Abonnements Reels Mensuels',
    price: '3 500 – 12 000 DH',
    duration: 'Abonnements Mensuels au Choix',
    category: 'content',
    description: 'Déléguez toute votre production de Reels : idées stratégiques, scripts, tournages en studio et montages complets chaque mois.',
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    cameras_count: 2,
    audio_services: 'Micros broadcast Shure SM7B avec préampli et monitoring',
    video_services: 'Plateau multi-caméras Sony avec régie de tournage',
    editing_services: 'Montages dynamiques avec sous-titres animés et habillage visuel',
    additional_features: [
      'Starter : 4 Reels/mois + idées + scripts + 1 tournage + montage (3 500 – 4 500 DH)',
      'Standard : 8 Reels/mois + idées + scripts + 1/2 journées de tournage + montage (6 000 – 8 000 DH)',
      'Premium : 12 Reels/mois + stratégie + scripts + tournage régulier + montage avancé (9 000 – 12 000 DH)',
      'Accompagnement créatif complet par l’équipe Kwan Studio',
      'Sauvegarde et archivage sécurisé de tous vos épisodes'
    ],
    tiers: [
      {
        name: 'Starter',
        content: '4 Reels/mois + idées + scripts + 1 tournage + montage',
        price: '3 500 – 4 500 DH'
      },
      {
        name: 'Standard',
        content: '8 Reels/mois + idées + scripts + 1/2 journées de tournage + montage',
        price: '6 000 – 8 000 DH'
      },
      {
        name: 'Premium',
        content: '12 Reels/mois + stratégie + scripts + tournage régulier + montage avancé',
        price: '9 000 – 12 000 DH'
      }
    ],
    is_popular: true,
    sort_order: 6
  }
];

const DEFAULT_SETTINGS: SiteSettings = {
  hero_title: 'Votre espace premium pour créer des podcasts qui marquent.',
  hero_subtitle: "Studio de tournage et d'enregistrement haute fidélité au cœur de Casablanca. Équipements broadcast 4K, acoustique d'exception et accompagnement de prestige.",
  hero_primary_cta: 'Réserver mon studio',
  hero_secondary_cta: 'Découvrir nos packs',
  contact_phone: '+212 6 61 00 00 00',
  contact_whatsapp: '+212661000000',
  contact_email: 'contact@kwanstudio.ma',
  contact_city: 'Casablanca, Maroc',
  contact_address: "Boulevard d'Anfa, Quartier Racine, Casablanca",
  contact_hours: 'Lundi - Samedi : 09h00 - 21h00 (Sur réservation)',
  social_instagram: 'https://instagram.com/kwanstudio.ma',
  social_youtube: 'https://youtube.com/@kwanstudioma',
  social_linkedin: 'https://linkedin.com/company/kwanstudio',
  seo_meta_title: 'Kwan Studio - Studio Podcast Premium Maroc | Casablanca',
  seo_meta_description: "Studio podcast haut de gamme à Casablanca. Location de studio d'enregistrement audio et vidéo 4K broadcast au Maroc. Réservez votre créneau en ligne.",
  seo_keywords: 'Studio podcast Maroc, Location studio podcast Maroc, Studio podcast Casablanca, Location podcast Casablanca, Podcast professionnel Maroc, Studio vidéo podcast'
};

const DEFAULT_FAQS: FAQ[] = [
  {
    id: 1,
    question: "Où se situe exactement Kwan Studio à Casablanca ?",
    answer: "Nous sommes idéalement situés sur le Boulevard d'Anfa dans le quartier Racine à Casablanca, avec des facilités de stationnement et un accès direct et sécurisé pour vous et vos invités.",
    category: "Location",
    sort_order: 1,
    is_active: true
  },
  {
    id: 2,
    question: "Faut-il apporter son propre matériel d'enregistrement ?",
    answer: "Non, absolument rien ! Le studio est 100% prêt à tourner (plug-and-play). Micros broadcast Shure SM7B, caméras cinéma Sony FX3 4K, éclairages Aputure doux et régie son sont déjà calibrés. Vous pouvez simplement venir avec vos idées ou une clé USB / disque dur si vous désirez emporter immédiatement vos rushes.",
    category: "Matériel",
    sort_order: 2,
    is_active: true
  },
  {
    id: 3,
    question: "Combien de personnes peuvent participer simultanément au podcast ?",
    answer: "Notre table acoustique sur-mesure peut accueillir confortablement jusqu'à 4 intervenants au micro simultanément, plus l'animateur et l'équipe d'assistance dans notre espace régie et lounge VIP.",
    category: "Capacité",
    sort_order: 3,
    is_active: true
  },
  {
    id: 4,
    question: "Comment se déroule la réservation et le paiement ?",
    answer: "Vous sélectionnez votre pack et formule en ligne ou via WhatsApp. Notre équipe vérifie les disponibilités et vous contacte sous 2 heures pour confirmer votre créneau. Le règlement s'effectue par virement, carte ou sur place lors de votre arrivée.",
    category: "Réservation",
    sort_order: 4,
    is_active: true
  },
  {
    id: 5,
    question: "Fournissez-vous également le montage et des extraits pour les réseaux sociaux (Reels/TikTok) ?",
    answer: "Oui ! Notre pack L'Élite Broadcast comprend le montage complet, l'étalonnage cinématique et la création de 3 formats courts verticaux sous-titrés prêts à publier. Cette option est également disponible à la carte pour les autres packs.",
    category: "Post-production",
    sort_order: 5,
    is_active: true
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    author_name: 'Mehdi Benjelloun',
    role_company: 'Créateur du podcast "Visionnaires"',
    quote: "Kwan Studio a totalement transformé la qualité perçue de nos interviews. Les invités sont immédiatement impressionnés par le cadre et l'acoustique feutrée. Le rendu 4K des caméras Sony est bluffant.",
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    project_title: 'Podcast Business & Tech',
    is_featured: true
  },
  {
    id: 2,
    author_name: 'Sara Alami',
    role_company: 'Directrice de Marque, Casablanca',
    quote: "Nous avons enregistré la saison 2 de notre podcast d'entreprise chez Kwan. L'équipe technique est d'un professionnalisme rare au Maroc : ponctualité, régie attentionnée et livraison des fichiers en 24h chrono.",
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    project_title: 'Série Audio Corporate',
    is_featured: true
  },
  {
    id: 3,
    author_name: 'Karim Tazi',
    role_company: 'Host, "Le Grand Entretien"',
    quote: "Après avoir testé plusieurs studios au Maroc, Kwan Studio est sans conteste le seul qui allie une vraie acoustique de niveau broadcast avec une esthétique cinématographique moderne.",
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    project_title: 'Talk-Show Hebdomadaire',
    is_featured: true
  }
];

const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'comment-reussir-son-podcast-au-maroc-en-2026',
    title: 'Comment réussir son podcast au Maroc en 2026 : Le Guide Complet',
    excerpt: "Du choix du concept à l'acoustique broadcast et la monétisation locale, découvrez les clés indispensables pour créer un podcast impactant au Maroc.",
    content: `<h2>L'essor fulgurant du podcast au Maroc</h2>
<p>Le paysage médiatique marocain vit une transformation majeure. Les auditeurs recherchent désormais des conversations profondes, authentiques et spécialisées dans l'entrepreneuriat, la culture, le sport et la société.</p>
<h3>1. Pourquoi la qualité audio et vidéo fait toute la différence</h3>
<p>Sur YouTube et Spotify Vidéo, les spectateurs quittent une vidéo dès les 15 premières secondes si le son grésille ou si l'image est sombre. Investir dans un studio broadcast équipé de caméras cinéma 4K et de micros Shure SM7B positionne immédiatement votre contenu au standard international.</p>
<h3>2. Structurer ses épisodes pour capter l'attention</h3>
<p>Un podcast réussi s'appuie sur une narration rythmée : une accroche percutante de 30 secondes, une présentation concise de l'invité et des questions ciblées qui incitent au partage.</p>
<h3>3. Maximiser la diffusion avec les formats courts</h3>
<p>Ne sous-estimez jamais la puissance de TikTok et des Instagram Reels. Chez Kwan Studio, nous découpons systématiquement les moments forts de chaque épisode pour alimenter vos réseaux et attirer des milliers de nouveaux auditeurs.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop',
    category: 'Stratégie & Production',
    tags: ['Podcast Maroc', 'Production', 'YouTube Maroc'],
    seo_title: 'Comment réussir son podcast au Maroc en 2026 | Guide Kwan Studio',
    meta_description: 'Guide complet pour lancer un podcast professionnel au Maroc : matériel, stratégie, tournage vidéo 4K et distribution.',
    canonical_url: 'https://kwanstudio.ma/blog/comment-reussir-son-podcast-au-maroc-en-2026',
    og_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop',
    is_published: true,
    reading_time: '6 min',
    views_count: 142,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    slug: 'choisir-entre-podcast-audio-et-video-le-guide',
    title: 'Podcast Audio ou Vidéo : Quelle formule choisir pour votre projet ?',
    excerpt: "Analyse comparative des formats audio natifs vs vidéo multi-caméras pour optimiser votre audience et vos conversions.",
    content: `<h2>Audio vs Vidéo : Deux dynamiques complémentaires</h2>
<p>Lors de la création d'un podcast chez Kwan Studio, l'une des premières questions de nos clients concerne le choix du format : faut-il démarrer en audio pur ou miser directement sur la vidéo 4K ?</p>
<h3>Les avantages du format Audio Pure (Pack L'Essentiel)</h3>
<p>Le podcast audio favorise une intimité inégalée. Vos auditeurs vous écoutent en voiture sur l'autoroute Rabat-Casablanca, en faisant du sport ou au bureau. La barrière psychologique face à la caméra disparaît, permettant des confessions plus libres.</p>
<h3>Pourquoi la vidéo est devenue incontournable</h3>
<p>Les algorithmes des plateformes actuelles privilégient la vidéo. Avoir 2 ou 3 angles de caméra vous permet non seulement de publier sur YouTube et Spotify Video, mais surtout de générer des clips verticaux viraux qui drainent votre audience principale.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
    category: 'Équipement & Format',
    tags: ['Vidéo 4K', 'Audio Broadcast', 'Spotify Video'],
    seo_title: 'Podcast Audio ou Vidéo : Quelle formule choisir ? | Kwan Studio',
    meta_description: 'Comparatif détaillé entre podcast audio pur et podcast vidéo multi-caméras 4K pour maximiser votre impact au Maroc.',
    canonical_url: 'https://kwanstudio.ma/blog/choisir-entre-podcast-audio-et-video-le-guide',
    og_image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
    is_published: true,
    reading_time: '5 min',
    views_count: 98,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 1,
    filename: 'kwan-studio-hero.jpg',
    original_name: 'kwan-studio-hero.jpg',
    url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    mime_type: 'image/jpeg',
    size: 245000,
    alt_text: 'Studio podcast Kwan Studio Casablanca avec caméras cinéma et éclairage doux',
    section_tag: 'hero',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    filename: 'shure-sm7b-mic.jpg',
    original_name: 'shure-sm7b-mic.jpg',
    url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop',
    mime_type: 'image/jpeg',
    size: 189000,
    alt_text: 'Micros Shure SM7B broadcast avec panneau acoustique bois',
    section_tag: 'studio',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    filename: 'sound-mixing-desk.jpg',
    original_name: 'sound-mixing-desk.jpg',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    mime_type: 'image/jpeg',
    size: 310000,
    alt_text: 'Régie audio et console de mixage professionnelle',
    section_tag: 'equipment',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    filename: 'sony-fx3-camera.jpg',
    original_name: 'sony-fx3-camera.jpg',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
    mime_type: 'image/jpeg',
    size: 275000,
    alt_text: 'Caméra Sony FX3 4K sur trépied fluide de tournage podcast',
    section_tag: 'studio',
    created_at: new Date().toISOString()
  }
];

// Initial sample bookings
const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 1,
    full_name: 'Youssef El Mansouri',
    city: 'Casablanca',
    phone: '+212661234567',
    email: 'youssef.m@gmail.com',
    package_id: 'pack-video',
    package_name: 'Le Visio Standard',
    preferred_date: '2026-09-22',
    preferred_time: '14:00 - 17:00',
    participants: 2,
    message: 'Tournage du premier épisode de notre série sur l’immobilier d’investissement à Casablanca.',
    status: 'New',
    admin_notes: 'Premier contact reçu via le site web. Client intéressé par un créneau après-midi.',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 2,
    full_name: 'Sofia Chraibi',
    city: 'Rabat',
    phone: '+212672345678',
    email: 'sofia.c@agence-crea.ma',
    package_id: 'pack-elite',
    package_name: "L'Élite Broadcast",
    preferred_date: '2026-09-26',
    preferred_time: '09:30 - 13:00',
    participants: 3,
    message: 'Podcast de marque pour un grand groupe bancaire. Besoin de 3 formats courts verticaux pour LinkedIn.',
    status: 'Contacted',
    admin_notes: 'Appelée par WhatsApp. Devis validé, en attente de versement d’acompte.',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    id: 3,
    full_name: 'Amine Guessous',
    city: 'Casablanca',
    phone: '+212661987654',
    email: 'guessous.amine@tech-talk.com',
    package_id: 'pack-audio',
    package_name: "L'Essentiel Audio",
    preferred_date: '2026-09-18',
    preferred_time: '18:00 - 20:00',
    participants: 2,
    message: 'Enregistrement voice-over et interview audio pour un podcast tech.',
    status: 'Confirmed',
    admin_notes: 'Créneau confirmé pour vendredi soir. Régie calée.',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

// Local JSON store configuration
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'kwan_studio_db.json');

interface LocalStoreData {
  admins: { id: number; username: string; email: string; password_hash: string; role: string }[];
  packages: Package[];
  bookings: Booking[];
  blog_posts: BlogPost[];
  media: MediaItem[];
  site_settings: SiteSettings;
  testimonials: Testimonial[];
  faqs: FAQ[];
}

function ensureLocalStore(): LocalStoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading local JSON store, recreating with defaults', e);
    }
  }

  // Hash default password
  const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AdminPassword2026!';
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(defaultPassword, salt);

  const initialData: LocalStoreData = {
    admins: [
      {
        id: 1,
        username: 'admin',
        email: process.env.ADMIN_INITIAL_EMAIL || 'admin@kwanstudio.ma',
        password_hash: passwordHash,
        role: 'admin'
      }
    ],
    packages: DEFAULT_PACKAGES,
    bookings: DEFAULT_BOOKINGS,
    blog_posts: DEFAULT_BLOG_POSTS,
    media: DEFAULT_MEDIA,
    site_settings: DEFAULT_SETTINGS,
    testimonials: DEFAULT_TESTIMONIALS,
    faqs: DEFAULT_FAQS
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

function saveLocalStore(data: LocalStoreData) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// MySQL connection pool if configured
let mysqlPool: mysql.Pool | null = null;

if (process.env.DB_HOST && process.env.DB_USER) {
  try {
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kwan_studio_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log(`[DB] MySQL pool initialized targeting ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
  } catch (err) {
    console.error('[DB] Failed to create MySQL pool, using local resilient store', err);
    mysqlPool = null;
  }
} else {
  console.log('[DB] No MySQL environment variables provided, using local resilient file-backed store.');
}

// Unified Database Access API
export const db = {
  // BOOKINGS
  async getBookings(): Promise<Booking[]> {
    if (mysqlPool) {
      try {
        const [rows] = await mysqlPool.query('SELECT * FROM booking_requests ORDER BY created_at DESC');
        return rows as Booking[];
      } catch (err) {
        console.error('[DB] MySQL getBookings error, falling back to local store', err);
      }
    }
    const store = ensureLocalStore();
    return store.bookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createBooking(data: Omit<Booking, 'id' | 'created_at' | 'status'>): Promise<Booking> {
    if (mysqlPool) {
      try {
        const [result] = await mysqlPool.execute<mysql.ResultSetHeader>(
          `INSERT INTO booking_requests (full_name, city, phone, email, package_id, package_name, preferred_date, preferred_time, participants, message, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')`,
          [
            data.full_name,
            data.city,
            data.phone,
            data.email || null,
            data.package_id,
            data.package_name,
            data.preferred_date,
            data.preferred_time,
            data.participants || 2,
            data.message || null
          ]
        );
        const [rows] = await mysqlPool.query('SELECT * FROM booking_requests WHERE id = ?', [result.insertId]);
        const created = (rows as Booking[])[0];
        if (created) return created;
      } catch (err) {
        console.error('[DB] MySQL createBooking error, falling back to local store', err);
      }
    }
    const store = ensureLocalStore();
    const newId = store.bookings.length > 0 ? Math.max(...store.bookings.map(b => b.id)) + 1 : 1;
    const newBooking: Booking = {
      ...data,
      id: newId,
      status: 'New',
      created_at: new Date().toISOString()
    };
    store.bookings.unshift(newBooking);
    saveLocalStore(store);
    return newBooking;
  },

  async updateBookingStatus(id: number, status: Booking['status'], admin_notes?: string): Promise<Booking | null> {
    if (mysqlPool) {
      try {
        await mysqlPool.execute(
          'UPDATE booking_requests SET status = ?, admin_notes = COALESCE(?, admin_notes) WHERE id = ?',
          [status, admin_notes || null, id]
        );
        const [rows] = await mysqlPool.query('SELECT * FROM booking_requests WHERE id = ?', [id]);
        return ((rows as Booking[])[0]) || null;
      } catch (err) {
        console.error('[DB] MySQL updateBookingStatus error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    const booking = store.bookings.find(b => b.id === id);
    if (!booking) return null;
    booking.status = status;
    if (admin_notes !== undefined) booking.admin_notes = admin_notes;
    booking.updated_at = new Date().toISOString();
    saveLocalStore(store);
    return booking;
  },

  async deleteBooking(id: number): Promise<boolean> {
    if (mysqlPool) {
      try {
        const [result] = await mysqlPool.execute<mysql.ResultSetHeader>('DELETE FROM booking_requests WHERE id = ?', [id]);
        return result.affectedRows > 0;
      } catch (err) {
        console.error('[DB] MySQL deleteBooking error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    const initialLen = store.bookings.length;
    store.bookings = store.bookings.filter(b => b.id !== id);
    if (store.bookings.length !== initialLen) {
      saveLocalStore(store);
      return true;
    }
    return false;
  },

  // PACKAGES
  async getPackages(): Promise<Package[]> {
    if (mysqlPool) {
      try {
        const [rows] = await mysqlPool.query('SELECT * FROM packages ORDER BY sort_order ASC');
        const list = rows as any[];
        return list.map(p => ({
          ...p,
          additional_features: typeof p.additional_features === 'string' ? JSON.parse(p.additional_features) : p.additional_features
        }));
      } catch (err) {
        console.error('[DB] MySQL getPackages error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    return store.packages.sort((a, b) => a.sort_order - b.sort_order);
  },

  async updatePackage(id: string, data: Partial<Package>): Promise<Package | null> {
    if (mysqlPool) {
      try {
        const featuresJson = data.additional_features ? JSON.stringify(data.additional_features) : undefined;
        await mysqlPool.execute(
          `UPDATE packages SET 
             name = COALESCE(?, name),
             badge = COALESCE(?, badge),
             price = COALESCE(?, price),
             duration = COALESCE(?, duration),
             description = COALESCE(?, description),
             image_url = COALESCE(?, image_url),
             cameras_count = COALESCE(?, cameras_count),
             audio_services = COALESCE(?, audio_services),
             video_services = COALESCE(?, video_services),
             editing_services = COALESCE(?, editing_services),
             additional_features = COALESCE(?, additional_features),
             is_popular = COALESCE(?, is_popular)
           WHERE id = ?`,
          [
            data.name || null,
            data.badge || null,
            data.price || null,
            data.duration || null,
            data.description || null,
            data.image_url || null,
            data.cameras_count !== undefined ? data.cameras_count : null,
            data.audio_services || null,
            data.video_services || null,
            data.editing_services || null,
            featuresJson || null,
            data.is_popular !== undefined ? data.is_popular : null,
            id
          ]
        );
        const [rows] = await mysqlPool.query('SELECT * FROM packages WHERE id = ?', [id]);
        const p = (rows as any[])[0];
        if (p) {
          return {
            ...p,
            additional_features: typeof p.additional_features === 'string' ? JSON.parse(p.additional_features) : p.additional_features
          };
        }
      } catch (err) {
        console.error('[DB] MySQL updatePackage error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    const pkgIndex = store.packages.findIndex(p => p.id === id);
    if (pkgIndex === -1) return null;
    store.packages[pkgIndex] = { ...store.packages[pkgIndex], ...data };
    saveLocalStore(store);
    return store.packages[pkgIndex];
  },

  // BLOG POSTS
  async getBlogPosts(onlyPublished = true): Promise<BlogPost[]> {
    if (mysqlPool) {
      try {
        const query = onlyPublished
          ? 'SELECT * FROM blog_posts WHERE is_published = TRUE ORDER BY published_at DESC'
          : 'SELECT * FROM blog_posts ORDER BY created_at DESC';
        const [rows] = await mysqlPool.query(query);
        const list = rows as any[];
        return list.map(b => ({
          ...b,
          tags: typeof b.tags === 'string' ? JSON.parse(b.tags) : b.tags
        }));
      } catch (err) {
        console.error('[DB] MySQL getBlogPosts error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    let posts = [...store.blog_posts];
    if (onlyPublished) {
      posts = posts.filter(p => p.is_published);
    }
    return posts.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    if (mysqlPool) {
      try {
        const [rows] = await mysqlPool.query('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
        const p = (rows as any[])[0];
        if (p) {
          // Increment views
          mysqlPool.execute('UPDATE blog_posts SET views_count = views_count + 1 WHERE id = ?', [p.id]).catch(() => {});
          return {
            ...p,
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags
          };
        }
      } catch (err) {
        console.error('[DB] MySQL getBlogPostBySlug error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    const post = store.blog_posts.find(p => p.slug === slug);
    if (post) {
      post.views_count = (post.views_count || 0) + 1;
      saveLocalStore(store);
      return post;
    }
    return null;
  },

  async createBlogPost(data: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost> {
    if (mysqlPool) {
      try {
        const tagsJson = JSON.stringify(data.tags || []);
        const [result] = await mysqlPool.execute<mysql.ResultSetHeader>(
          `INSERT INTO blog_posts (slug, title, excerpt, content, featured_image, category, tags, seo_title, meta_description, canonical_url, og_image, is_published, reading_time)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.slug,
            data.title,
            data.excerpt,
            data.content,
            data.featured_image,
            data.category,
            tagsJson,
            data.seo_title || null,
            data.meta_description || null,
            data.canonical_url || null,
            data.og_image || null,
            data.is_published,
            data.reading_time || '5 min'
          ]
        );
        const [rows] = await mysqlPool.query('SELECT * FROM blog_posts WHERE id = ?', [result.insertId]);
        const p = (rows as any[])[0];
        if (p) {
          return {
            ...p,
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags
          };
        }
      } catch (err) {
        console.error('[DB] MySQL createBlogPost error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    const newId = store.blog_posts.length > 0 ? Math.max(...store.blog_posts.map(b => b.id)) + 1 : 1;
    const newPost: BlogPost = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
      views_count: 0
    };
    store.blog_posts.unshift(newPost);
    saveLocalStore(store);
    return newPost;
  },

  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost | null> {
    if (mysqlPool) {
      try {
        const tagsJson = data.tags ? JSON.stringify(data.tags) : undefined;
        await mysqlPool.execute(
          `UPDATE blog_posts SET
             slug = COALESCE(?, slug),
             title = COALESCE(?, title),
             excerpt = COALESCE(?, excerpt),
             content = COALESCE(?, content),
             featured_image = COALESCE(?, featured_image),
             category = COALESCE(?, category),
             tags = COALESCE(?, tags),
             seo_title = COALESCE(?, seo_title),
             meta_description = COALESCE(?, meta_description),
             canonical_url = COALESCE(?, canonical_url),
             og_image = COALESCE(?, og_image),
             is_published = COALESCE(?, is_published),
             reading_time = COALESCE(?, reading_time)
           WHERE id = ?`,
          [
            data.slug || null,
            data.title || null,
            data.excerpt || null,
            data.content || null,
            data.featured_image || null,
            data.category || null,
            tagsJson || null,
            data.seo_title || null,
            data.meta_description || null,
            data.canonical_url || null,
            data.og_image || null,
            data.is_published !== undefined ? data.is_published : null,
            data.reading_time || null,
            id
          ]
        );
        const [rows] = await mysqlPool.query('SELECT * FROM blog_posts WHERE id = ?', [id]);
        const p = (rows as any[])[0];
        if (p) {
          return {
            ...p,
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags
          };
        }
      } catch (err) {
        console.error('[DB] MySQL updateBlogPost error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    const index = store.blog_posts.findIndex(b => b.id === id);
    if (index === -1) return null;
    store.blog_posts[index] = { ...store.blog_posts[index], ...data };
    saveLocalStore(store);
    return store.blog_posts[index];
  },

  async deleteBlogPost(id: number): Promise<boolean> {
    if (mysqlPool) {
      try {
        const [res] = await mysqlPool.execute<mysql.ResultSetHeader>('DELETE FROM blog_posts WHERE id = ?', [id]);
        return res.affectedRows > 0;
      } catch (err) {
        console.error('[DB] MySQL deleteBlogPost error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    const initialLen = store.blog_posts.length;
    store.blog_posts = store.blog_posts.filter(b => b.id !== id);
    if (store.blog_posts.length !== initialLen) {
      saveLocalStore(store);
      return true;
    }
    return false;
  },

  // SITE SETTINGS
  async getSiteSettings(): Promise<SiteSettings> {
    if (mysqlPool) {
      try {
        const [rows] = await mysqlPool.query('SELECT setting_key, setting_value FROM site_settings');
        const settings: SiteSettings = {};
        for (const row of rows as any[]) {
          settings[row.setting_key] = row.setting_value;
        }
        return { ...DEFAULT_SETTINGS, ...settings };
      } catch (err) {
        console.error('[DB] MySQL getSiteSettings error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    return { ...DEFAULT_SETTINGS, ...store.site_settings };
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    if (mysqlPool) {
      try {
        for (const [key, val] of Object.entries(settings)) {
          await mysqlPool.execute(
            'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            [key, val, val]
          );
        }
      } catch (err) {
        console.error('[DB] MySQL updateSiteSettings error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    store.site_settings = { ...store.site_settings, ...settings };
    saveLocalStore(store);
    return { ...DEFAULT_SETTINGS, ...store.site_settings };
  },

  // MEDIA
  async getMedia(): Promise<MediaItem[]> {
    if (mysqlPool) {
      try {
        const [rows] = await mysqlPool.query('SELECT * FROM media ORDER BY created_at DESC');
        return rows as MediaItem[];
      } catch (err) {
        console.error('[DB] MySQL getMedia error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    return store.media;
  },

  async createMedia(data: Omit<MediaItem, 'id' | 'created_at'>): Promise<MediaItem> {
    if (mysqlPool) {
      try {
        const [result] = await mysqlPool.execute<mysql.ResultSetHeader>(
          'INSERT INTO media (filename, original_name, url, mime_type, size, alt_text, section_tag) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [data.filename, data.original_name, data.url, data.mime_type, data.size, data.alt_text || null, data.section_tag || 'general']
        );
        const [rows] = await mysqlPool.query('SELECT * FROM media WHERE id = ?', [result.insertId]);
        return (rows as MediaItem[])[0];
      } catch (err) {
        console.error('[DB] MySQL createMedia error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    const newId = store.media.length > 0 ? Math.max(...store.media.map(m => m.id)) + 1 : 1;
    const item: MediaItem = {
      ...data,
      id: newId,
      created_at: new Date().toISOString()
    };
    store.media.unshift(item);
    saveLocalStore(store);
    return item;
  },

  async deleteMedia(id: number): Promise<boolean> {
    if (mysqlPool) {
      try {
        const [res] = await mysqlPool.execute<mysql.ResultSetHeader>('DELETE FROM media WHERE id = ?', [id]);
        return res.affectedRows > 0;
      } catch (err) {
        console.error('[DB] MySQL deleteMedia error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    const initialLen = store.media.length;
    store.media = store.media.filter(m => m.id !== id);
    if (store.media.length !== initialLen) {
      saveLocalStore(store);
      return true;
    }
    return false;
  },

  // TESTIMONIALS
  async getTestimonials(): Promise<Testimonial[]> {
    if (mysqlPool) {
      try {
        const [rows] = await mysqlPool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
        return rows as Testimonial[];
      } catch (err) {
        console.error('[DB] MySQL getTestimonials error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    return store.testimonials;
  },

  async createTestimonial(data: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    const store = ensureLocalStore();
    const newId = store.testimonials.length > 0 ? Math.max(...store.testimonials.map(t => t.id)) + 1 : 1;
    const newT: Testimonial = { ...data, id: newId };
    store.testimonials.push(newT);
    saveLocalStore(store);
    return newT;
  },

  async deleteTestimonial(id: number): Promise<boolean> {
    const store = ensureLocalStore();
    const len = store.testimonials.length;
    store.testimonials = store.testimonials.filter(t => t.id !== id);
    if (store.testimonials.length !== len) {
      saveLocalStore(store);
      return true;
    }
    return false;
  },

  // FAQS
  async getFaqs(): Promise<FAQ[]> {
    if (mysqlPool) {
      try {
        const [rows] = await mysqlPool.query('SELECT * FROM faqs WHERE is_active = TRUE ORDER BY sort_order ASC');
        return rows as FAQ[];
      } catch (err) {
        console.error('[DB] MySQL getFaqs error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    return store.faqs.filter(f => f.is_active).sort((a, b) => a.sort_order - b.sort_order);
  },

  async createFaq(data: Omit<FAQ, 'id'>): Promise<FAQ> {
    const store = ensureLocalStore();
    const newId = store.faqs.length > 0 ? Math.max(...store.faqs.map(f => f.id)) + 1 : 1;
    const newF: FAQ = { ...data, id: newId };
    store.faqs.push(newF);
    saveLocalStore(store);
    return newF;
  },

  async updateFaq(id: number, data: Partial<FAQ>): Promise<FAQ | null> {
    const store = ensureLocalStore();
    const idx = store.faqs.findIndex(f => f.id === id);
    if (idx === -1) return null;
    store.faqs[idx] = { ...store.faqs[idx], ...data };
    saveLocalStore(store);
    return store.faqs[idx];
  },

  async deleteFaq(id: number): Promise<boolean> {
    const store = ensureLocalStore();
    const len = store.faqs.length;
    store.faqs = store.faqs.filter(f => f.id !== id);
    if (store.faqs.length !== len) {
      saveLocalStore(store);
      return true;
    }
    return false;
  },

  // ADMIN AUTH
  async getAdminByEmail(email: string) {
    if (mysqlPool) {
      try {
        const [rows] = await mysqlPool.query('SELECT * FROM admins WHERE email = ?', [email]);
        return (rows as any[])[0] || null;
      } catch (err) {
        console.error('[DB] MySQL getAdminByEmail error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    return store.admins.find(a => a.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async updateAdminPassword(email: string, newPasswordHash: string) {
    if (mysqlPool) {
      try {
        await mysqlPool.execute('UPDATE admins SET password_hash = ? WHERE email = ?', [newPasswordHash, email]);
      } catch (err) {
        console.error('[DB] MySQL updateAdminPassword error, falling back', err);
      }
    }
    const store = ensureLocalStore();
    const admin = store.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (admin) {
      admin.password_hash = newPasswordHash;
      saveLocalStore(store);
      return true;
    }
    return false;
  }
};
