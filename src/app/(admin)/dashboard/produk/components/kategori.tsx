'use client'

import { useState, useEffect, useRef } from 'react'
import { MoreVertical } from 'lucide-react'
import {
  Pizza,
  Beef,
  Drumstick,
  Sandwich,
  CupSoda,
  Coffee,
  IceCream,
  Fish,
  Utensils,
  Croissant,
  FlaskConical,
  Package,
} from 'lucide-react'

const ICON_OPTIONS = [
  { name: 'Pizza', icon: Pizza },
  { name: 'Burger', icon: Beef },
  { name: 'Ayam', icon: Drumstick },
  { name: 'Roti', icon: Sandwich },
  { name: 'Minuman', icon: CupSoda },
  { name: 'Kopi', icon: Coffee },
  { name: 'Dessert', icon: IceCream },
  { name: 'Seafood', icon: Fish },
  { name: 'Makanan Berat', icon: Utensils },
  { name: 'Sarapan', icon: Croissant },
  { name: 'Saus', icon: FlaskConical },
  { name: 'Package', icon: Package },
]

export type CategoryItem = {
  id: string | number
  name: string
  count: number
  icon: React.ComponentType<{ size?: number; className?: string }>
  mediaId?: string
}

type Props = {
  categories: CategoryItem[]
  onEdit: (cat: CategoryItem) => void
  onDelete: (cat: CategoryItem) => void
  activeCategory: string
  onCategoryClick: (name: string) => void
}

export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  activeCategory,
  onCategoryClick,
}: Props) {
  // const [active, setActive] = useState<string>(categories[0]?.name || '')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const menuRef = useRef<HTMLDivElement | null>(null)

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
          <div key={`${cat.id}-${cat.name}`} className="relative">
            {/* CHANGE button -> div */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onCategoryClick(cat.name)}
              className={`rounded-xl p-4 w-28 h-28 shadow-sm transition cursor-pointer flex flex-col justify-between
                ${
                  activeCategory === cat.name
                    ? 'bg-[#737373] text-white scale-105 shadow-md'
                    : 'bg-white text-gray-700 hover:bg-[#737373]/70 hover:text-white'
                }
              `}
            >
              <div className="w-full flex justify-end">
                <cat.icon
                  size={28}
                  className={activeCategory === cat.name ? 'text-white' : 'text-inherit'}
                />
              </div>

              <div className="flex justify-between items-center w-full">
                <div className="text-left">
                  <div className="text-sm font-semibold">{cat.name}</div>
                  <div
                    className={`text-xs ${activeCategory === cat.name ? 'text-white/80' : 'text-inherit'}`}
                  >
                    {cat.count}
                  </div>
                </div>

                {/* ⚡ Keep this button as actual button */}
                <button
                  type="button"
                  className="rounded p-1 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(menuOpen === cat.name ? null : cat.name)
                  }}
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

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
