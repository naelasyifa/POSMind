'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Edit, Trash, X } from 'lucide-react'

export default function ListProduct() {
  const [showDrawer, setShowDrawer] = useState(false)

  const products = [
    {
      id: 1,
      name: "Chicken Parmesan",
      stock: 10,
      status: "Aktif",
      category: "Chicken",
      price: 55.0,
      image: "/food1.jpg",
    },
    {
      id: 2,
      name: "Beef Burger",
      stock: 8,
      status: "Aktif",
      category: "Beef",
      price: 45.0,
      image: "/food2.jpg",
    },
    {
      id: 3,
      name: "Fried Rice",
      stock: 15,
      status: "Aktif",
      category: "Rice",
      price: 30.0,
      image: "/food3.jpg",
    },
    {
      id: 4,
      name: "Spaghetti Carbonara",
      stock: 5,
      status: "Aktif",
      category: "Pasta",
      price: 50.0,
      image: "/food4.jpg",
    },
    {
      id: 5,
      name: "Chicken Curry",
      stock: 12,
      status: "Aktif",
      category: "Chicken",
      price: 60.0,
      image: "/food5.jpg",
    },
    {
      id: 6,
      name: "Vegetable Salad",
      stock: 20,
      status: "Aktif",
      category: "Veggie",
      price: 25.0,
      image: "/food6.jpg",
    },
  ]

  return (
    <div className="flex-1 relative">
      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow p-5 flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
          <h3 className="font-semibold text-lg">Daftar Produk</h3>
          <button
            onClick={() => setShowDrawer(true)}
            className="bg-[#52BFBE] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#43a9a8] transition"
          >
            Tambah Produk
          </button>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto flex-1 pr-1">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`flex items-center justify-between py-3 px-2 rounded-lg ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              {/* Image + Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md border"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">Stok Produk</p>
                  <p className="text-xs text-[#52BFBE] font-medium">
                    {product.stock} Tersedia
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="text-sm text-gray-700 w-28 text-center">
                <p className="font-medium">Status</p>
                <p>{product.status}</p>
              </div>

              {/* Category */}
              <div className="text-sm text-gray-700 w-28 text-center">
                <p className="font-medium">Kategori</p>
                <p>{product.category}</p>
              </div>

              {/* Price + Actions */}
              <div className="flex items-center gap-3 w-32 justify-end">
                <div className="text-sm text-right">
                  <p className="font-medium">Harga Satuan</p>
                  <p className="font-semibold">Rp {product.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-gray-600 hover:text-[#52BFBE]">
                    <Edit size={16} />
                  </button>
                  <button className="text-red-500 hover:text-red-600">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side Drawer */}
      {showDrawer && (
        <div
          className="fixed inset-0 bg-black/40 z-20 flex justify-end"
          onClick={() => setShowDrawer(false)}
        >
          <div
            className="bg-white w-[400px] h-full shadow-lg p-6 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold">Tambah Produk</h2>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form content */}
            <form className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nama Produk"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]"
              />
              <input
                type="number"
                placeholder="Harga"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]"
              />
              <input
                type="number"
                placeholder="Stok"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]"
              />
              <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]">
                <option value="">Pilih Kategori</option>
                <option value="Chicken">Chicken</option>
                <option value="Beef">Beef</option>
                <option value="Rice">Rice</option>
              </select>
              <button
                type="submit"
                className="mt-2 bg-[#52BFBE] text-white font-medium py-2 rounded-lg hover:bg-[#43a9a8] transition"
              >
                Simpan Produk
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
