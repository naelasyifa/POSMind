'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

interface DetailPromoProps {
  promo: any
  onClose: () => void
}

export default function DetailPromo({ promo, onClose }: DetailPromoProps) {
  const [isClosing, setIsClosing] = useState(false)

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

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 ${
          isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}
      >
        <div
          className={`bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden ${
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
          <div className="p-4 space-y-2 text-sm leading-relaxed">
            <p>
              <strong>Nama Promo:</strong> {promo.nama}
            </p>
            <p>
              <strong>Kode:</strong> {promo.kode}
            </p>
            <p>
              <strong>Periode:</strong> {formatDate(promo.mulai)} - {formatDate(promo.akhir)}
            </p>
            <p>
              <strong>Kategori:</strong> {promo.kategori}
            </p>
            <p>
              <strong>Diskon:</strong> {formatDiskon(promo)}
            </p>
            <p>
              <strong>Kuota:</strong> {promo.kuota}
            </p>
            <p>
              <strong>Minimum Pembelian:</strong>{' '}
              {promo.minPembelian ? `Rp ${promo.minPembelian.toLocaleString()}` : '-'}
            </p>
            <p>
              <strong>Produk Promo:</strong>{' '}
              {promo.produk?.map((p: any) => p.nama).join(', ') || '-'}
            </p>
            <p>
              <strong>Aturan Penggabungan Promo:</strong> {formatStacking(promo.stacking)}
            </p>
            <p>
              <strong>Berlaku Untuk:</strong> {formatOrderType(promo.orderType)}
            </p>
            <p>
              <strong>Limit Per Pelanggan:</strong> {formatLimitCustomer(promo.limitCustomer)}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`ml-1 font-medium ${
                  promo.status === 'Aktif' ? 'text-blue-500' : 'text-red-500'
                }`}
              >
                {promo.status}
              </span>
            </p>
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
