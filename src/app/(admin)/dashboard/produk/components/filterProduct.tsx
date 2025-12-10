'use client'

import { useState } from 'react'

interface FilterProductProps {
  categories: string[] // daftar kategori dari backend
  onFilterChange: (filters: {
    search?: string
    status?: string
    category?: string
    stok?: string
    priceMin?: number
    priceMax?: number
  }) => void
}

export default function FilterProduct({ categories, onFilterChange }: FilterProductProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Semua')
  const [category, setCategory] = useState('')
  const [stok, setStok] = useState('Semua')
  const [priceMin, setPriceMin] = useState<number | ''>('')
  const [priceMax, setPriceMax] = useState<number | ''>('')

  const applyFilter = (newFilters: Partial<FilterProductProps['onFilterChange']>) => {
    onFilterChange({
      search,
      status: status !== 'Semua' ? status : undefined,
      category: category || undefined,
      stok: stok !== 'Semua' ? stok : undefined,
      priceMin: priceMin !== '' ? priceMin : undefined,
      priceMax: priceMax !== '' ? priceMax : undefined,
      ...newFilters,
    })
  }

  const handleReset = () => {
    setSearch('')
    setStatus('Semua')
    setCategory('')
    setStok('Semua')
    setPriceMin('')
    setPriceMax('')
    onFilterChange({})
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 w-[320px] h-[600px]">
      {/* Search Produk */}
      <div className="mb-4">
        <p className="font-semibold mb-1">Cari Produk</p>

        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama produk..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm
                 focus:outline-none focus:border-[#52BFBE]"
            onChange={(e) => {
              setSearch(e.target.value)
              applyFilter({ search: e.target.value })
            }}
          />

          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
            />
          </svg>
        </div>
      </div>

      {/* Status Produk */}
      <div>
        <p className="font-semibold mb-1">Status</p>
        <div className="grid grid-cols-2 gap-3">
          {['Semua', 'Aktif', 'Draft', 'Non-Aktif'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setStatus(item)
                applyFilter({ status: item !== 'Semua' ? item : undefined })
              }}
              className={`flex justify-between items-center border rounded-lg py-2 px-3 text-sm transition ${
                status === item
                  ? 'bg-[#52BFBE] text-white border-[#52BFBE]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#52BFBE]'
              }`}
            >
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Kategori */}
      <div className="mt-4">
        <p className="font-semibold mb-1">Kategori</p>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            applyFilter({ category: e.target.value || undefined })
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]"
        >
          <option value="">Semua</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Stok */}
      <div className="mt-4">
        <p className="font-semibold mb-2">Stok</p>
        <select
          value={stok}
          onChange={(e) => {
            setStok(e.target.value)
            applyFilter({ stok: e.target.value !== 'Semua' ? e.target.value : undefined })
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]"
        >
          <option>Semua</option>
          <option>Tersedia</option>
          <option>Habis</option>
        </select>
      </div>

      {/* Harga */}
      <div className="mt-4">
        <p className="font-semibold mb-2">Harga</p>
        <div className="flex items-center gap-2 w-full">
          <div className="flex flex-1 min-w-0 items-center border border-gray-300 rounded-lg px-3 py-2">
            <input
              type="number"
              placeholder="0"
              className="w-full outline-none text-sm"
              value={priceMin}
              onChange={(e) => {
                const val = Number(e.target.value)
                setPriceMin(val)
                applyFilter({ priceMin: val })
              }}
            />
            <span className="text-[#52BFBE] text-sm ml-1">Rp</span>
          </div>

          <span className="text-gray-700">-</span>

          <div className="flex flex-1 min-w-0 items-center border border-gray-300 rounded-lg px-3 py-2">
            <input
              type="number"
              placeholder="0"
              className="w-full outline-none text-sm"
              value={priceMax}
              onChange={(e) => {
                const val = Number(e.target.value)
                setPriceMax(val)
                applyFilter({ priceMax: val })
              }}
            />
            <span className="text-[#52BFBE] text-sm ml-1">Rp</span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="mt-10 w-full bg-[#52BFBE] text-white font-medium py-2.5 rounded-lg hover:bg-[#43a9a8] transition"
      >
        Reset Filter
      </button>
    </div>
  )
}
