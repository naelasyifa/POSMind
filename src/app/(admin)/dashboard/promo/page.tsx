'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Edit, Trash2 } from 'lucide-react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'

export default function PromoPage() {
  const [query, setQuery] = useState('')

  const promoData = [
    {
      id: 1,
      nama: 'Diskon Gajian',
      kode: '123awalbulan',
      mulai: '01 Aug 2025 14:00:01',
      akhir: '03 Aug 2025 20:00:00',
      diskon: '20%',
      kuota: 25,
      status: 'Aktif',
    },
    {
      id: 2,
      nama: 'Merdeka Sale',
      kode: '17Agustus',
      mulai: '17 Aug 2025 10:00:01',
      akhir: '17 Aug 2025 14:00:00',
      diskon: '17%',
      kuota: 45,
      status: 'Aktif',
    },
  ]

  const filteredPromo = promoData.filter(
    (item) =>
      item.nama.toLowerCase().includes(query.toLowerCase()) ||
      item.kode.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-[#52bfbe] overflow-hidden">
      {/* Sidebar fixed */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Promo" />

        {/* Main content dengan scroll */}
        <main className="flex-1 p-8 pt-16 overflow-y-auto">
          <div className="bg-white rounded-xl shadow p-6">
            {/* Search dan Tambah */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Pencarian"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52bfbe]"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>

              <Link
                href="/dashboard/promo/tambah"
                className="bg-[#52bfbe] text-white px-4 py-2 rounded-md hover:bg-[#44a9a9] transition"
              >
                Tambah Promo
              </Link>
            </div>

            {/* Tabel Data - scroll hanya untuk tabel jika data banyak */}
            <div className="overflow-x-auto">
              <table className="w-full border-t border-gray-200 text-sm">
                <thead className="bg-white sticky top-0">
                  <tr className="text-left border-b border-gray-300">
                    <th className="py-3 px-2">No</th>
                    <th className="py-3 px-2">Nama Promo</th>
                    <th className="py-3 px-2">Kode</th>
                    <th className="py-3 px-2">Tanggal Promo</th>
                    <th className="py-3 px-2">Diskon</th>
                    <th className="py-3 px-2">Kuota</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPromo.map((item, i) => (
                    <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-2">{item.id}</td>
                      <td className="py-3 px-2">{item.nama}</td>
                      <td className="py-3 px-2">{item.kode}</td>
                      <td className="py-3 px-2">
                        {item.mulai} - {item.akhir}
                      </td>
                      <td className="py-3 px-2">{item.diskon}</td>
                      <td className="py-3 px-2">{item.kuota}</td>
                      <td className="py-3 px-2 text-[#52bfbe] font-medium">{item.status}</td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/dashboard/promo/edit/${item.id}`}
                            className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 text-gray-700" />
                          </Link>
                          <button
                            onClick={() => alert('Hapus Promo (nanti pakai popup)')}
                            className="p-1.5 rounded-md border border-gray-300 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPromo.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-4 text-center text-gray-500">
                        Tidak ada promo yang cocok
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
