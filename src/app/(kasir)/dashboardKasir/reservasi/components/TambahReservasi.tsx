'use client'

import React, { useState } from 'react'
import { User, CreditCard } from 'lucide-react'

/* ============================================
    ICON COMPONENTS
===============================================*/
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

/* ============================================
    MAIN COMPONENT
===============================================*/
interface AddReservationProps {
  isOpen: boolean
  onClose: () => void
  // Prop onSave yang akan mengirim data kembali ke parent
  onSave: (data: any) => void 
}

export default function TambahReservasi({ isOpen, onClose, onSave }: AddReservationProps) {
  const [table, setTable] = useState('')
  const [pax, setPax] = useState('1') // Default 1
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Default hari ini
  const [startTime, setStartTime] = useState('09:00') // Default
  const [endTime, setEndTime] = useState('10:00') // Default
  const [deposit, setDeposit] = useState('0')
  const [status, setStatus] = useState('Confirmed')
  const [gender, setGender] = useState('Pria')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Tunai')

  const statusList = [
    'Pending',
    'Confirmed',
    'Checked In',
    'Completed',
    'Cancelled',
    'No Show'
  ]

  const tables = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'Bar']
  const genderList = ['Pria', 'Wanita']
  const paymentList = ['Tunai', 'QRIS', 'Debit', 'Kartu Kredit']

  // 💡 MODIFIKASI: Memanggil onSave prop untuk mengirim data
  const handleSave = () => {
    // Validasi sederhana
    if (!table || !firstName || !pax || !startTime || !endTime || !date) {
      alert("Harap isi semua kolom wajib (Meja, Nama, Pax, Waktu, Tanggal)")
      return
    }
    
    // Mengirim objek data lengkap ke parent melalui prop onSave
    onSave({
      table,
      pax,
      date,
      startTime,
      endTime,
      deposit,
      status,
      gender,
      firstName,
      lastName,
      phone,
      email,
      paymentMethod
    })
    // NOTE: onSave di parent akan otomatis memanggil onClose
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 rounded-l-2xl p-8 overflow-y-auto transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Tambah Reservasi</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl font-bold">
            ✕
          </button>
        </div>

        {/* ====== Detail Reservasi ====== */}
        <p className="text-sm font-semibold mb-3">Detail Reservasi</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Nomor Meja */}
          <div>
            <label className="text-sm mb-1 block">Nomor Meja</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={table}
              onChange={(e) => setTable(e.target.value)}
            >
              <option value="">Pilih Meja</option>
              {tables.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Jumlah Pax */}
          <div>
            <label className="text-sm mb-1 block">Jumlah Pax</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={pax}
              onChange={(e) => setPax(e.target.value)}
            />
          </div>

          {/* Tanggal Reservasi */}
          <div>
            <label className="text-sm mb-1 block">Tanggal Reservasi</label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Uang Muka */}
          <div>
            <label className="text-sm mb-1 block">Uang Muka</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
          </div>

          {/* Jam Mulai */}
          <div>
            <label className="text-sm mb-1 block">Jam Mulai</label>
            <input
              type="time"
              className="w-full border rounded-lg px-3 py-2"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          {/* Jam Selesai */}
          <div>
            <label className="text-sm mb-1 block">Jam Selesai</label>
            <input
              type="time"
              className="w-full border rounded-lg px-3 py-2"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Status */}
        <div className="mt-2 mb-6">
          <label className="text-sm mb-1 block">Status</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* ====== Detail Customer ====== */}
        <p className="text-sm font-semibold mb-3">Detail Customer</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Jenis Kelamin */}
          <div className="col-span-2">
            <label className="text-sm mb-1 block">Jenis Kelamin</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              {genderList.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Nama Depan */}
          <div>
            <label className="text-sm mb-1 block">Nama Depan</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Nama Belakang */}
          <div>
            <label className="text-sm mb-1 block">Nama Belakang</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* No. Telepon */}
          <div>
            <label className="text-sm mb-1 block">No. Telepon</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm mb-1 block">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* ====== Additional Info ====== */}
        <div className="bg-white p-4 rounded-lg border shadow mt-6">
          <h2 className="text-base font-semibold mb-4">Additional Information</h2>

          <div className="flex items-center gap-3 mb-4">
            <IconCustomer />
            <span className="text-sm whitespace-nowrap">Customer ID</span>
            <span className="ml-auto font-medium text-sm">#1234564</span>
          </div>

          <div className="flex items-center gap-3">
            <IconPayment />
            <span className="text-sm whitespace-nowrap">Metode Pembayaran</span>

            <select
              className="ml-auto border border-gray-300 rounded-lg px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-[#4ECAC7]"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentList.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#3ABAB4] text-white font-medium"
          >
            Simpan
          </button>
        </div>
      </div>
    </>
  )
}