'use client'

import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'

export default function DashboardPage() {
  const headerHeight = 48

  return (
    <div className="flex min-h-screen bg-[ffffff]">
      {/* Sidebar */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        {/* Header */}
        <HeaderAdmin title="Dashboard" showBack={false} />

        {/* Konten area */}
        
      </div>
    </div>
  )
}
