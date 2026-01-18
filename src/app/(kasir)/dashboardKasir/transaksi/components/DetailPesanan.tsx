'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, SendToBack, Trash2 } from 'lucide-react'
import PelangganModal from './PelangganModal'
import { cetakTransaksiPDF, Transaksi, StoreSettings } from '../cetakTransaksi'
import PaymentActionModal from './PaymentActionModal'
import { generateKasirStrukPDF } from '@/utils/kasirStrukPDF'

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

type PaymentMethod = {
  id: string
  name: string
  type: 'cash' | 'qris' | 'bank_transfer'
  category?: string
  code?: string
  bankCode?: string
}

function isPromoTimeValid(promo: any) {
  const now = new Date()

  // 1. Validasi Tanggal Expired
  if (promo.akhir) {
    const tAkhir = new Date(promo.akhir)
    // Set ke jam 23:59:59 agar promo tetap berlaku sampai detik terakhir hari itu
    tAkhir.setHours(23, 59, 59, 999)
    if (now > tAkhir) return false
  }

  // 2. Validasi Jam (Jika admin menyetel jam mulai & akhir)
  if (promo.startTime && promo.endTime) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const [sh, sm] = promo.startTime.split(':').map(Number)
    const [eh, em] = promo.endTime.split(':').map(Number)

    const startMins = sh * 60 + sm
    const endMins = eh * 60 + em

    if (currentMinutes < startMins || currentMinutes > endMins) return false
  }

  // 3. Validasi Hari (Jika admin menyetel hari-hari tertentu)
  if (promo.availableDays && promo.availableDays.length > 0) {
    const today = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
    if (!promo.availableDays.includes(today)) return false
  }

  return true
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
  // const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | ''>('')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [amountPaid, setAmountPaid] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  const [isPaid, setIsPaid] = useState(false)
  const [noPesanan, setNoPesanan] = useState<string>('')
  // NEW STATE UNTUK POPUP BARU
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState('') // 'qris' | 'va'
  const [actionData, setActionData] = useState('')
  const [isSimulationSuccess, setIsSimulationSuccess] = useState(false)

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
    .filter(
      (p) =>
        p.type !== 'bxgy' &&
        // Ubah bagian ini agar tidak kaku jika status undefined
        ((p as any).status === 'Aktif' || (p as any).status === undefined) &&
        isPromoTimeValid(p),
    )
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
      const promo = promoBreakdown.find((p) =>
        // p.type === 'bxgy' && it.nama.toLowerCase().includes(p.label.trim().toLowerCase()),
        {
          const isMatch = it.nama.toLowerCase().includes(p.label.trim().toLowerCase())
          const isBxGy = p.type === 'bxgy'

          // TAMBAHKAN PENGECEKAN STATUS DI SINI
          // Promo harus Match Nama, Tipe BXGY, Status Aktif, DAN Waktu Valid
          const isStatusActive = (p as any).status === 'Aktif'

          return isMatch && isBxGy && isStatusActive && isPromoTimeValid(p)
        },
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
  // const [storeSettings, setStoreSettings] = useState<{
  //   serviceCharge: boolean
  //   serviceChargePercentage: number
  //   pajak: boolean
  //   pajakPercentage: number
  // } | null>(null)
  const [storeSettings, setStoreSettings] = useState<any>(null)

  useEffect(() => {
    const fetchAllSettings = async () => {
      try {
        // Ambil 3 data dari 3 endpoint berbeda secara bersamaan
        const [resPajak, resStruk, resDapur] = await Promise.all([
          fetch('/api/frontend/store-settings'),
          fetch('/api/frontend/store-settings/struk'),
          fetch('/api/frontend/store-settings/cetak'),
        ])

        const pajakData = await resPajak.json()
        const strukData = await resStruk.json()
        const dapurData = await resDapur.json()

        // Gabungkan semua ke dalam satu state storeSettings
        setStoreSettings({
          // Data Pajak & Service (dari endpoint utama)
          serviceCharge: pajakData.serviceCharge ?? true,
          serviceChargePercentage: pajakData.serviceChargePercentage ?? 10,
          pajak: pajakData.pajak ?? true,
          pajakPercentage: pajakData.pajakPercentage ?? 10,

          // Data Struk (dari endpoint /struk)
          struk: {
            header: strukData.header,
            footer: strukData.footer,
            paperSize: strukData.paperSize,
            logo: strukData.logo,
            options: strukData.options,
          },

          // Data Dapur (dari endpoint /cetak)
          dapur: {
            paperSize: dapurData.paperSize,
            options: dapurData.options,
          },
        })
      } catch (err) {
        console.error('Gagal menggabungkan data settings:', err)
      }
    }

    fetchAllSettings()
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

  // =================== FETCH METODE PEMBAYARAN ===================
  useEffect(() => {
    fetch('/api/payment-methods?where[isActive][equals]=true')
      .then((res) => res.json())
      .then((data) => setPaymentMethods(Array.isArray(data?.docs) ? data.docs : []))
  }, [])

  // =================== HITUNG KEMBALIAN ===================
  useEffect(() => {
    if (selectedMethod?.type === 'cash') {
      setChange(amountPaid > totalAmount ? amountPaid - totalAmount : 0)
    } else {
      setChange(0)
    }
  }, [amountPaid, selectedMethod, totalAmount])

  useEffect(() => {
    if (selectedMethod?.type === 'qris') {
      setAmountPaid(totalAmount)
    }
  }, [selectedMethod, totalAmount])

  // =================== HANDLER PEMBAYARAN ===================
  const [modalStep, setModalStep] = useState('select') // 'select' | 'input_cash' | 'instruction' | 'success'

  const handleCheckout = () => {
    setModalStep('select') // Reset ke pilih metode
    setIsActionModalOpen(true)
  }

  // 1. Definisikan dulu simulasinya
  const startPaymentSimulation = () => {
    setIsSimulationSuccess(false)
    setTimeout(() => {
      setIsSimulationSuccess(true)
      setIsPaid(true)
      setModalStep('success') // Agar modal otomatis berubah jadi centang hijau
      setFrozenTime(new Date().toLocaleTimeString('id-ID'))
    }, 5000) // 5 detik
  }

  // 2. Baru definisikan handler confirm yang memanggil fungsi di atas
  const handleConfirmPayment = async () => {
    if (!selectedMethod) return alert('Pilih metode pembayaran')

    // --- LOGIKA TUNAI (CASH) ---
    if (selectedMethod.code === 'cash' || selectedMethod.type === 'cash') {
      if (modalStep === 'select') {
        setModalStep('input_cash') // Pindah ke layar input uang
        return
      }

      if (modalStep === 'input_cash') {
        if (amountPaid < totalAmount) return alert('Uang kurang!')

        try {
          const trxRes = await fetch('/api/frontend/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              noPesanan,
              tenant: 1,
              namaKasir: 'Kasir 1',
              namaPelanggan: customerNameState,
              paymentMethodId: selectedMethod.id,
              items: displayCart.map(({ id, ...rest }) => ({ productId: id, ...rest })),
              subtotal: sub,
              pajak: tax,
              total: totalAmount,
              bayar: amountPaid,
              kembalian: amountPaid - totalAmount,
              status: 'selesai',
              waktu: new Date().toISOString(),
            }),
          })

          if (trxRes.ok) {
            setIsPaid(true)
            setModalStep('success') // Langsung ke layar sukses
            setFrozenTime(currentTime)
          }
        } catch (err) {
          alert('Gagal simpan transaksi cash')
        }
      }
      return
    }

    // --- LOGIKA DIGITAL (QRIS / E-WALLET / VA) ---
    try {
      // 1. Identifikasi tipe metode agar E-Wallet juga masuk ke Barcode
      const isEWallet = selectedMethod.category === 'E-Wallet'
      const isQRIS = selectedMethod.code === '16' || selectedMethod.type === 'qris'

      // 2. Buat transaksi status "proses"
      const trxRes = await fetch('/api/frontend/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noPesanan,
          tenant: 1,
          namaKasir: 'Kasir 1',
          namaPelanggan: customerNameState,
          paymentMethodId: selectedMethod.id,
          items: displayCart.map(({ id, ...rest }) => ({ productId: id, ...rest })),
          subtotal: sub,
          pajak: tax,
          total: totalAmount,
          status: 'proses',
          waktu: new Date().toISOString(),
        }),
      })

      if (!trxRes.ok) return alert('Gagal membuat transaksi')

      // 3. Panggil API Mock Payment
      const payRes = await fetch('/api/mock-payment/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Jika E-Wallet, kita paksa kirim kode '16' agar mock memberikan string QRIS
          payment_method: isEWallet ? '16' : selectedMethod.code,
          amount: totalAmount,
        }),
      })

      const payResult = await payRes.json()

      if (payResult.status) {
        // 4. SET LOGIKA POP-UP DI SINI
        // Jika metodenya adalah QRIS ATAU E-Wallet, set tipe ke 'qris' (Tampil Barcode)
        // Selain itu (seperti Bank Transfer), set tipe ke 'va' (Tampil Nomor)
        const modalType = isQRIS || isEWallet ? 'qris' : 'va'

        setActionType(modalType)

        // Data yang diambil juga menyesuaikan tipe modal
        setActionData(modalType === 'qris' ? payResult.data.qr_string : payResult.data.va_number)

        setModalStep('instruction')

        // 5. Simulasi otomatis lunas (10 detik untuk testing)
        const timer = setTimeout(async () => {
          try {
            await fetch(`/api/frontend/transactions/${noPesanan}/complete`, { method: 'PATCH' })
            setIsPaid(true)
            setModalStep('success')
          } catch (err) {
            console.error('Gagal update otomatis', err)
          }
        }, 10000)

        return () => clearTimeout(timer)
      }
    } catch (err: any) {
      alert('Sistem Error: ' + err.message)
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

    try {
      // 2. Susun Data Transaksi Asli dari State
      const dataTransaksiAsli = {
        noPesanan: noPesanan,
        waktu: currentTime,
        meja: customerNameState || '-',
        modePenjualan: 'Dine In',
        kasir: 'Kasir 1',
        pajak: tax,
        service: service,
        total: totalAmount,
        items: displayCart.map((item) => ({
          name: item.nama,
          qty: item.qty,
          price: item.harga,
          note: item.note || '',
        })),
      }

      // 3. Jalankan Generator
      const pdf = await generateKasirStrukPDF({
        storeSettings: storeSettings, // dari state useEffect fetch settings
        transaksiAsli: dataTransaksiAsli,
      })

      // 4. Simpan/Download
      pdf.save(`Struk_${noPesanan}.pdf`)
    } catch (err) {
      console.error('Gagal cetak PDF:', err)
      alert('Terjadi kesalahan saat membuat struk.')
    }
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

      <PaymentActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        step={modalStep}
        paymentMethods={paymentMethods}
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
        totalAmount={totalAmount}
        amountPaid={amountPaid}
        setAmountPaid={setAmountPaid}
        change={change}
        onConfirm={handleConfirmPayment}
        data={actionData}
        type={actionType}
      />

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
              <div className="flex gap-3 flex-wrap">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method)
                      setAmountPaid(0)
                      setChange(0)
                    }}
                    className={`px-4 py-2 rounded border text-sm ${
                      selectedMethod?.id === method.id
                        ? 'bg-[#52bfbe] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {method.name}
                  </button>
                ))}
              </div>

              {/* Input Cash */}
              {selectedMethod?.type === 'cash' && (
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
                  Rp{(selectedMethod?.type === 'cash' ? amountPaid : totalAmount).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm font-medium">
                <span>Kembali</span>
                <span>
                  Rp
                  {change.toLocaleString()}
                </span>
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
                <span className="font-medium capitalize">{selectedMethod?.name}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Bayar</span>
                <span>
                  Rp{(selectedMethod?.type === 'cash' ? amountPaid : totalAmount).toLocaleString()}
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
