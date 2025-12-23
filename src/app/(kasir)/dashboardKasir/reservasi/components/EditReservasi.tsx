'use client'

import React, { useState, useEffect } from 'react'
import { User, CreditCard, Save } from 'lucide-react'
import type { StatusType } from '@/types/reservation'

type AreaType = 'Indoor' | 'Outdoor' | 'Smoking' | 'VIP'

interface Reservation {
  id: string
  tableNumber: string
  pax: string
  date: string
  startTime: string
  endTime: string
  deposit: string
  // Telah diperbaiki: Menggunakan StatusType, bukan ReservationStatus
  status: StatusType
  customerName: string
  gender?: 'Pria' | 'Wanita' | ''
  phone: string
  email?: string
  paymentMethod: string
  areaType: AreaType
  floor: string
}

/* -------- ICON COMPONENTS -------- */
function IconCustomer() {
  return (
    <div className="w-10 h-10 rounded-full bg-[#4ECAC7] flex items-center justify-center">
      <User size={20} className="text-black" />
    </div>
  )
}

function IconPayment() {
  return (
    <div className="w-10 h-10 rounded-full bg-[#4ECAC7] flex items-center justify-center">
      <CreditCard size={20} className="text-black" />
    </div>
  )
}

/* ============================================ */

interface EditReservationProps {
  isOpen: boolean
  onClose: () => void
  initialData: Reservation | null
  onUpdate: (data: Reservation) => void
  onDeleteClick?: (id: string) => void
}

export default function EditReservasi({
  isOpen,
  onClose,
  initialData,
  onUpdate,
}: EditReservationProps) {
  // ⭐ FIXED STATUS LIST
  const statusList: StatusType[] = [
    'Menunggu',
    'Dikonfirmasi',
    'Checked In',
    'Selesai',
    'Tidak Datang',
  ]

  const tables = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'Bar']
  const genderList = ['Pria', 'Wanita']
  const paymentList = ['Tunai', 'QRIS', 'Debit', 'Kartu Kredit', 'Transfer']
  const areaTypeList: AreaType[] = ['Indoor', 'Outdoor', 'Smoking', 'VIP']
  const floorList = ['Lantai 1', 'Lantai 2', 'Lantai 3', 'Rooftop']

  const splitName = (fullName: string) => {
    const parts = fullName.trim().split(' ')
    if (parts.length > 1) {
      return {
        first: parts.slice(0, -1).join(' '),
        last: parts.slice(-1)[0],
      }
    }
    return { first: fullName, last: '' }
  }

  const defaultReservation: Reservation = {
    id: '',
    tableNumber: '',
    pax: '1',
    date: '',
    startTime: '',
    endTime: '',
    deposit: '0',
    status: 'Menunggu',
    customerName: '',
    phone: '',
    paymentMethod: 'Tunai',
    areaType: 'Indoor',
    floor: 'Lantai 1',
  }

  const [currentData, setCurrentData] = useState<Reservation>(initialData || defaultReservation)
  const [firstName, setFirstName] = useState(
    initialData ? splitName(initialData.customerName).first : '',
  )
  const [lastName, setLastName] = useState(
    initialData ? splitName(initialData.customerName).last : '',
  )

  useEffect(() => {
    if (initialData) {
      setCurrentData({
        ...initialData,
        // Pastikan tipe data konsisten saat inisialisasi
        status: initialData.status as StatusType,
        areaType: initialData.areaType as AreaType,
      })

      const { first, last } = splitName(initialData.customerName)
      setFirstName(first)
      setLastName(last)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'firstName') {
      setFirstName(value)
    } else if (name === 'lastName') {
      setLastName(value)
    } else {
      setCurrentData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleUpdate = () => {
    if (!initialData) return

    if (
      !currentData.tableNumber ||
      !firstName ||
      !currentData.pax ||
      !currentData.startTime ||
      !currentData.endTime ||
      !currentData.date ||
      !currentData.phone
    ) {
      alert('Harap isi semua kolom wajib (Meja, Nama Depan, Pax, Waktu, Tanggal, Telepon)')
      return
    }

    const updatedData: Reservation = {
      ...currentData,
      customerName: `${firstName} ${lastName}`.trim(),
      // Pastikan tipe dikembalikan ke tipe Reservation yang benar
      status: currentData.status as StatusType,
      areaType: currentData.areaType as AreaType,
      gender: (currentData.gender || '') as Reservation['gender'],
    }

    onUpdate(updatedData)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all ${
          isOpen ? 'opacity-100 visible z-50' : 'opacity-0 invisible z-50'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        // Mengubah z-[55] menjadi z-50 agar konsisten dengan standar Tailwind
        className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 rounded-l-2xl p-8 overflow-y-auto transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Edit Reservasi <span className="text-[#3ABAB4]">#{currentData.id}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleUpdate()
          }}
        >
          {/* === DETAIL RESERVASI === */}
          <p className="text-sm font-semibold mb-3">Detail Reservasi</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Nomor Meja */}
            <div>
              <label className="text-sm mb-1 block">Nomor Meja</label>
              <select
                name="tableNumber"
                className="w-full border rounded-lg px-3 py-2"
                value={currentData.tableNumber}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Meja</option>
                {tables.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Pax */}
            <div>
              <label className="text-sm mb-1 block">Jumlah Pax</label>
              <input
                name="pax"
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={currentData.pax}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="mt-2 mb-6">
            <label className="text-sm mb-1 block">Status</label>
            <select
              name="status"
              className="w-full border rounded-lg px-3 py-2"
              value={currentData.status}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Status</option>
              {statusList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* === TANGGAL & WAKTU (BARU DITAMBAHKAN) === */}
          <p className="text-sm font-semibold mb-3">Tanggal & Waktu</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Tanggal */}
            <div>
              <label className="text-sm mb-1 block">Tanggal</label>
              <input
                name="date"
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={currentData.date}
                onChange={handleChange}
                required
              />
            </div>
            {/* Waktu Mulai */}
            <div>
              <label className="text-sm mb-1 block">Waktu Mulai</label>
              <input
                name="startTime"
                type="time"
                className="w-full border rounded-lg px-3 py-2"
                value={currentData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            {/* Waktu Selesai */}
            <div>
              <label className="text-sm mb-1 block">Waktu Selesai</label>
              <input
                name="endTime"
                type="time"
                className="w-full border rounded-lg px-3 py-2"
                value={currentData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* === LOKASI MEJA (BARU DITAMBAHKAN) === */}
          <p className="text-sm font-semibold mb-3">Lokasi Meja</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Lantai */}
            <div>
              <label className="text-sm mb-1 block">Lantai</label>
              <select
                name="floor"
                className="w-full border rounded-lg px-3 py-2"
                value={currentData.floor}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Lantai</option>
                {floorList.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            {/* Area Type */}
            <div>
              <label className="text-sm mb-1 block">Tipe Area</label>
              <select
                name="areaType"
                className="w-full border rounded-lg px-3 py-2"
                value={currentData.areaType}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Area</option>
                {areaTypeList.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* === KEUANGAN / DEPOSIT (BARU DITAMBAHKAN) === */}
          <p className="text-sm font-semibold mb-3">Keuangan</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Deposit */}
            <div>
              <label className="text-sm mb-1 block">Deposit (Rp)</label>
              <input
                name="deposit"
                type="number"
                className="w-full border rounded-lg px-3 py-2"
                value={currentData.deposit}
                onChange={handleChange}
                required
              />
            </div>
            {/* Metode Pembayaran */}
            <div>
              <label className="text-sm mb-1 block">Metode Pembayaran Deposit</label>
              <select
                name="paymentMethod"
                className="w-full border rounded-lg px-3 py-2"
                value={currentData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Metode</option>
                {paymentList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            {/* === DETAIL CUSTOMER === */}
            <p className="text-sm font-semibold mb-3">Detail Customer</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Gender */}
              <div className="col-span-2">
                <label className="text-sm mb-1 block">Jenis Kelamin</label>
                <select
                  name="gender"
                  className="w-full border rounded-lg px-3 py-2"
                  value={currentData.gender || ''}
                  onChange={handleChange}
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  {genderList.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nama Depan */}
              <div>
                <label className="text-sm mb-1 block">Nama Depan</label>
                <input
                  name="firstName"
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  value={firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Nama Belakang */}
              <div>
                <label className="text-sm mb-1 block">Nama Belakang</label>
                <input
                  name="lastName"
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  value={lastName}
                  onChange={handleChange}
                />
              </div>

              {/* Telepon */}
              <div>
                <label className="text-sm mb-1 block">No. Telepon</label>
                <input
                  name="phone"
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  value={currentData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm mb-1 block">Email</label>
                <input
                  name="email"
                  type="email"
                  className="w-full border rounded-lg px-3 py-2"
                  value={currentData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#3ABAB4] text-white font-medium flex items-center gap-2"
            >
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
