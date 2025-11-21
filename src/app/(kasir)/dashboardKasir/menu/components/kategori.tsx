'use client'

import { useState } from 'react'

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

const categories = [
  { name: 'Semua', count: 116, icon: Package },
  { name: 'Pizza', count: 20, icon: Pizza },
  { name: 'Burger', count: 15, icon: Sandwich },
  { name: 'Ayam', count: 10, icon: Drumstick },
  { name: 'Roti', count: 18, icon: Croissant },
  { name: 'Minuman', count: 12, icon: CupSoda },
  { name: 'Seafood', count: 16, icon: Fish },
]

export default function CategoryList() {
  const [active, setActive] = useState('Semua')

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActive(cat.name)}
            className={`rounded-xl p-4 w-28 h-28 shadow-sm transition cursor-pointer flex flex-col justify-between
              ${
                active === cat.name
                  ? 'bg-[#737373] text-white scale-105 shadow-md'
                  : 'bg-white text-gray-700 hover:bg-[#737373]/70 hover:text-white'
              }
            `}
          >
            {/* TOP RIGHT ICON */}
            <div className="w-full flex justify-end">
              <cat.icon
                size={28}
                className={`${active === cat.name ? 'text-white' : 'text-[#737373]'}`}
              />
            </div>

            {/* BOTTOM LEFT TEXT */}
            <div className="flex flex-col items-start">
              <div className="text-sm font-semibold">{cat.name}</div>
              <div
                className={`text-xs ${active === cat.name ? 'text-white/80' : 'text-[#737373]'}`}
              >
                {cat.count}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
