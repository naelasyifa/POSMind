'use client'

import { useState, useEffect } from 'react'
import { cetakDapurPdf } from '@/utils/cetakDapurPdf'

type OptionKey =
  | 'noTransaksi'
  | 'tanggalTransaksi'
  | 'jamTransaksi'
  | 'modePenjualan'
  | 'namaWaiter'
  | 'namaWaiter2'
  | 'namaSender'
  | 'infoTambahan'
  | 'namaMeja'

export default function CetakTab() {
  // -----------------------------------------
  // MODE STATE
  // -----------------------------------------
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const readOnly = !isEditing

  const [paperSize, setPaperSize] = useState<58 | 80>(80)

  // -----------------------------------------
  // MAIN DATA
  // -----------------------------------------
  const [options, setOptions] = useState<Record<OptionKey, boolean>>({
    noTransaksi: true,
    tanggalTransaksi: true,
    jamTransaksi: true,
    modePenjualan: true,
    namaWaiter: true,
    namaWaiter2: false,
    namaSender: true,
    infoTambahan: true,
    namaMeja: true,
  })

  const [dapurSettings, setDapurSettings] = useState<any>(null)

  // Ambil pengaturan dapur dari API
  useEffect(() => {
    fetch('/api/frontend/store-settings/cetak')
      .then((res) => res.json())
      .then((data) => {
        setDapurSettings(data)
        // Kalau data sudah ada, tandai sudah pernah tersimpan
        setPaperSize(data.paperSize || 80)
        setIsFirstTime(false)
        // Set state options sesuai API
        if (data.options) {
          setOptions(data.options)
        }
      })
      .catch((err) => console.error('Fetch error:', err))
  }, [])

  const toggleList: [OptionKey, string][] = [
    ['noTransaksi', 'No. Transaksi'],
    ['tanggalTransaksi', 'Tanggal Transaksi'],
    ['jamTransaksi', 'Jam Transaksi'],
    ['modePenjualan', 'Mode Penjualan'],
    ['namaWaiter', 'Nama Waiter'],
    ['namaWaiter2', 'Nama Waiter 2'],
    ['namaSender', 'Nama Sender'],
    ['infoTambahan', 'Info Tambahan'],
    ['namaMeja', 'Nama Meja'],
  ]

  const toggle = (key: OptionKey) => {
    if (readOnly) return
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Save ke API
  // Save ke API
  const handleSave = async () => {
    try {
      const res = await fetch('/api/frontend/store-settings/cetak', {
        method: 'PATCH', // wajib sesuai route API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options }), // kirim langsung objek options
      })
      if (!res.ok) throw new Error('Failed to save settings')
      setIsEditing(false)
      setIsFirstTime(false)
      console.log('Settings saved:', options)
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan pengaturan.')
    }
  }

  const handleCancel = () => setIsEditing(false)

  // Preview / generate PDF
  const handlePreviewPDF = () => {
    if (!dapurSettings) return
    const items = ['Paket Hemat', 'Nasi Putih', 'Air Putih', 'Kerupuk'] // contoh item dapur

    const pdf = cetakDapurPdf({
      storeName: dapurSettings.storeName,
      tenantName: dapurSettings.tenant?.name || dapurSettings.tenant,
      options,
      items,
      paperSize,
    }) // 🟢 simpan ke pdf

    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)

    window.open(url, '_blank')
  }

  return (
    <div className="flex gap-6 w-full">
      {/* LEFT SETTINGS — SCROLLABLE */}
      <div className="w-2/3 bg-white p-6 rounded-xl shadow-sm max-h-[85vh] overflow-y-auto">
        <h3 className="font-semibold text-xl mb-6">Pengaturan Cetakan Dapur</h3>

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
        <div className="my-6" />
        <div className="grid grid-cols-1 gap-6">
          {/* TOGGLES (MATCH STRUKTAB STYLE) */}
          <div>
            <p className="font-medium mb-2">Elemen yang Ditampilkan</p>

            <div className="grid grid-cols-1 gap-4">
              {toggleList.map(([key, label]) => (
                <div key={key} className="flex justify-between items-center">
                  <span>{label}</span>

                  {/* Toggle + text */}
                  <div className="flex items-center gap-3 min-w-[160px] justify-end">
                    {/* TOGGLE */}
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

                    {/* Text tampilkan/sembunyikan */}
                    <span
                      className={`text-xs inline-block text-left w-[80px] ${
                        options[key] ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {options[key] ? 'Tampilkan' : 'Sembunyikan'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTONS — CENTERED LIKE STRUKTAB */}
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

      {/* RIGHT PREVIEW SAME AS BEFORE */}
      <div className="w-1/3 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Tampilan Cetakan Dapur</h3>

        <div
          className="text-sm text-gray-700 leading-relaxed p-4 rounded-lg border"
          style={{
            width: paperSize === 58 ? '230px' : '300px', // sesuaikan dengan thermal 58/80mm
            margin: '0 auto',
          }}
        >
          {options.noTransaksi && <p>#ES421</p>}
          {options.tanggalTransaksi && <p>17-06-2021</p>}
          {options.jamTransaksi && <p>10:22</p>}
          {options.namaMeja && <p>No. Meja : Indoor / A1</p>}
          {options.modePenjualan && <p className="mt-2 font-semibold">DINE IN</p>}
          {options.namaWaiter && <p>Waiter&nbsp;&nbsp;&nbsp;&nbsp;: Gisell</p>}
          {options.namaWaiter2 && <p>Waiter 2&nbsp;&nbsp;&nbsp;&nbsp;: Rafi</p>}
          {options.namaSender && <p>Sender&nbsp;&nbsp;&nbsp;&nbsp;: Rafaela</p>}
          {options.infoTambahan && (
            <p>Info&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Andi</p>
          )}

          <hr className="my-3" />
          <p className="font-semibold text-center mb-1">Dapur</p>
          <p>Paket Hemat</p>
          <p>Nasi Putih</p>
          <p>Air Putih</p>
          <p>Kerupuk</p>
        </div>
      </div>
    </div>
  )
}
