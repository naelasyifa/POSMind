'use client'

import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import CategoryList from './components/kategori'
import MenuTabs from './components/menuTabs'
import SearchBar from './components/searchBar'
import ProductTable from './components/productTable'

export default function MenuPage() {
  const headerHeight = 48

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
          <h2 className="text-lg font-semibold mt-10 mb-2">Special menu all items</h2>

          <div className="flex justify-between items-center mb-6">
            <MenuTabs />
            <button className="bg-[#737373] text-white px-4 py-2 rounded-lg">
              + Tambah Produk
            </button>
          </div>

          <SearchBar />

          <ProductTable />
        </div>
      </div>
    </div>
  )
}
