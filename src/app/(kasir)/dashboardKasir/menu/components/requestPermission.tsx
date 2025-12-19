'use client'

import { LockKeyhole } from 'lucide-react'

type ActionType = 'create' | 'update' | 'delete'

type PermissionRequestProps = {
  isOpen: boolean
  onClose: () => void
  actionType: 'create' | 'update' | 'delete'
  actionLabel: string
  payload?: any
}

export default function PermissionRequest({
  isOpen,
  onClose,
  actionType,
  actionLabel,
  payload,
}: PermissionRequestProps) {
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
            <LockKeyhole className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-3">Akses Diperlukan</h2>

        <p className="text-sm text-center text-gray-600 mb-6">
          Anda memerlukan izin Admin untuk melakukan aksi ini
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-200 py-3 rounded-lg">
            Batal
          </button>

          <button
  onClick={async () => {
    await fetch('/api/action-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionType,
        payloadData: payload,
      }),
    })

    alert('Permintaan izin dikirim ke Admin')
    onClose()
  }}
  className="flex-1 bg-[#52bfbe] text-white py-3 rounded-lg"
>
  Minta Izin
</button>

        </div>
      </div>
    </div>
  )
}
