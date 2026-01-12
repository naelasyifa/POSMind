'use client'

import { Wallet, Clock, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'

type ShiftType = 'Pagi' | 'Siang' | 'Malam'

interface OpenShiftFormProps {
  onSuccess: (data: any) => void
  onClose: () => void
}

export default function BukaShift({
  onSuccess,
  onClose,
}: OpenShiftFormProps) {
  const [shiftName, setShiftName] = useState<ShiftType>('Pagi')
  const [openingCash, setOpeningCash] = useState('')
  const [openingNote, setOpeningNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* =============================
      FORMAT RUPIAH
  ============================= */
  const formatRupiah = (value: string) => {
    const clean = value.replace(/\D/g, '')
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpeningCash(formatRupiah(e.target.value))
    setError(null)
  }

  /* =============================
      SUBMIT OPEN SHIFT
  ============================= */
  const handleSubmit = async () => {
    const cash = Number(openingCash.replace(/\./g, ''))

    if (isNaN(cash) || cash < 0) {
      setError('Modal awal harus berupa angka valid')
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/frontend/shifts/open', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shiftName,
          openingCash: cash,
          openingNote,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Gagal membuka shift')
        return
      }

      onSuccess(data.data)
      onClose()
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan server')
    } finally {
      setLoading(false)
    }
  }

  /* =============================
      UI
  ============================= */
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
      >
        {/* Close */}
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 text-center">
          Buka Shift
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Isi data sebelum memulai transaksi
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Modal Awal */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
            <Wallet size={16} className="mr-2 text-[#3FA3A2]" />
            Modal Awal (Cash)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
            <input
              type="text"
              value={openingCash}
              onChange={handleCashChange}
              placeholder="Contoh: 100.000"
              className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-[#52BFBE] focus:border-[#52BFBE]"
            />
          </div>
        </div>

        {/* Shift */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
            <Clock size={16} className="mr-2 text-[#3FA3A2]" />
            Pilih Shift
          </label>
          <div className="relative">
            <select
              value={shiftName}
              onChange={(e) =>
                setShiftName(e.target.value as ShiftType)
              }
              className="w-full px-4 py-2 border rounded-lg appearance-none focus:ring-[#52BFBE] focus:border-[#52BFBE]"
            >
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
              <option value="Malam">Malam</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Catatan */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Catatan (Opsional)
          </label>
          <textarea
            value={openingNote}
            onChange={(e) => setOpeningNote(e.target.value)}
            rows={2}
            placeholder="Contoh: Serah terima kasir pagi"
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#52BFBE] focus:border-[#52BFBE]"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full bg-[#52BFBE] hover:bg-[#3FA3A2] text-white font-medium py-2 rounded-lg transition ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Membuka Shift...' : `Mulai Shift ${shiftName}`}
        </button>
      </div>
    </div>
  )
}
