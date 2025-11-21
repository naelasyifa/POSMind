'use client'

interface BerhasilSimpanPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function BerhasilSimpanPopup({ isOpen, onClose }: BerhasilSimpanPopupProps) {
  if (!isOpen) return null

  return (
    <>
      {/* ✅ Style animasi langsung di file ini */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>

      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-center text-gray-800 mb-3">
            Berhasil Disimpan!
          </h2>

          <p className="text-sm text-center text-gray-600 mb-6">
            Perubahan profil kamu telah berhasil disimpan.
          </p>

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-[#52BFBE] hover:bg-[#46a8a8] text-white font-medium py-2 px-6 rounded-lg transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
