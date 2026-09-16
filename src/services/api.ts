import { Package, BookingRequest, BlogPost, SiteSettings, MediaItem, Testimonial, FAQ, DashboardStats, AdminUser } from '../types.js';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('kwan_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Public
  async getPackages(): Promise<Package[]> {
    const res = await fetch(`${API_BASE}/packages`);
    const data = await res.json();
    return data.packages || [];
  },

  async getSettings(): Promise<SiteSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    const data = await res.json();
    return data.settings || {};
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch(`${API_BASE}/testimonials`);
    const data = await res.json();
    return data.testimonials || [];
  },

  async getFaqs(): Promise<FAQ[]> {
    const res = await fetch(`${API_BASE}/faqs`);
    const data = await res.json();
    return data.faqs || [];
  },

  async getBlogPosts(): Promise<BlogPost[]> {
    const res = await fetch(`${API_BASE}/blog`);
    const data = await res.json();
    return data.posts || [];
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blog/${slug}`);
    if (!res.ok) throw new Error('Article non trouvé');
    const data = await res.json();
    return data.post;
  },

  async submitBooking(payload: {
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
  }) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la réservation');
    return data;
  },

  // Admin Auth
  async loginAdmin(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Identifiants invalides');
    return data;
  },

  async getAdminMe(): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/admin/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Non authentifié');
    const data = await res.json();
    return data.user;
  },

  async changeAdminPassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/admin/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors du changement de mot de passe');
    return data;
  },

  // Admin Dashboard
  async getDashboardStats(): Promise<{ stats: DashboardStats; recentBookings: BookingRequest[] }> {
    const res = await fetch(`${API_BASE}/admin/dashboard-stats`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur stats');
    return data;
  },

  // Admin Bookings
  async getAdminBookings(): Promise<BookingRequest[]> {
    const res = await fetch(`${API_BASE}/admin/bookings`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur réservations');
    return data.bookings || [];
  },

  async updateBookingStatus(id: number, status: BookingRequest['status'], admin_notes?: string) {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, admin_notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur mise à jour réservation');
    return data.booking;
  },

  async deleteBooking(id: number) {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur suppression');
    return data.success;
  },

  // Admin Packages
  async updatePackage(id: string, updates: Partial<Package>) {
    const res = await fetch(`${API_BASE}/admin/packages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur mise à jour pack');
    return data.package;
  },

  // Admin Blog
  async getAdminBlogPosts(): Promise<BlogPost[]> {
    const res = await fetch(`${API_BASE}/admin/blog`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.posts || [];
  },

  async createBlogPost(payload: Partial<BlogPost>) {
    const res = await fetch(`${API_BASE}/admin/blog`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur création article');
    return data.post;
  },

  async updateBlogPost(id: number, payload: Partial<BlogPost>) {
    const res = await fetch(`${API_BASE}/admin/blog/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur modification article');
    return data.post;
  },

  async deleteBlogPost(id: number) {
    const res = await fetch(`${API_BASE}/admin/blog/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur suppression');
    return data.success;
  },

  // Admin Settings
  async updateSettings(settings: Partial<SiteSettings>) {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur modification paramètres');
    return data.settings;
  },

  // Admin Media
  async getMedia(): Promise<MediaItem[]> {
    const res = await fetch(`${API_BASE}/admin/media`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.media || [];
  },

  async uploadMedia(formData: FormData): Promise<MediaItem> {
    const token = localStorage.getItem('kwan_admin_token');
    const res = await fetch(`${API_BASE}/admin/media/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur upload image');
    return data.media;
  },

  async deleteMedia(id: number) {
    const res = await fetch(`${API_BASE}/admin/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // Admin FAQs
  async createFaq(payload: { question: string; answer: string; category?: string; sort_order?: number }) {
    const res = await fetch(`${API_BASE}/admin/faqs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.faq;
  },

  async deleteFaq(id: number) {
    const res = await fetch(`${API_BASE}/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  },

  // Admin Testimonials
  async createTestimonial(payload: Partial<Testimonial>) {
    const res = await fetch(`${API_BASE}/admin/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.testimonial;
  },

  async deleteTestimonial(id: number) {
    const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data.success;
  }
};
