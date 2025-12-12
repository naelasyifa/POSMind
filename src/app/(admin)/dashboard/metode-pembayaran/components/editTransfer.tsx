'use client'

import { useState, useEffect } from 'react'

interface EditTransferProps {
  isOpen: boolean
  onClose: () => void
  transferData: {
    nama: string
    tipe: string
    status: boolean
    rekening: string
    integrasi: string
  } | null
  onSave: (updatedTransfer: any) => void
}

export default function EditTransfer({ isOpen, onClose, transferData, onSave }: EditTransferProps) {
  const [nama, setNama] = useState('')
  const [tipe, setTipe] = useState('')
  const [status, setStatus] = useState(true)
  const [rekening, setRekening] = useState('')
  const [integrasi, setIntegrasi] = useState('')
  const [isTipeDropdownOpen, setIsTipeDropdownOpen] = useState(false)
  const [isIntegrasiDropdownOpen, setIsIntegrasiDropdownOpen] = useState(false)

  // Isi form dengan data transfer yang dipilih
  useEffect(() => {
    if (transferData) {
      setNama(transferData.nama)
      setTipe(transferData.tipe)
      setStatus(transferData.status)
      setRekening(transferData.rekening)
      setIntegrasi(transferData.integrasi)
    }
  }, [transferData])

  const handleTipeSelect = (selectedTipe: string) => {
    setTipe(selectedTipe)
    setIsTipeDropdownOpen(false)
  }

  const handleIntegrasiSelect = (selectedIntegrasi: string) => {
    setIntegrasi(selectedIntegrasi)
    setIsIntegrasiDropdownOpen(false)
  }

  const handleSubmit = () => {
    if (nama && tipe) {
      const updatedTransfer = { nama, tipe, status, rekening, integrasi }
      onSave(updatedTransfer)
      onClose()
    }
  }

  return (
    <>
      {/* Overlay transparan */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => {
          onClose()
          setIsTipeDropdownOpen(false)
          setIsIntegrasiDropdownOpen(false)
        }}
      />

      {/* Panel kanan */}
      <div
        className={`fixed top-0 right-0 h-full w-[430px] bg-white shadow-2xl rounded-l-2xl z-[1001] p-8 transition-transform duration-500 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Metode Pembayaran Transfer Bank
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Garis pemisah tipis */}
        <hr className="border-gray-300 mb-6" />

        <div className="space-y-4">
          {/* Nama Metode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">nama metode</label>
            <input
              type="text"
              value={nama}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>

          {/* Tipe & Status (dalam satu baris) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tipe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTipeDropdownOpen(!isTipeDropdownOpen)}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#52bfbe] bg-white text-left ${tipe ? 'text-gray-900' : 'text-gray-500'}`}
                >
                  {tipe || 'Pilih Tipe'}
                </button>

                {/* Custom arrow */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-transform duration-200 ${isTipeDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Dropdown options */}
                {isTipeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleTipeSelect('Manual')}
                      className="w-full px-3 py-2.5 text-left text-gray-900 hover:bg-[#E0F7F6] transition-colors"
                    >
                      Manual
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTipeSelect('VA Otomatis')}
                      className="w-full px-3 py-2.5 text-left text-gray-900 hover:bg-[#E0F7F6] transition-colors"
                    >
                      VA Otomatis
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex items-center h-[42px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#52bfbe] transition-all"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-all"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Rekening / VA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rekening / VA</label>
            <input
              type="text"
              value={rekening}
              onChange={(e) => setRekening(e.target.value)}
              placeholder="BRI"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#52bfbe]"
            />
          </div>

          {/* Integrasi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Integrasi</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsIntegrasiDropdownOpen(!isIntegrasiDropdownOpen)}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#52bfbe] bg-white text-left ${integrasi ? 'text-gray-900' : 'text-gray-500'}`}
              >
                {integrasi || 'Pilih Status Integrasi'}
              </button>

              {/* Custom arrow */}
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`transition-transform duration-200 ${isIntegrasiDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Dropdown options */}
              {isIntegrasiDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleIntegrasiSelect('Connected')}
                    className="w-full px-3 py-2.5 text-left text-gray-900 hover:bg-[#E0F7F6] transition-colors"
                  >
                    Connected
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIntegrasiSelect('Disconnected')}
                    className="w-full px-3 py-2.5 text-left text-gray-900 hover:bg-[#E0F7F6] transition-colors"
                  >
                    Disconnected
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIntegrasiSelect('Error')}
                    className="w-full px-3 py-2.5 text-left text-gray-900 hover:bg-[#E0F7F6] transition-colors"
                  >
                    Error
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIntegrasiSelect('-')}
                    className="w-full px-3 py-2.5 text-left text-gray-900 hover:bg-[#E0F7F6] transition-colors"
                  >
                    -
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#52bfbe] hover:bg-[#32A9A4] text-white py-2 rounded-lg transition-all font-medium"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
