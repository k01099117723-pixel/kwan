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
import { BlogListing } from './pages/BlogListing.js';
import { BlogPostDetail } from './pages/BlogPostDetail.js';
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminPortal } from './components/admin/AdminPortal.js';

// Fallback initial packages in case API is still initializing
const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pack-essentiel-audio',
    name: "L'Essentiel Audio",
    badge: 'Formule Audio Pure',
    price: '600 MAD / heure',
    duration: '1 Heure minimum',
    description: "Conçu pour les podcasters axés sur la voix, les créateurs d'émissions audio et le doublage vocal de haute précision.",
    image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',
    cameras_count: 0,
    audio_services: 'Jusqu’à 4 micros Shure SM7B avec préamplification et monitoring indépendant',
    video_services: 'Aucune captation vidéo',
    editing_services: 'Nettoyage audio basique, égalisation et compression',
    additional_features: [
      'Traitement acoustique broadcast certifié',
      'Enregistrement multicanal séparé WAV 24-bit',
      'Ingénieur du son dédié pour le réglage des gains',
      'Exportation immédiate des pistes brutes sur clé ou cloud',
      'Espace lounge & café offert'
    ],
    sort_order: 1
  },
  {
    id: 'pack-visio-standard',
    name: 'Le Visio Standard',
    badge: 'Le Plus Populaire',
    price: '1 200 MAD / heure',
    duration: '1 Heure minimum',
    description: "Le format de référence pour les podcasts vidéo modernes : YouTube, Spotify Vidéo et extraits percutants pour les réseaux sociaux.",
    image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    cameras_count: 2,
    audio_services: 'Prise de son studio Shure SM7B multicanale avec traitement dynamique en direct',
    video_services: '2 Caméras Sony FX3 Cinéma 4K (plan large + gros plan invité/hôte) avec éclairage Aputure',
    editing_services: 'Rushes vidéo 4K synchronisés livrés sous 24 heures',
    additional_features: [
      'Tout le contenu du Pack Audio',
      '2 angles 4K Cinema Line étalonnés',
      'Éclairage 3 points doux et flatteur',
      'Régisseur vidéo dédié pendant toute la session',
      'Livraison des fichiers en 4K UHD non compressé'
    ],
    is_popular: true,
    sort_order: 2
  },
  {
    id: 'pack-elite-broadcast',
    name: "L'Élite Broadcast",
    badge: 'Production Clé en Main',
    price: '2 500 MAD / session',
    duration: 'Session 2 Heures + Post-Prod Complète',
    description: "La solution de prestige pour entreprises, émissions de marque et personnalités publiques exigeant un rendu télévisuel sans aucun effort.",
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    cameras_count: 3,
    audio_services: 'Configuration complète jusqu’à 4 invités, mixage et mastering sonore broadcast',
    video_services: 'Dispositif complet 3 Caméras 4K Sony FX3 avec réalisation en direct (Switching ATEM)',
    editing_services: 'Montage vidéo dynamique complet + 3 Réels / Shorts verticaux sous-titrés',
    additional_features: [
      '3 angles de caméras 4K cinéma',
      'Réalisation multi-caméras dynamique intégrée',
      'Montage complet de l’épisode avec habillage visuel',
      '3 teasers verticaux optimisés pour TikTok & Instagram',
      'Accueil VIP privé avec boissons et confiserie',
      'Archivage sécurisé de votre projet pendant 12 mois'
    ],
    sort_order: 3
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

  const handleOpenBooking = (pkgOrId?: Package | string, customMsg?: string) => {
    if (typeof pkgOrId === 'string') {
      const found = packages.find(p => p.id === pkgOrId);
      setSelectedPackageForBooking(found || packages[1] || packages[0]);
    } else if (pkgOrId) {
      setSelectedPackageForBooking(pkgOrId);
    } else {
      setSelectedPackageForBooking(packages[1] || packages[0]);
    }
    setBookingCustomMessage(customMsg || '');
    setIsBookingOpen(true);
  };

  const handleBookWithCustomConfig = (configSummary: string, estimatedPrice: number) => {
    const pkg = packages[1] || packages[0];
    handleOpenBooking(pkg, `[Simulation Devis en Ligne] ${configSummary}`);
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
      
      {/* Cinematic Film Grain Overlay */}
      <div className="film-grain" />

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
              onSelectPackage={(pkg) => handleOpenBooking(pkg)}
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
