'use client'

import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'

export default function ProdukPage() {
  const headerHeight = 48

  return (
    <div className="flex min-h-screen bg-[ffffff]">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderAdmin title="Produk" />
        {/* konten area */}
      </div>
    </div>
  )
}
