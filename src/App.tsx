import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { api } from './services/api.js';
import { Package, BlogPost, SiteSettings, Testimonial, FAQ } from './types.js';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { StudioSection } from './components/StudioSection.js';
import { InteractiveHotspotStudio } from './components/InteractiveHotspotStudio.js';
import { AudioComparisonSlider } from './components/AudioComparisonSlider.js';
import { PackagesSection } from './components/PackagesSection.js';
import { SessionCostCalculator } from './components/SessionCostCalculator.js';
import { EquipmentSection } from './components/EquipmentSection.js';
import { WhyKwanSection } from './components/WhyKwanSection.js';
import { TestimonialsSection } from './components/TestimonialsSection.js';
import { FaqSection } from './components/FaqSection.js';
import { ContactSection } from './components/ContactSection.js';
import { Footer } from './components/Footer.js';
import { BookingModal } from './components/BookingModal.js';
import { CustomCursor } from './components/CustomCursor.js';
import { BlogListing } from './pages/BlogListing.js';
import { BlogPostDetail } from './pages/BlogPostDetail.js';
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminPortal } from './components/admin/AdminPortal.js';

// Fallback initial packages matching official Kwan Studio flyers
const INITIAL_PACKAGES: Package[] = [
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

function MainApp() {
  const { user } = useAuth();

  const [currentRoute, setCurrentRoute] = useState<'home' | 'blog' | 'blog-post' | 'admin'>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Modals & custom booking messages
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<Package | null>(null);
  const [bookingSelectedTier, setBookingSelectedTier] = useState<string>('');
  const [bookingCustomMessage, setBookingCustomMessage] = useState<string>('');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const loadAllData = async () => {
    try {
      const [pkgs, stt, tstm, fq, blg] = await Promise.allSettled([
        api.getPackages(),
        api.getSettings(),
        api.getTestimonials(),
        api.getFaqs(),
        api.getBlogPosts()
      ]);

      if (pkgs.status === 'fulfilled' && pkgs.value.length > 0) setPackages(pkgs.value);
      if (stt.status === 'fulfilled') setSettings(stt.value);
      if (tstm.status === 'fulfilled') setTestimonials(tstm.value);
      if (fq.status === 'fulfilled') setFaqs(fq.value);
      if (blg.status === 'fulfilled') setBlogPosts(blg.value);
    } catch (err) {
      console.error('Error loading public data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenBooking = (pkgOrId?: Package | string, customMsg?: string, tierName?: string) => {
    if (typeof pkgOrId === 'string') {
      const found = packages.find(p => p.id === pkgOrId);
      setSelectedPackageForBooking(found || packages[1] || packages[0]);
    } else if (pkgOrId) {
      setSelectedPackageForBooking(pkgOrId);
    } else {
      setSelectedPackageForBooking(packages[1] || packages[0]);
    }
    setBookingSelectedTier(tierName || '');
    setBookingCustomMessage(customMsg || '');
    setIsBookingOpen(true);
  };

  const handleBookWithCustomConfig = (
    configSummary: string,
    estimatedPrice: number,
    packageId?: string,
    tierName?: string
  ) => {
    const pkg = (packageId ? packages.find(p => p.id === packageId) : null) || packages[1] || packages[0];
    handleOpenBooking(pkg, `[Devis Personnalisé : ${estimatedPrice} DH]\n${configSummary}`, tierName);
  };

  const handleNavigate = (route: string) => {
    if (route === 'admin') {
      if (user) {
        setCurrentRoute('admin');
      } else {
        setIsAdminLoginOpen(true);
      }
    } else if (route === 'blog') {
      setCurrentRoute('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentRoute('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentRoute('blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in admin mode and user is logged in
  if (currentRoute === 'admin' && user) {
    return (
      <AdminPortal
        onBackToSite={() => setCurrentRoute('home')}
        packages={packages}
        settings={settings}
        onRefreshGlobalData={loadAllData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#06070b] text-white flex flex-col selection:bg-[#d4af37] selection:text-black relative">
      
      {/* Studio Gold Custom Cursor */}
      <CustomCursor />

      {/* Cinematic Film Grain & Dark Studio Vignette */}
      <div className="film-grain" />
      <div className="cinematic-vignette" />

      {/* Top Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onNavigate={handleNavigate}
        currentRoute={currentRoute}
        onOpenAdmin={() => {
          if (user) {
            setCurrentRoute('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        customLogoUrl={settings.custom_logo_url}
        whatsappNumber={settings.contact_whatsapp}
      />

      {/* Main Pages */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <>
            <Hero
              title={settings.hero_title}
              subtitle={settings.hero_subtitle}
              primaryCtaText={settings.hero_cta_text}
              onOpenBooking={() => handleOpenBooking()}
              onExplorePacks={() => {
                const el = document.querySelector('#packs');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Studio Tour Section */}
            <StudioSection />

            {/* Interactive Studio Hotspots Explorer */}
            <InteractiveHotspotStudio onBookNow={() => handleOpenBooking()} />

            {/* Audio Comparison: Home vs Kwan Studio R-60 */}
            <AudioComparisonSlider onBookNow={() => handleOpenBooking()} />

            {/* Packages Section */}
            <PackagesSection
              packages={packages}
              onSelectPackage={(pkg, tierName) => handleOpenBooking(pkg, undefined, tierName)}
            />

            {/* Live Interactive Session Cost Simulator */}
            <SessionCostCalculator
              onBookWithCustomConfig={handleBookWithCustomConfig}
            />

            {/* Equipment Inventory */}
            <EquipmentSection />

            {/* Why Kwan Distinction */}
            <WhyKwanSection />

            {/* Social Proof & Testimonials */}
            {testimonials.length > 0 && (
              <TestimonialsSection testimonials={testimonials} />
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <FaqSection faqs={faqs} />
            )}

            {/* Contact & Map */}
            <ContactSection
              settings={settings}
              onOpenBooking={() => handleOpenBooking()}
            />
          </>
        )}

        {currentRoute === 'blog' && (
          <BlogListing
            posts={blogPosts}
            onSelectPost={handleSelectPost}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentRoute === 'blog-post' && selectedPost && (
          <BlogPostDetail
            post={selectedPost}
            onBack={() => setCurrentRoute('blog')}
            onOpenBooking={() => handleOpenBooking()}
            whatsappNumber={settings.contact_whatsapp}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => {
          if (user) {
            setCurrentRoute('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onNavigate={handleNavigate}
        customLogoUrl={settings.custom_logo_url}
      />

      {/* Booking Popup Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedPackage={selectedPackageForBooking}
        initialTier={bookingSelectedTier}
        packages={packages}
        whatsappNumber={settings.contact_whatsapp}
        initialMessage={bookingCustomMessage}
      />

      {/* Admin Login Modal */}
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setCurrentRoute('admin');
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
