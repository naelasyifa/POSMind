'use client'
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

interface Product {
  id?: string | number
  nama: string
  kategori?: string
  harga: number
  stok?: number
  // Tambahkan format Payload Media
  gambar?: {
    url: string
    filename?: string
    mimeType?: string
    sizes?: any
  }
}

interface Props {
  products?: Product[]
  onSelect: (p: Product) => void
}

export default function PesananList({ products = [], onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua')

  // Buat kategori unik, ganti undefined jadi 'Lainnya'
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.kategori || 'Lainnya')))
    return ['Semua', ...cats]
  }, [products])

  // Filter berdasarkan kategori dan pencarian
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === 'Semua' || (p.kategori || 'Lainnya') === category
      const matchQuery = p.nama.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQuery
    })
  }, [products, category, query])

  return (
    <div className="flex flex-col h-full p-2">
      {/* Pencarian + Riwayat */}
      <div className="flex items-start gap-2 mb-2">
        {/* Input Pencarian */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="pl-10 pr-3 py-2 w-full border rounded-lg"
          />
        </div>

        {/* Tombol Riwayat Transaksi */}
        <button
          onClick={() => (window.location.href = '/dashboardKasir/transaksi/riwayat')}
          className="px-4 py-2 rounded-lg whitespace-nowrap bg-[#737373] text-white hover:bg-[#5f5f5f] transition-colors"
        >
          Riwayat Transaksi
        </button>
      </div>

      {/* Filter Kategori + Items count */}
      <div className="flex items-center justify-between mb-4 overflow-x-auto gap-2">
        {/* Kategori */}
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-full text-sm transition ${
                category === cat
                  ? 'bg-[#52bfbe] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items count */}
        <div className="text-sm text-gray-500 whitespace-nowrap">Items: {filtered.length}</div>
      </div>

      {/* Daftar Produk */}
      <div
        className="grid grid-cols-4 gap-3 overflow-auto"
        style={{ maxHeight: 'calc(100% - 150px)' }}
      >
        {filtered.map((p, index) => (
          <div
            key={p.id || `${p.nama}-${index}`}
            onClick={() => onSelect(p)}
            className="bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="h-20 w-full mb-2 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                {p.gambar?.url ? (
                  <img
                    src={p.gambar.url}
                    alt={p.nama}
                    className="h-full w-full object-cover rounded"
                  />
                ) : (
                  <div className="text-sm">No Image</div>
                )}
              </div>

              <div className="font-semibold truncate">{p.nama}</div>
              <div className="text-xs text-gray-500">{p.kategori || 'Lainnya'}</div>

              {/* Stok warna dinamis */}
              <div
                className={`text-xs mt-1 ${
                  p.stok && p.stok > 0 ? 'text-[#52bfbe]' : 'text-red-500'
                }`}
              >
                Stok {p.stok ?? 0}
              </div>
            </div>

            <div className="mt-2 text-sm font-bold">Rp {p.harga.toLocaleString('id-ID')}</div>
          </div>
        ))}
      </div>

      {/* Jika tidak ada hasil */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 text-sm mt-6">
          Tidak ada produk yang ditemukan.
        </div>
      )}
    </div>
  )
}
