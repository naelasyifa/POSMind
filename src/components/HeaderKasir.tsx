'use client'

import Link from 'next/link'
import { Bell, UserCircle, ChevronLeft } from 'lucide-react'

interface HeaderKasirProps {
  title: string
  showBack?: boolean
  notifications?: number
  onBack?: () => void
}

export default function HeaderKasir({
  title,
  showBack = false,
  notifications = 0,
  onBack,
}: HeaderKasirProps) {
  const headerHeight = 48

  return (
    <>
      <header
        className="fixed top-0 left-28 right-0 z-50 bg-[#52bfbe] shadow px-4 flex items-center justify-between"
        style={{ height: `${headerHeight}px` }}
      >
        {/* Kiri - Judul halaman */}
        <div className="flex items-center gap-2">
          {showBack && (
            <>
              {onBack ? (
                <button
                  onClick={onBack}
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
                </button>
              ) : (
                <Link
                  href="/dashboardKasir"
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
                </Link>
              )}
            </>
          )}

          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>

        {/* Kanan - Notifikasi dan profil */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboardKasir/notifikasi"
            className="relative p-2 rounded-full hover:bg-white/10 transition"
          >
            <Bell className="w-5 h-5 text-white" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 bg-red-500 text-xs text-white font-bold rounded-full">
                {notifications > 99 ? '99+' : notifications}
              </span>
            )}
          </Link>

          <div className="w-px h-6 bg-white/50"></div>

          <Link
            href="/dashboardKasir/profil"
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10 transition"
          >
            <UserCircle className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Kasir</span>
          </Link>
        </div>
      </header>

      {/* Spacer agar konten tidak tertutup header */}
      <div style={{ height: `${headerHeight}px` }}></div>
    </>
  )
}
