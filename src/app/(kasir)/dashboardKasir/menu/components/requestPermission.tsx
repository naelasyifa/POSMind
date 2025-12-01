'use client'

import { LockKeyhole } from 'lucide-react'

type PermissionRequestProps = {
  isOpen: boolean
  onClose: () => void
  actionName?: string
}

export default function PermissionRequest({ isOpen, onClose, actionName }: PermissionRequestProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
  <LockKeyhole className="w-8 h-8 text-yellow-500" strokeWidth={2} />
</div>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-3">Akses Diperlukan</h2>

        <p className="text-sm text-center text-gray-600 mb-6">
          Anda memerlukan izin dari Admin untuk melakukan aksi ini
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-all"
          >
            Batal
          </button>

          <button
            onClick={() => {
              alert('Permintaan izin telah dikirim ke admin.')
              onClose()
            }}
            className="flex-1 bg-[#52bfbe] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-all"
          >
            Minta Izin
          </button>
        </div>
      </div>
    </div>
  )
}
