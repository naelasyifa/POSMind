'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function SidebarKasir() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      })

      localStorage.removeItem('token')
      document.cookie = 'token=; Max-Age=0; path=/'

      router.push('/')
    } catch (error) {
      console.error('Logout gagal:', error)
    }
  }, [router])

  // Hydration-safe pathname
  const [clientPath, setClientPath] = useState<string | null>(null)
  useEffect(() => {
    setClientPath(pathname)
  }, [pathname])

  if (!clientPath) return null // cegah mismatch SSR vs Client

  const menuItems = [
    { href: '/dashboardKasir', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/dashboardKasir/transaksi', label: 'Transaksi', icon: 'BankNote' },
    { href: '/dashboardKasir/menu', label: 'Menu', icon: 'Package' },
    { href: '/dashboardKasir/laporan', label: 'Laporan', icon: 'FileText' },
    { href: '/dashboardKasir/reservasi', label: 'Reservasi', icon: 'Calendar' },
  ]

  const activeMenu = menuItems.reduce<string | null>((acc, item) => {
    if (clientPath === item.href || clientPath.startsWith(item.href + '/')) {
      if (!acc || item.href.length > acc.length) return item.href
    }
    return acc
  }, null)

  const renderIcon = (iconName: string, isActive: boolean) => {
    const className = `w-4 h-4 ${isActive ? 'text-[#52bfbe]' : 'text-gray-600'}`

    switch (iconName) {
      case 'LayoutDashboard':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
        )
      case 'Package':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16.5 9.4l-9-5.19"></path>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          </svg>
        )
      case 'BankNote':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M6 9v0" />
            <path d="M18 15v0" />
          </svg>
        )
      case 'FileText':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        )
      case 'Calendar':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <polyline points="9 15 11 17 15 13" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[120px] bg-white flex flex-col items-center py-2 border-r border-gray-200 shadow-sm z-50">

      {/* Logo */}
      <div className="mt-4 mb-8 flex flex-col items-center">
        <img src="/logo-posmind.png" alt="POSMind Logo" className="w-10 h-auto" />
        <p className="text-[#52bfbe] font-bold text-sm mt-1">POSMind</p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col items-center w-full gap-0 flex-1">
        {menuItems.map((item, idx) => {
          const isActive = item.href === activeMenu

          return (
            <div key={idx} className="w-full flex flex-col items-center">

              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center w-full px-2 py-1.5 rounded-md transition-all duration-200 ${
                  isActive ? 'bg-[#52bfbe] text-white' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    isActive ? 'bg-white' : 'bg-gray-100'
                  }`}
                >
                  {renderIcon(item.icon, isActive)}
                </div>

                <span className={`text-[10px] leading-tight ${isActive ? 'text-white font-medium' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </Link>

              {idx < menuItems.length - 1 && <div className="w-16 h-px bg-gray-200 my-1.5"></div>}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="mt-10 mb-2 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:text-red-500 transition"
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center transition">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <span className="text-[10px]">Keluar</span>
        </button>
      </div>

    </aside>
  )
}
