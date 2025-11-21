'use client'

import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'

export default function MetodePembayaranPage() {
  const headerHeight = 48

  return (
    <div className="flex min-h-screen bg-[ffffff]">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderKasir title="Laporan" showBack={true} />
        {/* konten area */}
      </div>
    </div>
  )
}
