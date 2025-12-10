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
          gambar: p.gambar || { url: '/default.jpg' },
          sku: (p as any).sku || '',
        }))

        setProduct(mapped)
      })
      .catch(console.error)
  }, [])

  const handleModalChange = (open: boolean) => {
    console.log('Modal status:', open)
    setIsModalOpen(open)
  }

  const handleAddProduct = (newProductInput: {
    name: string
    category: string
    stock: number
    price: number
    image: string
  }) => {
    const newProduct: Product = {
      id: (product.length + 1).toString(),
      nama: newProductInput.name,
      kategori: { nama: newProductInput.category },
      stok: newProductInput.stock,
      harga: newProductInput.price,
      status: 'Aktif',
      gambar: newProductInput.image ? { url: newProductInput.image } : { url: '/default.jpg' },
    }
    setProduct((prev) => [...prev, newProduct])
    setIsAddProductOpen(false)
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
        <div className="px-6 py-4 bg-[#52bfbe] min-h-screen text-white">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Kategori</h1>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (!hasPermission) {
                    setIsPermissionModalOpen(true)
                    return
                  }
                  setIsAddKategoriOpen(true)
                  handleModalChange(true)
                }}
                className="bg-[#737373] text-white hover:bg-[#5E5E5E] px-5 py-2.5 rounded-lg transition-colors font-medium"
              >
                + Tambah Kategori
              </button>
            </div>
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
