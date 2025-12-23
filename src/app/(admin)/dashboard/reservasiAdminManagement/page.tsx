'use client'

import React, { useEffect, useState } from 'react'
import { Search, Users, Plus, Edit3, Trash2 } from 'lucide-react'
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
  status:
    | 'pending'
    | 'checkin'
    | 'completed'
    | 'noshow'
    | 'menunggu'
    | 'selesai'
    | 'dikonfirmasi'
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

  // ✅ STATE DELETE
  const [showDelete, setShowDelete] = useState(false)

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/frontend/reservations')
      const json = await res.json()
      if (json.success) setReservations(json.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  // ✅ BUKA MODAL DELETE
  const openDeleteModal = (reservation: Reservation) => {
    setSelected(reservation)
    setShowDelete(true)
  }

  // ✅ HANDLE DELETE
  const handleDeleteReservasi = async () => {
    if (!selected) return

    try {
      const res = await fetch(`/api/reservations/${selected.id}`, {
        method: 'DELETE',
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Gagal hapus reservasi')

      alert('Reservasi berhasil dihapus')
      setShowDelete(false)
      setSelected(null)
      fetchReservations()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#52BFBE] relative overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderAdmin title="Reservasi" />

        <div className="flex-1 p-3">
          <div className="bg-white rounded-xl shadow-lg p-6 min-h-[85vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Daftar Reservasi</h2>

            </div>

            <div className="relative mb-6">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari nama pelanggan atau kode reservasi..."
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 text-sm text-gray-700">
                    <th className="pb-3 text-left">Kode</th>
                    <th className="pb-3 text-left pl-4">Pelanggan</th>
                    <th className="pb-3 text-left pl-4">Meja</th>
                    <th className="pb-3 text-left pl-4">Pax & Tgl</th>
                    <th className="pb-3 text-left pl-4">Waktu</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right pr-4">Deposit</th>
                    <th className="pb-3 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-gray-400">
                        Memuat data...
                      </td>
                    </tr>
                  ) : (
                    reservations.map((res) => (
                      <tr
                        key={res.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-4 font-bold text-[#52BFBE]">
                          {res.kodeReservasi}
                        </td>

                        <td className="py-4 pl-4 font-semibold">
                          {res.namaPelanggan}
                        </td>

                        <td className="py-4 pl-4">
                          <span className="font-bold">
                            {res.meja?.namaMeja ||
                              res.meja?.nomorMeja ||
                              'N/A'}
                          </span>
                          <p className="text-[10px] text-gray-400 uppercase">
                            {res.meja?.area || 'Area'} •{' '}
                            {res.meja?.lantai || 'Lantai'}
                          </p>
                        </td>

                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-1">
                            <Users size={12} /> {res.pax}
                          </div>
                          <p className="text-[10px] text-gray-400">
                            {res.tanggal}
                          </p>
                        </td>

                        <td className="py-4 pl-4">
                          {res.jamMulai} - {res.jamSelesai}
                        </td>

                        <td className="py-4 text-center">
                          <BadgeStatus status={res.status} />
                        </td>

                        <td className="py-4 text-right pr-4 font-bold">
                          Rp {res.deposit?.toLocaleString()}
                        </td>

                        <td className="py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelected(res)
                                setOpenEdit(true)
                              }}
                              className="p-2 border-2 rounded-lg hover:bg-[#52bfbe] hover:text-white"
                            >
                              <Edit3 size={16} />
                            </button>

                            {/* ✅ DELETE */}
                            <button
                              onClick={() => openDeleteModal(res)}
                              className="p-2 border-2 border-red-300 rounded-lg text-red-600 hover:bg-red-500 hover:text-white transition-all"
                            >
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

      {/* EDIT MODAL */}
      {openEdit && selected && (
        <EditReservationModal
          open={openEdit}
          reservationId={selected.id}
          onClose={() => setOpenEdit(false)}
          onSuccess={fetchReservations}
          initialData={{
            tableId:
              typeof selected.meja === 'object'
                ? selected.meja.id
                : selected.meja || '',
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
            areaType:
              typeof selected.meja === 'object' ? selected.meja.area : '',
            floor:
              typeof selected.meja === 'object' ? selected.meja.lantai : '',
            kodeReservasi: selected.kodeReservasi,
          }}
        />
      )}

      {/* DELETE MODAL */}
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
  const config: any = {
    pending: { label: 'Menunggu', bg: 'bg-amber-100', text: 'text-amber-600' },
    menunggu: { label: 'Menunggu', bg: 'bg-amber-100', text: 'text-amber-600' },
    checkin: { label: 'Check In', bg: 'bg-blue-100', text: 'text-blue-600' },
    completed: { label: 'Selesai', bg: 'bg-green-100', text: 'text-green-600' },
    selesai: { label: 'Selesai', bg: 'bg-green-100', text: 'text-green-600' },
    noshow: { label: 'Batal', bg: 'bg-red-100', text: 'text-red-600' },
  }

  const s = config[status] || config.pending
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  )
}
