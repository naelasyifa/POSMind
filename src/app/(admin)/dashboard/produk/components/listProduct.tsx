'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Edit, Trash2 } from 'lucide-react'
import AddProduct from './tambahProduk'
import EditProduct from './editProduct'
import HapusProduct from './hapus'

type Product = {
  id: number
  name: string
  stock: number
  status: string
  category: string
  price: number
  image: string
}

type ListProductProps = {
  onModalChange: (open: boolean) => void
}

export default function ListProduct({ onModalChange }: ListProductProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null)

  const initialProducts: Product[] = [
    {
      id: 1,
      name: 'Chicken Parmesan',
      stock: 10,
      status: 'Aktif',
      category: 'Chicken',
      price: 55.0,
      image: '/images/chicken_parmesan.jpg',
    },
    {
      id: 2,
      name: 'Beef Burger',
      stock: 8,
      status: 'Aktif',
      category: 'Beef',
      price: 45.0,
      image: '/images/chicken_parmesan.jpg',
    },
    {
      id: 3,
      name: 'Fried Rice',
      stock: 15,
      status: 'Aktif',
      category: 'Rice',
      price: 30.0,
      image: '/images/chicken_parmesan.jpg',
    },
    {
      id: 4,
      name: 'Spaghetti Carbonara',
      stock: 5,
      status: 'Aktif',
      category: 'Pasta',
      price: 50.0,
      image: '/images/chicken_parmesan.jpg',
    },
    {
      id: 5,
      name: 'Chicken Curry',
      stock: 12,
      status: 'Aktif',
      category: 'Chicken',
      price: 60.0,
      image: '/images/chicken_parmesan.jpg',
    },
    {
      id: 6,
      name: 'Vegetable Salad',
      stock: 20,
      status: 'Aktif',
      category: 'Veggie',
      price: 25.0,
      image: '/images/chicken_parmesan.jpg',
    },
  ]

  const [product, setProduct] = useState<Product[]>(initialProducts)

  // ADD PRODUCT
  const handleAddProduct = (newProductInput: Omit<Product, 'status' | 'id'>) => {
    const newProduct: Product = {
      id: product.length + 1,
      name: newProductInput.name,
      category: newProductInput.category,
      stock: newProductInput.stock,
      price: newProductInput.price,
      status: 'Aktif',
      image: newProductInput.image || '/default.jpg',
    }

    setProduct((prev) => [...prev, newProduct])
    setIsAddModalOpen(false)
  }

  // EDIT PRODUCT
  const handleEditClick = (product: Product, index: number) => {
    setSelectedProduct(product)
    setSelectedProductIndex(index)
    setIsEditModalOpen(true)
    onModalChange(true)
  }

  const handleSaveEdit = (updatedProduct: Product) => {
    if (selectedProductIndex !== null) {
      setProduct((prev) => prev.map((p, i) => (i === selectedProductIndex ? updatedProduct : p)))
    }

    setSelectedProduct(null)
    setSelectedProductIndex(null)
    setIsEditModalOpen(false)
  }

  // DELETE PRODUCT
  const handleDeleteClick = (product: Product, index: number) => {
    setSelectedProduct(product)
    setSelectedProductIndex(index)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedProductIndex !== null) {
      setProduct((prev) => prev.filter((_, i) => i !== selectedProductIndex))
    }

    setSelectedProduct(null)
    setSelectedProductIndex(null)
    setIsDeleteModalOpen(false)
  }

  return (
    <div className="flex-1 relative">
      <div className="bg-white rounded-xl shadow p-5 flex flex-col h-[600px]">
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
            Tambah Produk
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 pr-1">
          {product.map((product, index) => (
            <div
              key={product.id}
              className={`flex items-center justify-between py-3 px-2 rounded-lg ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              {/* Image + Info */}
              <div className="flex items-center gap-3 flex-1 w-50 min-w-0">
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
                  <p className="text-xs text-[#52BFBE] font-medium">{product.stock} Tersedia</p>
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
                <p>{product.category}</p>
              </div>

              {/* Price + Actions */}
                <div className="text-sm w-15">
                  <p className="font-medium">Harga</p>
                  <p className="font-semibold">Rp {product.price.toFixed(2)}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(product, index)}
                    className="p-2 bg-gray-100 hover:bg-[#3ABAB4] hover:text-white rounded transition-all"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(product, index)}
                    className="p-2 bg-gray-100 hover:bg-red-500 hover:text-white text-red-500 rounded transition-all"
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
        productName={selectedProduct?.name || ''}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
