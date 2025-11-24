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

  const toggle = (key: OptionKey) => {
    if (readOnly) return
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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

  // -----------------------------------------
  // SIMPAN & CANCEL
  // -----------------------------------------
  const handleSave = () => {
    setIsFirstTime(false)
    setIsEditing(false)
    console.log('SAVED', { options })
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="flex gap-6 w-full">
      {/* LEFT SIDE: TOGGLE */}
      <div className="w-2/3 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-xl">Pengaturan Cetakan Dapur</h3>

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

        {/* Toggles */}
        <div className="space-y-3">
          {toggleList.map(([key, label]) => (
            <div key={key} className="flex justify-between items-center">
              <span>{label}</span>

              <label
                className={`${
                  readOnly ? 'opacity-50' : 'cursor-pointer relative inline-flex items-center'
                }`}
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
      </div>

      {/* RIGHT SIDE: PREVIEW */}
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
