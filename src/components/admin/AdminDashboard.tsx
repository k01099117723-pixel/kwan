import React from 'react';
import { DashboardStats, BookingRequest } from '../../types.js';
import { Calendar, CheckCircle2, Clock, FileText, ArrowRight, User, Phone, MapPin } from 'lucide-react';

interface AdminDashboardProps {
  stats: DashboardStats;
  recentBookings: BookingRequest[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  recentBookings,
  onNavigateTab
}) => {
  return (
    <div className="space-y-8">
      
      {/* Top Welcome */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white">
          Vue d'ensemble Kwan Studio
        </h2>
        <p className="text-xs text-[#8c9bb0] mt-1">
          Suivi en temps réel des réservations, du contenu et des indicateurs de performance.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Bookings */}
        <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1d2638] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#7e8eab] font-medium">Total Réservations</div>
            <div className="text-3xl font-extrabold text-white mt-1.5">{stats.totalBookings}</div>
            <div className="text-[11px] text-[#93a4b9] mt-1">Depuis le lancement</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#171e2c] border border-[#232f44] flex items-center justify-center text-[#d4af37]">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* New Bookings to Process */}
        <div className="p-6 rounded-2xl bg-[#141b27] border border-[#d4af37]/40 shadow-lg shadow-[#d4af37]/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#d4af37] font-bold uppercase tracking-wider">À Traiter</div>
            <div className="text-3xl font-extrabold text-white mt-1.5">{stats.newBookings}</div>
            <div className="text-[11px] text-[#9ab0c8] mt-1">Nouvelles demandes</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center text-[#f3e5ab]">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Confirmed Sessions */}
        <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1d2638] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#7e8eab] font-medium">Confirmées</div>
            <div className="text-3xl font-extrabold text-[#4ade80] mt-1.5">{stats.confirmedBookings}</div>
            <div className="text-[11px] text-[#8e9eb3] mt-1">Tournages validés</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#132219] border border-[#1f382a] flex items-center justify-center text-[#4ade80]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Blog Posts */}
        <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1d2638] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#7e8eab] font-medium">Articles Publiés</div>
            <div className="text-3xl font-extrabold text-white mt-1.5">{stats.publishedBlogPosts}</div>
            <div className="text-[11px] text-[#8e9eb3] mt-1">Guides & SEO</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#171e2c] border border-[#232f44] flex items-center justify-center text-[#93c5fd]">
            <FileText className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Recent Bookings Table */}
      <div className="p-6 rounded-2xl bg-[#0e131d] border border-[#1e273a] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Dernières Demandes de Tournage</h3>
            <p className="text-xs text-[#8292a8]">Les 5 demandes de réservation les plus récentes reçues sur le site.</p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-bold text-[#d4af37] hover:underline flex items-center gap-1"
          >
            <span>Voir toutes les réservations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#8292a8]">
            Aucune demande de réservation pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1c2435] text-[#78889e]">
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Ville</th>
                  <th className="pb-3 font-semibold">Formule</th>
                  <th className="pb-3 font-semibold">Date & Créneau</th>
                  <th className="pb-3 font-semibold">Statut</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171f2d]">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#121824]/50 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-white">{b.full_name}</div>
                      <div className="text-[11px] text-[#798a9f]">{b.phone}</div>
                    </td>
                    <td className="py-3.5 text-[#a8b8cc]">{b.city}</td>
                    <td className="py-3.5">
                      <span className="font-medium text-[#f3e5ab]">{b.package_name}</span>
                    </td>
                    <td className="py-3.5 text-[#9bb0c7]">
                      <div>{b.preferred_date}</div>
                      <div className="text-[10px] text-[#6e7e93]">{b.preferred_time}</div>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'New'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : b.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : b.status === 'Contacted'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : b.status === 'Completed'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => onNavigateTab('bookings')}
                        className="px-3 py-1 rounded-lg bg-[#161d2b] hover:bg-[#1f283b] text-white text-[11px] border border-[#243046] transition-colors"
                      >
                        Gérer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
