'use client'

import { useState } from 'react'

interface DeletePromoProps {
  promo: any
  onConfirm: (id: number) => void
  onCancel: () => void
}

export default function DeletePromo({ promo, onConfirm, onCancel }: DeletePromoProps) {
  const [closing, setClosing] = useState(false)

  if (!promo) return null

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => onCancel(), 220) // tunggu animasi scale out selesai
  }

  const handleConfirm = async () => {
    setClosing(true)
    try {
      const res = await fetch('/api/frontend/promos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: promo.id }),
      })

      if (!res.ok) throw new Error('Gagal menghapus promo')

      // opsional: dapat response dari server, misal data promo yang dihapus
      const data = await res.json()
      console.log('Deleted promo:', data)

      onConfirm(promo.id) // update state parent
      setTimeout(() => onCancel(), 220) // tunggu animasi selesai
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menghapus promo')
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fadeIn"
        onClick={handleClose}
      >
        {/* Modal Box */}
        <div
          className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform
            ${closing ? 'animate-scaleOut' : 'animate-scaleIn'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center text-gray-800 mb-3">
            Apakah Anda yakin ingin menghapus promo ini?
          </h2>

          <p className="text-sm text-center text-gray-600 mb-6">
            Promo <span className="font-semibold">{promo.nama}</span> akan dihapus permanen.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all"
            >
              Tidak
            </button>

            <button
              onClick={handleConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-all"
            >
              Ya
            </button>
          </div>
        </div>
      </div>

      {/* Animasi */}
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
