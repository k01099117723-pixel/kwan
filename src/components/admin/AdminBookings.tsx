import React, { useState } from 'react';
import { BookingRequest } from '../../types.js';
import { api } from '../../services/api.js';
import { Search, Download, Trash2, MessageSquare, Phone, Calendar, Clock, CheckCircle, Edit3, Save, X } from 'lucide-react';

interface AdminBookingsProps {
  bookings: BookingRequest[];
  onRefresh: () => void;
}

export const AdminBookings: React.FC<AdminBookingsProps> = ({ bookings, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const statuses: ('All' | BookingRequest['status'])[] = ['All', 'New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'];

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      b.full_name.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.package_name.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: number, newStatus: BookingRequest['status']) => {
    setUpdatingId(id);
    try {
      await api.updateBookingStatus(id, newStatus);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur mise à jour statut');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id: number) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    setUpdatingId(id);
    try {
      await api.updateBookingStatus(id, booking.status, tempNotes);
      setEditingNotesId(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur sauvegarde notes');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette réservation ?')) return;
    try {
      await api.deleteBooking(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur suppression');
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Nom', 'Ville', 'Téléphone', 'Email', 'Formule', 'Date', 'Créneau', 'Participants', 'Statut', 'Notes', 'Date création'];
    const rows = filteredBookings.map(b => [
      b.id,
      `"${b.full_name.replace(/"/g, '""')}"`,
      `"${b.city}"`,
      `"${b.phone}"`,
      `"${b.email || ''}"`,
      `"${b.package_name}"`,
      b.preferred_date,
      `"${b.preferred_time}"`,
      b.participants,
      b.status,
      `"${(b.admin_notes || '').replace(/"/g, '""')}"`,
      b.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kwan-studio-reservations-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Gestion des Réservations
          </h2>
          <p className="text-xs text-[#8c9bb0] mt-1">
            Traitez les demandes de tournage, mettez à jour les statuts et contactez directement les créateurs.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141926] hover:bg-[#1b2333] text-white text-xs font-semibold border border-[#242e42] transition-colors"
        >
          <Download className="w-4 h-4 text-[#d4af37]" />
          <span>Exporter en CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e131d] border border-[#1b2435]">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#d4af37] text-[#07080c] shadow-sm font-bold'
                  : 'bg-[#131824] text-[#8e9faf] hover:text-white'
              }`}
            >
              {st === 'All' ? 'Toutes' : st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#6e7f96] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#121724] border border-[#212a3d] text-white text-xs focus:outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl bg-[#0e131d] border border-[#1e273a] overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8c9bb0]">
            Aucune réservation trouvée pour ces critères.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#121824] border-b border-[#1c2435] text-[#8292a8]">
                  <th className="py-3 px-4 font-semibold">ID / Date Création</th>
                  <th className="py-3 px-4 font-semibold">Client & Contact</th>
                  <th className="py-3 px-4 font-semibold">Formule</th>
                  <th className="py-3 px-4 font-semibold">Date & Heure</th>
                  <th className="py-3 px-4 font-semibold">Statut</th>
                  <th className="py-3 px-4 font-semibold">Notes Internes</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171f2d]">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#121824]/40 transition-colors">
                    <td className="py-3 px-4 text-[#758498]">
                      <div className="font-bold text-white">#{b.id}</div>
                      <div className="text-[10px]">{b.created_at.split('T')[0]}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{b.full_name}</div>
                      <div className="text-[11px] text-[#93a2b7]">{b.city}</div>
                      <div className="text-[11px] text-[#d4af37] font-medium">{b.phone}</div>
                      {b.email && <div className="text-[10px] text-[#718196]">{b.email}</div>}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#f3e5ab]">{b.package_name}</div>
                      <div className="text-[10px] text-[#7d8ea3]">{b.participants} invité(s)</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{b.preferred_date}</div>
                      <div className="text-[11px] text-[#8c9bb0]">{b.preferred_time}</div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        disabled={updatingId === b.id}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                          b.status === 'New'
                            ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                            : b.status === 'Confirmed'
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                            : b.status === 'Contacted'
                            ? 'bg-blue-950/40 text-blue-300 border-blue-500/40'
                            : b.status === 'Completed'
                            ? 'bg-purple-950/40 text-purple-300 border-purple-500/40'
                            : 'bg-red-950/40 text-red-300 border-red-500/40'
                        }`}
                      >
                        <option value="New">New (À traiter)</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      {editingNotesId === b.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#131926] border border-[#2a354b] text-white text-xs"
                            placeholder="Note interne..."
                          />
                          <button
                            onClick={() => handleSaveNotes(b.id)}
                            className="p-1 rounded bg-[#d4af37] text-black"
                            title="Sauvegarder"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="p-1 rounded bg-[#1f2738] text-white"
                            title="Annuler"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNotesId(b.id);
                            setTempNotes(b.admin_notes || '');
                          }}
                          className="cursor-pointer group flex items-center gap-1 text-[#8c9bb0] hover:text-white"
                        >
                          <span className="truncate max-w-[140px] italic">
                            {b.admin_notes || 'Ajouter une note...'}
                          </span>
                          <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#d4af37]" />
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* WhatsApp Quick Message */}
                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(b.full_name)}%2C%20c'est%20l'%C3%A9quipe%20Kwan%20Studio%20au%20sujet%20de%20votre%20demande%20de%20r%C3%A9servation%20pour%20le%20${b.preferred_date}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#142318] hover:bg-[#1a3021] text-[#25D366] border border-[#25D366]/30 transition-colors"
                          title="WhatsApp direct"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {/* Phone call */}
                        <a
                          href={`tel:${b.phone}`}
                          className="p-1.5 rounded-lg bg-[#141926] hover:bg-[#1c2436] text-[#8ea0b7] hover:text-white border border-[#242e42] transition-colors"
                          title="Appeler"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 rounded-lg bg-[#241416] hover:bg-[#331a1d] text-red-400 border border-red-500/20 transition-colors"
                          title="Supprimer la réservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
