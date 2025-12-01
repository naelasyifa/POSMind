'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import ListProduct from './components/listProduct'
import FilterProduct from './components/filterProduct'
import Kategori from './components/kategori'
import AddKategori from './components/tambahKategori'
import EditKategori from './components/editKategori'
import DeleteKategori from './components/hapusKategori'
import type { CategoryItem } from './components/kategori'
import { Pizza, Sandwich, Drumstick, CupSoda, Fish, Croissant, Package } from 'lucide-react'

export default function ProdukPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddKategoriOpen, setIsAddKategoriOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)

  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 1, name: 'Semua', count: 116, icon: Package },
    { id: 2, name: 'Pizza', count: 20, icon: Pizza },
    { id: 3, name: 'Burger', count: 15, icon: Sandwich },
    { id: 4, name: 'Ayam', count: 10, icon: Drumstick },
    { id: 5, name: 'Roti', count: 18, icon: Croissant },
    { id: 6, name: 'Minuman', count: 12, icon: CupSoda },
    { id: 7, name: 'Seafood', count: 16, icon: Fish },
  ])

  const handleModalChange = (open: boolean) => {
    console.log('Modal status:', open)
    setIsModalOpen(open)
  }

  const handleEditCategory = (cat: CategoryItem) => {
    setSelectedCategory(cat)
    setEditOpen(true)
  }

  const handleSaveCategory = (updated: CategoryItem) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
  }

  const handleDeleteCategory = (cat: CategoryItem) => {
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
    <div className="flex min-h-screen bg-[#52bfbe] relative">
      <Sidebar />

      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderAdmin title="Produk" />

        <div className="px-4 pt-2">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-white">Kategori</h1>
            <button
              onClick={() => {
                setIsAddKategoriOpen(true)
                handleModalChange(true)
              }}
              className="bg-[#737373] text-white hover:bg-[#5E5E5E] px-4 py-2 rounded-lg"
            >
              + Tambah Kategori
            </button>
          </div>
          <Kategori
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        </div>

        {/* Filter + List */}
        <div className="flex flex-1 gap-4 px-4">
          <FilterProduct />
          <ListProduct onModalChange={setIsModalOpen} />
        </div>
      </div>

      {isModalOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />}

      <AddKategori
        isOpen={isAddKategoriOpen}
        onClose={() => {
          setIsAddKategoriOpen(false)
          handleModalChange(false)
        }}
        onAdd={(newCategory) => {
          console.log(newCategory)
          setIsAddKategoriOpen(false)
          handleModalChange(false)
        }}
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
