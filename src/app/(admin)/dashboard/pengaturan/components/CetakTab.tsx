'use client'

import { useState } from 'react'

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
  const [isEditing, setIsEditing] = useState(isFirstTime)
  const readOnly = !isEditing

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

  const handleSave = () => {
    setIsFirstTime(false)
    setIsEditing(false)
    console.log('SAVED', { options })
  }

  const handleCancel = () => setIsEditing(false)

  return (
    <div className="flex gap-6 w-full">
      {/* LEFT SETTINGS — SCROLLABLE */}
      <div className="w-2/3 bg-white p-6 rounded-xl shadow-sm max-h-[85vh] overflow-y-auto">
        <h3 className="font-semibold text-xl mb-6">Pengaturan Cetakan Dapur</h3>

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
                        checked={options[key]}
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
          </div>
        </div>
      </div>

      {/* RIGHT PREVIEW SAME AS BEFORE */}
      <div className="w-1/3 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Tampilan Cetakan Dapur</h3>

        <div className="text-sm text-gray-700 leading-relaxed p-4 rounded-lg border">
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
