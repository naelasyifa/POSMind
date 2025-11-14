'use client'

interface DeletePromoProps {
  promo: any
  onConfirm: (id: number) => void
  onCancel: () => void
}

export default function DeletePromo({ promo, onConfirm, onCancel }: DeletePromoProps) {
  if (!promo) return null

  const handleConfirm = () => {
    onConfirm(promo.id)
    onCancel()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onCancel}
    >
      {/* Kotak Modal */}
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all"
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

        {/* Judul */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-3">
          Apakah Anda yakin ingin menghapus promo ini?
        </h2>

        {/* Nama Promo */}
        <p className="text-sm text-center text-gray-600 mb-6">
          Promo <span className="font-semibold text-gray-800">{promo.nama}</span> akan dihapus
          secara permanen.
        </p>

        {/* Tombol Aksi */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
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
  )
}
