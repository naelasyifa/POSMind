'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import ProductList from './components/listProduct'
import ReqPermission from './components/requestPermission'
import AddProduct from './components/tambahProduk'
import AddKategori from './components/tambahKategori'
import EditKategori from './components/editKategori'
import DeleteKategori from './components/hapusKategori'
import { Pizza, Sandwich, Drumstick, CupSoda, Fish, Croissant, Package } from 'lucide-react'

interface ProductApi {
  id: number
  nama: string
  kategori?: { id: string; nama: string }
  harga: number
  stok: number
  gambar?: { url: string }
  status: string
  deskripsi: string
}

type Product = {
  id: string
  nama: string
  stok: number
  status: string
  kategori: { nama: string }
  harga: number
  gambar?: { url: string }
}

type CategoryItem = {
  id: number
  name: string
  count: number
  icon: any
  mediaId?: string
}

const ICON_OPTIONS: { name: string; icon: any }[] = [
  { name: 'Pizza', icon: Pizza },
  { name: 'Burger', icon: Sandwich },
  { name: 'Ayam', icon: Drumstick },
  { name: 'Roti', icon: Croissant },
  { name: 'Minuman', icon: CupSoda },
  { name: 'Seafood', icon: Fish },
  { name: 'Package', icon: Package },
]

export default function MenuPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('Semua')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasPermission] = useState(false)
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddKategoriOpen, setIsAddKategoriOpen] = useState(false)

  const [product, setProduct] = useState<Product[]>([])
  const [search, setSearch] = useState('')

  const [editOpen, setEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)

  // Fetch categories
  useEffect(() => {
    fetch('/api/frontend/categories')
      .then((res) => res.json())
      .then((data) => {
        const mapped = data
          .filter((c: any) => c.id !== 'all')
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

  // Fetch products
  useEffect(() => {
    fetch('/api/frontend/menu')
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((p: ProductApi) => ({
          id: p.id.toString(),
          nama: p.nama,
          kategori: p.kategori ? { nama: p.kategori.nama } : { nama: '-' },
          harga: p.harga,
          stok: p.stok,
          status: p.status,
          gambar: p.gambar || { url: '/images/image-placeholder.png' },
          sku: (p as any).sku || '',
        }))

        setProducts(mapped)
      })
      .catch(console.error)
  }, [])

  const handleModalChange = (open: boolean) => {
    console.log('Modal status:', open)
    setIsModalOpen(open)
  }

  const handleAddProduct = (newProductInput: {
    id: string
    nama: string
    stok: number
    status: string
    kategori: { nama: string }
    harga: number
    gambar?: { url: string }
  }) => {
    const newProduct: Product = {
      id: (products.length + 1).toString(), // FIX 1
      nama: newProductInput.nama,
      kategori: { nama: newProductInput.kategori.nama }, // FIX 2
      stok: newProductInput.stok,
      harga: newProductInput.harga,
      status: newProductInput.status || 'Aktif',
      gambar: newProductInput.gambar // FIX 3
        ? { url: newProductInput.gambar.url }
        : { url: '/images/image-placeholder.png' },
    }

    setProducts((prev) => [...prev, newProduct])
    setIsAddProductOpen(false)
  }

  const handleEditProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id.toString()))
  }

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

          {/* Product List with Category Cards & Search */}
          <ProductList
            products={product}
            setProducts={setProduct}
            onModalChange={handleModalChange}
            hasPermission={hasPermission}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            search={search}
            setSearch={setSearch}
            categories={categories}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            setIsAddProductOpen={setIsAddProductOpen}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </div>
      </div>

      {/* Modals */}
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
