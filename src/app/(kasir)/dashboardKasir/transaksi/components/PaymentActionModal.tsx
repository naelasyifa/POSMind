'use client'
import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle, X } from 'lucide-react'

export default function PaymentActionModal({
  isOpen,
  onClose,
  step, // 'select' | 'input_cash' | 'instruction' | 'success'
  paymentMethods,
  selectedMethod,
  onSelectMethod,
  totalAmount,
  amountPaid,
  setAmountPaid,
  change,
  onConfirm,
  data, // QR string atau VA number
  type, // 'qris' | 'va'
}: any) {
  if (!isOpen) return null

  const calculatedChange = amountPaid - totalAmount

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
      <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* STEP 1: PILIH METODE */}
        {step === 'select' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">Pilih Pembayaran</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {paymentMethods.map((m: any) => (
                <button
                  key={m.id}
                  onClick={() => onSelectMethod(m)}
                  className={`p-4 rounded-2xl border-2 transition-all text-sm font-semibold active:scale-95 ${
                    selectedMethod?.id === m.id
                      ? 'border-[#52bfbe] bg-cyan-50 text-[#52bfbe] shadow-inner'
                      : 'border-gray-100 hover:border-[#52bfbe] hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
            <button
              onClick={onConfirm}
              disabled={!selectedMethod}
              className="w-full bg-[#52bfbe] hover:bg-[#43a8a7] active:scale-[0.98] text-white py-4 rounded-2xl font-bold disabled:bg-gray-200 transition-all shadow-lg shadow-cyan-100 disabled:shadow-none"
            >
              Lanjut
            </button>
          </div>
        )}

        {/* STEP 2: INPUT CASH */}
        {step === 'input_cash' && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Pembayaran Tunai</h3>
            <p className="text-sm text-gray-500 mb-6">
              Total Tagihan:{' '}
              <span className="font-bold text-black">Rp{totalAmount.toLocaleString('id-ID')}</span>
            </p>

            <div className="bg-gray-50 p-4 rounded-2xl mb-4 border-2 border-transparent focus-within:border-[#52bfbe] transition-all">
              <label className="text-xs text-gray-400 uppercase font-bold block mb-1 text-left">
                Jumlah Uang Diterima
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                placeholder="0"
                className="w-full text-4xl font-bold text-center bg-transparent text-[#52bfbe] focus:outline-none"
                // Format tampilan dengan titik ribuan
                value={amountPaid === 0 ? '' : amountPaid.toLocaleString('id-ID')}
                onChange={(e) => {
                  // Hanya izinkan angka (regex)
                  const val = e.target.value.replace(/\D/g, '')
                  setAmountPaid(Number(val))
                }}
              />
            </div>

            <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl mb-8">
              <span className="text-sm font-medium text-green-700">Kembalian:</span>
              <span
                className={`text-2xl font-black ${
                  calculatedChange >= 0 ? 'text-green-600' : 'text-gray-300'
                }`}
              >
                Rp{Math.max(calculatedChange, 0).toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={onConfirm}
              disabled={amountPaid < totalAmount}
              className="w-full bg-[#52bfbe] hover:bg-[#43a8a7] active:scale-[0.98] text-white py-4 rounded-2xl font-bold shadow-lg shadow-cyan-100 transition-all disabled:bg-gray-200 disabled:shadow-none"
            >
              Bayar Sekarang
            </button>
          </div>
        )}

        {/* STEP 3: INSTRUKSI (QRIS / VA) */}
        {step === 'instruction' && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-1">Selesaikan Pembayaran</h3>
            <p className="text-sm text-gray-500 mb-6">
              Total: Rp{totalAmount.toLocaleString('id-ID')}
            </p>

            {type === 'qris' ? (
              <div className="flex flex-col items-center">
                <div className="p-4 border-4 border-[#52bfbe] rounded-2xl bg-white shadow-xl">
                  <QRCodeSVG value={data} size={220} />
                </div>

                {/* TAMBAHAN NOMOR DI BAWAH BARCODE */}
                <div className="mt-4 bg-gray-100 px-4 py-2 rounded-lg">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                    ID Referensi / Nomor
                  </p>
                  <p className="text-lg font-mono font-bold text-gray-800">
                    {data.substring(data.length - 12)}
                  </p>
                </div>

                <p className="mt-4 text-xs text-gray-400 italic font-medium">
                  Silakan scan QRIS di atas
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-[#52bfbe] relative overflow-hidden">
                <p className="text-xs text-gray-500 uppercase font-bold mb-2 relative z-10">
                  Nomor Virtual Account
                </p>
                <p className="text-3xl font-mono font-bold tracking-wider text-[#52bfbe] relative z-10">
                  {data}
                </p>
                <p className="mt-4 text-xs text-gray-400 italic font-medium relative z-10">
                  {selectedMethod?.name}
                </p>
                {/* Dekorasi VA */}
                <div className="absolute -right-4 -bottom-4 bg-cyan-100/30 w-24 h-24 rounded-full" />
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-orange-500 font-semibold bg-orange-50 py-2 rounded-full w-fit mx-auto px-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              Menunggu Pembayaran...
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <div className="py-6 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={60} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Transaksi Berhasil</h3>
            <p className="text-gray-500 mt-2 font-medium">Pembayaran telah diterima</p>
            <button
              onClick={onClose}
              className="mt-8 w-full bg-[#52bfbe] hover:bg-[#43a8a7] active:scale-[0.98] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-cyan-100"
            >
              Lihat Struk
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
