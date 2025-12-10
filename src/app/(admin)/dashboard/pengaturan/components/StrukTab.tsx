/* --- SAME IMPORTS --- */
'use client'
import { useState, useEffect } from 'react'
import { generateStrukPDF } from '@/utils/strukPdfGenerator'
import StrukPreview from '../components/struk/StrukPreview'

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
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

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

  const uploadLogo = async (e: any) => {
    if (readOnly) return

    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append('logo', file)

    const res = await fetch('/api/frontend/store-settings/upload-logo', {
      method: 'POST',
      body: formData,
    })

    setIsUploading(false)

    if (!res.ok) {
      alert('Gagal upload logo')
      return
    }

    const data = await res.json()

    // Simpan URL logo yang dikembalikan API
    setLogoUrl(data.url)
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

  const handleSave = async () => {
    const payload = {
      header,
      footer,
      paperSize,
      logoUrl,
      options,
    }

    const res = await fetch('/api/frontend/store-settings/struk', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      alert('Gagal menyimpan pengaturan struk')
      return
    }

    setIsFirstTime(false)
    setIsEditing(false)
  }

  const handleCancel = () => setIsEditing(false)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/frontend/store-settings/struk')
      if (!res.ok) return

      const data = await res.json()

      setHeader(data.header || '')
      setFooter(data.footer || '')
      setPaperSize(data.paperSize || 80)
      setLogoUrl(data.logo?.url ?? null)

      // merge toggle
      setOptions((prev) => {
        const incoming = data.options || {}
        const fixed: any = {}

        for (const key in prev) {
          const k = key as OptionKey
          fixed[k] = incoming[k] ?? prev[k]
        }

        return fixed
      })

      setIsFirstTime(false)
      setIsEditing(false)
    }
    load()
  }, [])

  const handlePreviewPDF = async () => {
    const pdf = await generateStrukPDF({
      header,
      footer,
      logoUrl,
      paperSize,
      options,
    })

    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)

    window.open(url, '_blank')
  }

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
              {logoUrl ? (
                <img src={logoUrl} className="h-full object-contain rounded" />
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
              value={header ?? ''}
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
              value={paperSize ?? 80}
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
                        checked={options[key] ?? false}
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
              value={footer ?? ''}
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
            {/* TOMBOL PREVIEW HANYA MUNCUL KALAU SUDAH PERNAH TERSIMPAN */}
            {!isEditing && !isFirstTime && (
              <button
                onClick={handlePreviewPDF}
                className="bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
                style={{ width: '200px' }}
              >
                Preview PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PREVIEW */}
      <div className="w-1/3 bg-white p-6 rounded-xl shadow-sm max-h-[85vh] overflow-y-auto">
        <h3 className="font-semibold text-lg mb-4">Tampilan Cetakan Nota</h3>

        <StrukPreview
          header={header}
          footer={footer}
          paperSize={paperSize}
          logoUrl={logoUrl}
          options={options}
        />
      </div>
    </div>
  )
}
