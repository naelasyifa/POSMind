'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

export default function PelangganModal({ initialName = '', onClose, onSave }: any) {
  const [name, setName] = useState(initialName)
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => onClose(), 220) // menunggu animasi scaleOut
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 animate-fadeIn"
        onClick={handleClose}
      >
        <div
          className={`bg-white rounded-lg p-5 w-80 relative transform
            ${closing ? 'animate-scaleOut' : 'animate-scaleIn'}
          `}
          onClick={(e) => e.stopPropagation()} // supaya klik di modal tidak menutup
        >
          <button className="absolute top-3 right-3" onClick={handleClose}>
            <X />
          </button>

          <h3 className="text-lg font-bold mb-3">Nama Pelanggan</h3>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama"
            className="w-full border rounded p-2 mb-4"
          />

          <div className="flex justify-end gap-2">
            <button onClick={handleClose} className="px-3 py-1 bg-gray-300 rounded">
              Batal
            </button>
            <button
              onClick={() => onSave(name)}
              className="px-3 py-1 bg-[#52bfbe] text-white rounded"
            >
              Simpan
            </button>
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
