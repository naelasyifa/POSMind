// src/app/(kasir)/components/KelolaQris.tsx
'use client'
import { QRCodeSVG } from 'qrcode.react'

export default function KelolaQris({
  isOpen,
  onClose,
  qrData,
  totalAmount,
}: {
  isOpen: boolean
  onClose: () => void
  qrData: string
  totalAmount: number
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[999]">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl">
        <h3 className="text-lg font-bold mb-2">Pembayaran QRIS</h3>
        <p className="text-sm text-gray-500 mb-4">
          Total Tagihan:{' '}
          <span className="font-bold text-black">Rp{totalAmount.toLocaleString()}</span>
        </p>

        {qrData ? (
          <div className="flex flex-col items-center">
            <div className="p-4 border-4 border-[#52bfbe] rounded-2xl bg-white shadow-inner">
              <QRCodeSVG value={qrData} size={240} />
            </div>
            <p className="mt-4 text-xs text-gray-400 italic">
              Scan QRIS melalui aplikasi bank atau e-wallet Anda
            </p>
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#52bfbe]"></div>
            <p className="text-sm text-gray-500">Menghubungkan ke API Payment...</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-semibold transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}
