'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/SidebarKasir'
import HeaderAdmin from '@/components/HeaderKasir'
import { Trash2, CheckCircle2, AlertTriangle, PlusSquare } from 'lucide-react'
import HapusNotifKasir from './components/HapusNotifKasir'

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

export default function NotifikasiKasir() {
  const [tab, setTab] = useState<
    'Semua' | 'Belum Dibaca' | 'Transaksi' | 'Produk' | 'Promo' | 'Reservasi'
  >('Semua')
  const [data, setData] = useState<Notifikasi[]>([])

  // 🧩 State untuk modal hapus
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNotif, setSelectedNotif] = useState<Notifikasi | null>(null)

  // Ambil data notifikasi dari API
  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const res = await fetch('/api/frontend/notifications', {
          credentials: 'include',
        })

        const json = await res.json()
        if (json.success) setData(json.docs || [])
      } catch (err) {
        console.error('Gagal ambil notifikasi', err)
      }
    }

    fetchNotif()
  }, [])

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
        body: JSON.stringify({ id }),
      })

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

  const getIcon = (ikon: Notifikasi['icon']) => {
    switch (ikon) {
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
      <Sidebar key="notifikasi" />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin
          title="Notifikasi"
          showBack={true}
          notifications={data.filter((n) => !n.isRead).length}
        />
        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifikasi Kasir</h2>
                <p className="text-sm text-gray-500">
                  Terdapat{' '}
                  <span className="font-bold text-[#52BFBE]">
                    {data.filter((n) => !n.isRead).length}
                  </span>{' '}
                  pesan belum dibaca
                </p>
              </div>
              <button
                onClick={handleMarkAllRead}
                className="text-[#52BFBE] hover:underline text-sm font-medium transition"
              >
                Tandai Semua Dibaca
              </button>
            </div>

            {/* TAB FILTER - Style Segmented Control agar tidak menyatu dengan background */}
            <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-1.5 rounded-lg w-fit">
              {['Semua', 'Belum Dibaca', 'Transaksi', 'Produk', 'Promo', 'Reservasi'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                    tab === t
                      ? 'bg-white text-[#52BFBE] shadow-sm' // Aktif: Putih Timbul
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200' // Tidak Aktif: Abu-abu
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* DAFTAR NOTIFIKASI */}
            <div className="space-y-2">
              {filteredData.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkOneRead(n.id)}
                  className={`relative rounded-xl border transition-all duration-200 flex justify-between items-center p-4 cursor-pointer ${
                    n.isRead
                      ? 'bg-white border-gray-100'
                      : 'bg-blue-50 border-blue-100 hover:bg-blue-100'
                  }`}
                >
                  {/* Indikator Garis Samping untuk Pesan Baru */}
                  {!n.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#52BFBE] rounded-l-xl"></div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full ${n.isRead ? 'bg-gray-50' : 'bg-white shadow-sm'}`}
                    >
                      {getIcon(n.icon)}
                    </div>
                    <div>
                      <h3
                        className={`text-sm ${n.isRead ? 'font-medium text-gray-600' : 'font-bold text-gray-900'}`}
                      >
                        {n.title}
                      </h3>
                      <p className="text-sm text-gray-500">{n.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(n.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedNotif(n)
                        setIsModalOpen(true)
                      }}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredData.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  Tidak ada notifikasi dalam kategori ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <HapusNotifKasir
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        notifTitle={selectedNotif?.title || ''}
      />
    </div>
  )
}
