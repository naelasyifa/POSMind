'use client'
<<<<<<< HEAD

import { useState } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import { Trash2, Flame } from 'lucide-react'
import HapusProdukTerlaris from './components/HapusProdukTerlaris'

type ProdukTerlaris = {
  id: number
  nama: string
  deskripsi: string
  terjual: number
  tanggal: string
  ikon: 'terlaris'
}

export default function ProdukTerlarisPage() {
  const [data, setData] = useState<ProdukTerlaris[]>([
    {
      id: 1,
      nama: 'Beef Steak Premium',
      deskripsi: 'Menu juara dengan tingkat penjualan paling tinggi.',
      terjual: 230,
      tanggal: '07/04/24',
      ikon: 'terlaris',
    },
    {
      id: 2,
      nama: 'Chicken Crispy Deluxe',
      deskripsi: 'Sering dibeli terutama saat jam makan siang.',
      terjual: 185,
      tanggal: '07/04/24',
      ikon: 'terlaris',
    },
    {
      id: 3,
      nama: 'Matcha Latte Premium',
      deskripsi: 'Minuman terlaris sepanjang minggu ini.',
      terjual: 162,
      tanggal: '07/04/24',
      ikon: 'terlaris',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduk, setSelectedProduk] = useState<ProdukTerlaris | null>(null)

  const handleDelete = (id: number) => {
    setData(data.filter((p) => p.id !== id))
  }

  const handleConfirmDelete = () => {
    if (selectedProduk) {
      handleDelete(selectedProduk.id)
      setSelectedProduk(null)
    }
  }

  const getIcon = () => {
    return <Flame className="text-red-500" size={18} />
  }

  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Produk Terlaris" showBack={true} />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-black">Produk Terlaris</h2>
                <p className="text-sm text-gray-700">
                  Total {data.length} produk dengan penjualan tertinggi
                </p>
              </div>
            </div>

            {/* Daftar Produk */}
            <div className="space-y-3">
              {data.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-lg shadow-sm flex justify-between items-center p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon()}</div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">{p.nama}</h3>
                      <p className="text-sm text-gray-600">{p.deskripsi}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Terjual: <span className="font-bold">{p.terjual}</span> kali
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">{p.tanggal}</span>

                    <button
                      onClick={() => {
                        setSelectedProduk(p)
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

      {/* Modal Hapus */}
      <HapusProdukTerlaris
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        produkTitle={selectedProduk?.nama || ''}
      />
=======
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'

export default function ProdukTerlarisPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Produk Terlaris" showBack={true} />
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-4">Semua Produk Terlaris</h1>
          <p>Daftar lengkap produk terlaris muncul di sini...</p>
        </div>
      </div>
>>>>>>> a89ce25388a2ec03ec79f5e49a36daa34cd4f6d5
    </div>
  )
}
