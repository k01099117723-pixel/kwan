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

export interface BookingRequest {
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

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: string;
}

export interface DashboardStats {
  totalBookings: number;
  newBookings: number;
  contactedBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  packagesCount: number;
}
