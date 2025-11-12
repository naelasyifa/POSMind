'use client'

import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import ListProduct from './components/listProduct'
import FilterProduct from './components/filterProduct'

export default function ProdukPage() {
  const headerHeight = 48

  return (
    <div className="flex min-h-screen bg-[#52bfbe]">
      <Sidebar />

      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderAdmin title="Produk" />
        {/* konten area */}
        <div className="flex gap-4">
          <FilterProduct />
          <ListProduct />
        </div>
      </div>
    </div>

  )
}
