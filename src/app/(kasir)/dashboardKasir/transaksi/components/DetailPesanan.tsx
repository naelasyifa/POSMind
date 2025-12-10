'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, SendToBack, Trash2 } from 'lucide-react'
import PelangganModal from './PelangganModal'
import { cetakTransaksiPDF, Transaksi, StoreSettings } from '../cetakTransaksi'

type PromoItem = {
  id?: string
  label: string
  type?: 'percent' | 'nominal' | 'bxgy' // optional jika sudah diproses
  value: number // selalu nominal (Rupiah). Jika belum, konversi dulu
  X?: number // untuk BxGy
  Y?: number // untuk BxGy
}

type CartItem = {
  id?: string
  nama: string
  harga: number
  qty: number
  stok?: number
  note?: string
  isGratis?: boolean
}

// Fungsi untuk menerapkan promo Beli X Gratis Y pada item
function applyBxGyPromo(item: CartItem, X: number, Y: number, unlimited: boolean = true) {
  const qtyBeli = item.qty
  let bonus = 0

  if (unlimited) {
    bonus = Math.floor(qtyBeli / X) * Y
    const block = X + Y
    const fullBlock = Math.floor(qtyBeli / block)
    const sisa = qtyBeli % block

    let qtyBayar
    if (sisa <= X) qtyBayar = fullBlock * X + sisa
    else qtyBayar = fullBlock * X + X

    return {
      qtyBayar,
      qtyGratis: bonus,
      items: [
        { ...item, qty: qtyBayar },
        ...(bonus > 0 ? [{ ...item, qty: bonus, nama: item.nama + ' (Gratis)', harga: 0 }] : []),
      ],
    }
  }

  // non unlimited → maksimal 1x gratis
  bonus = qtyBeli >= X ? Y : 0
  return {
    qtyBayar: qtyBeli - bonus,
    qtyGratis: bonus,
    items: [
      { ...item, qty: qtyBeli - bonus },
      ...(bonus > 0 ? [{ ...item, qty: bonus, nama: item.nama + ' (Gratis)', harga: 0 }] : []),
    ],
  }
}

export default function DetailPesanan({
  keranjang = [],
  subtotal = 0,
  promoBreakdown = [], // ⭐ promo dari pesanan baru
  total = 0,
  customerName = '',
  onOpenCustomer,
  onRemoveItem,
}: {
  keranjang?: CartItem[]
  subtotal?: number
  promoBreakdown?: PromoItem[] // pastikan upstream mengirimkan nominal
  total?: number
  customerName?: string
  onOpenCustomer?: () => void
  onRemoveItem?: (i: number) => void
}) {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState<string>('')
  const [frozenTime, setFrozenTime] = useState<string>('')

  const [isPaying, setIsPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | ''>('')
  const [amountPaid, setAmountPaid] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [isPaid, setIsPaid] = useState(false)
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
  const promoNominalList: PromoItem[] = (promoBreakdown || [])
    .filter((p) => p.type !== 'bxgy') // bxgy akan di-handle langsung di keranjang
    .map((p) => ({ ...p, value: toNominal(p, subtotal) }))

  // =================== FETCH NOMOR PESANAN ===================
  useEffect(() => {
    async function fetchNo() {
      try {
        const res = await fetch('/api/frontend/transactions/generate-no')
        const data = await res.json()
        setNoPesanan(data.noPesanan || '')
      } catch (err) {
        console.error('Gagal mengambil nomor pesanan:', err)
      }
    }

    fetchNo()
  }, [])

  const [displayCart, setDisplayCart] = useState<CartItem[]>([])

  useEffect(() => {
    const newCart: typeof keranjang = []

    keranjang.forEach((it) => {
      const promo = promoBreakdown.find(
        (p) => p.type === 'bxgy' && it.nama.toLowerCase().includes(p.label.trim().toLowerCase()),
      )

      if (promo && promo.X && promo.Y) {
        const X = Number(promo.X)
        const Y = Number(promo.Y)

        if (!isNaN(X) && !isNaN(Y)) {
          const { items } = applyBxGyPromo(it, X, Y, true)
          newCart.push(...items)
        } else {
          console.warn('Promo BxGy invalid:', promo)
          newCart.push(it)
        }
      } else {
        newCart.push(it)
      }
    })

    setDisplayCart(newCart)
  }, [keranjang, promoBreakdown])

  // =================== FETCH SETTING TOKO ===================
  const [storeSettings, setStoreSettings] = useState<{
    serviceCharge: boolean
    serviceChargePercentage: number
    pajak: boolean
    pajakPercentage: number
  } | null>(null)

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const res = await fetch('/api/frontend/store-settings')
        const data = await res.json()
        setStoreSettings({
          serviceCharge: data.serviceCharge ?? true,
          serviceChargePercentage: data.serviceChargePercentage ?? 10,
          pajak: data.pajak ?? true,
          pajakPercentage: data.pajakPercentage ?? 10,
        })
      } catch (err) {
        console.error('Gagal ambil store settings', err)
      }
    }

    fetchStoreSettings()
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

  // =================== HITUNG TOTAL ===================
  const calculateTotals = () => {
    const sub = displayCart.reduce((sum, it) => sum + it.harga * it.qty, 0)
    const discount = promoNominalList.reduce((s, p) => s + p.value, 0)
    const subAfterDiscount = sub - discount

    const tax = storeSettings?.pajak
      ? Math.round((subAfterDiscount * (storeSettings.pajakPercentage ?? 0)) / 100)
      : 0
    const service = storeSettings?.serviceCharge
      ? Math.round((subAfterDiscount * (storeSettings.serviceChargePercentage ?? 0)) / 100)
      : 0

    const totalAmount = subAfterDiscount + tax + service
    return { subtotal: sub, discount, tax, service, total: totalAmount }
  }

  const { subtotal: sub, discount, tax, service, total: totalAmount } = calculateTotals()

  // =================== HITUNG KEMBALIAN ===================
  useEffect(() => {
    if (paymentMethod === 'cash') {
      setChange(amountPaid > total ? amountPaid - total : 0)
    } else {
      setChange(0)
    }
  }, [amountPaid, paymentMethod, totalAmount])

  useEffect(() => {
    if (paymentMethod === 'qris') {
      setAmountPaid(totalAmount)
    }
  }, [paymentMethod, totalAmount])

  // =================== HANDLER PEMBAYARAN ===================
  const handleCheckout = () => setIsPaying(true)

  const handleConfirmPayment = async () => {
    if (!paymentMethod) return alert('Pilih metode pembayaran!')
    if (paymentMethod === 'cash' && amountPaid < totalAmount) {
      return alert('Jumlah bayar kurang!')
    }

    try {
      // === Transform keranjang untuk promo BxGy ===
      let itemsWithBxGy: CartItem[] = []
      keranjang.forEach((it) => {
        const promo = promoBreakdown.find((p) => p.type === 'bxgy' && p.id === it.id)
        if (promo && promo.X && promo.Y) {
          const { items } = applyBxGyPromo(it, promo.X, promo.Y, true)
          itemsWithBxGy.push(...items)
        } else {
          itemsWithBxGy.push(it)
        }
      })

      const discount = promoNominalList.reduce((s, p) => s + p.value, 0)

      const itemsForPayload = itemsWithBxGy.map(({ id, ...rest }) => ({ productId: id, ...rest }))

      const res = await fetch('/api/frontend/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noPesanan,
          tenant: 1,
          namaKasir: 'Kasir 1',
          namaPelanggan: customerNameState,
          items: itemsForPayload, // <<< id dihapus
          subtotal: sub,
          pajak: tax,
          serviceCharge: service,
          discount,
          total: totalAmount,
          metode: paymentMethod === 'cash' ? 'Cash' : 'E-Wallet',
          bayar: amountPaid,
          kembalian: paymentMethod === 'cash' ? amountPaid - totalAmount : 0,
          status: 'selesai',
          waktu: new Date().toISOString(),
        }),
      })

      const data = await res.json()
      if (!res.ok) return alert(data.error)

      setIsPaid(true) // aktifkan state setelah bayar
      setFrozenTime(currentTime)
      alert('Pembayaran berhasil! Silakan cetak struk.')
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message)
    }
  }

  const handleCancelPayment = async () => {
    if (!confirm('Batalkan proses pembayaran?')) return

    try {
      const itemsForPayload = keranjang.map(({ id, ...rest }) => rest)

      const res = await fetch('/api/frontend/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant: 1,
          namaKasir: 'Kasir 1',
          namaPelanggan: customerNameState,
          items: itemsForPayload,
          subtotal: sub,
          pajak: tax,
          serviceCharge: service,
          discount: promoNominalList.reduce((s, p) => s + p.value, 0),
          total: totalAmount,
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
      router.push('/dashboardKasir/transaksi/riwayat')
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message)
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm('Batalkan pesanan ini?')) return

    try {
      const itemsForPayload = keranjang.map(({ id, ...rest }) => rest)

      const res = await fetch('/api/frontend/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant: 1,
          namaKasir: 'Kasir 1',
          namaPelanggan: customerNameState,
          items: itemsForPayload,
          subtotal: sub,
          pajak: tax,
          serviceCharge: service,
          discount: promoNominalList.reduce((s, p) => s + p.value, 0),
          total: totalAmount,
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

  const handleDownloadPDF = async () => {
    if (!storeSettings) return alert('Store settings belum siap')

    const transaksiObj: Transaksi = {
      meja: noPesanan,
      modePenjualan: 'Dine In',
      pax: 1,
      kasir: 'Kasir 1',
      catatan: '',
      waiter: 'Waiter 1',
      pajak: tax,
      service: service,
      pembulatan: 0,
      items: displayCart.map((i) => ({
        name: i.nama,
        qty: i.qty,
        price: i.harga,
        total: i.qty * i.harga,
      })),
    }

    const pdf = await cetakTransaksiPDF({
      transaksi: transaksiObj,
      storeSettings: storeSettings as StoreSettings,
    })

    pdf.save(`Transaksi_${noPesanan}.pdf`)
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
              {!isPaid && (
                <button onClick={handleOpenCustomer} className="p-1 rounded hover:bg-gray-100">
                  <Pencil size={16} />
                </button>
              )}
            </div>

            <div className="border-b my-2"></div>
            <p className="text-xs text-gray-500">{isPaid ? frozenTime : currentTime}</p>
          </div>

          {/* ============ ITEM LIST ============ */}
          <div className="max-h-[250px] overflow-y-auto space-y-3 border-b pb-3">
            {displayCart.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Belum ada item</p>
            ) : (
              displayCart.map((it: CartItem & { isGratis?: boolean }, idx: number) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center border rounded p-2 ${
                    it.isGratis ? 'ml-4 bg-gray-50' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className={`${it.isGratis ? 'text-gray-400 italic' : 'font-medium'}`}>
                      {it.nama}
                    </div>
                    {it.note && <div className="text-xs text-gray-500">Catatan: {it.note}</div>}
                    <div className="text-xs text-gray-500">Rp{it.harga.toLocaleString()}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">x{it.qty}</div>
                    <div className="text-sm font-bold">
                      Rp{(it.harga * it.qty).toLocaleString()}
                    </div>

                    {/* tombol hapus hanya untuk item asli */}
                    {!isPaid && !it.isGratis && (
                      <button
                        onClick={() => {
                          const indexInKeranjang = keranjang.findIndex(
                            (k) => k.id === it.id && (k.note || '') === (it.note || ''),
                          )
                          if (indexInKeranjang !== -1 && onRemoveItem)
                            onRemoveItem(indexInKeranjang)
                        }}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
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
              <span>Rp{sub.toLocaleString()}</span>
            </div>

            {/* PROMO DINAMIS */}
            {promoNominalList.length > 0 && (
              <div className="space-y-1">
                {promoNominalList.map((p, i) => (
                  <div key={i} className="flex justify-between text-xs text-red-500 font-medium">
                    <span>{p.label}</span>
                    <span>-Rp{p.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Pajak */}
            <div className="flex justify-between">
              <span>Pajak {storeSettings?.pajakPercentage ?? 0}%</span>
              <span>Rp{tax.toLocaleString()}</span>
            </div>

            {/* Service Charge */}
            {storeSettings?.serviceCharge && (
              <div className="flex justify-between">
                <span>Service Charge {storeSettings.serviceChargePercentage ?? 0}%</span>
                <span>Rp{service.toLocaleString()}</span>
              </div>
            )}

            {/* TOTAL */}
            <div className="border-t border-dashed pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>
                Rp
                {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Catatan Pelanggan</label>
            <input
              className="w-full border rounded p-2 text-sm"
              placeholder="menggunakan alat makan"
              disabled={isPaid}
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
                <span>
                  Rp{(paymentMethod === 'cash' ? amountPaid : totalAmount).toLocaleString()}
                </span>
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
                <span>
                  Rp{(paymentMethod === 'cash' ? amountPaid : totalAmount).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Kembali</span>
                <span>Rp{change.toLocaleString()}</span>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="w-full py-2 rounded bg-[#52bfbe] text-white hover:bg-[#44a9a9] mt-2"
              >
                Cetak Struk
              </button>

              <button
                onClick={() => router.push('/dashboardKasir/transaksi/riwayat')}
                className="w-full py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100 mt-1"
              >
                Selesai
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
