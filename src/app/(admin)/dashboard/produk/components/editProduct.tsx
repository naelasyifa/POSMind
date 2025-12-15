'use client'

import { useState, useEffect, useRef } from 'react'

interface Product {
  id: string
  nama: string
  stok: number
  status: string
  kategori: { id:string; nama: string }
  harga: number
  gambar?: { id: string; url: string }
  sku?: string
  useAutoSku?: boolean
}

interface EditProductProps {
  isOpen: boolean
  onClose: () => void
  productData: Product | null
  onSave: (updatedProduct: Product) => void
}

export default function EditProduk({ isOpen, onClose, productData, onSave }: EditProductProps) {
  const [nama, setNama] = useState('')
  const [kuantitas, setKuantitas] = useState('')
  const [harga, setHarga] = useState('')
  // const [kategori, setKategori] = useState<string[]>([])
  const [selectedKategori, setSelectedKategori] = useState('')
  // const [newKategori, setNewKategori] = useState('')
  const [gambar, setGambar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  // const [useAutoId, setUseAutoId] = useState(false)
  // const [manualId, setManualId] = useState('')

  const [useAutoSku, setUseAutoSku] = useState(true)
  const [skuManual, setSkuManual] = useState('')

  // Load data terbaru saat productData berubah
  useEffect(() => {
    if (productData) {
      setNama(productData.nama)
      setKuantitas(productData.stok.toString())
      setHarga(productData.harga.toString())
      setSelectedKategori(productData.kategori.nama)
      setGambar(productData.gambar?.url || '/images/image-placeholder.png')
      setUseAutoSku(productData.sku ? false : true)
      setSkuManual(productData.sku || '')
    }
  }, [productData])

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

  const handleSubmit = async () => {
    if (!productData) return

    const updated = {
      id: productData.id,
      name: nama,
      stock: Number(kuantitas),
      status: productData.status,
      category: selectedKategori,
      price: Number(harga),
      image: gambar || productData.gambar,
      useAutoSku,
      sku: useAutoSku ? undefined : skuManual,
    }

    try {
      const res = await fetch('/api/frontend/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      const data = await res.json()
      onSave(data)
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  if (!isOpen) return null

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
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU Produk</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={skuManual || (useAutoSku ? productData?.sku || '' : '')}
                onChange={(e) => setSkuManual(e.target.value)}
                placeholder={useAutoSku ? 'Auto Generated' : 'Enter SKU'}
                disabled={useAutoSku}
                className={`flex-1 border border-gray-300 rounded-lg px-3 py-2 ${
                  useAutoSku ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />

              <button
                onClick={() => {
                  const newState = !useAutoSku
                  setUseAutoSku(newState)
                  // Kalau pindah ke Auto, biarkan skuManual tetap tampil tapi disable
                  // Kalau pindah ke Manual, biarkan skuManual bisa diedit
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  useAutoSku ? 'bg-[#52BFBE] text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {useAutoSku ? 'Manual' : 'Auto'}
              </button>
            </div>
            {useAutoSku && (
              <p className="text-xs text-gray-500 mt-1">SKU akan digenerate otomatis</p>
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <input
              type="text"
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
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
