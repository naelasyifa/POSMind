'use client'

import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import ListProduct from './components/listProduct'
import FilterProduct from './components/filterProduct'
import { useState } from 'react'

export default function ProdukPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#52bfbe] relative">
      <Sidebar />

      <div style={{ marginLeft: '7rem' }}>
        <HeaderAdmin title="Produk" />
      </div>
      <div className="flex flex-1 gap-6 px-6 pt-16 pb-6">
        <FilterProduct />
        {/* ✅ Pass prop correctly */}
        <ListProduct onModalChange={setIsModalOpen} />
      </div>

      {/* ✅ Global blur overlay */}
      {isModalOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />}
    </div>
  )
}
