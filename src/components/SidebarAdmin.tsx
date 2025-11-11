'use client'

import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/dashboard/produk', label: 'Produk', icon: 'Package' },
    { href: '/dashboard/promo', label: 'Promo', icon: 'Percent' },
    { href: '/dashboard/pengguna', label: 'Pengguna', icon: 'Users' },
    { href: '/dashboard/metode-pembayaran', label: 'Metode Pembayaran', icon: 'CreditCard' },
    { href: '/dashboard/laporan', label: 'Laporan', icon: 'FileText' },
  ]

  const pathname = usePathname()

  // Cari menu aktif yang paling spesifik
  const activeMenu = menuItems.reduce<string | null>((acc, item) => {
    if (pathname === item.href || pathname.startsWith(item.href + '/')) {
      if (!acc || item.href.length > acc.length) {
        return item.href
      }
    }
    return acc
  }, null)

  const renderIcon = (iconName: string, isActive: boolean) => {
    const className = `w-4 h-4 ${isActive ? 'text-[#52bfbe]' : 'text-gray-600'}`
    switch (iconName) {
      case 'LayoutDashboard':
        return (
          <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </svg>
        )
      case 'Package':
        return (
          <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16.5 9.4l-9-5.19"></path>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        )
      case 'Percent':
        return (
          <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="5" x2="5" y2="19"></line>
            <circle cx="6.5" cy="6.5" r="2.5"></circle>
            <circle cx="17.5" cy="17.5" r="2.5"></circle>
          </svg>
        )
      case 'Users':
        return (
          <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        )
      case 'CreditCard':
        return (
          <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        )
      case 'FileText':
        return (
          <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-28 bg-white flex flex-col items-center py-2 border-r border-gray-200 overflow-y-auto">
      {/* Logo */}
      <div className="mt-4 mb-8 flex flex-col items-center flex-shrink-0">
        <img src="/logo-posmind.png" alt="POSMind Logo" className="w-10 h-8,5" />
        <p className="text-[#52bfbe] font-bold text-sm mt-1">POSMind</p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col items-center w-full gap-2 flex-1">
        {menuItems.map((item, idx) => {
          const isActive = item.href === activeMenu

          return (
            <div key={idx} className="w-full flex flex-col items-center">
              {/* Menu Item */}
              <a
                href={item.href}
                className={`flex flex-col items-center justify-center w-full px-2 py-1.5 rounded-md transition
                  ${isActive ? 'bg-[#52bfbe]' : 'hover:bg-gray-50'}`}
              >
                {/* Icon dengan lingkaran */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${isActive ? 'bg-white' : 'bg-gray-100'}`}
                >
                  {renderIcon(item.icon, isActive)}
                </div>
                {/* Label */}
                <span
                  className={`text-[10px] text-center leading-tight
                  ${isActive ? 'text-white font-medium' : 'text-gray-600'}`}
                >
                  {item.label}
                </span>
              </a>

              {/* Divider */}
              {idx < menuItems.length - 1 && <div className="w-16 h-px bg-gray-200 my-1.5"></div>}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="mt-10 mb-2 flex-shrink-0">
        <button className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:text-red-500 transition">
          <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 flex items-center justify-center transition">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
