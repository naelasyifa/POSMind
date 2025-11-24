'use client'

import { useState } from 'react'

type OptionKey =
  | 'infoToko'
  | 'noNota'
  | 'noTransaksi'
  | 'jamTransaksi'
  | 'jamBuka'
  | 'infoTambahan'
  | 'namaMeja'
  | 'modePenjualan'
  | 'pax'
  | 'namaKasir'
  | 'posmindOrder'
  | 'cetakKe'
  | 'promoMenu'
  | 'pembulatan'
  | 'pajak'
  | 'service'
  | 'wifi'
  | 'powered'

export default function StrukTab() {
  // -----------------------------------------
  // MODE STATE
  // -----------------------------------------

  const [isFirstTime, setIsFirstTime] = useState(true) // nanti diganti dari DB
  const [isEditing, setIsEditing] = useState(isFirstTime)

  // -----------------------------------------
  // MAIN DATA
  // -----------------------------------------

  const [header, setHeader] = useState('')
  const [footer, setFooter] = useState('')
  const [paperSize, setPaperSize] = useState<58 | 80>(58)
  const [logo, setLogo] = useState<string | null>(null)

  const [options, setOptions] = useState<Record<OptionKey, boolean>>({
    infoToko: true,
    noNota: true,
    noTransaksi: true,
    jamTransaksi: true,
    jamBuka: false,
    infoTambahan: false,
    namaMeja: false,
    modePenjualan: false,
    pax: false,
    namaKasir: true,
    posmindOrder: false,
    cetakKe: false,
    promoMenu: false,
    pembulatan: false,
    pajak: true,
    service: true,
    wifi: false,
    powered: true,
  })

  // -----------------------------------------
  // HANDLER
  // -----------------------------------------

  const readOnly = !isEditing

  const toggle = (key: OptionKey) => {
    if (readOnly) return
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const uploadLogo = (e: any) => {
    if (readOnly) return
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result as string)
    reader.readAsDataURL(file)
  }

  const toggleList: [OptionKey, string][] = [
    ['infoToko', 'Informasi Toko'],
    ['noNota', 'No. Nota'],
    ['noTransaksi', 'No. Transaksi'],
    ['jamTransaksi', 'Jam Transaksi'],
    ['jamBuka', 'Jam Buka Transaksi'],
    ['infoTambahan', 'Info Tambahan'],
    ['namaMeja', 'Nama Meja'],
    ['modePenjualan', 'Mode Penjualan'],
    ['pax', 'Pax'],
    ['namaKasir', 'Nama Kasir'],
    ['posmindOrder', 'Informasi POSMind Order'],
    ['cetakKe', 'Informasi Cetakan Ke'],
    ['promoMenu', 'Informasi Promosi Menu'],
    ['pembulatan', 'Pembulatan'],
    ['pajak', 'Informasi Pajak'],
    ['service', 'Informasi Service Charge'],
    ['wifi', 'Nama WiFi'],
    ['powered', 'Powered by POSMind'],
  ]

  // -----------------------------------------
  // SIMPAN
  // -----------------------------------------

  const handleSave = () => {
    setIsFirstTime(false)
    setIsEditing(false)

    // Nanti disini fetch ke backend
    console.log('SAVED')
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="w-full flex gap-6">
      <div className="w-2/3 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-xl">Pengaturan Cetakan Nota</h3>

          {/* BUTTONS */}
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-[#52bfbe] text-white px-4 py-2 rounded hover:bg-[#43a9a8]"
              >
                Simpan
              </button>

              {!isFirstTime && (
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Batal
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#52bfbe] text-white px-4 py-2 rounded hover:bg-[#43a9a8]"
            >
              Edit
            </button>
          )}
        </div>

        {/* Upload Logo */}
        <div className="border rounded-lg h-40 flex items-center justify-center bg-gray-50 mb-4 relative overflow-hidden">
          {logo ? (
            <img src={logo} className="h-full object-cover" />
          ) : (
            <p className="text-gray-400 text-sm text-center">Masukkan gambar logo ukuran 2:1</p>
          )}

          {/* Disable file input when read-only */}
          <input
            type="file"
            accept="image/*"
            disabled={readOnly}
            onChange={uploadLogo}
            className={`absolute inset-0 ${readOnly ? 'opacity-0 cursor-not-allowed' : 'opacity-0 cursor-pointer'}`}
          />
        </div>

        {/* Header */}
        <p className="font-medium mb-1">Header</p>
        <input
          type="text"
          value={header}
          readOnly={readOnly}
          onChange={(e) => setHeader(e.target.value)}
          placeholder="Header Struk"
          className={`border p-2 rounded w-full mb-4 ${readOnly ? 'bg-gray-100' : ''}`}
        />

        {/* Paper Size */}
        <div className="mb-4">
          <label className="font-medium">Ukuran Kertas</label>
          <select
            value={paperSize}
            disabled={readOnly}
            onChange={(e) => setPaperSize(Number(e.target.value) as 58 | 80)}
            className={`border p-2 rounded ml-3 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value={58}>Thermal 58mm</option>
            <option value={80}>Thermal 80mm</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {toggleList.map(([key, label]) => (
            <div key={key} className="flex justify-between items-center">
              <span>{label}</span>

              <label
                className={`${readOnly ? 'opacity-50' : 'cursor-pointer relative inline-flex items-center'}`}
              >
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={() => toggle(key)}
                  disabled={readOnly}
                  className="sr-only peer"
                />
                <div className="w-11 h-5 bg-gray-300 peer-checked:bg-[#52bfbe] rounded-full transition"></div>
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full border peer-checked:translate-x-6 transition"></div>
              </label>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="font-medium mt-5 mb-1">Footer</p>
        <textarea
          value={footer}
          readOnly={readOnly}
          onChange={(e) => setFooter(e.target.value)}
          placeholder="Footer Struk"
          className={`border p-2 rounded w-full h-16 ${readOnly ? 'bg-gray-100' : ''}`}
        />
      </div>

      {/* RIGHT PREVIEW */}
      <div className="w-1/3 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Tampilan Cetakan Nota</h3>

        <div
          className="border rounded-lg p-4 text-sm"
          style={{ width: paperSize === 58 ? 230 : 300 }}
        >
          {options.infoToko && (
            <div className="text-center mb-3">
              {logo ? (
                <img src={logo} className="w-20 h-20 rounded mx-auto" />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded mx-auto"></div>
              )}
            </div>
          )}

          {header && <p className="text-center mb-2 font-semibold">{header}</p>}

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

          <div className="mt-2 space-y-3">
            {/* ITEM 1 */}
            <div>
              <p className="font-medium">Nasi Goreng</p>

              <div className="flex justify-between text-xs text-gray-600">
                {/* LEFT SIDE: qty + price (kasih gap) */}
                <div className="flex gap-4">
                  <span>2x</span>
                  <span>20.000</span>
                </div>

                {/* RIGHT SIDE: total */}
                <span>40.000</span>
              </div>
            </div>

            {/* ITEM 2 */}
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

          <p className="flex justify-between font-semibold mt-1">
            <span>Total</span> <span>28.750</span>
          </p>

          {footer && (
            <p className="text-center text-xs mt-4 text-gray-600 whitespace-pre-line">{footer}</p>
          )}

          {options.powered && (
            <p className="text-center text-[11px] mt-2 text-gray-400">Powered by POSMind</p>
          )}
        </div>
      </div>
    </div>
  )
}
