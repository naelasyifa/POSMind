'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import ListProduct from './components/listProduct'
import Kategori from './components/kategori'
import AddKategori from './components/tambahKategori'
import EditKategori from './components/editKategori'
import DeleteKategori from './components/hapusKategori'
import type { CategoryItem } from './components/kategori'
import { Pizza, Sandwich, Drumstick, CupSoda, Fish, Croissant, Package } from 'lucide-react'

const ICON_OPTIONS: { name: string; icon: any }[] = [
  { name: 'Pizza', icon: Pizza },
  { name: 'Burger', icon: Sandwich },
  { name: 'Ayam', icon: Drumstick },
  { name: 'Roti', icon: Croissant },
  { name: 'Minuman', icon: CupSoda },
  { name: 'Seafood', icon: Fish },
  { name: 'Package', icon: Package },
]

interface Product {
  id: string
  nama: string
  kategori: { id: string; nama: string } // ubah string → object
  stok: number
  status: string
  harga: number
  gambar?: { id: string; url: string }
  sku?: string
  useAutoSku?: boolean
}

export default function ProdukPage() {
  // state kategori
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 1, name: 'Semua', count: 0, icon: Package },
  ])
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('Semua')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddKategoriOpen, setIsAddKategoriOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)

  useEffect(() => {
    fetch('/api/frontend/categories')
      .then((res) => res.json())
      .then((data) => {
        const mapped = data
          .filter((c: any) => c.id !== 'all') // skip 'all' dulu
          .map((c: any) => ({
            id: c.id,
            name: c.name,
            count: c.count,
            icon:
              ICON_OPTIONS.find((i) => i.name.toLowerCase() === c.name.toLowerCase())?.icon ||
              Package,
            mediaId: c.ikon?.value?.id,
          }))

        const totalCount = data.find((c: any) => c.id === 'all')?.count || 0

        setCategories([
          {
            id: 'all',
            name: 'Semua',
            count: totalCount,
            icon: Package,
          },
          ...mapped,
        ])
      })
      .catch(console.error)
  }, [])

  const handleAddCategory = async (newCat: { name: string; iconFile?: File }) => {
    const formData = new FormData()
    formData.append('nama', newCat.name)
    if (newCat.iconFile) formData.append('iconFile', newCat.iconFile)

    const res = await fetch('/api/frontend/categories', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()

    setCategories((prev) => [
      ...prev,
      {
        id: data.id,
        name: data.nama,
        count: 0,
        icon:
          ICON_OPTIONS.find((i) => i.name.toLowerCase() === (data.nama?.toLowerCase() || ''))
            ?.icon || Package,
        mediaId: data.ikon?.value?.id,
      },
    ])
  }

  // Edit kategori
  const handleEditCategory = (cat: CategoryItem) => {
    setSelectedCategory(cat)
    setIsEditOpen(true)
  }

  const handleSaveCategory = async (updated: CategoryItem) => {
    try {
      const ikonName = ICON_OPTIONS.find((i) => i.icon === updated.icon)?.name || 'Package'
      await fetch('/api/frontend/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updated.id,
          nama: updated.name,
          ikonId: updated.mediaId,
        }),
      })
      setCategories((prev) =>
        prev.map((c) =>
          c.id === updated.id
            ? { ...c, name: updated.name, icon: updated.icon, mediaId: updated.mediaId }
            : c,
        ),
      )
      setIsEditOpen(false)
      setSelectedCategory(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleModalChange = (open: boolean) => {
    console.log('Modal status:', open)
    setIsModalOpen(open)
  }

  const handleDeleteCategory = (cat: CategoryItem) => {
    setSelectedCategory(cat)
    setIsDeleteOpen(true)
  }

  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return
    try {
      await fetch('/api/frontend/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedCategory.id }),
      })
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id))
      setIsDeleteOpen(false)
      setSelectedCategory(null)
    } catch (err) {
      console.error(err)
    }
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
              onClick={() => setIsAddKategoriOpen(true)}
              className="bg-[#737373] text-white hover:bg-[#5E5E5E] px-4 py-2 rounded-lg"
            >
              + Tambah Kategori
            </button>
          </div>
          <Kategori
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            activeCategory={activeCategory}
            onCategoryClick={setActiveCategory}
          />
        </div>

        {/* List + Filter internal */}
        <div className="flex flex-1 gap-4 px-4">
          <ListProduct
            products={products}
            onModalChange={setIsModalOpen}
            activeCategory={activeCategory}
          />
        </div>
      </div>

      {isModalOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />}

      <AddKategori
        isOpen={isAddKategoriOpen}
        onClose={() => {
          setIsAddKategoriOpen(false)
          handleModalChange(false)
        }}
        onAdd={handleAddCategory}
      />
      <EditKategori
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
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
