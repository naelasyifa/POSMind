'use client'

import React, { useEffect, useState } from 'react'
import type { StatusType } from '@/types/reservation'

/* ================= TYPES ================= */
interface Table {
  id: string | number
  namaMeja: string
  lantai: string
  area: string
  kapasitas: number
}

export interface ReservationData {
  tableId: string
  pax: number
  date: string
  startTime: string
  endTime: string
  deposit: number
  status: StatusType
  firstName: string
  lastName: string
  phone: string
  email: string
  paymentMethod: string
  areaType: string
  floor: string
  kodeReservasi?: string // Ditambahkan untuk sinkronisasi header
}

interface EditReservationProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  reservationId: string
  initialData: ReservationData
}

/* ================= COMPONENT ================= */
export default function EditReservasi({
  open,
  onClose,
  onSuccess,
  reservationId,
  initialData,
}: EditReservationProps) {
  const [formData, setFormData] = useState<ReservationData>(initialData)
  const [tables, setTables] = useState<Table[]>([])
  const [loadingTables, setLoadingTables] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // --- ANIMATION STATE ---
  const [animate, setAnimate] = useState(false)

  /* ================= FETCH TABLES & SYNC DATA ================= */
  useEffect(() => {
    if (!open) {
      setAnimate(false)
      return
    }

    // Perbaikan Tanggal: Pastikan format YYYY-MM-DD agar muncul di input date
    const formattedDate = initialData.date ? initialData.date.split('T')[0] : ''
    
    setFormData({
      ...initialData,
      date: formattedDate
    })
    
    setLoadingTables(true)
    
    // Trigger animasi slide-in
    const timer = setTimeout(() => setAnimate(true), 10)

    fetch('/api/frontend/admin/tables')
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch(() => console.error('Gagal memuat data meja'))
      .finally(() => setLoadingTables(false))
      
    return () => clearTimeout(timer)
  }, [open, initialData])

  // Handler untuk menutup dengan animasi keluar
  const handleClose = () => {
    setAnimate(false)
    setTimeout(onClose, 300) 
  }

  /* ================= HANDLER ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === 'tableId') {
      const selected = tables.find((t) => String(t.id) === value)
      if (!selected) return

      setFormData((prev) => ({
        ...prev,
        tableId: value,
        areaType: selected.area,
        floor: selected.lantai,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pax' || name === 'deposit' ? Number(value) : value,
    }))
  }

  const handleSubmit = async () => {
    if (!formData.tableId) return alert('Pilih meja')
    if (!formData.firstName) return alert('Nama pelanggan wajib diisi')
    if (!formData.phone) return alert('Nomor HP wajib diisi')

    try {
      setSaving(true)
      
      // Gunakan endpoint yang sesuai dengan reservations route.ts Anda
      const res = await fetch(`/api/frontend/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meja: formData.tableId,
          pax: formData.pax,
          tanggal: formData.date,
          jamMulai: formData.startTime,
          jamSelesai: formData.endTime,
          namaPelanggan: formData.firstName,
          noTelepon: formData.phone,
          email: formData.email,
          status: formData.status
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Gagal update')

      alert('Reservasi berhasil diperbarui') // ✅ DI SINI

      onSuccess()
      handleClose()
      if (!res.ok) throw new Error(json.message || 'Gagal update')

      onSuccess()
      handleClose() 
    } catch (err: any) {
      alert(err.message || 'Gagal update reservasi')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Overlay dengan animasi Opacity */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ease-in-out ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Panel dengan animasi Slide-in dari kanan */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-[480px] bg-white z-[110] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
          animate ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Edit Reservasi</h2>
            {/* Menampilkan Kode (R000x) jika tersedia, jika tidak tampilkan ID database */}
            <p className="text-sm font-mono text-[#3ABAB4]">
              {initialData.kodeReservasi || `ID: ${reservationId}`}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section: Meja */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Nomor Meja</label>
              <select
                name="tableId"
                value={formData.tableId}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#3ABAB4]/20 focus:border-[#3ABAB4] outline-none"
              >
                <option value="">{loadingTables ? 'Memuat meja...' : 'Pilih Meja'}</option>
                {tables.map((t) => (
                  <option key={t.id} value={String(t.id)}>
                    {t.namaMeja} • {t.area} • {t.lantai}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">Area</label>
                <input
                  value={formData.areaType}
                  disabled
                  placeholder="Area"
                  className="w-full mt-1 border border-gray-200 px-3 py-2.5 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">Lantai</label>
                <input
                  value={formData.floor}
                  disabled
                  placeholder="Lantai"
                  className="w-full mt-1 border border-gray-200 px-3 py-2.5 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Section: Waktu & Pax */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Tanggal Reservasi</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#3ABAB4]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Pax</label>
                <input
                  type="number"
                  name="pax"
                  value={formData.pax}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2.5 outline-none"
                />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Jam Mulai</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2.5 outline-none"
                />
              </div>
              <div className="col-span-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Jam Selesai</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Section: Pelanggan */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-600 uppercase">Informasi Pelanggan</label>
            <input
              name="firstName"
              placeholder="Nama Lengkap"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#3ABAB4]"
            />
            <input
              name="phone"
              placeholder="Nomor WhatsApp (Contoh: 08122...)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#3ABAB4]"
            />
            <input
              name="email"
              placeholder="Alamat Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#3ABAB4]"
            />
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t bg-gray-50">
          <button
            disabled={saving}
            onClick={handleSubmit}
            className="w-full bg-[#3ABAB4] hover:bg-[#2d9691] text-white py-3 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Perubahan'
            )}
          </button>
        </div>
      </div>
    </>
  )
}