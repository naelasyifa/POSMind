'use client'
import { useState, useEffect } from 'react'
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
import type { CategoryItem } from './kategori'

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
]

interface EditCategoryProps {
  isOpen: boolean
  onClose: () => void
  category: CategoryItem | null
  onSave: (updated: CategoryItem) => void
}

export default function EditKategori({ isOpen, onClose, category, onSave }: EditCategoryProps) {
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('Package')
  const [showIconPicker, setShowIconPicker] = useState(false)

  // Load category on open
  useEffect(() => {
    if (category) {
      setName(category.name)
      setSelectedIcon(category.icon.name || 'Package')
    }
  }, [category])

  const handleSave = () => {
    if (!name.trim() || !category) return

    const newIcon = ICON_OPTIONS.find((i) => i.name === selectedIcon)?.icon || Package

    onSave({
      ...category,
      name,
      icon: newIcon,
    })

    onClose()
  }

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[430px] bg-white shadow-2xl rounded-l-2xl z-50 p-8 
        transition-transform duration-500 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Kategori</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-gray-400 mb-6"></div>

        {/* ICON PREVIEW */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-1">Icon</p>

            <div className="w-16 h-16 flex items-center justify-center rounded-xl border border-gray-300 bg-gray-50">
              {(() => {
                const Icon =
                  ICON_OPTIONS.find((ic) => ic.name === selectedIcon)?.icon || Package
                return <Icon size={32} className="text-[#52BFBE]" />
              })()}
            </div>
          </div>

          <button
            onClick={() => setShowIconPicker(true)}
            className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:border-[#52BFBE] h-fit mt-5"
          >
            Pilih Icon
          </button>
        </div>

        {/* NAME INPUT */}
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama kategori"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]"
          />
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-6">
          <button
            onClick={handleSave}
            className="w-full bg-[#52BFBE] hover:bg-[#32A9A4] text-white py-2 rounded-lg transition-all font-medium"
          >
            Simpan Perubahan
          </button>
        </div>

        {/* ICON PICKER */}
        {showIconPicker && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
            <div className="bg-white p-4 rounded-lg w-[300px]">
              <div className="grid grid-cols-4 gap-3 max-h-[200px] overflow-y-auto">
                {ICON_OPTIONS.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setSelectedIcon(item.name)
                        setShowIconPicker(false)
                      }}
                      className="p-2 border rounded-lg hover:bg-gray-100"
                    >
                      <Icon size={22} />
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setShowIconPicker(false)}
                className="mt-3 w-full py-2 bg-gray-200 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
