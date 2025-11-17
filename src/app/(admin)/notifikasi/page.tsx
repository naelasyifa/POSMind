'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import { Trash2, CheckCircle2, AlertTriangle, PlusSquare } from 'lucide-react'
import HapusNotif from './components/HapusNotif'

type Notifikasi = {
  id: number
  jenis: 'Transaksi' | 'Produk' | 'Peringatan'
  status: 'Belum Dibaca' | 'Dibaca'
  judul: string
  pesan: string
  tanggal: string
  ikon: 'berhasil' | 'gagal' | 'warning' | 'baru'
}

export default function NotifikasiAdmin() {
  const [tab, setTab] = useState<'Semua' | 'Belum Dibaca' | 'Transaksi' | 'Produk'>('Semua')
  const [data, setData] = useState<Notifikasi[]>([
    {
      id: 1,
      jenis: 'Peringatan',
      status: 'Belum Dibaca',
      judul: 'Peringatan Stok Rendah',
      pesan: 'Pemberitahuan bahwa beberapa barang berikut hampir habis stoknya.',
      tanggal: '07/04/24',
      ikon: 'warning',
    },
    {
      id: 2,
      jenis: 'Transaksi',
      status: 'Belum Dibaca',
      judul: 'Transaksi Berhasil',
      pesan: 'Transaksi #INV-104 berhasil menggunakan QRIS.',
      tanggal: '07/04/24',
      ikon: 'berhasil',
    },
    {
      id: 3,
      jenis: 'Transaksi',
      status: 'Belum Dibaca',
      judul: 'Transaksi Gagal',
      pesan: 'Pembayaran #INV-099 gagal diproses oleh gateway.',
      tanggal: '07/04/24',
      ikon: 'gagal',
    },
    {
      id: 4,
      jenis: 'Produk',
      status: 'Belum Dibaca',
      judul: 'Berhasil Menambahkan Produk',
      pesan: 'Produk baru “Chicken Parmigiana” berhasil ditambahkan.',
      tanggal: '07/04/24',
      ikon: 'baru',
    },
  ])

  // 🧩 State untuk modal hapus
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNotif, setSelectedNotif] = useState<Notifikasi | null>(null)

  // Fungsi hapus
  const handleDelete = (id: number) => {
    setData(data.filter((n) => n.id !== id))
  }

  // Fungsi konfirmasi hapus
  const handleConfirmDelete = () => {
    if (selectedNotif) {
      handleDelete(selectedNotif.id)
      setSelectedNotif(null)
    }
  }

  const handleMarkAllRead = () => {
    setData(data.map((n) => ({ ...n, status: 'Dibaca' })))
  }

  const filteredData = data.filter((n) => {
    if (tab === 'Semua') return true
    if (tab === 'Belum Dibaca') return n.status === 'Belum Dibaca'
    if (tab === 'Transaksi') return n.jenis === 'Transaksi'
    if (tab === 'Produk') return n.jenis === 'Produk'
    return true
  })

  const getIcon = (ikon: Notifikasi['ikon']) => {
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
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Notifikasi" showBack={true} />
        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-6">
            {/* Header Notifikasi */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-black">Notifikasi</h2>
                <p className="text-sm text-gray-700">
                  Terdapat {data.filter((n) => n.status === 'Belum Dibaca').length} pesan belum dibaca
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
              {['Semua', 'Belum Dibaca', 'Transaksi', 'Produk'].map((t) => (
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
                  className="bg-white rounded-lg shadow-sm flex justify-between items-center p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(n.ikon)}</div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">{n.judul}</h3>
                      <p className="text-sm text-gray-600">{n.pesan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">{n.tanggal}</span>
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
        notifTitle={selectedNotif?.judul || ''}
      />
    </div>
  )
}
