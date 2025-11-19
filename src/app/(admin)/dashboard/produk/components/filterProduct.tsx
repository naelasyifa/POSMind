'use client'

import { useState } from "react"

export default function FilterProduct() {
  const [status, setStatus] = useState("Semua")

  return (
    <div className="bg-white rounded-xl shadow p-5 w-[320px]">
      {/* Status Produk */}
      <div>
        <p className="font-semibold mb-3">Status Produk</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Semua", count: 150 },
            { label: "Tersedia", count: 120 },
            { label: "Habis", count: 10 },
            { label: "Draft", count: 10 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setStatus(item.label)}
              className={`flex justify-between items-center border rounded-lg py-2 px-3 text-sm transition ${
                status === item.label
                  ? "bg-[#52BFBE] text-white border-[#52BFBE]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#52BFBE]"
              }`}
            >
              <span>{item.label}</span>
              <span>{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Kategori */}
      <div className="mt-5">
        <p className="font-semibold mb-2">Kategori</p>
        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]">
          <option>All</option>
          <option>Elektronik</option>
          <option>Pakaian</option>
          <option>Makanan</option>
        </select>
      </div>

      {/* Stok */}
      <div className="mt-5">
        <p className="font-semibold mb-2">Stok</p>
        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]">
          <option>Tersedia</option>
          <option>Habis</option>
        </select>
      </div>

      {/* Jumlah */}
      <div className="mt-5">
        <p className="font-semibold mb-2">Jumlah</p>
        <input
          type="number"
          placeholder="0"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]"
        />
      </div>

      {/* Harga */}
      <div className="mt-5">
        <p className="font-semibold mb-2">Harga</p>
        <div className="flex items-center gap-2 w-full">
          <div className="flex flex-1 min-w-0 items-center border border-gray-300 rounded-lg px-3 py-2">
            <input
              type="number"
              placeholder="0"
              className="w-full outline-none text-sm"
            />
            <span className="text-[#52BFBE] text-sm ml-1">Rp</span>
          </div>

          <span className="text-gray-700">-</span>

          <div className="flex flex-1 min-w-0 items-center border border-gray-300 rounded-lg px-3 py-2">
            <input
              type="number"
              placeholder="0"
              className="w-full outline-none text-sm"
            />
            <span className="text-[#52BFBE] text-sm ml-1">Rp</span>
          </div>
        </div>
      </div>


      {/* Reset Button */}
      <button className="mt-6 w-full bg-[#52BFBE] text-white font-medium py-2.5 rounded-lg hover:bg-[#43a9a8] transition">
        Reset Filters
      </button>
    </div>
  )
}