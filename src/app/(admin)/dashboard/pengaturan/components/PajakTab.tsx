'use client'
import { useState, useEffect } from 'react'

type JamBuka = {
  hari: string
  buka: boolean
  fullDay: boolean
  jamBuka: string
  jamTutup: string
}

type StoreSettings = {
  tenant: number
  storeName: string
  serviceCharge: boolean
  pajak: boolean
  serviceChargePercentage: number
  pajakPercentage: number
  jamBuka: JamBuka[]
}

export default function PajakTab() {
  const [loading, setLoading] = useState(true)
  const [serviceCharge, setServiceCharge] = useState(true)
  const [pajak, setPajak] = useState(true)
  const [serviceChargePercentage, setServiceChargePercentage] = useState(10)
  const [pajakPercentage, setPajakPercentage] = useState(10)

  const defaultJamBuka: JamBuka[] = [
    { hari: 'Senin', buka: true, fullDay: false, jamBuka: '09:00', jamTutup: '17:00' },
    { hari: 'Selasa', buka: true, fullDay: false, jamBuka: '09:00', jamTutup: '17:00' },
    { hari: 'Rabu', buka: true, fullDay: false, jamBuka: '09:00', jamTutup: '17:00' },
    { hari: 'Kamis', buka: true, fullDay: false, jamBuka: '09:00', jamTutup: '17:00' },
    { hari: 'Jumat', buka: true, fullDay: false, jamBuka: '09:00', jamTutup: '17:00' },
    { hari: 'Sabtu', buka: true, fullDay: false, jamBuka: '09:00', jamTutup: '17:00' },
    { hari: 'Minggu', buka: true, fullDay: false, jamBuka: '09:00', jamTutup: '17:00' },
  ]

  const [jamBuka, setJamBuka] = useState<JamBuka[]>(defaultJamBuka)

  // Ambil data dari API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/frontend/store-settings')
        const data = (await res.json()) as Partial<StoreSettings>

        setServiceCharge(data.serviceCharge ?? true)
        setPajak(data.pajak ?? true)
        setServiceChargePercentage(data.serviceChargePercentage ?? 10)
        setPajakPercentage(data.pajakPercentage ?? 10)
        setJamBuka((prev) =>
          prev.map((j: JamBuka) => {
            const apiJam = (data.jamBuka ?? []) as JamBuka[]
            const found = apiJam.find((x) => x.hari === j.hari)
            return {
              ...j,
              buka: found?.buka ?? j.buka,
              fullDay: found?.fullDay ?? j.fullDay,
              jamBuka: found?.jamBuka ?? j.jamBuka,
              jamTutup: found?.jamTutup ?? j.jamTutup,
            }
          }),
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  if (loading) return <p>Loading</p>

  // Generic function supaya TypeScript tahu tipe value sesuai field
  const handleJamChange = <K extends keyof JamBuka>(index: number, field: K, value: JamBuka[K]) => {
    const newJam = [...jamBuka]
    newJam[index][field] = value

    // jika fullDay diubah
    if (field === 'fullDay') {
      if (value) {
        newJam[index].jamBuka = ''
        newJam[index].jamTutup = ''
      } else {
        newJam[index].jamBuka = '09:00'
        newJam[index].jamTutup = '17:00'
      }
    }

    setJamBuka(newJam)

    // langsung PATCH ke backend
    fetch('/api/frontend/store-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceCharge,
        pajak,
        serviceChargePercentage,
        pajakPercentage,
        jamBuka: newJam,
      }),
    }).catch((err) => console.error('Gagal update jam buka', err))
  }

  const handleSave = async () => {
    const payload: StoreSettings = {
      tenant: 1, // ID tenant
      storeName: "lovy's cafe", // Nama toko
      serviceCharge,
      pajak,
      serviceChargePercentage,
      pajakPercentage,
      jamBuka,
    }

    try {
      const res = await fetch('/api/frontend/store-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Gagal update pengaturan')

      const updated = await res.json()
      alert('Pengaturan berhasil disimpan!')
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menyimpan')
    }
  }

  return (
    <div className="flex gap-6">
      {/* Pajak & Service Charge */}
      <div className="bg-white p-6 rounded-xl shadow-sm w-1/3 flex flex-col gap-6">
        <h3 className="font-semibold text-lg border-b pb-2 mb-2">Pajak & Service Charge</h3>

        {/* Service Charge */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span>Service Charge</span>
            <label className="relative inline-flex items-center cursor-pointer w-12 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={serviceCharge}
                onChange={() => setServiceCharge(!serviceCharge)}
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-[#52bfbe] transition-colors duration-300" />
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  serviceCharge ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </label>
          </div>
          {serviceCharge && (
            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
              <span>Persentase Service Charge</span>
              <input
                type="number"
                value={serviceChargePercentage}
                onChange={(e) => setServiceChargePercentage(Number(e.target.value))}
                placeholder="%"
                className="border p-1 rounded w-20 text-right"
              />
            </div>
          )}
        </div>

        {/* Pajak */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span>Pajak</span>
            <label className="relative inline-flex items-center cursor-pointer w-12 h-6">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={pajak}
                onChange={() => setPajak(!pajak)}
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-[#52bfbe] transition-colors duration-300" />
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  pajak ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </label>
          </div>
          {pajak && (
            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
              <span>Persentase Pajak</span>
              <input
                type="number"
                value={pajakPercentage}
                onChange={(e) => setPajakPercentage(Number(e.target.value))}
                placeholder="%"
                className="border p-1 rounded w-20 text-right"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="bg-[#52bfbe] hover:bg-[#3aa9a9] text-white px-4 py-2 rounded mt-2 w-full transition-colors duration-200"
        >
          Simpan
        </button>
      </div>

      {/* Jam Buka */}
      <div className="w-2/3 bg-white p-6 rounded-xl shadow-sm overflow-x-auto">
        <h2 className="font-semibold mb-4 text-lg border-b pb-2">Jam Buka Toko</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left pb-2">Hari</th>
              <th>Status</th>
              <th>24 Jam</th>
              <th>Jam Buka</th>
              <th>Jam Tutup</th>
            </tr>
          </thead>
          <tbody>
            {jamBuka.map((jam, index) => (
              <tr key={jam.hari} className="border-t border-gray-200">
                <td className="py-2">{jam.hari}</td>
                <td className="text-center">
                  <label className="relative inline-flex items-center cursor-pointer w-12 h-6">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={jam.buka}
                      onChange={(e) => handleJamChange(index, 'buka', e.target.checked)}
                    />
                    <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-[#52bfbe] transition-colors duration-300" />
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        jam.buka ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </label>
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={jam.fullDay}
                    onChange={(e) => handleJamChange(index, 'fullDay', e.target.checked)}
                    disabled={!jam.buka}
                    className="cursor-not-allowed opacity-50 w-4 h-4"
                  />
                </td>
                <td className="text-center">
                  <input
                    type="time"
                    value={jam.jamBuka}
                    onChange={(e) => handleJamChange(index, 'jamBuka', e.target.value)}
                    disabled={!jam.buka || jam.fullDay}
                    className="border border-gray-300 p-1 rounded mt-2 mb-2 items-center"
                  />
                </td>
                <td className="text-center">
                  <input
                    type="time"
                    value={jam.jamTutup}
                    onChange={(e) => handleJamChange(index, 'jamTutup', e.target.value)}
                    disabled={!jam.buka || jam.fullDay}
                    className="border border-gray-300 p-1 rounded mt-2 mb-2 items-center"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
