'use client'
import { useState } from 'react'

export default function PembayaranModal({
  subtotal,
  itemDiscount,
  orderDiscount,
  pajak,
  total,
  onClose,
  onSuccess,
}: any) {
  const [method, setMethod] = useState<'tunai' | 'qris' | 'transfer' | ''>('')
  const [cash, setCash] = useState<number | ''>('')
  const kembali = typeof cash === 'number' ? Math.max(0, cash - total) : 0

  const handlePay = () => {
    if (!method) return alert('Pilih metode pembayaran')
    if (method === 'tunai' && (typeof cash !== 'number' || cash < total))
      return alert('Nominal tunai kurang')
    onSuccess(method, method === 'tunai' ? cash : undefined)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-[480px] p-6">
        <h3 className="text-xl font-bold mb-2">Konfirmasi Pembayaran</h3>

        <div className="mb-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Item Discount</span>
            <span>-Rp{itemDiscount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Order Discount</span>
            <span>-Rp{orderDiscount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Pajak</span>
            <span>Rp{pajak.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>Rp{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex gap-3">
            <button
              onClick={() => setMethod('tunai')}
              className={`flex-1 py-2 rounded ${method === 'tunai' ? 'bg-[#52bfbe] text-white' : 'bg-gray-100'}`}
            >
              Tunai
            </button>
            <button
              onClick={() => setMethod('qris')}
              className={`flex-1 py-2 rounded ${method === 'qris' ? 'bg-[#52bfbe] text-white' : 'bg-gray-100'}`}
            >
              QRIS
            </button>
            <button
              onClick={() => setMethod('transfer')}
              className={`flex-1 py-2 rounded ${method === 'transfer' ? 'bg-[#52bfbe] text-white' : 'bg-gray-100'}`}
            >
              Transfer
            </button>
          </div>
        </div>

        {method === 'tunai' && (
          <div className="mb-4">
            <input
              type="number"
              placeholder="Masukkan nominal tunai"
              className="w-full border rounded p-2"
              value={cash}
              onChange={(e) => setCash(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <div className="mt-2 text-sm">Kembalian: Rp{kembali.toLocaleString()}</div>
          </div>
        )}

        {method === 'qris' && (
          <div className="mb-4 flex flex-col items-center">
            <div className="w-40 h-40 bg-gray-100 flex items-center justify-center">QR CODE</div>
            <p className="text-sm text-gray-500 mt-2">Scan QRIS untuk membayar</p>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-300 rounded">
            Batal
          </button>
          <button onClick={handlePay} className="flex-1 py-2 bg-[#52bfbe] text-white rounded">
            Bayar
          </button>
        </div>
      </div>
    </div>
  )
}
