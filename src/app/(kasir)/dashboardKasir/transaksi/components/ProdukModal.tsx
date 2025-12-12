'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function ProdukModal({ product, onClose, onAdd }: any) {
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => onClose(), 220) // menunggu animasi scaleOut
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-fadeIn"
        onClick={handleClose}
      >
        <div
          className={`bg-white rounded-lg w-[420px] p-5 relative transform
            ${closing ? 'animate-scaleOut' : 'animate-scaleIn'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="absolute top-3 right-3" onClick={handleClose}>
            <X />
          </button>

          <div className="flex gap-4">
            <div className="w-36 h-28 bg-gray-100 flex items-center justify-center rounded">
              {product.gambar?.url ? (
                <img
                  src={product.gambar.url}
                  alt={product.nama}
                  className="h-full object-cover rounded"
                />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg">{product.nama}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {typeof product.deskripsi === 'string' && product.deskripsi.trim() !== ''
                  ? product.deskripsi
                  : typeof product.desc === 'string' && product.desc.trim() !== ''
                    ? product.desc
                    : '-'}
              </p>

              <div className="font-semibold text-teal-600 mb-3">
                Rp {product.harga.toLocaleString()}
              </div>

              <textarea
                placeholder="Tambahkan catatan"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-md p-2 mb-3"
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-full border"
                >
                  -
                </button>

                <div className="flex-1 text-center font-semibold bg-[#52bfbe] text-white rounded px-3 py-2">
                  {qty}
                </div>

                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-full border">
                  +
                </button>

                <button
                  onClick={() => {
                    if (product.stok <= 0) {
                      alert('Stok habis')
                      return
                    }
                    if (qty > product.stok) {
                      alert('Qty lebih besar dari stok')
                      return
                    }
                    onAdd(product, qty, note)
                  }}
                  className="ml-2 px-4 py-2 bg-[#52bfbe] text-white rounded"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Animasi === */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes scaleOut {
          from {
            transform: scale(1);
            opacity: 1;
          }
          to {
            transform: scale(0.9);
            opacity: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease forwards;
        }
        .animate-scaleOut {
          animation: scaleOut 0.22s ease forwards;
        }
      `}</style>
    </>
  )
}
