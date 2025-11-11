// src/app/(admin)/layout.tsx
import '../(frontend)/styles.css'
import React from 'react'
import Sidebar from '@/components/SidebarAdmin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-100">
        <div className="flex min-h-screen">
          <Sidebar /> {/* sidebar menu */}
          <main className="flex-1 p-6">
            {children} {/* halaman dashboard akan muncul di sini */}
          </main>
        </div>
      </body>
    </html>
  )
}
