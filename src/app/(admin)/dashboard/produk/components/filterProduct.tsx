'use client'

import { useState } from 'react'

export default function FilterProduct() {
  const [status, setStatus] = useState('Semua')

  return (
    <div className="bg-white rounded-xl shadow p-5 w-[320px] h-[500px]">
      {/* Search Produk */}
      <div className="mb-4">
        <p className="font-semibold mb-1">Cari Produk</p>

        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama produk..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm
                 focus:outline-none focus:border-[#52BFBE]"
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
          {[
            { label: 'Semua', count: 150 },
            { label: 'Aktif', count: 120 },
            { label: 'Draft', count: 10 },
            { label: 'Non-Aktif', count: 10 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setStatus(item.label)}
              className={`flex justify-between items-center border rounded-lg py-2 px-3 text-sm transition ${
                status === item.label
                  ? 'bg-[#52BFBE] text-white border-[#52BFBE]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#52BFBE]'
              }`}
            >
              <span>{item.label}</span>
              <span>{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stok */}
      <div className="mt-4">
        <p className="font-semibold mb-2">Stok</p>
        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]">
          <option>Tersedia</option>
          <option>Habis</option>
        </select>
      </div>

      {/* Harga */}
      <div className="mt-4">
        <p className="font-semibold mb-2">Harga</p>
        <div className="flex items-center gap-2 w-full">
          <div className="flex flex-1 min-w-0 items-center border border-gray-300 rounded-lg px-3 py-2">
            <input type="number" placeholder="0" className="w-full outline-none text-sm" />
            <span className="text-[#52BFBE] text-sm ml-1">Rp</span>
          </div>

          <span className="text-gray-700">-</span>

          <div className="flex flex-1 min-w-0 items-center border border-gray-300 rounded-lg px-3 py-2">
            <input type="number" placeholder="0" className="w-full outline-none text-sm" />
            <span className="text-[#52BFBE] text-sm ml-1">Rp</span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button className="mt-10 w-full bg-[#52BFBE] text-white font-medium py-2.5 rounded-lg hover:bg-[#43a9a8] transition">
        Reset Filters
      </button>
    </div>
  )
}
