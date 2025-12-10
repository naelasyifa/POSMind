'use client'
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import style from 'styled-jsx/style'

interface Category {
  id: string
  nama: string
  ikon?: string
  createdAt?: string
  updatedAt?: string
}

interface Product {
  id?: string | number
  nama: string
  kategori?: Category | string
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
    const cats = Array.from(
      new Set(
        products.map((p) => {
          if (!p.kategori) return 'Lainnya'
          return typeof p.kategori === 'string' ? p.kategori : p.kategori.nama
        }),
      ),
    )
    return ['Semua', ...cats]
  }, [products])

  // Filter berdasarkan kategori dan pencarian
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const catName = !p.kategori
        ? 'Lainnya'
        : typeof p.kategori === 'string'
          ? p.kategori
          : p.kategori.nama

      const matchCat = category === 'Semua' || catName === category
      const matchQuery = p.nama.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQuery
    })
  }, [products, category, query])

  const [popup, setPopup] = useState<{ open: boolean; nama: string }>({
    open: false,
    nama: '',
  })

  return (
    <>
      <div className="flex flex-col h-full p-2">
        {/* Pencarian + Riwayat */}
        <div className="flex items-start gap-2 mb-2">
          {/* Input Pencarian */}
          <div className="relative flex-1">
            <Search className="absolute h-5 w-5 left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk"
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
        <div className="flex items-center justify-between mt-2 mb-4 overflow-x-auto gap-2">
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
              onClick={() => {
                if (!p.stok || p.stok <= 0) {
                  setPopup({ open: true, nama: p.nama })
                  return
                }
                onSelect(p)
              }}
              className={`
              bg-white border rounded-lg p-3 flex flex-col justify-between relative
              ${p.stok && p.stok > 0 ? 'cursor-pointer hover:shadow-md' : 'opacity-40 cursor-not-allowed'}
            `}
            >
              {/* BADGE HABIS – POSISI YANG BENAR */}
              {(!p.stok || p.stok <= 0) && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded">
                  Habis
                </span>
              )}

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
                <div className="text-xs text-gray-500">
                  {typeof p.kategori === 'string' ? p.kategori : p.kategori?.nama || 'Lainnya'}
                </div>

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
        {/* POPUP STOK HABIS */}
        {popup.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
            <div
              id="popupBox"
              className="bg-white p-6 rounded-xl shadow-lg w-[300px] text-center animate-scaleIn"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>

              <div className="text-red-600 text-lg font-bold mb-2">Stok Tidak Cukup</div>

              <p className="text-gray-700 text-sm mb-4">
                Produk <b>{popup.nama}</b> tidak dapat ditambahkan karena stok sudah habis.
              </p>

              <button
                onClick={() => {
                  const el = document.getElementById('popupBox')
                  el?.classList.remove('animate-scaleIn')
                  el?.classList.add('animate-scaleOut')

                  setTimeout(() => {
                    setPopup({ open: false, nama: '' })
                  }, 220)
                }}
                className="bg-[#52bfbe] text-white px-4 py-2 rounded-lg hover:bg-[#46aead] transition"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Animasi */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes scaleOut {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(0.9);
            opacity: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.25s ease forwards;
        }

        .animate-scaleOut {
          animation: scaleOut 0.22s ease forwards;
        }
      `}</style>
    </>
  )
}
