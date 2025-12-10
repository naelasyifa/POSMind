'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus } from 'lucide-react'
import SidebarKasir from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'

interface ItemPesanan {
  nama: string
  harga: number
  qty: number
  note?: string
}

interface Pesanan {
  id: number
  noPesanan: string
  nama: string
  waktu: string
  items: ItemPesanan[]
  subtotal: number
  pajak: number
  discount: number
  total: number
  status: 'selesai' | 'batal' | 'proses'
  metode: 'Cash' | 'E-Wallet'
  bayar?: number
  kembalian?: number
}

export default function RiwayatPage() {
  const router = useRouter()

  const [pesananList, setPesananList] = useState<Pesanan[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'semua' | 'selesai' | 'batal' | 'proses'>('semua')

  // State untuk detail pesanan
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  // State untuk proses pembayaran
  const [isPaying, setIsPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | ''>('')
  const [amountPaid, setAmountPaid] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [isPaid, setIsPaid] = useState(false)

  const [isClosing, setIsClosing] = useState(false)
  const closeDetail = () => {
    setIsClosing(true)

    setTimeout(() => {
      setDetailOpen(false)
      setSelectedOrder(null)
      setIsClosing(false)
    }, 300) // sesuai durasi fadeOut
  }

  const filteredPesanan = pesananList.filter((p) => {
    // filter status
    if (filter !== 'semua' && p.status !== filter) return false

    // filter search
    const keyword = search.toLowerCase()
    return (
      p.noPesanan.toLowerCase().includes(keyword) ||
      p.nama.toLowerCase().includes(keyword) ||
      p.status.toLowerCase().includes(keyword) ||
      p.metode.toLowerCase().includes(keyword)
    )
  })

  // buka detail (slide dari kanan)
  const handleSelesaikan = (pesanan: Pesanan) => {
    setSelectedOrder(pesanan)
    setDetailOpen(true)
    // reset payment states
    setIsPaying(false)
    setPaymentMethod('')
    setAmountPaid(0)
    setChange(0)
    setIsPaid(false)
  }

  useEffect(() => {
    if (paymentMethod === 'cash') {
      setChange(amountPaid > (selectedOrder?.total || 0) ? amountPaid - selectedOrder.total : 0)
    } else {
      setChange(0)
    }
  }, [amountPaid, paymentMethod, selectedOrder])

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/frontend/get-transactions')
      const data = await res.json()
      // mapping nama pelanggan dari database ke field 'nama'
      const mappedData = data.map((p: any, idx: number) => ({
        id: idx + 1, // atau p.id kalau ada di database
        noPesanan: p.noPesanan,
        nama: p.namaPelanggan || '-', // pastikan field database sesuai
        waktu: new Date(p.createdAt).toLocaleString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: p.items || [],
        subtotal: p.subtotal || 0,
        pajak: p.pajak || 0,
        discount: p.discount || 0,
        total: p.total || 0,
        status: p.status || 'proses',
        metode: p.metode || 'Cash',
        bayar: p.bayar,
        kembalian: p.kembalian,
      }))

      setPesananList(mappedData)
    }

    load()
  }, [])

  // konfirmasi pembayaran: update pesananList -> status selesai, simpan bayar & kembalian
  const handleConfirmPayment = () => {
    if (!selectedOrder) return
    if (!paymentMethod) {
      alert('Pilih metode pembayaran!')
      return
    }
    if (paymentMethod === 'cash' && amountPaid < selectedOrder.total) {
      alert('Jumlah bayar kurang!')
      return
    }

    // update pesananList
    setPesananList((prev) =>
      prev.map((p) =>
        p.id === selectedOrder.id
          ? {
              ...p,
              status: 'selesai',
              bayar: paymentMethod === 'cash' ? amountPaid : p.total,
              kembalian: paymentMethod === 'cash' ? change : 0,
              metode: paymentMethod === 'cash' ? 'Cash' : 'E-Wallet',
            }
          : p,
      ),
    )

    setIsPaid(true)

    // beri sedikit delay supaya user lihat konfirmasi, lalu tutup modals
    setTimeout(() => {
      setIsPaying(false)
      setDetailOpen(false)
      setSelectedOrder(null)
      setPaymentMethod('')
      setAmountPaid(0)
      setChange(0)
      setIsPaid(false)
    }, 800)
  }

  return (
    <>
      <div className="flex min-h-screen bg-[#52bfbe] text-gray-800">
        <div className="relative z-30">
          <SidebarKasir />
        </div>
        <div className="flex-1 flex flex-col relative z-20" style={{ marginLeft: '7rem' }}>
          <HeaderKasir
            title="Riwayat Transaksi"
            showBack
            onBack={() => router.push('/dashboardKasir/transaksi')}
          />

          {/* Filter dan Kontrol */}
          <div className="flex flex-col md:flex-row justify-between gap-4 p-4">
            <div className="flex gap-2">
              {['semua', 'proses', 'selesai', 'batal'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-1 rounded-full font-medium text-sm ${
                    filter === f ? 'bg-[#737373] text-white' : 'bg-white text-black'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#737373] bg-white text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Daftar Pesanan */}
          <div className="p-4 flex-1 overflow-y-auto">
            {filteredPesanan.length === 0 && (
              <p className="text-white italic mb-4">Belum ada pesanan.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPesanan.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow p-4 flex flex-col hover:shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="bg-[#1E90FF] text-white px-3 py-1 rounded font-bold">
                      {p.noPesanan}
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        p.status === 'selesai'
                          ? 'bg-green-200 text-green-700'
                          : p.status === 'batal'
                            ? 'bg-red-200 text-red-700'
                            : 'bg-yellow-200 text-yellow-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <p className="font-semibold">{p.nama || '-'}</p>
                  <p className="text-xs text-gray-500 border-b border-gray-300 pb-1">{p.waktu}</p>

                  {/* Items */}
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-0.5">
                    {p.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>
                          {item.nama} x{item.qty}
                        </span>
                        <span>Rp{(item.harga * item.qty).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-dashed pt-2 flex justify-between items-center mt-3 font-semibold">
                    <span>Subtotal</span>
                    <span>Rp{p.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pajak 10%</span>
                    <span>Rp{p.pajak.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span>Diskon</span>
                    <span>-Rp{p.discount.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-dashed pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>Rp{p.total.toLocaleString()}</span>
                  </div>

                  <div className="mt-2 text-sm">
                    <div className="flex justify-between">
                      <span>Metode</span>
                      <span>{p.metode}</span>
                    </div>
                    {p.status === 'selesai' && (
                      <>
                        <div className="flex justify-between">
                          <span>Bayar</span>
                          <span>Rp{p.bayar?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kembalian</span>
                          <span>Rp{p.kembalian?.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Tombol selesaikan hanya untuk proses */}
                  {p.status === 'proses' && (
                    <button
                      onClick={() => handleSelesaikan(p)} // kirim objek pesanan
                      className="mt-3 px-3 py-2 rounded bg-[#52bfbe] text-white hover:bg-[#44a9a9]"
                    >
                      Selesaikan Pesanan
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Pesanan Slide Panel */}
      {detailOpen && selectedOrder && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 animate-fadeIn"
            onClick={() => {
              setIsClosing(true)
              setTimeout(() => {
                setDetailOpen(false)
                setSelectedOrder(null)
                setIsClosing(false)
              }, 250)
            }}
          />

          <div
            className={`fixed top-0 right-0 w-full max-w-[420px] h-full bg-white rounded-l-2xl shadow-xl 
        z-50 p-6 overflow-y-auto
        ${isClosing ? 'animate-slideOutRight' : 'animate-slideInRight'}
      `}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Detail Pesanan</h2>
              <button
                onClick={() => {
                  setIsClosing(true)
                  setTimeout(() => {
                    setDetailOpen(false)
                    setSelectedOrder(null)
                    setIsClosing(false)
                  }, 250)
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 text-sm mt-3 mb-6">
              {selectedOrder.noPesanan} • {selectedOrder.nama} • {selectedOrder.waktu}
            </p>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mt-6">
              {selectedOrder.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.nama} x{item.qty}
                  </span>
                  <span>Rp{(item.harga * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t my-6 pt-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp{selectedOrder.subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Pajak 10%</span>
                <span>Rp{selectedOrder.pajak.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Diskon</span>
                <span>-Rp{selectedOrder.discount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span>Rp{selectedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-12 flex justify-end gap-3">
              <button
                onClick={() => setIsPaying(true)}
                className="px-4 py-2 rounded-lg bg-[#52bfbe] text-white hover:bg-[#44a9a9]"
              >
                Lanjutkan Pembayaran
              </button>
            </div>
          </div>
        </>
      )}

      {/* ====== PAYMENT MODAL (overlay di atas slide panel) ====== */}
      {isPaying && selectedOrder && (
        <>
          {/* overlay cepat */}
          <div
            className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center animate-fadeIn"
            onClick={() => {
              // klik overlay akan menutup payment modal saja
              setIsPaying(false)
              setPaymentMethod('')
              setAmountPaid(0)
              setChange(0)
              setIsPaid(false)
            }}
          />

          {/* payment box */}
          <div className="fixed z-70 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-5 bg-white rounded-xl shadow-xl animate-zoomIn">
            <h3 className="text-lg font-semibold mb-2">Pembayaran — {selectedOrder.noPesanan}</h3>
            <p className="text-sm text-gray-600 mb-3">
              {selectedOrder.nama} • {selectedOrder.waktu}
            </p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Total Tagihan</span>
                <span className="font-bold">Rp{selectedOrder.total.toLocaleString()}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex-1 py-2 rounded border ${
                    paymentMethod === 'cash' ? 'bg-[#52bfbe] text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('qris')}
                  className={`flex-1 py-2 rounded border ${
                    paymentMethod === 'qris' ? 'bg-[#52bfbe] text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  QRIS
                </button>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="text-sm text-gray-600">Jumlah Bayar (Rp)</label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full border rounded p-2 mt-1"
                    placeholder="Masukkan jumlah bayar"
                  />
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>Jumlah yang dibayar</span>
                <span>
                  {paymentMethod === 'cash'
                    ? `Rp${amountPaid.toLocaleString()}`
                    : `Rp${selectedOrder.total.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Kembali</span>
                <span className="font-medium">Rp{change.toLocaleString()}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    // cancel payment modal
                    setIsPaying(false)
                    setPaymentMethod('')
                    setAmountPaid(0)
                    setChange(0)
                    setIsPaid(false)
                  }}
                  className="flex-1 py-2 rounded border hover:bg-gray-50"
                >
                  Batal
                </button>

                <button
                  onClick={handleConfirmPayment}
                  className="flex-1 py-2 rounded bg-[#52bfbe] text-white hover:bg-[#44a9a9]"
                >
                  Bayar Sekarang
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0.3;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fadeOut {
          animation: fadeOut 0.45s ease-in forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        .animate-slideOutRight {
          animation: slideOutRight 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
      `}</style>
    </>
  )
}
