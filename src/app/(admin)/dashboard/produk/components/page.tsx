'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import ListProduct from './components/listProduct'
import FilterProduct from './components/filterProduct'
import Kategori from './components/kategori'
import type { CategoryItem } from './components/kategori'

export default function ProdukPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#52bfbe] relative">
      <Sidebar />

      <div style={{ marginLeft: '7rem' }}>
        <HeaderAdmin title="Produk" />
      </div>
      <Kategori />
      <div className="flex flex-1 gap-4 px-4 pt-16 pb-6">
        <FilterProduct />
        <ListProduct onModalChange={setIsModalOpen} />
      </div>

      {/* Global blur overlay */}
      {isModalOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />}
    </div>
  )
}
