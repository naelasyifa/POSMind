'use client'

import { useEffect, useState } from 'react'
import { X, Save } from 'lucide-react'

interface KelolaProps {
  isOpen: boolean
  onClose: () => void
}

export default function KelolaTunai({ isOpen, onClose }: KelolaProps) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)

  // State untuk form
  const [status, setStatus] = useState(true)
  const [minTransaksi, setMinTransaksi] = useState('10000')
  const [maxTransaksi, setMaxTransaksi] = useState('5000000')
  const [pembulatan, setPembulatan] = useState(true)
  const [nilaiPembulatan, setNilaiPembulatan] = useState('500')
  const [catatan, setCatatan] = useState('Mohon siapkan uang pas untuk mempercepat transaksi')

  // HANDLE OPEN & CLOSE ANIMATION
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      setTimeout(() => setShow(true), 20)
    } else {
      setShow(false)
      setTimeout(() => setMounted(false), 300)
    }
  }, [isOpen])

  if (!mounted) return null

  const handleSave = () => {
    // Logic save di sini
    console.log({
      status,
      minTransaksi,
      maxTransaksi,
      pembulatan,
      nilaiPembulatan,
      catatan,
    })
    onClose()
  }

  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, '')
    return new Intl.NumberFormat('id-ID').format(Number(number))
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999]">
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm
          transition-opacity duration-300
          ${show ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* PANEL POPUP */}
      <div
        className={`
          relative bg-white w-[600px] max-h-[90vh]
          rounded-2xl shadow-xl overflow-hidden
          transition-all duration-500 transform

          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 pt-6 pb-6 border-b">
          <h2 className="text-xl font-semibold">Kelola Metode Pembayaran Tunai</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* FORM CONTENT */}
        <div className="px-6 py-6 overflow-y-auto max-h-[70vh]">
          {/* STATUS */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Metode Tunai
            </label>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#3ABAB4] transition-all"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-all"></div>
              </label>
              <span className="text-sm text-gray-600">
                {status ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>

          {/* MINIMUM TRANSAKSI */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Transaksi
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <input
                type="text"
                value={formatRupiah(minTransaksi)}
                onChange={(e) => setMinTransaksi(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ABAB4]"
                placeholder="0"
              />
            </div>
          </div>

          {/* MAKSIMUM TRANSAKSI */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maksimum Transaksi
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <input
                type="text"
                value={formatRupiah(maxTransaksi)}
                onChange={(e) => setMaxTransaksi(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ABAB4]"
                placeholder="0"
              />
            </div>
          </div>

          {/* PEMBULATAN */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pembulatan Otomatis
            </label>
            <div className="flex items-center gap-3 mb-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={pembulatan}
                  onChange={(e) => setPembulatan(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#3ABAB4] transition-all"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-all"></div>
              </label>
              <span className="text-sm text-gray-600">
                {pembulatan ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>

            {pembulatan && (
              <div className="ml-14">
                <label className="block text-xs text-gray-600 mb-2">
                  Pembulatan ke kelipatan:
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pembulatan"
                      value="100"
                      checked={nilaiPembulatan === '100'}
                      onChange={(e) => setNilaiPembulatan(e.target.value)}
                      className="w-4 h-4 text-[#3ABAB4] focus:ring-[#3ABAB4]"
                    />
                    <span className="text-sm">Rp 100</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pembulatan"
                      value="500"
                      checked={nilaiPembulatan === '500'}
                      onChange={(e) => setNilaiPembulatan(e.target.value)}
                      className="w-4 h-4 text-[#3ABAB4] focus:ring-[#3ABAB4]"
                    />
                    <span className="text-sm">Rp 500</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pembulatan"
                      value="1000"
                      checked={nilaiPembulatan === '1000'}
                      onChange={(e) => setNilaiPembulatan(e.target.value)}
                      className="w-4 h-4 text-[#3ABAB4] focus:ring-[#3ABAB4]"
                    />
                    <span className="text-sm">Rp 1.000</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* CATATAN */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan untuk Pelanggan
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ABAB4] resize-none"
              placeholder="Contoh: Mohon siapkan uang pas untuk mempercepat transaksi"
            />
            <p className="text-xs text-gray-500 mt-1">
              Catatan ini akan ditampilkan kepada pelanggan saat memilih metode pembayaran tunai
            </p>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#3ABAB4] text-white rounded-lg hover:bg-[#2da8a2] transition-all text-sm"
          >
            <Save size={16} />
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}