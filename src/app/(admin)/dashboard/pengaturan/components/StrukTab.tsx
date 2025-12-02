/* --- SAME IMPORTS --- */
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
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [isEditing, setIsEditing] = useState(isFirstTime)

  const [header, setHeader] = useState('')
  const [footer, setFooter] = useState('')
  const [paperSize, setPaperSize] = useState<58 | 80>(80)
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

  const handleSave = () => {
    setIsFirstTime(false)
    setIsEditing(false)
  }

  const handleCancel = () => setIsEditing(false)

  return (
    <div className="w-full flex gap-6">
      {/* LEFT SETTINGS SCROLLABLE */}
      <div className="w-2/3 bg-white p-6 rounded-xl shadow-sm max-h-[85vh] overflow-y-auto">
        <h3 className="font-semibold text-xl mb-6">Pengaturan Cetakan Nota</h3>

        <div className="grid grid-cols-1 gap-6">
          {/* LOGO */}
          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <p className="font-medium">Logo Nota</p>
              <p className="text-sm text-gray-500 mt-1">Ukuran rekomendasi 1:1</p>
            </div>

            <div className="border rounded-lg h-40 w-full flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden text-center p-3">
              {logo ? (
                <img src={logo} className="h-full object-contain rounded" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <div className="w-14 h-16 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5V5.25A2.25 2.25 0 015.25 3h9L21 9.75v6.75A2.25 2.25 0 0118.75 18H5.25A2.25 2.25 0 013 16.5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 14.25l2.25-2.25 1.5 1.5 3-3"
                      />
                    </svg>
                  </div>

                  <p className="text-xs leading-tight">
                    Unggah file gambar dengan cara <br />
                    <span className="font-medium text-gray-600">seret & lepas</span> atau{' '}
                    <span className="font-medium text-gray-600">cari file</span> di sini
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                disabled={readOnly}
                onChange={uploadLogo}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* HEADER */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <p className="font-medium">Header Struk</p>
            <input
              type="text"
              value={header}
              readOnly={readOnly}
              onChange={(e) => setHeader(e.target.value)}
              className={`border p-2 rounded ${readOnly ? 'bg-gray-100' : ''}`}
              placeholder="Masukkan Header"
            />
          </div>

          {/* PAPER SIZE */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <p className="font-medium">Ukuran Kertas</p>
            <select
              value={paperSize}
              disabled={readOnly}
              onChange={(e) => setPaperSize(Number(e.target.value) as 58 | 80)}
              className={`border p-2 rounded ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value={58}>Thermal 58mm</option>
              <option value={80}>Thermal 80mm</option>
            </select>
          </div>

          {/* TOGGLES —— PERFECT ALIGNMENT */}
          <div>
            <p className="font-medium mb-2">Elemen yang Ditampilkan</p>

            <div className="grid grid-cols-1 gap-4">
              {toggleList.map(([key, label]) => (
                <div key={key} className="flex justify-between items-center">
                  {/* Label kiri */}
                  <span>{label}</span>

                  {/* Toggle + teks kanan */}
                  <div className="flex items-center gap-3 min-w-[160px] justify-end">
                    {/* Toggle */}
                    <label
                      className={`${
                        readOnly ? 'opacity-50' : 'cursor-pointer'
                      } relative inline-flex items-center`}
                    >
                      <input
                        type="checkbox"
                        checked={options[key]}
                        disabled={readOnly}
                        onChange={() => toggle(key)}
                        className="sr-only peer"
                      />

                      <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#52bfbe] rounded-full transition"></div>
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
                    </label>

                    {/* Teks tampilkan / sembunyikan – selalu lurus */}
                    <span
                      className={`text-xs ${
                        options[key] ? 'text-green-600' : 'text-gray-400'
                      } inline-block text-left w-[80px]`}
                    >
                      {options[key] ? 'Tampilkan' : 'Sembunyikan'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="grid grid-cols-2 gap-4 items-start">
            <p className="font-medium">Footer Struk</p>
            <textarea
              value={footer}
              readOnly={readOnly}
              onChange={(e) => setFooter(e.target.value)}
              className={`border p-2 rounded w-full h-20 ${readOnly ? 'bg-gray-100' : ''}`}
            />
          </div>

          {/* BUTTONS CENTERED */}
          <div className="flex justify-center gap-4 mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-[#52bfbe] text-white py-2 rounded hover:bg-[#43a9a8]"
                  style={{ width: '200px' }}
                >
                  Simpan
                </button>

                {!isFirstTime && (
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                    style={{ width: '200px' }}
                  >
                    Batal
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#52bfbe] text-white py-2 rounded hover:bg-[#43a9a8]"
                style={{ width: '200px' }}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PREVIEW */}
      <div className="w-1/3 bg-white p-6 rounded-xl shadow-sm max-h-[85vh] overflow-y-auto">
        <h3 className="font-semibold text-lg mb-4">Tampilan Cetakan Nota</h3>

        <div
          className="border rounded-lg p-4 text-sm"
          style={{ width: paperSize === 58 ? 230 : 300 }}
        >
          {/* PREVIEW CONTENT — SAME AS BEFORE */}
          {options.infoToko && (
            <div className="text-center mb-3">
              {logo ? (
                <img src={logo} className="w-20 h-20 rounded mx-auto" />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded mx-auto"></div>
              )}
            </div>
          )}

          {header && <p className="text-center mb-6 font-semibold">{header}</p>}

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
