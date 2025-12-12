'use client'

import { useState, useEffect, useRef } from 'react'
import type { Product } from './listProduct'

interface EditProductProps {
  isOpen: boolean
  onClose: () => void
  productData: {
    id: string
    nama: string
    stok: number
    status: string
    kategori: { nama: string }
    harga: number
    gambar?: { url: string }
  } | null
  onSave: (updatedProduct: {
    id: string
    nama: string
    stok: number
    status: string
    kategori: { nama: string }
    harga: number
    gambar?: { url: string }
  }) => void
}

export default function EditProduk({ isOpen, onClose, productData, onSave }: EditProductProps) {
  const [nama, setNama] = useState('')
  const [kuantitas, setKuantitas] = useState('')
  const [harga, setHarga] = useState('')
  const [kategori, setKategori] = useState<{ id: string; name: string }[]>([])
  const [selectedKategori, setSelectedKategori] = useState<{ id: string; name: string } | null>(
    null,
  )
  const [newKategori, setNewKategori] = useState('')
  const [gambar, setGambar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [useAutoId, setUseAutoId] = useState(false)
  const [manualId, setManualId] = useState('')

  useEffect(() => {
    if (productData) {
      setNama(productData.nama)
      setKuantitas(productData.stok.toString())
      setHarga(productData.harga.toString())
      setSelectedKategori(
        productData.kategori ? { id: '0', name: productData.kategori.nama } : null,
      )
      setGambar(productData.gambar?.url || null)
      setManualId(productData.id.toString()) // <-- load existing ID
      setUseAutoId(false) // <-- default: manual is enabled
    }
  }, [productData])

  const handleAddCategory = () => {
    if (newKategori.trim() !== '') {
      const newCat = { id: Date.now().toString(), name: newKategori }
      setKategori([...kategori, newCat])
      setNewKategori('')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setGambar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (nama && selectedKategori && kuantitas && harga && productData) {
      onSave({
        id: useAutoId ? Date.now().toString() : manualId,
        nama: nama,
        stok: Number(kuantitas),
        status: productData.status,
        kategori: { nama: selectedKategori.name },
        harga: Number(harga),
        gambar: gambar ? { url: gambar } : productData.gambar,
      })
      onClose()
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
          <h2 className="text-xl font-semibold text-gray-800">Edit Produk</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>
        <div className="border-b border-gray-400 mb-6"></div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              id="gambarInput"
              onChange={handleImageChange}
              className="hidden"
            />

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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>

            <div className="flex items-center gap-3">
              {/* ID Input */}
              <input
                type="number"
                value={useAutoId ? '' : manualId}
                onChange={(e) => setManualId(e.target.value)}
                placeholder={useAutoId ? 'Auto Generated' : 'Enter Product ID'}
                disabled={useAutoId}
                className={`flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3ABAB4] ${
                  useAutoId ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />

              {/* Toggle Button */}
              <button
                onClick={() => {
                  const newState = !useAutoId
                  setUseAutoId(newState)

                  if (newState) {
                    // Switched to auto → clear manual
                    setManualId('')
                  } else {
                    // Switched back to manual → load existing ID
                    if (productData?.id) setManualId(productData.id.toString())
                  }
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  useAutoId ? 'bg-[#52BFBE] text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {useAutoId ? 'Auto' : 'Manual'}
              </button>
            </div>

            {useAutoId && (
              <p className="text-xs text-gray-500 mt-1">
                Auto ID will be generated: <strong>{Date.now()}</strong>
              </p>
            )}
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
              value={selectedKategori?.id || ''}
              onChange={(e) => {
                const selected = kategori.find((k) => k.id === e.target.value) || null
                setSelectedKategori(selected)
              }}
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {kategori.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>

            <div className="flex mt-2 gap-2">
              <input
                type="text"
                value={newKategori}
                onChange={(e) => setNewKategori(e.target.value)}
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
              Simpan
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
