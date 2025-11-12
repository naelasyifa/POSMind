'use client'

import { useState } from "react"

export default function FilterProduct() {
  const [status, setStatus] = useState("Semua")
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [newCategory, setNewCategory] = useState("")

  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

return(
  <div className="bg-white rounded-xl shadow p-5 w-[380px]">
    {/* Kategori */}
      <div className="mt-5">
        <p className="font-semibold mb-2">Kategori</p>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" disabled>
            Pilih kategori
          </option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="flex mt-2 gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Tambah kategori baru"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]"
          />
          <button
            onClick={handleAddCategory}
            className="bg-[#52BFBE] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#43a9a8] transition"
          >
            +
          </button>
        </div>
      </div>
  </div>
)
