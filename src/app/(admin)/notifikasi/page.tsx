'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import { Trash2, CheckCircle2, AlertTriangle, PlusSquare } from 'lucide-react'
import HapusNotif from './components/HapusNotif'

type Notifikasi = {
  id: string
  type: 'transaksi' | 'produk' | 'promo' | 'reservasi' | 'peringatan'
  icon: 'berhasil' | 'gagal' | 'warning' | 'baru'
  tipe: string
  isRead: boolean
  title: string
  message: string
  createdAt: string
}

export default function NotifikasiAdmin() {
  const [tab, setTab] = useState<
    'Semua' | 'Belum Dibaca' | 'Transaksi' | 'Produk' | 'Promo' | 'Reservasi'
  >('Semua')
  const [data, setData] = useState<Notifikasi[]>([])

  // 🧩 State untuk modal hapus
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNotif, setSelectedNotif] = useState<Notifikasi | null>(null)

  // Map tab ke filter API
  const filterMap: Record<string, string> = {
    Semua: 'all',
    'Belum Dibaca': 'unread',
    Transaksi: 'transaksi',
    Produk: 'produk',
    Promo: 'promo',
    Reservasi: 'reservasi',
  }

  // Ambil data notifikasi dari API
  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const filter = filterMap[tab] || 'all'
        const res = await fetch(`/api/frontend/notifications?filter=${filter}`, {
          credentials: 'include',
        })

        const json = await res.json()
        if (json.success) setData(json.docs || [])
      } catch (err) {
        console.error('Gagal ambil notifikasi', err)
      }
    }

    fetchNotif()
  }, [tab])

  // Tandai satu notifikasi dibaca
  const handleMarkOneRead = async (id: string) => {
    try {
      await fetch('/api/frontend/notifications/mark-one', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        credentials: 'include',
      })

      setData((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    } catch (err) {
      console.error('Gagal mark one read', err)
    }
  }

  // Fungsi tandai semua dibaca
  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/frontend/notifications/mark-all', {
        method: 'PATCH',
        credentials: 'include',
      })

      setData((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Gagal mark all read', err)
    }
  }

  // Fungsi hapus 1 notifikasi
  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/frontend/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }), // kirim id di body
      })

      // Update state supaya langsung hilang dari UI
      setData((prev) => prev.filter((n) => n.id !== id))
    } catch (err) {
      console.error('Gagal hapus notifikasi:', err)
    }
  }

  // Fungsi konfirmasi hapus
  const handleConfirmDelete = () => {
    if (selectedNotif) {
      handleDelete(selectedNotif.id)
      setSelectedNotif(null)
    }
  }

  const filteredData = data.filter((n) => {
    if (tab === 'Semua') return true
    if (tab === 'Belum Dibaca') return !n.isRead
    if (tab === 'Transaksi') return n.type === 'transaksi'
    if (tab === 'Produk') return n.type === 'produk'
    if (tab === 'Promo') return n.type === 'promo'
    if (tab === 'Reservasi') return n.type === 'reservasi'
    return true
  })

  // 🔥 Ikon sesuai backend (icon)
  const getIcon = (icon: Notifikasi['icon']) => {
    switch (icon) {
      case 'berhasil':
        return <CheckCircle2 className="text-green-500" size={18} />
      case 'gagal':
        return <AlertTriangle className="text-red-500" size={18} />
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={18} />
      case 'baru':
        return <PlusSquare className="text-black" size={18} />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin
          title="Notifikasi"
          showBack={true}
          notifications={data.filter((n) => !n.isRead).length}
        />
        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-6">
            {/* Header Notifikasi */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-black">Notifikasi</h2>
                <p className="text-sm text-gray-700">
                  Terdapat {data.filter((n) => !n.isRead).length} pesan belum dibaca
                </p>
              </div>
              <button
                onClick={handleMarkAllRead}
                className="bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-md shadow-sm transition"
              >
                Tandai Dibaca Semua
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              {['Semua', 'Belum Dibaca', 'Transaksi', 'Produk', 'Promo', 'Reservasi'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    tab === t
                      ? 'bg-white text-[#52BFBE] shadow'
                      : 'bg-[#4AB1B0] text-white hover:bg-[#3FA3A2]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Daftar Notifikasi */}
            <div className="space-y-3">
              {filteredData.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkOneRead(n.id)} // ✅ langsung tandai dibaca
                  className={`bg-white rounded-lg shadow-sm flex justify-between items-center p-4 cursor-pointer ${
                    n.isRead ? '' : 'bg-[#E0F7F6]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(n.icon)}</div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">{n.title}</h3>
                      <p className="text-sm text-gray-600">{n.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedNotif(n)
                        setIsModalOpen(true)
                      }}
                      className="flex items-center gap-1 bg-white border border-red-400 text-red-500 hover:bg-red-50 text-xs px-3 py-1 rounded-md shadow-sm"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      <HapusNotif
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        notifTitle={selectedNotif?.title || ''}
      />
    </div>
  )
}
