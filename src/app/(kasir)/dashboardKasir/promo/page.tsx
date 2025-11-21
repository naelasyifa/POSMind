'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function PromoPage() {
  const [dataPromo, setDataPromo] = useState([
    {
      id: 1,
      nama: 'Promo Akhir Tahun',
      deskripsi: 'Diskon hingga 50% untuk semua produk',
      tanggal: '2025-11-25',
      gambar: '/promo1.jpg',
      status: 'aktif',
    },
    {
      id: 2,
      nama: 'Promo Pembukaan Cabang',
      deskripsi: 'Hanya hari ini! Cashback 20%',
      tanggal: '2025-11-20',
      gambar: '/promo2.jpg',
      status: 'nonaktif',
    },
  ])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* CONTENT */}
      <div className="flex-1">
        <HeaderKasir title="Promo" />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Daftar Promo
            </h1>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Plus size={18} />
              Tambah Promo
            </button>
          </div>

          {/* TABEL PROMO */}
          <div className="bg-white p-6 rounded-lg shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3">Gambar</th>
                  <th className="py-3">Nama Promo</th>
                  <th className="py-3">Deskripsi</th>
                  <th className="py-3">Tanggal</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {dataPromo.map((promo) => (
                  <tr key={promo.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <img
                        src={promo.gambar}
                        alt="promo"
                        className="w-16 h-16 rounded object-cover"
                      />
                    </td>
                    <td className="py-3">{promo.nama}</td>
                    <td className="py-3">{promo.deskripsi}</td>
                    <td className="py-3">{promo.tanggal}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          promo.status === 'aktif'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {promo.status}
                      </span>
                    </td>
                    <td className="py-3 text-center flex gap-3 justify-center">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}
