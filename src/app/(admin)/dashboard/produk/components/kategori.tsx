'use client'

import { useState, useEffect, useRef } from 'react'
import { MoreVertical } from 'lucide-react'

// TYPE: dynamic category item
export type CategoryItem = {
  id: number
  name: string
  count: number
  icon: React.ComponentType<{ size?: number; className?: string }>
}

type Props = {
  categories: CategoryItem[]
  onEdit: (cat: CategoryItem) => void
  onDelete: (cat: CategoryItem) => void
}

export default function CategoryList({ categories, onEdit, onDelete }: Props) {
  const [active, setActive] = useState<string>(categories[0]?.name || '')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const menuRef = useRef<HTMLDivElement | null>(null)

  // Close popup menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-4 flex-wrap">
        {categories.map((cat) => (
          <div key={cat.id} className="relative">
            <button
              onClick={() => setActive(cat.name)}
              className={`rounded-xl p-4 w-28 h-28 shadow-sm transition cursor-pointer flex flex-col justify-between
                ${
                  active === cat.name
                    ? 'bg-[#737373] text-white scale-105 shadow-md'
                    : 'bg-white text-gray-700 hover:bg-[#737373]/70 hover:text-white'
                }
              `}
            >
              {/* ICON TOP RIGHT */}
              <div className="w-full flex justify-end">
                <cat.icon
                  size={28}
                  className={active === cat.name ? 'text-white' : 'text-inherit'}
                />
              </div>

              {/* CATEGORY NAME + COUNT + MENU */}
              <div className="flex justify-between items-center w-full">
                <div className="text-left">
                  <div className="text-sm font-semibold">{cat.name}</div>
                  <div
                    className={`text-xs ${active === cat.name ? 'text-white/80' : 'text-inherit'}`}
                  >
                    {cat.count}
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded py-1 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(menuOpen === cat.name ? null : cat.name)
                  }}
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </button>

            {/* POPUP MENU */}
            {menuOpen === cat.name && (
              <div
                ref={menuRef}
                className="absolute right-0 top-0 mt-10 mr-2 bg-white shadow-md rounded-md z-50"
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
