'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Edit, Trash2 } from 'lucide-react'
import AddProduct from './tambahProduk copy'
import EditProduct from './editProduct'
import HapusProduct from './hapus'
import FilterProduct from './filterProduct'

type Product = {
  id: string
  nama: string
  stok: number
  status: string
  kategori: { id: string; nama: string }
  harga: number
  gambar?: { id: string; url: string }
  sku?: string
  useAutoSku?: boolean
}

type Filter = {
  search: string
  status?: string
  category?: string
  stok?: 'Tersedia' | 'Habis'
  priceMin?: number
  priceMax?: number
}

type ListProductProps = {
  onModalChange: (open: boolean) => void
  products?: Product[]
  activeCategory?: string
}

export default function ListProduct({
  onModalChange,
  products: initialProducts,
  activeCategory,
}: ListProductProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || [])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filter, setFilter] = useState<Filter>({
    search: '',
  })

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null)

  // Fetch produk dari API Payload
  useEffect(() => {
    fetch('/api/frontend/menu')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setFilteredProducts(data) // awalnya tampil semua
      })
      .catch(console.error)
  }, [])

  // Update filter.category saat activeCategory berubah
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      category: activeCategory && activeCategory !== 'Semua' ? activeCategory : undefined,
    }))
  }, [activeCategory])

  // ADD PRODUCT
  const handleAddProduct = (newProductInput: Product) => {
    // cukup update state frontend
    setProducts((prev) => [...prev, newProductInput])
    setIsAddModalOpen(false)
    onModalChange(false)
  }

  // Terapkan filter setiap kali filter berubah
  useEffect(() => {
    const result = products.filter((p) => {
      if (filter.search && !p.nama.toLowerCase().includes(filter.search.toLowerCase())) return false
      if (filter.status && p.status !== filter.status) return false
      if (filter.category && p.kategori?.nama !== filter.category) return false
      if (filter.stok) {
        if (filter.stok === 'Tersedia' && p.stok <= 0) return false
        if (filter.stok === 'Habis' && p.stok > 0) return false
      }
      if (filter.priceMin !== undefined && p.harga < filter.priceMin) return false
      if (filter.priceMax !== undefined && p.harga > filter.priceMax) return false
      return true
    })
    setFilteredProducts(result)
  }, [filter, products])

  // EDIT PRODUCT
  const handleEditClick = (product: Product, index: number) => {
    setSelectedProduct(product)
    setSelectedProductIndex(index)
    setIsEditModalOpen(true)
    onModalChange(true)
  }

  const handleSaveEdit = async (updatedProduct: Product) => {
    try {
      const res = await fetch('/api/frontend/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedProduct.id,
          nama: updatedProduct.nama,
          stok: updatedProduct.stok,
          harga: updatedProduct.harga,
          kategori: updatedProduct.kategori.id, // ✓ ID kategori
          gambar: updatedProduct.gambar?.id || null, // ✓ ID media
          status: updatedProduct.status,
          sku: updatedProduct.sku, // optional
          useAutoSku: updatedProduct.useAutoSku, // optional
        }),
      })
      const updated = await res.json()
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setSelectedProduct(null)
      setIsEditModalOpen(false)
      onModalChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  // DELETE PRODUCT
  const handleDeleteClick = (product: Product, index: number) => {
    setSelectedProduct(product)
    setSelectedProductIndex(index)
    setIsDeleteModalOpen(true)
    onModalChange(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return
    try {
      await fetch('/api/frontend/menu', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProduct.id }),
      })
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))
      setIsDeleteModalOpen(false)
      setSelectedProduct(null)
      onModalChange(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex gap-4">
      {/* Filter */}
      <FilterProduct
        categories={Array.from(new Set(products.map((p) => p.kategori.nama)))}
        onFilterChange={(newFilter) =>
          setFilter({
            search: newFilter.search || '', // pastikan selalu string
            status: newFilter.status,
            category: newFilter.category,
            stok: newFilter.stok as 'Tersedia' | 'Habis' | undefined,
            priceMin: newFilter.priceMin,
            priceMax: newFilter.priceMax,
          })
        }
      />

      {/* List Produk */}
      <div className="flex-1 bg-white rounded-xl shadow p-5 flex flex-col w-[730px] h-[600px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
          <h3 className="font-semibold text-lg">Daftar Produk</h3>
          <button
            onClick={() => {
              setIsAddModalOpen(true)
              onModalChange(true)
            }}
            className="bg-[#52BFBE] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#43a9a8] transition"
          >
            + Tambah Produk
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 pr-1">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between py-3 px-2 rounded-lg border-b"
            >
              {/* Image + Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image
                    src={product.gambar?.url || '/images/image-placeholder.png'}
                    alt={product.nama}
                    fill
                    className="object-cover rounded-md border"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm truncate">{product.nama}</p>
                  <p className="text-xs text-gray-500">Stok Produk</p>
                  <p className="text-xs text-[#52BFBE] font-medium">{product.stok} Tersedia</p>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-end">
                {/* Id */}
                <div className="text-sm text-gray-700 w-15">
                  <p className="font-medium">Id</p>
                  <p>{product.id}</p>
                </div>

                {/* Status */}
                <div className="text-sm text-gray-700 w-15">
                  <p className="font-medium">Status</p>
                  <p>{product.status}</p>
                </div>

                {/* Category */}
                <div className="text-sm text-gray-700 w-18">
                  <p className="font-medium">Kategori</p>
                  <p>{product.kategori?.nama || '-'}</p>
                </div>

                {/* Price + Actions */}
                <div className="text-sm w-20">
                  <p className="font-medium">Harga</p>
                  <p className="font-semibold">Rp {product.harga.toLocaleString()}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsEditModalOpen(true)
                      onModalChange(true)
                    }}
                    className="p-2 bg-white border border-[#52bfbe] hover:bg-[#52bfbe] hover:text-white rounded transition-all"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsDeleteModalOpen(true)
                      onModalChange(true)
                    }}
                    className="p-2 bg-white border border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add */}
      <AddProduct
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          onModalChange(false)
        }}
        onAdd={handleAddProduct}
      />

      {/* Edit */}
      <EditProduct
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          onModalChange(false)
        }}
        productData={selectedProduct}
        onSave={handleSaveEdit}
      />

      {/* Delete */}
      <HapusProduct
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          onModalChange(false)
        }}
        productName={selectedProduct?.nama || ''}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
