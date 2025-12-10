'use client'

import { useState, useRef, useEffect } from 'react'
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

// ubah tipe AddProductProps
interface AddProductProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (newProduct: {
    id: string
    nama: string
    kategori: { id: string; nama: string }
    stok: number
    harga: number
    gambar?: { id: string; url: string }
    status: string
  }) => void
}

interface CategoryItem {
  id: string
  name: string
}

const ICON_OPTIONS = [
  { name: 'Package', icon: Package },
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

export default function TambahProduk({ isOpen, onClose, onAdd }: AddProductProps) {
  const [useAutoId, setUseAutoId] = useState(true)
  const [productId, setProductId] = useState('')
  const [nama, setNama] = useState('')
  const [kuantitas, setKuantitas] = useState('')
  const [harga, setHarga] = useState('')
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [selectedKategori, setSelectedKategori] = useState('')
  const [newKategori, setNewKategori] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('Package')
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [gambar, setGambar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // FETCH categories dari API saat mount
  useEffect(() => {
    fetch('/api/frontend/categories')
      .then((res) => res.json())
      .then((data: CategoryItem[]) => {
        setCategories(data.filter((c) => c.id !== 'all')) // kecuali "Semua"
        if (data.length > 0) setSelectedKategori(data[0].id) // default kategori pertama
      })
      .catch((err) => console.error(err))
  }, [])

  // const handleAddCategory = () => {
  //   if (newKategori.trim() !== '' && !kategori.includes(newKategori)) {
  //     setKategori([...kategori, newKategori])
  //     setNewKategori('')
  //   }
  // }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setGambar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function uploadImage(base64: string) {
    const res = await fetch('/api/frontend/upload-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64 }),
    })

    return await res.json() // return { id }
  }

  const handleSubmit = async () => {
    if (!nama || !selectedKategori || !harga) return

    try {
      let imageId = null

      // ⬅ Upload gambar dulu
      if (gambar) {
        const uploaded = await uploadImage(gambar)
        imageId = uploaded.id
      }

      // ⬅ Kirim produk ke Payload (POST)
      const res = await fetch('/api/frontend/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nama,
          kategori: selectedKategori, // hanya ID kategori
          stock: Number(kuantitas),
          price: Number(harga),
          image: imageId, // ID media, bukan base64
        }),
      })

      const created = await res.json()

      // ⬅ Update ke ListProduct
      onAdd({
        id: created.id,
        nama: created.name,
        kategori: {
          id: created.kategori?.id || '',
          nama: created.kategori?.nama || '',
        },
        stok: created.stock,
        harga: created.price,
        gambar: created.image ? { id: created.image.id, url: created.image.url } : undefined,
        status: created.status || 'Tersedia',
      })

      // reset
      setNama('')
      setKuantitas('')
      setHarga('')
      setGambar(null)
      setSelectedKategori(categories[0]?.id || '')
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Side panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[430px] bg-white shadow-2xl rounded-l-2xl z-50 p-8 transition-transform duration-500 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Tambah Produk</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>
        <div className="border-b border-gray-400 mb-6"></div>

        <div className="space-y-4">
          {/* Gambar Produk */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>

            {/* Clickable text that opens file explorer */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              id="gambarInput"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Default image OR preview */}
            <div className="mt-3">
              <img
                src={gambar || '/images/image-placeholder.png'} // ⬅ put your default image here
                alt="no image"
                className="w-24 h-24 object-cover rounded-lg border border-gray-300"
              />
            </div>
            <p
              onClick={() => fileInputRef.current?.click()}
              className="text-[#52BFBE] text-sm text-center cursor-pointer underline w-24"
            >
              Pilih Gambar
            </p>
          </div>
          {/* Product ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>

            <div className="flex items-center gap-3">
              {/* ID Input */}
              <input
                type="number"
                value={useAutoId ? '' : productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder={useAutoId ? 'Auto Generated' : 'Enter Product ID'}
                disabled={useAutoId}
                className={`flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3ABAB4] ${
                  useAutoId ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />

              {/* Toggle Button */}
              <button
                onClick={() => {
                  setUseAutoId(!useAutoId)
                  if (!useAutoId === true) {
                    setProductId('') // reset when switching back to auto
                  }
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition
                ${useAutoId ? 'bg-[#52BFBE] text-white' : 'bg-gray-200 text-gray-700'}
                `}
              >
                {useAutoId ? 'Auto' : 'Manual'}
              </button>
            </div>

            {useAutoId && <p className="text-xs text-gray-500 mt-1">ID will be auto-generated</p>}
          </div>

          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Produk"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3ABAB4]"
            />
          </div>

          {/* Kategori */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-1">Kategori</p>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#52BFBE]"
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Kuantitas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kuantitas</label>
            <input
              type="number"
              min="0"
              value={kuantitas}
              onChange={(e) => setKuantitas(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3ABAB4]"
            />
          </div>
          {/* Harga */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
            <input
              type="number"
              min="0"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              placeholder="Rp"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3ABAB4]"
            />
          </div>
          {/* Submit */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#52BFBE] hover:bg-[#32A9A4] text-white py-2 rounded-lg transition-all font-medium"
            >
              Tambah
            </button>
          </div>
        </div>
        {/* Icon Picker Modal */}
        {showIconPicker && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
            <div className="bg-white p-5 rounded-xl shadow-xl w-[300px]">
              <h3 className="font-semibold mb-3">Pilih Icon</h3>

              <div className="grid grid-cols-4 gap-3">
                {ICON_OPTIONS.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setSelectedIcon(item.name)
                        setShowIconPicker(false)
                      }}
                      className={`p-3 border rounded-lg hover:border-[#52BFBE] transition ${
                        selectedIcon === item.name ? 'border-[#52BFBE] bg-[#ECFDFC]' : ''
                      }`}
                    >
                      <Icon size={22} className="mx-auto text-gray-700" />
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setShowIconPicker(false)}
                className="mt-4 w-full py-2 bg-gray-200 rounded-lg text-sm"
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
