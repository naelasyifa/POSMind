'use client'

import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface DetailPromoProps {
  promoId?: string
  promoData?: any
  onClose: () => void
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between p-3 bg-gray-50 rounded-xl shadow-sm">
    <p className="font-medium text-gray-700">{label}</p>
    <p className="text-gray-900">{value}</p>
  </div>
)

export default function DetailPromo({ promoId, promoData, onClose }: DetailPromoProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [promo, setPromo] = useState<any>(promoData || null)
  const [loading, setLoading] = useState(!promoData)

  // Ambil data promo via API jika cuma dikasih promoId
  useEffect(() => {
    if (!promoId || promoData) return

    setLoading(true)
    fetch(`/api/frontend/promos?id=${promoId}`)
      .then((res) => res.json())
      .then((data) => setPromo(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [promoId, promoData])

  if (!promo && loading)
    return <div className="fixed inset-0 flex items-center justify-center z-50">Loading...</div>
  if (!promo) return null

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 250) // durasi sama dengan animasi scaleOut
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatDiskon = (promo: any) =>
    promo.tipeDiskon === 'percent'
      ? `${promo.nilaiDiskon}%`
      : `Rp ${promo.nilaiDiskon.toLocaleString()}`

  const formatLimitCustomer = (limit: string) => {
    switch (limit) {
      case 'unlimited':
        return 'Tidak dibatasi'
      case 'once_per_day':
        return '1x per hari'
      case 'once_per_order':
        return '1x per transaksi'
      case 'new_customer':
        return 'Khusus pelanggan baru'
      default:
        return limit
    }
  }

  const formatStacking = (stacking: string) => {
    switch (stacking) {
      case 'no':
        return 'Tidak Bisa Digabung'
      case 'yes':
        return 'Boleh Digabung'
      case 'single':
        return 'Hanya 1 Promo Aktif'
      default:
        return stacking
    }
  }

  const formatOrderType = (types: string[]) => {
    return types
      ?.map((t) => (t === 'dinein' ? 'Dine In' : t === 'takeaway' ? 'Takeaway' : t))
      .join(', ')
  }

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="bg-white p-6 rounded shadow text-center animate-pulse">Loading...</div>
      </div>
    )

  if (!promo) return null

  const banner = promo.banner ?? '/images/default-promo.jpg'

  return (
    <>
      {/* Overlay Modal */}
      <div
        className={`fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 ${
          isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}
      >
        <div
          className={`bg-white rounded-xl w-full max-w-[600px] shadow-xl overflow-hidden ${
            isClosing ? 'animate-scaleOut' : 'animate-scaleIn'
          }`}
        >
          {/* Header */}
          <div className="relative bg-[#52bfbe] p-3 flex items-center">
            <h2 className="text-xl font-semibold text-white absolute left-1/2 transform -translate-x-1/2">
              Detail Promo
            </h2>
            <button
              onClick={handleClose}
              className="ml-auto text-white p-1 rounded hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[400px] overflow-auto">
            {/* === Status & Kategori (dipindah ke atas) === */}
            <div className="flex gap-2 flex-wrap">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  promo.status === 'Aktif'
                    ? 'bg-green-50 text-green-700 border border-green-200 animate-pulseDot'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {promo.status}
              </span>

              <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {promo.kategori}
              </span>
            </div>

            {/* === HIGHLIGHT BOX BESAR === */}
            <div
              className={`
          bg-gradient-to-r from-orange-50 to-amber-50
          border border-orange-200 rounded-xl p-4
          flex items-center gap-4
          transition-transform duration-300 
          hover:scale-[1.02] hover:shadow-xl
        `}
            >
              {/* Teks kiri */}
              <div className="flex-1 space-y-2">
                {/* Nama Promo */}
                <p className="text-lg font-semibold text-orange-700">{promo.nama}</p>

                {/* Diskon / BXGY */}
                {promo.promoType === 'discount' && (
                  <p className="text-2xl font-bold text-orange-600">{formatDiskon(promo)}</p>
                )}

                {promo.promoType === 'bxgy' && (
                  <p className="text-xl font-bold text-purple-600">
                    Beli {promo.buyQuantity} Gratis {promo.freeQuantity}
                  </p>
                )}
              </div>

              {/* Banner — ratio 2:1, no white box, rounded */}
              <div className="w-32 aspect-[2/1] rounded-lg overflow-hidden shadow">
                <img
                  src={banner}
                  alt={promo.nama}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* BOX ABU BESAR */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
              <p>
                <strong>Periode:</strong> {formatDate(promo.mulai)} - {formatDate(promo.akhir)}
              </p>

              <p>
                <strong>Kuota:</strong>{' '}
                {promo.useQuota
                  ? `${promo.kuota - promo.kuotaUsed} sisa dari ${promo.kuota}`
                  : 'Tidak dibatasi'}
              </p>

              <p>
                <strong>Min. Pembelian:</strong>{' '}
                {promo.minPembelian ? `Rp ${promo.minPembelian.toLocaleString()}` : '-'}
              </p>

              <p>
                <strong>Produk Promo:</strong>{' '}
                {Array.isArray(promo.produk)
                  ? promo.produk.map((p: any) => p.nama).join(', ')
                  : promo.produk?.nama || '-'}
              </p>

              <p>
                <strong>Penggabungan:</strong> {formatStacking(promo.stacking)}
              </p>

              <p>
                <strong>Tipe Order:</strong> {formatOrderType(promo.orderType)}
              </p>

              <p>
                <strong>Limit Pelanggan:</strong> {promo.limitCustomer}
              </p>
            </div>
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
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
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
        .animate-fadeOut {
          animation: fadeOut 0.25s ease forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease forwards;
        }
        .animate-scaleOut {
          animation: scaleOut 0.25s ease forwards;
        }
      `}</style>
    </>
  )
}
