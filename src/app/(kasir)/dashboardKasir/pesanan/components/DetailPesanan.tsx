'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'

export default function DetailPesanan({
  keranjang = [],
  subtotal = 0,
  pajak = 0,
  promoBreakdown = [], // ⭐ promo dari pesanan baru
  total = 0,
  customerName = '',
  onOpenCustomer,
  onRemoveItem,
}: any) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [isPaying, setIsPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | ''>('')
  const [amountPaid, setAmountPaid] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [isPaid, setIsPaid] = useState(false)

  // =================== WAKTU ===================
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const hari = now.toLocaleDateString('id-ID', { weekday: 'short' })
      const tanggal = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      const jam = now.toLocaleTimeString('id-ID', { hour12: false })
      setCurrentTime(`${hari}, ${tanggal} | ${jam}`)
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  // =================== HITUNG KEMBALIAN ===================
  useEffect(() => {
    if (paymentMethod === 'cash') {
      setChange(amountPaid > total ? amountPaid - total : 0)
    } else {
      setChange(0)
    }
  }, [amountPaid, paymentMethod, total])

  const handleCheckout = () => setIsPaying(true)

  const handleConfirmPayment = () => {
    if (!paymentMethod) return alert('Pilih metode pembayaran!')
    if (paymentMethod === 'cash' && amountPaid < total) return alert('Jumlah bayar kurang!')

    setIsPaid(true)
  }

  const handleCancelPayment = () => {
    if (confirm('Batalkan proses pembayaran?')) {
      router.push('/dashboardKasir/pesanan')
    }
  }

  const handleCancelOrder = () => {
    if (confirm('Batalkan pesanan ini?')) {
      router.push('/dashboardKasir/pesanan')
    }
  }

  const handlePrintReceipt = () => {
    alert('Struk dicetak (simulasi)')
    router.push('/dashboardKasir/pesanan')
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col justify-between">
      {/* =================== SCROLL AREA =================== */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex flex-col gap-3">
          {/* ============ HEADER ============ */}
          <div>
            <h2 className="font-bold text-lg">Pesanan #001</h2>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">{customerName || 'Pelanggan: -'}</p>

              <button onClick={onOpenCustomer} className="p-1 rounded hover:bg-gray-100">
                <Pencil size={16} />
              </button>
            </div>

            <div className="border-b my-2"></div>
            <p className="text-xs text-gray-500">{currentTime}</p>
          </div>

          {/* ============ ITEM LIST ============ */}
          <div className="max-h-[250px] overflow-y-auto space-y-3 border-b pb-3">
            {keranjang.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Belum ada item</p>
            ) : (
              keranjang.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border rounded p-2">
                  <div className="flex-1">
                    <div className="font-medium">{it.nama}</div>
                    {it.note && <div className="text-xs text-gray-500">Catatan: {it.note}</div>}
                    <div className="text-xs text-gray-500">Rp{it.harga.toLocaleString()}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">x{it.qty}</div>
                    <div className="text-sm font-bold">
                      Rp{(it.harga * it.qty).toLocaleString()}
                    </div>

                    <button onClick={() => onRemoveItem(idx)} className="p-1 hover:bg-gray-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ============ TOTAL + PROMO ============ */}
          <div className="text-sm space-y-2 pt-2">
            {/* Subtotal */}
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp{subtotal.toLocaleString()}</span>
            </div>

            {/* PROMO DINAMIS */}
            {promoBreakdown.length > 0 && (
              <div className="space-y-1">
                {promoBreakdown.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs text-red-500 font-medium">
                    <span>{p.label}</span>
                    <span>-Rp{p.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Pajak */}
            <div className="flex justify-between">
              <span>Pajak 10%</span>
              <span>Rp{pajak.toLocaleString()}</span>
            </div>

            {/* TOTAL */}
            <div className="border-t border-dashed pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>Rp{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Catatan Pelanggan</label>
            <input
              className="w-full border rounded p-2 text-sm"
              placeholder="menggunakan alat makan"
            />
          </div>

          {/* ============ FORM PEMBAYARAN ============ */}
          {isPaying && !isPaid && (
            <div className="mt-4 border-t pt-3 space-y-3">
              <h3 className="font-semibold text-sm">Detail Pembayaran</h3>

              {/* Metode */}
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex-1 py-2 rounded border ${
                    paymentMethod === 'cash' ? 'bg-[#52bfbe] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('qris')}
                  className={`flex-1 py-2 rounded border ${
                    paymentMethod === 'qris' ? 'bg-[#52bfbe] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  QRIS
                </button>
              </div>

              {/* Input Cash */}
              {paymentMethod === 'cash' && (
                <div>
                  <label className="text-sm text-gray-600">Jumlah Bayar (Rp)</label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full border rounded p-2 text-sm mt-1"
                  />
                </div>
              )}

              <div className="flex justify-between text-sm font-medium">
                <span>Total Bayar</span>
                <span>Rp{(paymentMethod === 'cash' ? amountPaid : total).toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm font-medium">
                <span>Kembali</span>
                <span>Rp{change.toLocaleString()}</span>
              </div>

              <button
                onClick={handleConfirmPayment}
                className="w-full py-2 rounded bg-[#52bfbe] text-white hover:bg-[#44a9a9]"
              >
                Bayar Sekarang
              </button>

              <button
                onClick={handleCancelPayment}
                className="w-full py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100"
              >
                Batalkan Pembayaran
              </button>
            </div>
          )}

          {/* ============ SETELAH BAYAR ============ */}
          {isPaid && (
            <div className="mt-4 border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Metode</span>
                <span className="font-medium capitalize">{paymentMethod}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Bayar</span>
                <span>Rp{(paymentMethod === 'cash' ? amountPaid : total).toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Kembali</span>
                <span>Rp{change.toLocaleString()}</span>
              </div>

              <button
                onClick={handlePrintReceipt}
                className="w-full py-2 rounded bg-[#52bfbe] text-white hover:bg-[#44a9a9] mt-2"
              >
                Cetak Struk
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer: tombol pilih pembayaran & batal */}
      {!isPaying && !isPaid && (
        <div className="pt-3 space-y-2">
          <button
            onClick={handleCheckout}
            disabled={keranjang.length === 0}
            className={`w-full py-2 rounded ${
              keranjang.length === 0 ? 'bg-gray-300' : 'bg-[#52bfbe] text-white hover:bg-[#44a9a9]'
            }`}
          >
            Pilih Pembayaran
          </button>

          <button
            onClick={handleCancelOrder}
            className="w-full py-2 rounded border border-red-500 text-red-500 hover:bg-red-50"
          >
            Batalkan Pesanan
          </button>
        </div>
      )}
    </div>
  )
}
