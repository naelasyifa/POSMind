'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import CategoryList from './components/kategori'
import MenuTabs from './components/menuTabs'
import SearchBar from './components/searchBar'
import ProductTable from './components/productTable'
import ProductList from './components/listProduct'

export default function MenuPage() {
  const headerHeight = 48
  const handleModalChange = (open: boolean) => {
    console.log('Modal status:', open)
    setIsModalOpen(open)
  }
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[ffffff]">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderKasir title="Menu" showBack={true} />
        {/* konten area */}
        <div className="px-6 py-2 bg-[#52bfbe] min-h-screen text-white">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold">Kategori</h1>
            <button className="bg-[#737373] text-white px-4 py-2 rounded-lg">
              + Tambah Kategori
            </button>
          </div>
          <CategoryList />

          <div className="flex justify-between items-center mt-8 mb-2">
            <SearchBar />
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#737373] text-white px-4 py-2 rounded-lg"
            >
              + Tambah Produk
            </button>
          </div>
          <ProductList onModalChange={handleModalChange} />
        </div>
      </div>
    </div>
  )
}
