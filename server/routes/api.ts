import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { db, Booking } from '../db.js';
import { generateToken, requireAdminAuth, AuthRequest } from '../auth.js';

export const apiRouter = express.Router();

// Multer storage setup for image uploads
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `kwan_${cleanName}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Formats acceptés : JPEG, PNG, WebP, SVG, AVIF'));
    }
  }
});

// Simple rate limiter for public booking submissions
const submissionTracker = new Map<string, number>();

// ==========================================================
// PUBLIC ENDPOINTS
// ==========================================================

// 1. Submit a Booking Request
apiRouter.post('/bookings', async (req: Request, res: Response) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const ipKey = String(ip);
    const lastSub = submissionTracker.get(ipKey);
    const now = Date.now();

    // Prevent spam if submitted within last 5 seconds
    if (lastSub && now - lastSub < 5000) {
      return res.status(429).json({
        error: 'Veuillez patienter quelques secondes avant de soumettre une nouvelle demande.'
      });
    }

    const {
      full_name,
      city,
      phone,
      email,
      package_id,
      package_name,
      preferred_date,
      preferred_time,
      participants,
      message
    } = req.body;

    // Validation
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ error: 'Le nom complet est obligatoire (au moins 2 caractères).' });
    }

    if (!city || city.trim().length < 2) {
      return res.status(400).json({ error: 'La ville est obligatoire.' });
    }

    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ error: 'Un numéro de téléphone valide est obligatoire.' });
    }

    if (!package_id || !package_name) {
      return res.status(400).json({ error: 'Veuillez sélectionner un pack.' });
    }

    if (!preferred_date) {
      return res.status(400).json({ error: 'Veuillez indiquer une date souhaitée.' });
    }

    if (!preferred_time) {
      return res.status(400).json({ error: 'Veuillez sélectionner un créneau horaire.' });
    }

    // Sanitize string inputs
    const sanitizedName = String(full_name).trim().slice(0, 100);
    const sanitizedCity = String(city).trim().slice(0, 100);
    const sanitizedPhone = String(phone).trim().slice(0, 30);
    const sanitizedEmail = email ? String(email).trim().slice(0, 100) : undefined;
    const sanitizedMessage = message ? String(message).trim().slice(0, 1000) : undefined;

    const booking = await db.createBooking({
      full_name: sanitizedName,
      city: sanitizedCity,
      phone: sanitizedPhone,
      email: sanitizedEmail,
      package_id: String(package_id),
      package_name: String(package_name),
      preferred_date: String(preferred_date),
      preferred_time: String(preferred_time),
      participants: Number(participants) || 2,
      message: sanitizedMessage
    });

    submissionTracker.set(ipKey, now);

    return res.status(201).json({
      success: true,
      message: 'Merci pour votre demande. Notre équipe Kwan Studio vous contactera prochainement pour confirmer votre réservation.',
      bookingId: booking.id
    });
  } catch (err: any) {
    console.error('Error creating booking request:', err);
    return res.status(500).json({ error: 'Une erreur est survenue lors de l’enregistrement de votre demande.' });
  }
});

// 2. Get All Packages
apiRouter.get('/packages', async (req: Request, res: Response) => {
  try {
    const packages = await db.getPackages();
    return res.json({ success: true, packages });
  } catch (err) {
    return res.status(500).json({ error: 'Impossible de récupérer les packs.' });
  }
});

// 3. Get Public Site Settings
apiRouter.get('/settings', async (req: Request, res: Response) => {
  try {
    const settings = await db.getSiteSettings();
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ error: 'Impossible de récupérer les réglages.' });
  }
});

// 4. Get Testimonials
apiRouter.get('/testimonials', async (req: Request, res: Response) => {
  try {
    const testimonials = await db.getTestimonials();
    return res.json({ success: true, testimonials });
  } catch (err) {
    return res.status(500).json({ error: 'Impossible de charger les avis.' });
  }
});

// 5. Get FAQs
apiRouter.get('/faqs', async (req: Request, res: Response) => {
  try {
    const faqs = await db.getFaqs();
    return res.json({ success: true, faqs });
  } catch (err) {
    return res.status(500).json({ error: 'Impossible de charger les questions fréquentes.' });
  }
});

// 6. Get Public Blog Posts
apiRouter.get('/blog', async (req: Request, res: Response) => {
  try {
    const posts = await db.getBlogPosts(true);
    return res.json({ success: true, posts });
  } catch (err) {
    return res.status(500).json({ error: 'Impossible de charger les articles de blog.' });
  }
});

// 7. Get Single Blog Post by Slug
apiRouter.get('/blog/:slug', async (req: Request, res: Response) => {
  try {
    const post = await db.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ error: 'Article non trouvé.' });
    }
    return res.json({ success: true, post });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la récupération de l’article.' });
  }
});

// ==========================================================
// ADMIN AUTHENTICATION
// ==========================================================

apiRouter.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const admin = await db.getAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const isMatch = bcrypt.compareSync(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });
    return res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

apiRouter.get('/admin/me', requireAdminAuth, async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Non authentifié' });
  const admin = await db.getAdminByEmail(req.user.email);
  if (!admin) return res.status(404).json({ error: 'Admin introuvable' });
  return res.json({
    success: true,
    user: {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role
    }
  });
});

apiRouter.post('/admin/change-password', requireAdminAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' });
    }

    const email = req.user!.email;
    const admin = await db.getAdminByEmail(email);
    if (!admin) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    const isMatch = bcrypt.compareSync(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Le mot de passe actuel est incorrect.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);
    await db.updateAdminPassword(email, newHash);

    return res.json({ success: true, message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors du changement de mot de passe.' });
  }
});

// ==========================================================
// ADMIN PROTECTED DASHBOARD & CMS ROUTES
// ==========================================================

// Dashboard Stats Overview
apiRouter.get('/admin/dashboard-stats', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const bookings = await db.getBookings();
    const blogPosts = await db.getBlogPosts(false);
    const packages = await db.getPackages();

    const stats = {
      totalBookings: bookings.length,
      newBookings: bookings.filter(b => b.status === 'New').length,
      contactedBookings: bookings.filter(b => b.status === 'Contacted').length,
      confirmedBookings: bookings.filter(b => b.status === 'Confirmed').length,
      completedBookings: bookings.filter(b => b.status === 'Completed').length,
      cancelledBookings: bookings.filter(b => b.status === 'Cancelled').length,
      totalBlogPosts: blogPosts.length,
      publishedBlogPosts: blogPosts.filter(b => b.is_published).length,
      packagesCount: packages.length
    };

    return res.json({ success: true, stats, recentBookings: bookings.slice(0, 5) });
  } catch (err) {
    return res.status(500).json({ error: 'Impossible de calculer les statistiques.' });
  }
});

// Booking Management
apiRouter.get('/admin/bookings', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const bookings = await db.getBookings();
    return res.json({ success: true, bookings });
  } catch (err) {
    return res.status(500).json({ error: 'Impossible de récupérer les réservations.' });
  }
});

apiRouter.patch('/admin/bookings/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, admin_notes } = req.body;
    const updated = await db.updateBookingStatus(id, status, admin_notes);
    if (!updated) {
      return res.status(404).json({ error: 'Demande non trouvée.' });
    }
    return res.json({ success: true, booking: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

apiRouter.delete('/admin/bookings/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await db.deleteBooking(id);
    return res.json({ success: deleted });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// Package Management
apiRouter.put('/admin/packages/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await db.updatePackage(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Pack non trouvé.' });
    return res.json({ success: true, package: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la modification du pack.' });
  }
});

// Blog Management
apiRouter.get('/admin/blog', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const posts = await db.getBlogPosts(false);
    return res.json({ success: true, posts });
  } catch (err) {
    return res.status(500).json({ error: 'Impossible de charger tous les articles.' });
  }
});

apiRouter.post('/admin/blog', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { title, slug, excerpt, content, featured_image, category, tags, seo_title, meta_description, is_published, reading_time } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Titre, slug et contenu sont obligatoires.' });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const created = await db.createBlogPost({
      title,
      slug: cleanSlug,
      excerpt: excerpt || '',
      content,
      featured_image: featured_image || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop',
      category: category || 'Général',
      tags: tags || [],
      seo_title: seo_title || title,
      meta_description: meta_description || excerpt,
      canonical_url: `https://kwanstudio.ma/blog/${cleanSlug}`,
      og_image: featured_image,
      is_published: Boolean(is_published),
      reading_time: reading_time || '5 min'
    });

    return res.status(201).json({ success: true, post: created });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la création de l’article.' });
  }
});

apiRouter.put('/admin/blog/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await db.updateBlogPost(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Article non trouvé.' });
    return res.json({ success: true, post: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la mise à jour de l’article.' });
  }
});

apiRouter.delete('/admin/blog/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await db.deleteBlogPost(id);
    return res.json({ success: deleted });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la suppression de l’article.' });
  }
});

// Site Settings Management
apiRouter.put('/admin/settings', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const settings = await db.updateSiteSettings(req.body);
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la mise à jour des paramètres.' });
  }
});

// Media / Image Management
apiRouter.get('/admin/media', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const media = await db.getMedia();
    return res.json({ success: true, media });
  } catch (err) {
    return res.status(500).json({ error: 'Impossible de charger la médiathèque.' });
  }
});

apiRouter.post('/admin/media/upload', requireAdminAuth, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni.' });
    }

    const { alt_text, section_tag } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const mediaItem = await db.createMedia({
      filename: req.file.filename,
      original_name: req.file.originalname,
      url: fileUrl,
      mime_type: req.file.mimetype,
      size: req.file.size,
      alt_text: alt_text || req.file.originalname,
      section_tag: section_tag || 'general'
    });

    return res.status(201).json({ success: true, media: mediaItem });
  } catch (err: any) {
    console.error('Media upload error:', err);
    return res.status(500).json({ error: err.message || 'Erreur lors de l’upload de l’image.' });
  }
});

apiRouter.delete('/admin/media/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await db.deleteMedia(id);
    return res.json({ success: deleted });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur lors de la suppression de l’image.' });
  }
});

// FAQs Management
apiRouter.post('/admin/faqs', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { question, answer, category, sort_order } = req.body;
    if (!question || !answer) return res.status(400).json({ error: 'Question et réponse obligatoires.' });
    const faq = await db.createFaq({
      question,
      answer,
      category: category || 'Général',
      sort_order: Number(sort_order) || 1,
      is_active: true
    });
    return res.status(201).json({ success: true, faq });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur création FAQ.' });
  }
});

apiRouter.delete('/admin/faqs/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteFaq(Number(req.params.id));
    return res.json({ success: deleted });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur suppression FAQ.' });
  }
});

// Testimonials Management
apiRouter.post('/admin/testimonials', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { author_name, role_company, quote, rating, avatar_url, project_title } = req.body;
    if (!author_name || !quote) return res.status(400).json({ error: 'Auteur et citation obligatoires.' });
    const t = await db.createTestimonial({
      author_name,
      role_company: role_company || 'Créateur',
      quote,
      rating: Number(rating) || 5,
      avatar_url: avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      project_title: project_title || '',
      is_featured: true
    });
    return res.status(201).json({ success: true, testimonial: t });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur création témoignage.' });
  }
});

apiRouter.delete('/admin/testimonials/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const deleted = await db.deleteTestimonial(Number(req.params.id));
    return res.json({ success: deleted });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur suppression avis.' });
  }
});
