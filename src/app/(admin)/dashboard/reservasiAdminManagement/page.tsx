'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { Search, Users, Edit3, Trash2, Loader2, Calendar, Filter } from 'lucide-react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import EditReservationModal from './components/EditModalReservations'
import HapusReservasi from './components/HapusModalReservations'

/* ================= TYPES ================= */
export type Reservation = {
  id: string
  kodeReservasi: string
  namaPelanggan: string
  noTelepon?: string
  email?: string
  pax: number
  deposit: number
  statusPembayaran?: string
  jamMulai: string
  jamSelesai: string
  tanggal: string
  status: string
  meja?: {
    id: string
    namaMeja?: string
    nomorMeja?: string
    area?: string
    lantai?: string
  } | any
}

export default function AdminReservationFlow1() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [openEdit, setOpenEdit] = useState(false)
  const [selected, setSelected] = useState<Reservation | null>(null)
  const [showDelete, setShowDelete] = useState(false)

  // ✅ STATE TANGGAL (Default ke hari ini)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // ✅ FETCH DENGAN FILTER TANGGAL
  const fetchReservations = async () => {
    try {
      setLoading(true)
      // Menggunakan filter tanggal yang sama dengan logic kasir
      const res = await fetch(`/api/reservations?where[tanggal][equals]=${selectedDate}&limit=100&sort=-createdAt`)
      const json = await res.json()
      
      const actualData = json.docs || json.data || json
      
      if (Array.isArray(actualData)) {
        setReservations(actualData)
      } else {
        setReservations([])
      }
    } catch (err) {
      console.error("Gagal mengambil data reservasi:", err)
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch ulang setiap kali selectedDate berubah
  useEffect(() => {
    fetchReservations()
  }, [selectedDate])

  // ✅ LOGIC PENCARIAN
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      const search = searchQuery.toLowerCase()
      const namaMeja = res.meja?.namaMeja || res.meja?.nomorMeja || ''
      return (
        res.namaPelanggan?.toLowerCase().includes(search) ||
        res.kodeReservasi?.toLowerCase().includes(search) ||
        namaMeja.toLowerCase().includes(search)
      )
    })
  }, [reservations, searchQuery])

  const openDeleteModal = (reservation: Reservation) => {
    setSelected(reservation)
    setShowDelete(true)
  }

  const handleDeleteReservasi = async () => {
    if (!selected) return
    try {
      const res = await fetch(`/api/reservations/${selected.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal hapus')
      setShowDelete(false)
      fetchReservations()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#52BFBE] relative overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderAdmin title="Manajemen Reservasi" />

        <div className="flex-1 p-3">
          <div className="bg-white rounded-xl shadow-lg p-6 min-h-[85vh]">
            
            {/* HEADER & DATE FILTER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Daftar Reservasi</h2>
                <p className="text-xs text-gray-400">Menampilkan data tanggal: <span className="font-bold text-[#52BFBE]">{selectedDate}</span></p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#52BFBE] transition-all">
                  <Calendar className="text-gray-400" size={16} />
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
                  />
                </div>
                <button 
                  onClick={fetchReservations}
                  className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-[#52BFBE] transition-all"
                  title="Refresh data"
                >
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* SEARCH BAR */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari nama pelanggan, kode, atau nomor meja..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#52BFBE] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-black">
                    <th className="pb-3 text-left">Kode</th>
                    <th className="pb-3 text-left pl-4">Pelanggan</th>
                    <th className="pb-3 text-left pl-4">Meja</th>
                    <th className="pb-3 text-left pl-4">Pax</th>
                    <th className="pb-3 text-left pl-4">Waktu</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right pr-4">Deposit</th>
                    <th className="pb-3 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-[#52BFBE]" size={32} />
                      </td>
                    </tr>
                  ) : filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-20 text-center text-gray-400">
                        Tidak ada reservasi pada tanggal ini.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => (
                      <tr key={res.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-black text-[#52BFBE]">#{res.kodeReservasi}</td>
                        <td className="py-4 pl-4 font-bold text-gray-700">{res.namaPelanggan}</td>
                        <td className="py-4 pl-4">
                          <span className="font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                            {res.meja?.namaMeja || res.meja?.nomorMeja || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-1 font-bold">
                            <Users size={12} className="text-gray-400" /> {res.pax}
                          </div>
                        </td>
                        <td className="py-4 pl-4 font-medium text-gray-600">
                          {res.jamMulai} - {res.jamSelesai}
                        </td>
                        <td className="py-4 text-center">
                          <BadgeStatus status={res.status} />
                        </td>
                        <td className="py-4 text-right pr-4 font-black text-gray-700">
                          Rp {res.deposit?.toLocaleString()}
                        </td>
                        <td className="py-4">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => { setSelected(res); setOpenEdit(true); }} className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-[#52BFBE] hover:border-[#52BFBE] transition-all">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => openDeleteModal(res)} className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-500 transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {openEdit && selected && (
        <EditReservationModal
          open={openEdit}
          reservationId={selected.id}
          onClose={() => setOpenEdit(false)}
          onSuccess={fetchReservations}
          initialData={{
            tableId: typeof selected.meja === 'object' ? selected.meja.id : selected.meja || '',
            pax: selected.pax,
            date: selected.tanggal,
            startTime: selected.jamMulai,
            endTime: selected.jamSelesai,
            deposit: selected.deposit,
            status: selected.status as any,
            firstName: selected.namaPelanggan,
            lastName: '',
            phone: selected.noTelepon || '',
            email: selected.email || '',
            paymentMethod: '',
            areaType: typeof selected.meja === 'object' ? selected.meja.area : '',
            floor: typeof selected.meja === 'object' ? selected.meja.lantai : '',
            kodeReservasi: selected.kodeReservasi,
          }}
        />
      )}

      <HapusReservasi
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteReservasi}
        kodeReservasi={selected?.kodeReservasi}
        namaPelanggan={selected?.namaPelanggan}
      />
    </div>
  )
}

function BadgeStatus({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const config: any = {
    pending: { label: 'Menunggu', bg: 'bg-amber-100', text: 'text-amber-600' },
    menunggu: { label: 'Menunggu', bg: 'bg-amber-100', text: 'text-amber-600' },
    dikonfirmasi: { label: 'Dikonfirmasi', bg: 'bg-green-100', text: 'text-green-600' },
    checkin: { label: 'Check In', bg: 'bg-blue-100', text: 'text-blue-600' },
    completed: { label: 'Selesai', bg: 'bg-indigo-100', text: 'text-indigo-600' },
    selesai: { label: 'Selesai', bg: 'bg-indigo-100', text: 'text-indigo-600' },
    noshow: { label: 'Batal', bg: 'bg-red-100', text: 'text-red-600' },
  }
  const c = config[s] || config.pending
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}