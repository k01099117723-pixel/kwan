import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';
import { Package, BookingRequest, BlogPost, SiteSettings, DashboardStats } from '../../types.js';
import { AdminDashboard } from './AdminDashboard.js';
import { AdminBookings } from './AdminBookings.js';
import { AdminPackages } from './AdminPackages.js';
import { AdminBlog } from './AdminBlog.js';
import { AdminMedia } from './AdminMedia.js';
import { AdminSettings } from './AdminSettings.js';
import { AdminHostingerGuide } from './AdminHostingerGuide.js';
import { Logo } from '../Logo.js';
import {
  LayoutDashboard,
  CalendarDays,
  PackageCheck,
  FileText,
  Image as ImageIcon,
  Settings,
  Server,
  LogOut,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AdminPortalProps {
  onBackToSite: () => void;
  packages: Package[];
  settings: SiteSettings;
  onRefreshGlobalData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToSite,
  packages,
  settings,
  onRefreshGlobalData
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    newBookings: 0,
    contactedBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalBlogPosts: 0,
    publishedBlogPosts: 0,
    packagesCount: 3
  });
  const [recentBookings, setRecentBookings] = useState<BookingRequest[]>([]);
  const [allBookings, setAllBookings] = useState<BookingRequest[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      const [statsData, bookingsData, postsData] = await Promise.all([
        api.getDashboardStats(),
        api.getAdminBookings(),
        api.getAdminBlogPosts()
      ]);
      setStats(statsData.stats);
      setRecentBookings(statsData.recentBookings || []);
      setAllBookings(bookingsData);
      setBlogPosts(postsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    {
      id: 'bookings',
      label: 'Réservations',
      icon: CalendarDays,
      badge: stats.newBookings > 0 ? stats.newBookings : undefined
    },
    { id: 'packages', label: 'Packs Studio', icon: PackageCheck },
    { id: 'blog', label: 'Articles Blog', icon: FileText },
    { id: 'media', label: 'Médiathèque', icon: ImageIcon },
    { id: 'settings', label: 'Paramètres', icon: Settings },
    { id: 'hostinger', label: 'Guide Hostinger', icon: Server }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col lg:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-[#0a0d14] border-r border-[#161c28] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Logo & Public Switch */}
          <div className="flex items-center justify-between">
            <Logo size="sm" customLogoUrl={settings.custom_logo_url} />
            <button
              onClick={onBackToSite}
              className="p-1.5 rounded-lg bg-[#121622] hover:bg-[#181f2f] text-[#8e9faf] hover:text-[#d4af37] text-xs flex items-center gap-1 transition-colors"
              title="Retour au site public"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-[#728399] px-3">
            Console d'Administration
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#07080c] shadow-md shadow-[#d4af37]/20 font-bold'
                      : 'text-[#9ab0c8] hover:text-white hover:bg-[#111624]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      active ? 'bg-black text-[#d4af37]' : 'bg-[#d4af37] text-black'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="pt-6 mt-6 border-t border-[#161d2b] space-y-3">
          <div className="px-3">
            <div className="text-xs font-bold text-white truncate">{user?.email || 'admin@kwanstudio.ma'}</div>
            <div className="text-[10px] text-[#718195]">Administrateur Kwan Studio</div>
          </div>

          <button
            onClick={() => {
              logout();
              onBackToSite();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#141926] hover:bg-[#201518] text-[#8e9faf] hover:text-red-400 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            stats={stats}
            recentBookings={recentBookings}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'bookings' && (
          <AdminBookings
            bookings={allBookings}
            onRefresh={loadAdminData}
          />
        )}

        {activeTab === 'packages' && (
          <AdminPackages
            packages={packages}
            onRefresh={() => {
              loadAdminData();
              onRefreshGlobalData();
            }}
          />
        )}

        {activeTab === 'blog' && (
          <AdminBlog
            posts={blogPosts}
            onRefresh={() => {
              loadAdminData();
              onRefreshGlobalData();
            }}
          />
        )}

        {activeTab === 'media' && <AdminMedia />}

        {activeTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onRefresh={() => {
              loadAdminData();
              onRefreshGlobalData();
            }}
          />
        )}

        {activeTab === 'hostinger' && <AdminHostingerGuide />}
      </main>

    </div>
  );
};
