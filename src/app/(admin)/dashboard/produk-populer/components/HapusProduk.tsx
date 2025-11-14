import { X } from 'lucide-react'

export default function HapusNotif({ isOpen, onClose, onConfirm, notifTitle }: any) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-black mb-2">
          Hapus Produk?
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Apakah Anda yakin ingin menghapus <span className="font-semibold">{notifTitle}</span>?  
          Aksi ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
