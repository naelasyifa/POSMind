'use client'

import { useEffect, useState } from 'react'

interface HapusUserProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName: string
}

export default function HapusUser({ isOpen, onClose, onConfirm, userName }: HapusUserProps) {
  const [mounted, setMounted] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      setTimeout(() => setAnimate(true), 10)
    } else {
      setAnimate(false)
      setTimeout(() => setMounted(false), 200)
    }
  }, [isOpen])

  if (!mounted) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <>
      <div
        className={`
          fixed inset-0 z-50 flex items-center justify-center px-4
          transition-all duration-200
          ${animate ? 'bg-black/40 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-0'}
        `}
        onClick={onClose}
      >
        <div
          className={`
            bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md
            transform transition-all duration-200
            ${animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon Warning */}
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

          <h2 className="text-xl font-bold text-center text-gray-800 mb-3">
            Apakah Anda yakin ingin menghapus pengguna ini?
          </h2>

          <p className="text-sm text-center text-gray-600 mb-6">
            Pengguna <span className="font-semibold text-gray-800">{userName}</span> akan dihapus
            secara permanen.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all"
            >
              Tidak
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-all"
            >
              Ya
            </button>
          </div>
        </div>
      </div>

      {/* FIX OUTLINE & BORDER HITAM (TANPA UBAH UI) */}
      <style jsx>{`
        button:focus {
          outline: none;
        }
      `}</style>
    </>
  )
}
