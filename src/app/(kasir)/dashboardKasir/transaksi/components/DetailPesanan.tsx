'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, SendToBack, Trash2 } from 'lucide-react'
import PelangganModal from './PelangganModal'

type PromoItem = {
  label: string
  type?: 'percent' | 'nominal' // optional jika sudah diproses
  value: number // selalu nominal (Rupiah). Jika belum, konversi dulu
}

type CartItem = {
  id?: string
  nama: string
  harga: number
  qty: number
  stok?: number
  note?: string
}

export default function DetailPesanan({
  keranjang = [],
  subtotal = 0,
  pajak = 0,
  promoBreakdown = [], // ⭐ promo dari pesanan baru
  total = 0,
  customerName = '',
  onOpenCustomer,
  onRemoveItem,
}: {
  keranjang?: CartItem[]
  subtotal?: number
  pajak?: number
  promoBreakdown?: PromoItem[] // pastikan upstream mengirimkan nominal
  total?: number
  customerName?: string
  onOpenCustomer?: () => void
  onRemoveItem?: (i: number) => void
}) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [isPaying, setIsPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | ''>('')
  const [amountPaid, setAmountPaid] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [isPaid, setIsPaid] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [noPesanan, setNoPesanan] = useState<string>('')

  // === State pelanggan & modal ===
  const [customerNameState, setCustomerNameState] = useState(customerName)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)

  const handleOpenCustomer = () => setIsCustomerModalOpen(true)
  const handleCloseCustomer = () => setIsCustomerModalOpen(false)
  const handleSaveCustomer = (name: string) => {
    setCustomerNameState(name)
    handleCloseCustomer()
  }

  // helper: jika ada kemungkinan promoBreakdown berisi persen,
  // konversikan dulu ke nominal berdasarkan subtotal.
  // Jika promoBreakdown sudah berisi nominal, fungsi ini tidak mengubahnya.
  const toNominal = (p: PromoItem, subtotalAmount: number) => {
    if (p.type === 'percent') {
      return Math.round((p.value / 100) * subtotalAmount)
    }
    return p.value // sudah nominal
  }

  // pastikan array yang kita gunakan berisi nominal (Rupiah)
  const promoNominalList: PromoItem[] = (promoBreakdown || []).map((p) => ({
    ...p,
    value: toNominal(p, subtotal),
    type: p.type ?? 'nominal',
  }))

  // =================== FETCH NOMOR PESANAN ===================
  useEffect(() => {
    async function fetchNo() {
      try {
        const res = await fetch('/api/transactions/generate-no')
        const data = await res.json()
        setNoPesanan(data.noPesanan || '')
      } catch (err) {
        console.error('Gagal mengambil nomor pesanan:', err)
      }
    }

    fetchNo()
  }, [])

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

  useEffect(() => {
    if (paymentMethod === 'qris') {
      setAmountPaid(total)
    }
  }, [paymentMethod, total])

  // =================== HANDLER PEMBAYARAN ===================
  const handleCheckout = () => setIsPaying(true)

  const handleConfirmPayment = async () => {
    if (!paymentMethod) return alert('Pilih metode pembayaran!')
    if (paymentMethod === 'cash' && amountPaid < total) {
      return alert('Jumlah bayar kurang!')
    }

    try {
      const discount = promoNominalList.reduce((s, p) => s + p.value, 0)

      const itemsForPayload = keranjang.map(({ id, ...rest }) => ({
        productId: id, // untuk update stok nanti
        ...rest, // nama, harga, qty, stok, note
      }))

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noPesanan,
          tenant: 1,
          namaKasir: 'Kasir 1',
          namaPelanggan: customerNameState,
          items: itemsForPayload, // <<< id dihapus
          subtotal,
          pajak,
          discount,
          total,
          metode: paymentMethod === 'cash' ? 'Cash' : 'E-Wallet',
          bayar: amountPaid,
          kembalian: paymentMethod === 'cash' ? amountPaid - total : 0,
          status: 'selesai',
          waktu: new Date().toISOString(),
        }),
      })

      const data = await res.json()
      if (!res.ok) return alert(data.error)

      alert('Transaksi berhasil!')
      router.push('/dashboardKasir/transaksi/riwayat')
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message)
    }
  }

  const handleCancelPayment = async () => {
    if (!confirm('Batalkan proses pembayaran?')) return

    try {
      const itemsForPayload = keranjang.map(({ id, ...rest }) => rest)

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant: 'ID_PAYLOAD_TENANT',
          namaKasir: 'Kasir 1',
          namaPelanggan: customerNameState,
          items: itemsForPayload,
          subtotal,
          pajak,
          discount: promoNominalList.reduce((s, p) => s + p.value, 0),
          total,
          metode: 'Cash',
          bayar: 0,
          kembalian: 0,
          status: 'batal', // penting supaya tercatat batal
          waktu: new Date().toISOString(),
        }),
      })

      const data = await res.json()
      if (!res.ok) return alert(data.error)

      alert('Pembayaran dibatalkan dan tersimpan!')
      router.push('/dashboardKasir/transaksi')
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message)
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm('Batalkan pesanan ini?')) return

    try {
      const itemsForPayload = keranjang.map(({ id, ...rest }) => rest)

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant: 1,
          namaKasir: 'Kasir 1',
          namaPelanggan: customerNameState,
          items: itemsForPayload,
          subtotal,
          pajak,
          discount: promoNominalList.reduce((s, p) => s + p.value, 0),
          total,
          metode: 'Cash', // atau 'E-Wallet' jika perlu
          bayar: 0,
          kembalian: 0,
          status: 'batal', // penting
          waktu: new Date().toISOString(),
        }),
      })

      const data = await res.json()
      if (!res.ok) return alert(data.error)

      alert('Pesanan dibatalkan dan tersimpan!')
      router.push('/dashboardKasir/transaksi/riwayat')
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message)
    }
  }

  const handlePrintReceipt = () => {
    alert('Struk dicetak (simulasi)')
    router.push('/dashboardKasir/transaksi')
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col justify-between">
      {/* Modal Pelanggan */}
      {isCustomerModalOpen && (
        <PelangganModal
          initialName={customerNameState}
          onClose={handleCloseCustomer}
          onSave={handleSaveCustomer}
        />
      )}

      {/* =================== SCROLL AREA =================== */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex flex-col gap-3">
          {/* ============ HEADER ============ */}
          <div>
            <h2 className="font-bold text-lg">
              {noPesanan ? `Pesanan #${noPesanan}` : 'Pesanan #...'}
            </h2>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">
                {customerNameState || 'Pelanggan: -'}
              </p>

              <button onClick={handleOpenCustomer} className="p-1 rounded hover:bg-gray-100">
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
              keranjang.map((it: CartItem, idx: number) => (
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

                    <button
                      onClick={() => onRemoveItem && onRemoveItem(idx)}
                      className="p-1 hover:bg-gray-100"
                    >
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
