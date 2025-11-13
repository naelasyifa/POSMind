'use client'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'

export default function ProdukTerlarisPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Produk Terlaris" showBack={true} />
        <div className="p-6">
          <h1 className="text-xl font-semibold mb-4">Semua Produk Terlaris</h1>
          <p>Daftar lengkap produk terlaris muncul di sini...</p>
        </div>
      </div>
    </div>
  )
}
