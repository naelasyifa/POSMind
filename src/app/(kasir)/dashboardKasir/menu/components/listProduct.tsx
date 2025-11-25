'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Edit, Trash2 } from 'lucide-react'

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
      <div className="bg-white rounded-xl shadow p-4 flex flex-col">

        {/* List */}
        <div className="overflow-y-auto flex-1 pr-1">
          <table className="w-full table-auto">
  <thead>
    <tr className="text-left text-gray-600 border-b">
      
      <th className="pl-3 pb-3 w-[100px]">ID</th>
      <th className="pb-3 w-[300px]">Produk</th>

      {/* SPACER → pushes following columns to the right */}
      <th></th>

      <th className="pb-3 w-[80px]">Stok</th>
      <th className="pb-3 w-[80px]">Status</th>
      <th className="pb-3 w-[120px]">Kategori</th>
      <th className="pb-3 w-[120px]">Harga</th>
      <th className="pb-3 w-[100px]">Aksi</th>
    </tr>
  </thead>

  <tbody className="text-gray-700">
    {product.map((product, index) => (
      <tr key={product.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>

        <td className="p-3">{product.id}</td>
        <td className="py-3">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-md border"
              />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{product.name}</p>
            </div>
          </div>
        </td>

        {/* SPACER cell */}
        <td></td>

        <td className="py-3">{product.stock}</td>
        <td className="py-3">{product.status}</td>
        <td className="py-3">{product.category}</td>
        <td className="py-3 font-semibold">
          Rp {product.price.toFixed(2)}
        </td>

        <td className="py-3">
          <div className="flex gap-2">
            <button className="p-2 bg-gray-100 hover:bg-[#3ABAB4] hover:text-white rounded">
              <Edit size={16} />
            </button>
            <button className="p-2 bg-gray-100 text-red-500 hover:bg-red-500 hover:text-white rounded">
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
    </div>
  )
}
