'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import CategoryList from './components/kategori'
import MenuTabs from './components/menuTabs'
import SearchBar from './components/searchBar'
import ProductTable from './components/productTable'
import ProductList from './components/listProduct'
import ReqPermission from './components/requestPermission'
import AddProduct from './components/tambahProduk'
import AddKategori from './components/tambahKategori'
import EditKategori from './components/editKategori'
import DeleteKategori from './components/hapusKategori'
import { Pizza, Sandwich, Drumstick, CupSoda, Fish, Croissant, Package } from 'lucide-react'

import type { CategoryItem } from './components/kategori'
type Product = {
  id: number
  name: string
  stock: number
  status: string
  category_id: number
  price: number
  image: string
}

export default function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasPermission] = useState(false)
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddKategoriOpen, setIsAddKategoriOpen] = useState(false)

  const handleModalChange = (open: boolean) => {
    console.log('Modal status:', open)
    setIsModalOpen(open)
  }

  const handleAddProduct = (newProductInput: Omit<Product, 'id' | 'status'>) => {
    const newProduct: Product = {
      id: products.length + 1,
      name: newProductInput.name,
      category_id: newProductInput.category_id,
      stock: newProductInput.stock,
      price: newProductInput.price,
      status: 'Aktif',
      image: newProductInput.image || '/default.jpg',
    }
    setProducts((prev) => [...prev, newProduct])
    setIsAddProductOpen(false)
  }
  const handleEditProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 1, name: 'Semua', count: 116, icon: Package },
    { id: 2, name: 'Pizza', count: 20, icon: Pizza },
    { id: 3, name: 'Burger', count: 15, icon: Sandwich },
    { id: 4, name: 'Ayam', count: 10, icon: Drumstick },
    { id: 5, name: 'Roti', count: 18, icon: Croissant },
    { id: 6, name: 'Minuman', count: 12, icon: CupSoda },
    { id: 7, name: 'Seafood', count: 16, icon: Fish },
  ])

  const [editOpen, setEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)

  const handleEditCategory = (cat: CategoryItem) => {
    if (!hasPermission) {
      setIsPermissionModalOpen(true)
      return
    }
    setSelectedCategory(cat)
    setEditOpen(true)
  }

  const handleSaveCategory = (updated: CategoryItem) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  const handleDeleteCategory = (cat: CategoryItem) => {
    if (!hasPermission) {
      setIsPermissionModalOpen(true)
      return
    }
    setSelectedCategory(cat)
    setIsDeleteOpen(true)
  }

  const confirmDeleteCategory = () => {
    if (!selectedCategory) return
    setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id))
    setIsDeleteOpen(false)
    setSelectedCategory(null)
  }

  return (
    <div className="flex min-h-screen bg-[ffffff]">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderKasir title="Menu" showBack={true} />
        {/* konten area */}
        <div className="px-6 py-2 bg-[#52bfbe] min-h-screen text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Kategori</h1>

            <button
              onClick={() => {
                if (!hasPermission) {
                  setIsPermissionModalOpen(true)
                  return
                }
                setIsAddKategoriOpen(true)
                handleModalChange(true)
              }}
              className="bg-[#737373] text-white hover:bg-[#5E5E5E] px-4 py-2 rounded-lg"
            >
              + Tambah Kategori
            </button>
          </div>

          <CategoryList
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />

          <div className="flex justify-between items-center mt-8 mb-2">
            <SearchBar onSearch={setSearchQuery} />
            <button
              onClick={() => {
                if (!hasPermission) {
                  setIsPermissionModalOpen(true)
                  return
                }
                setIsAddProductOpen(true)
                handleModalChange(true)
              }}
              className="bg-[#737373] text-white hover:bg-[#5E5E5E] px-4 py-2 rounded-lg"
            >
              + Tambah Produk
            </button>
          </div>
          <ProductList
            searchQuery={searchQuery}
            hasPermission={hasPermission}
            onModalChange={handleModalChange}
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </div>
      </div>

      <ReqPermission
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        actionName=" "
      />

      <AddProduct
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAdd={handleAddProduct}
      />

      <AddKategori
        isOpen={isAddKategoriOpen}
        onClose={() => setIsAddKategoriOpen(false)}
        onAdd={(newCategory) => console.log(newCategory)}
      />

      <EditKategori
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      <DeleteKategori
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        category={selectedCategory}
        onConfirmDelete={confirmDeleteCategory}
      />
    </div>
  )
}
