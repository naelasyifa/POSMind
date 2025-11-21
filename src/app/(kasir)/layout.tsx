// src/app/(kasir)/layout.tsx
import '../(frontend)/styles.css'
import React from 'react'
import SidebarKasir from '@/components/SidebarKasir'

export default function KasirLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="h-full w-full m-0 p-0 bg-[#52bfbe]">
        <div className="flex min-h-screen">
          {/* === SIDEBAR === */}
          <SidebarKasir />
          <main className="flex-1 p-6">
            {children} {/* halaman dashboard akan muncul di sini */}
          </main>
        </div>
      </body>
    </html>
  )
}
