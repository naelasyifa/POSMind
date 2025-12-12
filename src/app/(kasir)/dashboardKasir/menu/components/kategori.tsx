'use client'

import { useState, useEffect, useRef } from 'react'
import { MoreVertical, FolderX } from 'lucide-react'

// TYPE: dynamic category item from backend
export type CategoryItem = {
  id: number
  name: string
  count: number
  icon: React.ComponentType<{ size?: number; className?: string }>
}

type Props = {
  categories: CategoryItem[]
  activeCategory: string
  onCategoryClick: (name: string) => void
  onEdit: (cat: CategoryItem) => void
  onDelete: (cat: CategoryItem) => void
}

export default function CategoryList({
  categories,
  activeCategory,
  onCategoryClick,
  onEdit,
  onDelete,
}: Props) {
  const [active, setActive] = useState<string>(categories[0]?.name || '')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const menuRef = useRef<HTMLDivElement | null>(null)

  // CLOSE MENU ON OUTSIDE CLICK
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // SET DEFAULT ACTIVE WHEN DATA ARRIVES
  useEffect(() => {
    if (categories.length > 0 && active === null) {
      setActive(categories[0].id.toString())
    }
  }, [categories])

  return (
    <div className="mb-6">
      {/* ========== EMPTY STATE ========== */}
      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <FolderX size={64} className="text-gray-400 mb-4" />
          <p className="text-lg font-medium">Belum ada kategori</p>
          <p className="text-sm">Tambahkan kategori baru untuk memulai</p>
        </div>
      )}

      {/* ========== CATEGORY GRID ========== */}
      <div className="flex gap-4 flex-wrap">
        {categories.map((cat) => (
          <div key={cat.id} className="relative">
            <button
              onClick={() => {
                setActive(cat.id.toString())
                onCategoryClick(cat.name)
              }}
              className={`rounded-xl p-4 w-28 h-28 shadow-sm transition cursor-pointer flex flex-col justify-between
                ${
                  active === cat.id.toString()
                    ? 'bg-[#737373] text-white scale-105 shadow-md'
                    : 'bg-white text-gray-700 hover:bg-[#737373]/70 hover:text-white'
                }
              `}
            >
              {/* TOP RIGHT ICON */}
              <div className="w-full flex justify-end">
                <cat.icon
                  size={28}
                  className={active === cat.id.toString() ? 'text-white' : 'text-inherit'}
                />
              </div>

              {/* NAME + COUNT + MENU */}
              <div className="flex justify-between items-center w-full">
                <div className="text-left">
                  <div className="text-sm font-semibold">{cat.name}</div>
                  <div
                    className={`text-xs ${
                      active === cat.id.toString() ? 'text-white/80' : 'text-inherit'
                    }`}
                  >
                    {cat.count}
                  </div>
                </div>

                <span
                  className="rounded py-1 hover:bg-gray-200 cursor-pointer inline-flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(menuOpen === cat.id.toString() ? null : cat.id.toString())
                  }}
                >
                  <MoreVertical size={18} />
                </span>
              </div>
            </button>

            {/* POPUP MENU */}
            {menuOpen === cat.id.toString() && (
              <div
                ref={menuRef}
                className="absolute right-0 top-0 mt-10 mr-2 bg-white border shadow-md rounded-md z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="block px-4 py-2 text-sm hover:bg-gray-100 text-blue-600 w-full text-left"
                  onClick={() => {
                    setMenuOpen(null)
                    onEdit(cat)
                  }}
                >
                  Edit
                </button>

                <button
                  className="block px-4 py-2 text-sm hover:bg-gray-100 text-red-600 w-full text-left"
                  onClick={() => {
                    setMenuOpen(null)
                    onDelete(cat)
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
