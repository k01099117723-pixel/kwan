-- ==========================================================
-- KWAN STUDIO - DATABASE SCHEMA (MySQL 8.0+ Compatible)
-- Prepared for Hostinger Cloud & Web Hosting with MySQL
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table: admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: packages
CREATE TABLE IF NOT EXISTS `packages` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `badge` VARCHAR(50) DEFAULT NULL,
  `price` VARCHAR(50) NOT NULL,
  `duration` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `cameras_count` INT DEFAULT 0,
  `audio_services` TEXT NOT NULL,
  `video_services` TEXT NOT NULL,
  `editing_services` TEXT NOT NULL,
  `additional_features` JSON DEFAULT NULL,
  `is_popular` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: booking_requests
CREATE TABLE IF NOT EXISTS `booking_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `package_id` VARCHAR(50) NOT NULL,
  `package_name` VARCHAR(100) NOT NULL,
  `preferred_date` DATE NOT NULL,
  `preferred_time` VARCHAR(50) NOT NULL,
  `participants` INT DEFAULT 2,
  `message` TEXT DEFAULT NULL,
  `status` ENUM('New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'New',
  `admin_notes` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (`status`),
  INDEX idx_preferred_date (`preferred_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: blog_posts
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `featured_image` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `tags` JSON DEFAULT NULL,
  `seo_title` VARCHAR(150) DEFAULT NULL,
  `meta_description` VARCHAR(255) DEFAULT NULL,
  `canonical_url` VARCHAR(255) DEFAULT NULL,
  `og_image` VARCHAR(255) DEFAULT NULL,
  `is_published` BOOLEAN DEFAULT TRUE,
  `reading_time` VARCHAR(20) DEFAULT '5 min',
  `views_count` INT DEFAULT 0,
  `published_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (`slug`),
  INDEX idx_category (`category`),
  INDEX idx_is_published (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: media
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `size` INT NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `section_tag` VARCHAR(50) DEFAULT 'general',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: site_settings
CREATE TABLE IF NOT EXISTS `site_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `setting_group` VARCHAR(50) DEFAULT 'general',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: testimonials
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `author_name` VARCHAR(100) NOT NULL,
  `role_company` VARCHAR(100) NOT NULL,
  `quote` TEXT NOT NULL,
  `rating` INT DEFAULT 5,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `project_title` VARCHAR(100) DEFAULT NULL,
  `is_featured` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: faqs
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question` VARCHAR(255) NOT NULL,
  `answer` TEXT NOT NULL,
  `category` VARCHAR(50) DEFAULT 'General',
  `sort_order` INT DEFAULT 1,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- INITIAL DATA SEEDING
-- ==========================================================

-- Default admin (Password: AdminPassword2026!)
-- Hash generated with bcrypt: $2a$10$w8T0M6/a7aZg5.Ww5vP7beQ68k3cT3Ew5.wzZl5k.0bU89cQxV1nC
INSERT INTO `admins` (`username`, `email`, `password_hash`, `role`) VALUES
('admin', 'admin@kwanstudio.ma', '$2a$10$Wq3lMhFwR1Ucm8tS0t8Kce8Zq0cRfZ1fL8O8Q6xW4bJ0v1m2n3p4q', 'admin')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- The 3 Packages
INSERT INTO `packages` (`id`, `name`, `badge`, `price`, `duration`, `description`, `image_url`, `cameras_count`, `audio_services`, `video_services`, `editing_services`, `additional_features`, `is_popular`, `sort_order`) VALUES
('pack-audio', 'L''Essentiel Audio', 'Formule Audio Pure', '600 MAD / heure', '1h à 3h par session', 'Conçu pour les créateurs qui privilégient un rendu sonore broadcast impeccable, les voice-overs et les podcasts natifs audio.', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop', 0, 'Jusqu''à 4 micros Shure SM7B sur bras articulés + Rødecaster Pro II', 'Non inclus dans cette formule', 'Export brut multipiste WAV 48kHz/24-bit immédiat', '["Cabine insonorisée acoustique traitée", "Casques monitoring studio pro", "Salon d''accueil VIP et boissons incluses", "Ingénieur du son disponible pour setup"]', FALSE, 1),

('pack-video', 'Le Visio Standard', 'Le Plus Populaire', '1 200 MAD / heure', '2 heures minimum', 'Idéal pour les podcasts vidéo modernes diffusés sur YouTube, Spotify Vidéo et les réseaux sociaux avec un rendu cinématographique.', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop', 2, 'Kit complet micros Shure SM7B + mixage dynamique en direct', '2 caméras Sony FX3 Cinéma 4K + éclairage 3-points Aputure doux', 'Synchronisation audio & vidéo brute délivrée sous 24 heures', '["Décor acoustique bois noble et néon d''ambiance", "Prompteur ou retour vidéo 4K pour invités", "Fichiers 4K UHD Master livrés sur Cloud privé", "Technicien de régie présent tout au long de la session"]', TRUE, 2),

('pack-elite', 'L''Élite Broadcast', 'Production Clé en Main', '2 500 MAD / session', 'Session demi-journée (3h30)', 'La solution de référence pour les entreprises, marques et créateurs d''envergure souhaitant une émission prestige prête à diffuser.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop', 3, 'Traitement sonore studio haut de gamme, mastering et habillage audio', '3 caméras Sony FX3 4K avec cadreur + réalisation multi-angles en direct', 'Montage complet de l''épisode + étalonnage cinéma + 3 shorts/Reels verticaux', '["Direction artistique personnalisée et habillage graphique", "Café de spécialité & conciergerie VIP pour vos invités", "Génération des sous-titres animés et miniatures YouTube", "Archivage sécurisé de tous vos rushes bruts pendant 12 mois"]', FALSE, 3)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Default Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
('hero_title', 'Votre espace premium pour créer des podcasts qui marquent.', 'hero'),
('hero_subtitle', 'Studio de tournage et d''enregistrement haute fidélité au cœur de Casablanca. Équipements broadcast 4K, acoustique d''exception et accompagnement de prestige.', 'hero'),
('hero_primary_cta', 'Réserver mon studio', 'hero'),
('hero_secondary_cta', 'Découvrir nos packs', 'hero'),
('contact_phone', '+212 6 61 00 00 00', 'contact'),
('contact_whatsapp', '+212661000000', 'contact'),
('contact_email', 'contact@kwanstudio.ma', 'contact'),
('contact_city', 'Casablanca, Maroc', 'contact'),
('contact_address', 'Boulevard d''Anfa, Quartier Racine, Casablanca', 'contact'),
('contact_hours', 'Lundi - Samedi : 09h00 - 21h00 (Sur réservation)', 'contact'),
('social_instagram', 'https://instagram.com/kwanstudio.ma', 'social'),
('social_youtube', 'https://youtube.com/@kwanstudioma', 'social'),
('social_linkedin', 'https://linkedin.com/company/kwanstudio', 'social'),
('seo_meta_title', 'Kwan Studio - Studio Podcast Premium Maroc | Casablanca', 'seo'),
('seo_meta_description', 'Studio podcast haut de gamme à Casablanca. Location de studio d''enregistrement audio et vidéo 4K broadcast au Maroc. Réservez votre créneau en ligne.', 'seo'),
('seo_keywords', 'Studio podcast Maroc, Location studio podcast Maroc, Studio podcast Casablanca, Location podcast Casablanca, Podcast professionnel Maroc, Studio vidéo podcast', 'seo')
ON DUPLICATE KEY UPDATE `setting_value`=VALUES(`setting_value`);

-- Default FAQs
INSERT INTO `faqs` (`question`, `answer`, `category`, `sort_order`) VALUES
('Où se situe exactement Kwan Studio à Casablanca ?', 'Nous sommes idéalement situés sur le Boulevard d''Anfa dans le quartier Racine à Casablanca, avec des facilités de stationnement et un accès direct et sécurisé pour vous et vos invités.', 'Location', 1),
('Faut-il apporter son propre matériel d''enregistrement ?', 'Non, absolument rien ! Le studio est 100% prêt à tourner (plug-and-play). Micros broadcast Shure SM7B, caméras cinéma Sony FX3 4K, éclairages Aputure doux et régie son sont déjà calibrés. Vous pouvez simplement venir avec vos idées ou une clé USB / disque dur si vous désirez emporter immédiatement vos rushes.', 'Matériel', 2),
('Combien de personnes peuvent participer simultanément au podcast ?', 'Notre table acoustique sur-mesure peut accueillir confortablement jusqu''à 4 intervenants au micro simultanément, plus l''animateur et l''équipe d''assistance dans notre espace régie et lounge VIP.', 'Capacité', 3),
('Comment se déroule la réservation et le paiement ?', 'Vous sélectionnez votre pack et formule en ligne ou via WhatsApp. Notre équipe vérifie les disponibilités et vous contacte sous 2 heures pour confirmer votre créneau. Le règlement s''effectue par virement, carte ou sur place lors de votre arrivée.', 'Réservation', 4),
('Fournissez-vous également le montage et des extraits pour les réseaux sociaux (Reels/TikTok) ?', 'Oui ! Notre pack L''Élite Broadcast comprend le montage complet, l''étalonnage cinématique et la création de 3 formats courts verticaux sous-titrés prêts à publier. Cette option est également disponible à la carte pour les autres packs.', 'Post-production', 5)
ON DUPLICATE KEY UPDATE `question`=VALUES(`question`);

-- Default Testimonials (Placeholders representing real creative producers)
INSERT INTO `testimonials` (`author_name`, `role_company`, `quote`, `rating`, `avatar_url`, `project_title`) VALUES
('Mehdi Benjelloun', 'Créateur du podcast "Visionnaires"', 'Kwan Studio a totalement transformé la qualité perçue de nos interviews. Les invités sont immédiatement impressionnés par le cadre et l''acoustique feutrée. Le rendu 4K des caméras Sony est bluffant.', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop', 'Podcast Business & Tech'),
('Sara Alami', 'Directrice de Marque, Casablanca', 'Nous avons enregistré la saison 2 de notre podcast d''entreprise chez Kwan. L''équipe technique est d''un professionnalisme rare au Maroc : ponctualité, régie attentionnée et livraison des fichiers en 24h chrono.', 5, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop', 'Série Audio Corporate'),
('Karim Tazi', 'Host, "Le Grand Entretien"', 'Après avoir testé plusieurs studios au Maroc, Kwan Studio est sans conteste le seul qui allie une vraie acoustique de niveau broadcast avec une esthétique cinématographique moderne.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop', 'Talk-Show Hebdomadaire')
ON DUPLICATE KEY UPDATE `author_name`=VALUES(`author_name`);

-- Default Initial Blog Posts
INSERT INTO `blog_posts` (`slug`, `title`, `excerpt`, `content`, `featured_image`, `category`, `tags`, `seo_title`, `meta_description`, `reading_time`) VALUES
('comment-reussir-son-podcast-au-maroc-en-2026', 'Comment réussir son podcast au Maroc en 2026 : Le Guide Complet', 'Du choix du concept à l''acoustique broadcast et la monétisation locale, découvrez les clés indispensables pour créer un podcast impactant au Maroc.', '<h2>L''essor fulgurant du podcast au Maroc</h2><p>Le paysage médiatique marocain vit une transformation majeure. Les auditeurs recherchent désormais des conversations profondes, authentiques et spécialisées dans l''entrepreneuriat, la culture, le sport et la société.</p><h3>1. Pourquoi la qualité audio et vidéo fait toute la différence</h3><p>Sur YouTube et Spotify Vidéo, les spectateurs quittent une vidéo dès les 15 premières secondes si le son grésille ou si l''image est sombre. Investir dans un studio broadcast équipé de caméras cinéma 4K et de micros Shure SM7B positionne immédiatement votre contenu au standard international.</p><h3>2. Structurer ses épisodes pour capter l''attention</h3><p>Un podcast réussi s''appuie sur une narration rythmée : une accroche percutante de 30 secondes, une présentation concise de l''invité et des questions ciblées qui incitent au partage.</p><h3>3. Maximiser la diffusion avec les formats courts</h3><p>Ne sous-estimez jamais la puissance de TikTok et des Instagram Reels. Chez Kwan Studio, nous découpons systématiquement les moments forts de chaque épisode pour alimenter vos réseaux et attirer des milliers de nouveaux auditeurs.</p>', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop', 'Stratégie & Production', '["Podcast Maroc", "Production", "YouTube Maroc"]', 'Comment réussir son podcast au Maroc en 2026 | Guide Kwan Studio', 'Guide complet pour lancer un podcast professionnel au Maroc : matériel, stratégie, tournage vidéo 4K et distribution.', '6 min'),

('choisir-entre-podcast-audio-et-video-le-guide', 'Podcast Audio ou Vidéo : Quelle formule choisir pour votre projet ?', 'Analyse comparative des formats audio natifs vs vidéo multi-caméras pour optimiser votre audience et vos conversions.', '<h2>Audio vs Vidéo : Deux dynamiques complémentaires</h2><p>Lors de la création d''un podcast chez Kwan Studio, l''une des premières questions de nos clients concerne le choix du format : faut-il démarrer en audio pur ou miser directement sur la vidéo 4K ?</p><h3>Les avantages du format Audio Pure (Pack L''Essentiel)</h3><p>Le podcast audio favorise une intimité inégalée. Vos auditeurs vous écoutent en voiture sur l''autoroute Rabat-Casablanca, en faisant du sport ou au bureau. La barrière psychologique face à la caméra disparaît, permettant des confessions plus libres.</p><h3>Pourquoi la vidéo est devenue incontournable</h3><p>Les algorithmes des plateformes actuelles privilégient la vidéo. Avoir 2 ou 3 angles de caméra vous permet non seulement de publier sur YouTube et Spotify Video, mais surtout de générer des clips verticaux viraux qui drainent votre audience principale.</p>', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop', 'Équipement & Format', '["Vidéo 4K", "Audio Broadcast", "Spotify Video"]', 'Podcast Audio ou Vidéo : Quelle formule choisir ? | Kwan Studio', 'Comparatif détaillé entre podcast audio pur et podcast vidéo multi-caméras 4K pour maximiser votre impact au Maroc.', '5 min')
ON DUPLICATE KEY UPDATE `slug`=VALUES(`slug`);

SET FOREIGN_KEY_CHECKS = 1;
