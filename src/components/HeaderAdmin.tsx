'use client'

import Link from 'next/link'
import { Bell, UserCircle, ChevronLeft } from 'lucide-react'

interface HeaderAdminProps {
  title: string
  showBack?: boolean
}

export default function HeaderAdmin({ title, showBack = true }: HeaderAdminProps) {
  const headerHeight = 48

  return (
    <>
      <header
        className="fixed top-0 left-28 right-0 z-50 bg-[#52bfbe] shadow px-4 flex items-center justify-between"
        style={{ height: `${headerHeight}px` }}
      >
        <div className="flex items-center gap-2">
          {showBack && (
            <Link
              href="/dashboard"
              className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
            </Link>
          )}

          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/notifikasi"
            className="relative p-2 rounded-full hover:bg-white/10 transition"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>

          <div className="w-px h-6 bg-white/50"></div>

          <Link
            href="/profil"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 transition"
          >
            <UserCircle className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Admin</span>
          </Link>
        </div>
      </header>

      {/* Spacer agar konten tidak tertutup */}
      <div style={{ height: `${headerHeight}px` }}></div>
    </>
  )
}
