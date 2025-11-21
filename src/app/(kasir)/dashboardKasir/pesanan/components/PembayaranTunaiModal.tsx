'use client'
import { useState } from 'react'

export default function PembayaranTunaiModal({ onClose }: any) {
  const total = 54500
  const [bayar, setBayar] = useState<number | ''>('')
  const [showStruk, setShowStruk] = useState(false)
  const kembali = Number(bayar) - total

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        {!showStruk ? (
          <>
            <h3 className="text-lg font-bold mb-3">Pembayaran Tunai</h3>
            <p className="text-gray-700 mb-2">Total: Rp{total.toLocaleString('id-ID')}</p>
            <input
              type="number"
              placeholder="Nominal dibayar"
              value={bayar}
              onChange={(e) => setBayar(e.target.value ? Number(e.target.value) : '')}
              className="w-full border p-2 rounded-md mb-3"
            />
            {bayar !== '' && (
              <p className="text-sm text-gray-600">
                Kembalian: Rp{(kembali > 0 ? kembali : 0).toLocaleString('id-ID')}
              </p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded-md">
                Batal
              </button>
              <button
                disabled={bayar === '' || kembali < 0}
                onClick={() => setShowStruk(true)}
                className={`px-3 py-1 rounded-md text-white ${
                  bayar === '' || kembali < 0 ? 'bg-gray-400' : 'bg-teal-500 hover:bg-teal-600'
                }`}
              >
                Lanjut
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold mb-3">Pembayaran Berhasil</h3>
            <p className="text-gray-700 mb-2">Total Bayar: Rp{total.toLocaleString('id-ID')}</p>
            <p className="text-gray-700 mb-2">Dibayar: Rp{Number(bayar).toLocaleString('id-ID')}</p>
            <p className="text-gray-700 mb-4">
              Kembalian: Rp{(kembali > 0 ? kembali : 0).toLocaleString('id-ID')}
            </p>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-3 py-1 bg-teal-500 text-white rounded-md">
                Cetak Struk
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
