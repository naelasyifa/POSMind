'use client'

import { useState, useEffect } from 'react'
import { Search, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import DeletePromo from './components/DeletePromo'
import EditPromo from './editPromo'
import TambahPromo from './tambahPromo'
import { promoData as initialData, deletePromo as deletePromoData } from './data'

type SortKey = 'id' | 'kuota' | 'mulai' | null

export default function PromoPage() {
  const [isClient, setIsClient] = useState(false)
  const [query, setQuery] = useState('')
  const [data, setData] = useState(initialData)
  const [selectedPromo, setSelectedPromo] = useState<any>(null)
  const [editPromoId, setEditPromoId] = useState<number | null>(null)
  const [tambahOpen, setTambahOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  })

  useEffect(() => setIsClient(true), [])

  // Update status otomatis jika lewat tanggal
  useEffect(() => {
    const now = new Date()
    setData((prev) =>
      prev.map((item) => {
        const akhir = new Date(item.akhir)
        if (akhir < now && item.status === 'Aktif') return { ...item, status: 'Nonaktif' }
        return item
      }),
    )
  }, [])

  const formatDateTime = (date: string) => {
    if (!isClient) return ''
    const d = new Date(date)
    return d.toLocaleString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Delete
  const handleDelete = (id: number) => {
    deletePromoData(id)
    setData(data.filter((p) => p.id !== id))
    setSelectedPromo(null)
  }

  // Tambah promo
  const handleAddPromo = (newPromo: any) => {
    // ambil ID terakhir dari data sekarang
    const nextId = data.length > 0 ? Math.max(...data.map((p) => p.id)) + 1 : 1

    setData((prev) => [...prev, { ...newPromo, id: nextId }])
    setTambahOpen(false)
  }

  // Update promo (untuk EditPromo)
  const handleUpdatePromo = (updated: any) => {
    setData((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
    setEditPromoId(null)
  }

  // Sorting
  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
  }

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUp className="inline w-3 h-3 text-gray-500 ml-1" />
      ) : (
        <ChevronDown className="inline w-3 h-3 text-gray-500 ml-1" />
      )
    }
    return <ChevronUp className="inline w-3 h-3 text-gray-300 opacity-50 ml-1" />
  }

  const sortedData = [...data]
    .filter(
      (item) =>
        item.nama.toLowerCase().includes(query.toLowerCase()) ||
        item.kode.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0
      switch (sortConfig.key) {
        case 'id':
          return sortConfig.direction === 'asc' ? a.id - b.id : b.id - a.id
        case 'kuota':
          return sortConfig.direction === 'asc' ? a.kuota - b.kuota : b.kuota - a.kuota
        case 'mulai':
          const dateA = new Date(a.mulai)
          const dateB = new Date(b.mulai)
          return sortConfig.direction === 'asc'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime()
      }
    })

  return (
    <div className="flex h-screen bg-[#52bfbe] overflow-auto">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Promo" />
        <main className="flex-1 p-4">
          <div className="bg-white rounded-xl shadow p-6">
            {/* Search + Tambah */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-sm">Promo</span>
                <div className="relative w-64 ml-6">
                  <input
                    type="text"
                    placeholder="Cari Promo"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#52bfbe]"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <button
                onClick={() => setTambahOpen(true)}
                className="bg-[#52bfbe] text-white px-4 py-2 rounded-md hover:bg-[#44a9a9] transition"
              >
                Tambah Promo
              </button>
            </div>

            {isClient && (
              <table className="w-full border-t border-gray-200 text-sm">
                <thead>
                  <tr className="border-b border-gray-300 text-center">
                    <th className="py-3 px-2 cursor-pointer" onClick={() => handleSort('id')}>
                      No {renderSortIcon('id')}
                    </th>
                    <th className="py-3 px-2">Nama Promo</th>
                    <th className="py-3 px-2">Kode</th>
                    <th className="py-3 px-2 cursor-pointer" onClick={() => handleSort('mulai')}>
                      Tanggal Promo {renderSortIcon('mulai')}
                    </th>
                    <th className="py-3 px-2">Diskon</th>
                    <th className="py-3 px-2 cursor-pointer" onClick={() => handleSort('kuota')}>
                      Kuota {renderSortIcon('kuota')}
                    </th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.length > 0 ? (
                    sortedData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-200 hover:bg-gray-50 text-center"
                      >
                        <td className="py-3 px-2">{item.id}</td>
                        <td className="py-3 px-2">{item.nama}</td>
                        <td className="py-3 px-2">{item.kode}</td>
                        <td className="py-3 px-2">
                          {formatDateTime(item.mulai)} - {formatDateTime(item.akhir)}
                        </td>
                        <td className="py-3 px-2">{item.diskon}</td>
                        <td className="py-3 px-2">{item.kuota}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`text-sm font-medium ${
                              item.status === 'Aktif' ? 'text-blue-500' : 'text-red-500'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setEditPromoId(item.id)}
                              className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
                            >
                              <Edit className="w-4 h-4 text-gray-700" />
                            </button>
                            <button
                              onClick={() => setSelectedPromo(item)}
                              className="p-1.5 rounded-md border border-gray-300 hover:bg-red-100"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-4 text-gray-500 text-center">
                        Tidak ada promo yang cocok
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* Popup Hapus */}
      {selectedPromo && (
        <DeletePromo
          promo={selectedPromo}
          onConfirm={handleDelete}
          onCancel={() => setSelectedPromo(null)}
        />
      )}

      {/* Popup Tambah */}
      {tambahOpen && <TambahPromo onClose={() => setTambahOpen(false)} onSave={handleAddPromo} />}

      {/* Popup Edit */}
      {editPromoId && (
        <EditPromo
          id={editPromoId}
          onClose={() => setEditPromoId(null)}
          onUpdate={handleUpdatePromo}
          promoData={data} // ✅ wajib dikirim
        />
      )}
    </div>
  )
}
