'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import { Trash2, Star } from 'lucide-react'
import HapusProdukPopuler from './components/HapusProdukPopuler'

type ProdukPopuler = {
  id: number
  nama: string
  deskripsi: string
  pesan: number
  tanggal: string
  ikon: 'populer'
}

export default function ProdukPopulerPage() {
  const [data, setData] = useState<ProdukPopuler[]>([
    {
      id: 1,
      nama: 'Cheeseburger Deluxe',
      deskripsi: 'Menu favorit pelanggan, paling sering dipesan setiap hari.',
      pesan: 120,
      tanggal: '07/04/24',
      ikon: 'populer',
    },
    {
      id: 2,
      nama: 'Cappuccino Premium',
      deskripsi: 'Minuman kopi yang paling populer sepanjang hari.',
      pesan: 95,
      tanggal: '07/04/24',
      ikon: 'populer',
    },
    {
      id: 3,
      nama: 'Veggie Salad Bowl',
      deskripsi: 'Menu sehat yang menjadi pilihan pelanggan terpopuler.',
      pesan: 75,
      tanggal: '07/04/24',
      ikon: 'populer',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduk, setSelectedProduk] = useState<ProdukPopuler | null>(null)

  const handleDelete = (id: number) => {
    setData(data.filter((p) => p.id !== id))
  }

  const handleConfirmDelete = () => {
    if (selectedProduk) {
      handleDelete(selectedProduk.id)
      setSelectedProduk(null)
    }
  }

  const getIcon = () => <Star className="text-yellow-500" size={18} />

  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Produk Populer" showBack={true} />

        <div className="p-6">
          <div className="bg-white rounded-xl shadow p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-black">Produk Populer</h2>
                <p className="text-sm text-gray-700">
                  Total {data.length} produk paling banyak dipesan
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
                        Dipesan: <span className="font-bold">{p.pesan}</span> kali
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
      <HapusProdukPopuler
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        produkName={selectedProduk?.nama || ''}
      />
    </div>
  )
}
