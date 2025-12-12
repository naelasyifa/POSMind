'use client'

interface StrukPreviewProps {
  header: string
  footer: string
  paperSize: 58 | 80
  logoUrl: string | null
  options: Record<string, boolean>
}

export default function StrukPreview({
  header,
  footer,
  paperSize,
  logoUrl,
  options,
}: StrukPreviewProps) {
  return (
    <div
      className="border rounded-lg p-4 text-sm"
      style={{
        width: paperSize === 58 ? 230 : 300,
        margin: '0 auto',
      }}
    >
      {/* LOGO + INFO TOKO */}
      {options.infoToko && (
        <div className="text-center mb-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              className={`rounded mx-auto`}
              style={{
                width: paperSize === 58 ? 50 : 80, // thermal 58 → lebih kecil
                height: paperSize === 58 ? 50 : 80, // thermal 58 → lebih kecil
              }}
            />
          ) : (
            <div
              className="bg-gray-200 rounded mx-auto"
              style={{
                width: paperSize === 58 ? 50 : 80,
                height: paperSize === 58 ? 50 : 80,
              }}
            />
          )}
        </div>
      )}

      {/* HEADER */}
      {header && <p className="text-center mb-6 font-semibold">{header}</p>}

      {/* INFORMASI TRANSAKSI */}
      {options.noNota && <p>Nota: 280390283203</p>}
      {options.noTransaksi && <p>Transaksi: INV-12892</p>}
      {options.jamTransaksi && <p>Waktu: 20/05/2025 - 12:00</p>}
      {options.jamBuka && <p>Jam Buka: 09:00</p>}
      {options.namaMeja && <p>Meja: A-07</p>}
      {options.modePenjualan && <p>Mode: Dine In</p>}
      {options.pax && <p>Pax: 4 Orang</p>}
      {options.namaKasir && <p>Kasir: Mira Alfariyah</p>}
      {options.cetakKe && <p>Cetakan ke: 1</p>}
      {options.posmindOrder && <p>Order ID: #POS12392</p>}
      {options.wifi && <p>WiFi: POSMind-Guest</p>}
      {options.infoTambahan && <p>Catatan: Jangan pedas</p>}

      <hr className="my-2" />

      {/* LIST PRODUK */}
      <div className="mt-2 space-y-3">
        <div>
          <p className="font-medium">Nasi Goreng</p>
          <div className="flex justify-between text-xs text-gray-600">
            <div className="flex gap-4">
              <span>2x</span>
              <span>20.000</span>
            </div>
            <span>40.000</span>
          </div>
        </div>

        <div>
          <p className="font-medium">Es Teh</p>
          <div className="flex justify-between text-xs text-gray-600">
            <div className="flex gap-4">
              <span>1x</span>
              <span>5.000</span>
            </div>
            <span>5.000</span>
          </div>
        </div>
      </div>

      <hr className="my-2" />

      {/* PAJAK, SERVICE, PEMBULATAN */}
      {options.pajak && (
        <p className="flex justify-between">
          <span>Pajak 10%</span> <span>2.500</span>
        </p>
      )}
      {options.service && (
        <p className="flex justify-between">
          <span>Service 5%</span> <span>1.250</span>
        </p>
      )}
      {options.pembulatan && (
        <p className="flex justify-between">
          <span>Pembulatan</span> <span>0</span>
        </p>
      )}

      <p className="flex justify-between font-semibold mt-2">
        <span>Total</span> <span>28.750</span>
      </p>

      {footer && (
        <p className="text-center text-xs mt-4 text-gray-600 whitespace-pre-line">{footer}</p>
      )}

      {options.powered && (
        <p className="text-center text-[11px] mt-2 text-gray-400">Powered by POSMind</p>
      )}
    </div>
  )
}
