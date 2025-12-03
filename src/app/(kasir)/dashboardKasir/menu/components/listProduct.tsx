'use client'

import Image from 'next/image'
import { Edit, Trash2, PackageSearch } from 'lucide-react'
import EditProduct from './editProduct'
import HapusProduct from './hapusProduct'
import ReqPermission from './requestPermission'
import { useState, useEffect } from 'react'

export type Product = {
  id: number
  name: string
  stock: number
  status: string
  category_id: number
  price: number
  image: string
}

type ListProductProps = {
  searchQuery: string
  hasPermission: boolean
  onModalChange: (open: boolean) => void
  products: Product[]           // ⬅️ RECEIVED FROM BACKEND/PAGE
  onEdit: (p: Product) => void  // ⬅️ READY FOR BACKEND UPDATE
  onDelete: (id: number) => void // ⬅️ READY FOR BACKEND DELETE
}

export default function ListProduct({
  searchQuery,
  hasPermission,
  onModalChange,
  products,
  onEdit,
  onDelete,
}: ListProductProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // FILTER PRODUCTS
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // --- ACTION HANDLERS ---
  const handleEditClick = (p: Product) => {
    if (!hasPermission) return setIsPermissionModalOpen(true)

    setSelectedProduct(p)
    setIsEditOpen(true)
    onModalChange(true)
  }

  const handleDeleteClick = (p: Product) => {
    if (!hasPermission) return setIsPermissionModalOpen(true)

    setSelectedProduct(p)
    setIsDeleteOpen(true)
    onModalChange(true)
  }

  return (
  <div className="flex-1 relative">
    <div className="bg-white rounded-xl shadow p-4 flex flex-col h-[500px]">

      <div className="overflow-y-auto flex-1 pr-1">
        <table className="w-full table-auto">

          {/* === HEADER ALWAYS VISIBLE === */}
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="pl-3 pb-3 w-[100px]">ID</th>
              <th className="pb-3 w-[300px]">Produk</th>
              <th></th>
              <th className="pb-3 w-[80px]">Stok</th>
              <th className="pb-3 w-[80px]">Status</th>
              <th className="pb-3 w-[120px]">Kategori</th>
              <th className="pb-3 w-[120px]">Harga</th>
              <th className="pb-3 w-[100px]">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              // === EMPTY ROW ===
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center justify-center pt-35 text-gray-500">
                    <PackageSearch size={64} className="text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Belum ada produk</p>
                    <p className="text-sm">Tambahkan produk baru untuk mulai menjual</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p, index) => (
                <tr key={p.id} className={index % 2 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="p-3">{p.id}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 relative">
                        <Image
                          src={p.image || '/placeholder.jpg'}
                          alt={p.name}
                          fill
                          className="object-cover rounded-md border"
                        />
                      </div>
                      <p className="font-semibold text-sm truncate">{p.name}</p>
                    </div>
                  </td>
                  <td></td>
                  <td>{p.stock}</td>
                  <td>{p.status}</td>
                  <td>{p.category_id}</td>
                  <td className="font-semibold">
                    Rp {p.price.toLocaleString('id-ID')}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-2 bg-white border border-[#52bfbe] hover:bg-[#52bfbe] hover:text-white rounded"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(p)}
                        className="p-2 bg-white border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>

    {/* === MODALS === */}
    <ReqPermission
      isOpen={isPermissionModalOpen}
      onClose={() => setIsPermissionModalOpen(false)}
      actionName="mengubah produk"
    />

    <EditProduct
      isOpen={isEditOpen}
      onClose={() => {
        setIsEditOpen(false)
        onModalChange(false)
      }}
      productData={selectedProduct}
      onSave={onEdit}
    />

    <HapusProduct
      isOpen={isDeleteOpen}
      onClose={() => {
        setIsDeleteOpen(false)
        onModalChange(false)
      }}
      productName={selectedProduct?.name || ''}
      onConfirm={() => selectedProduct && onDelete(selectedProduct.id)}
    />
  </div>
  )
}