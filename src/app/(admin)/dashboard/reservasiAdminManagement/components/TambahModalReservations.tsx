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
}

interface AddReservationProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ReservationData) => void
}

/* ================= CONSTANT ================= */
const initialForm: ReservationData = {
  tableId: '',
  pax: 1,
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '10:00',
  deposit: 0,
  status: 'Dikonfirmasi',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  paymentMethod: 'Tunai',
  areaType: '',
  floor: '',
}

/* ================= COMPONENT ================= */
export default function TambahReservasi({
  isOpen,
  onClose,
  onSave,
}: AddReservationProps) {
  const [formData, setFormData] =
    useState<ReservationData>(initialForm)
  const [tables, setTables] = useState<Table[]>([])
  const [loadingTables, setLoadingTables] = useState(false)

  /* ================= FETCH TABLES ================= */
  useEffect(() => {
    if (!isOpen) return

    setFormData(initialForm)
    setLoadingTables(true)

    fetch('/api/frontend/admin/tables')
      .then((res) => res.json())
      .then((data) => {
        setTables(data)
      })
      .catch(() => alert('Gagal memuat data meja'))
      .finally(() => setLoadingTables(false))
  }, [isOpen])

  /* ================= HANDLER ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // ✅ FIX UTAMA DI SINI
    if (name === 'tableId') {
      const selected = tables.find(
        (t) => String(t.id) === value
      )

      if (!selected) return

      setFormData((prev) => ({
        ...prev,
        tableId: value,
        areaType: selected.area,
        floor: selected.lantai,
        pax: Math.min(prev.pax, selected.kapasitas),
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'pax' || name === 'deposit'
          ? Number(value)
          : value,
    }))
  }

  const handleSubmit = () => {
    if (!formData.tableId) return alert('Pilih meja')
    if (!formData.firstName) return alert('Nama depan wajib')
    if (!formData.phone) return alert('No HP wajib')
    if (formData.startTime >= formData.endTime)
      return alert('Jam selesai harus lebih besar')

    onSave(formData)
  }

  if (!isOpen) return null

  /* ================= RENDER ================= */
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white z-[60] p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Tambah Reservasi
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Meja */}
          <div>
            <label className="text-sm font-medium">
              Nomor Meja
            </label>
            <select
              name="tableId"
              value={formData.tableId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">
                {loadingTables
                  ? 'Memuat meja...'
                  : 'Pilih Meja'}
              </option>

              {tables.map((t) => (
                <option
                  key={t.id}
                  value={String(t.id)}
                >
                  {t.namaMeja} • {t.area} • {t.lantai}
                </option>
              ))}
            </select>
          </div>

          {/* Auto area & lantai */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Area</label>
              <input
                value={formData.areaType}
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="text-sm">Lantai</label>
              <input
                value={formData.floor}
                disabled
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>
          </div>

          {/* Tanggal & Pax */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
            <input
              type="number"
              name="pax"
              min={1}
              value={formData.pax}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          {/* Waktu */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          {/* Customer */}
          <input
            name="firstName"
            placeholder="Nama Depan"
            value={formData.firstName}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            name="lastName"
            placeholder="Nama Belakang"
            value={formData.lastName}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            name="phone"
            placeholder="No HP"
            value={formData.phone}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-[#3ABAB4] text-white py-2 rounded font-semibold"
          >
            Simpan Reservasi
          </button>
        </div>
      </div>
    </>
  )
}
