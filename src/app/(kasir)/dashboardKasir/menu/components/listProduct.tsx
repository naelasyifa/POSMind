'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Edit, Trash2, Package, MoreVertical } from 'lucide-react'
import EditProduct from './editProduct'
import HapusProduct from './hapusProduct'
import ReqPermission from './requestPermission'

type Product = {
  id: string
  nama: string
  stok: number
  status: string
  kategori: { nama: string }
  harga: number
  gambar?: { url: string }
  sku?: string
  useAutoSku?: boolean
}

type ListProductProps = {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  onModalChange: (open: boolean) => void
  hasPermission: boolean
  activeCategory: string
  setActiveCategory: (cat: string) => void
  search: string
  setSearch: (value: string) => void
  categories: Array<{ id: number; name: string; count: number; icon: any }>
  onEditCategory?: (cat: any) => void
  onDeleteCategory?: (cat: any) => void
  setIsAddProductOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ListProduct({
  products,
  setProducts,
  onModalChange,
  hasPermission,
  activeCategory,
  setActiveCategory,
  search,
  setSearch,
  categories,
  onEditCategory,
  onDeleteCategory,
  setIsAddProductOpen,
}: ListProductProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [categoryMenuOpen, setCategoryMenuOpen] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null)
  const [isActionOpen, setIsActionOpen] = useState<number | null>(null)

  // Filter produk
  const filteredProducts = products.filter((p) => {
    const categoryMatch = activeCategory === 'Semua' || p.kategori.nama === activeCategory
    const searchMatch = p.nama.toLowerCase().includes(search.toLowerCase())
    return categoryMatch && searchMatch
  })

  const handleEditClick = (product: Product, index: number) => {
    if (!hasPermission) {
      setIsPermissionModalOpen(true)
      return
    }

    setSelectedProduct(product)
    setSelectedProductIndex(index)
    setIsEditModalOpen(true)
    onModalChange(true)
  }

  const handleDeleteClick = (product: Product, index: number) => {
    if (!hasPermission) {
      setIsPermissionModalOpen(true)
      return
    }

    setSelectedProduct(product)
    setSelectedProductIndex(index)
    setIsDeleteModalOpen(true)
  }

  const handleSaveEdit = (updatedProduct: Product) => {
    if (selectedProductIndex !== null) {
      setProducts((prev) => prev.map((p, i) => (i === selectedProductIndex ? updatedProduct : p)))
    }

    setSelectedProduct(null)
    setSelectedProductIndex(null)
    setIsEditModalOpen(false)
  }

  const handleConfirmDelete = () => {
    if (selectedProductIndex !== null) {
      setProducts((prev) => prev.filter((_, i) => i !== selectedProductIndex))
    }

    setSelectedProduct(null)
    setSelectedProductIndex(null)
    setIsDeleteModalOpen(false)
  }

  const handleCategoryMenuClick = (e: React.MouseEvent, catId: number) => {
    e.stopPropagation()
    setCategoryMenuOpen(categoryMenuOpen === catId ? null : catId)
  }

  return (
    <div className="flex-1 relative space-y-4">
      {/* Category Cards */}

      <div className="flex gap-4 flex-wrap">
        {categories.map((cat) => {
          const Icon = cat.icon || Package
          const isActive = cat.name === activeCategory

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`relative w-28 h-28 rounded-2xl p-3 shadow transition-all hover:shadow-lg flex flex-col justify-start gap-y-1
  ${isActive ? 'bg-[#737373] text-white' : 'bg-white text-gray-800'}`}
            >
              {/* Ikon kanan atas */}
              <div className="absolute top-2 right-2 pt-3 pr-3">
                <Icon size={28} />
              </div>

              {/* Nama kategori */}
              <div className="flex-1 flex items-end mt-3 pl-2">
                <p className="font-semibold text-sm text-center">{cat.name}</p>
              </div>

              {/* Bawah: jumlah produk kiri, titik tiga kanan */}
              <div className="flex justify-between items-center w-full pl-2">
                <p className="text-xs">{cat.count}</p>

                {cat.name !== 'Semua' && (
                  <div className="relative">
                    {/* ganti button -> div/span */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCategoryMenuClick(e, cat.id)
                      }}
                      className={`p-1 rounded hover:bg-opacity-20 cursor-pointer ${
                        isActive ? 'hover:bg-white' : 'hover:bg-gray-200'
                      }`}
                    >
                      <MoreVertical size={16} />
                    </div>

                    {categoryMenuOpen === cat.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg z-10">
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            setCategoryMenuOpen(null)
                            onEditCategory?.(cat)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700 text-sm rounded-t-lg cursor-pointer"
                        >
                          <Edit size={14} /> Edit
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            setCategoryMenuOpen(null)
                            onDeleteCategory?.(cat)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-500 text-sm rounded-b-lg cursor-pointer"
                        >
                          <Trash2 size={14} /> Hapus
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Search + Tambah Produk */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full bg-white rounded-lg pl-10 pr-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#52BFBE] shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <button
          onClick={() => {
            if (!hasPermission) {
              setIsPermissionModalOpen(true)
              return
            }
            setIsAddProductOpen(true)
            onModalChange(true)
          }}
          className="bg-[#737373] text-white hover:bg-[#5E5E5E] px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col">
        <div className="overflow-y-auto flex-1 pr-1">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="pl-3 pb-3 w-[100px]">ID</th>
                <th className="pl-3 pb-3 w-[130px]">SKU</th>
                <th className="pb-3 w-[300px]">Produk</th>
                <th></th>
                <th className="pb-3 w-[80px]">Stok</th>
                <th className="pb-3 w-[80px]">Status</th>
                <th className="pb-3 w-[120px]">Kategori</th>
                <th className="pb-3 w-[120px]">Harga</th>
                <th className="pb-3 w-[100px]">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3">{product.id}</td>
                  <td className="p-3 text-sm font-normal">{product.sku}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <Image
                          src={
                            product.gambar?.url && product.gambar.url !== ''
                              ? product.gambar.url
                              : '/images/image-placeholder.png'
                          }
                          alt={product.nama || 'placeholder'}
                          fill
                          className="object-cover rounded-md border bg-gray-200"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{product.nama}</p>
                      </div>
                    </div>
                  </td>

                  <td></td>
                  <td className="py-3">{product.stok}</td>
                  <td className="py-3">{product.status}</td>
                  <td className="py-3">{product.kategori.nama}</td>
                  <td className="py-3 font-semibold">Rp {product.harga.toLocaleString()}</td>

                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(product, index)}
                        className="p-2 bg-white border border-[#52bfbe] hover:bg-[#52bfbe] hover:text-white rounded transition-colors"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(product, index)}
                        className="p-2 bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ReqPermission
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        actionName="mengubah produk"
      />
      <EditProduct
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productData={selectedProduct}
        onSave={handleSaveEdit}
      />
      <HapusProduct
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productName={selectedProduct?.nama || ''}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
