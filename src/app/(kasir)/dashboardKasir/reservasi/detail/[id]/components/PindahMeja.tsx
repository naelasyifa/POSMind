'use client'

import React, { useState, useEffect } from 'react'
import { User, CreditCard } from 'lucide-react'

interface ReservationData {
  id: number;
  table: string;
  time: string; // 'HH:MM' (Jam Mulai)
  duration: number; // Menit
  name: string; // Gabungan nama depan dan belakang
  people: number; // Pax
  status: string;
  notes?: string;
  contact?: string; // No. Telepon
  // Tambahan state dari TambahReservasi yang tidak ada di ReservationData:
  date?: string; // Kita akan default ke hari ini
  endTime?: string; // Kita akan default 1 jam dari time
  deposit?: number; // Default 0
  gender?: string; // Default 'Pria'
  firstName?: string; // Diambil dari name
  lastName?: string; // Diambil dari name
  email?: string; // Default kosong
  paymentMethod?: string; // Default 'Tunai'
}

interface PindahMejaProps {
  isOpen: boolean;
  onClose: () => void;
  currentReservation: ReservationData | null; 
  onSave: (updatedData: ReservationData) => void; 
}

/* ============================================
    ICON COMPONENTS (dipertahankan)
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

// Fungsi helper untuk mendapatkan Jam Selesai dari Jam Mulai dan Durasi
const calculateEndTime = (startTime: string, duration: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

// Fungsi helper untuk memisahkan nama (sederhana)
const splitName = (fullName: string): { firstName: string, lastName: string } => {
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    return { firstName, lastName };
}


/* ============================================
    MAIN COMPONENT
===============================================*/
export default function PindahMeja({ isOpen, onClose, currentReservation, onSave }: PindahMejaProps) {
  // State yang diperluas agar sama dengan TambahReservasi
  const [table, setTable] = useState(currentReservation?.table || '')
  const [pax, setPax] = useState(String(currentReservation?.people || 1))
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Default Hari Ini
  const [startTime, setStartTime] = useState(currentReservation?.time || '09:00')
  const [duration, setDuration] = useState(String(currentReservation?.duration || 60)) // Menit
  const [endTime, setEndTime] = useState('10:00') // Akan dihitung di useEffect
  const [deposit, setDeposit] = useState('0')
  const [status, setStatus] = useState(currentReservation?.status || 'Confirmed')
  const [gender, setGender] = useState('Pria')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState(currentReservation?.contact || '')
  const [email, setEmail] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Tunai')
  const [notes, setNotes] = useState(currentReservation?.notes || '')

  const statusList = ['Pending','Confirmed','Checked In','Completed','Cancelled','No Show']
  const tables = ['A1','A2','B1','B2','B3','C1','C2','Bar']
  const genderList = ['Pria', 'Wanita']
  const paymentList = ['Tunai', 'QRIS', 'Debit', 'Kartu Kredit']

  // Gunakan useEffect untuk inisialisasi state dari currentReservation
  useEffect(() => {
    if (currentReservation) {
        const { firstName, lastName } = splitName(currentReservation.name);

        setTable(currentReservation.table);
        setPax(String(currentReservation.people));
        // Jika currentReservation memiliki properti date, gunakan. Jika tidak, tetap hari ini.
        // Asumsi: date tidak ada di ReservationData, jadi kita skip setDate di sini
        setStartTime(currentReservation.time);
        setDuration(String(currentReservation.duration));
        setDeposit('0'); // Default karena tidak ada di ReservationData
        setStatus(currentReservation.status);
        setFirstName(firstName);
        setLastName(lastName);
        setPhone(currentReservation.contact || '');
        setEmail(''); // Default kosong
        setNotes(currentReservation.notes || '');
        setGender('Pria'); // Default 'Pria'
        setPaymentMethod('Tunai'); // Default 'Tunai'
    }
  }, [currentReservation])

  // Hitung ulang Jam Selesai setiap kali Jam Mulai atau Durasi berubah
  useEffect(() => {
    const durationNum = parseInt(duration) || 60;
    setEndTime(calculateEndTime(startTime, durationNum));
  }, [startTime, duration])


  const handleSave = () => {
    if (!currentReservation) return;

    // Gabungkan nama depan dan belakang untuk field 'name'
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    
    // Hitung durasi dari Jam Mulai dan Jam Selesai (Jika diperlukan, untuk konsistensi)
    // Dalam kasus ini, kita akan menggunakan state duration (menit) yang sudah ada.
    const durationNum = parseInt(duration) || 60;

    const updatedData: ReservationData = {
      ...currentReservation,
      table: table,
      people: parseInt(pax) || 1,
      time: startTime, // Jam Mulai
      duration: durationNum,
      status: status,
      notes: notes,
      name: fullName, 
      contact: phone,
      // Properti tambahan untuk konsistensi, walau mungkin tidak disimpan di database reservasi utama
      date: date,
      deposit: parseInt(deposit) || 0,
      gender: gender,
      firstName: firstName,
      lastName: lastName,
      email: email,
      paymentMethod: paymentMethod,
    };
    
    // Kirim data lengkap ke parent
    onSave(updatedData);
    onClose();
  }
  
  if (!currentReservation) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 rounded-l-2xl p-8 overflow-y-auto transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit & Pindah Meja Reservasi #{currentReservation.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-xl font-bold">✕</button>
        </div>
        
        {/* Nama Tamu di atas form (opsional, untuk penanda) */}
        <div className="mb-6 p-3 bg-gray-100 rounded-lg">
             <p className="text-sm font-medium text-gray-600">Nama Tamu Saat Ini:</p>
             <p className="text-lg font-bold">{currentReservation.name}</p>
        </div>

        {/* ====== Detail Reservasi (Sama persis dengan TambahReservasi) ====== */}
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

          {/* Durasi (Menggantikan Jam Selesai di TambahReservasi, karena lebih relevan dengan data asli) */}
          <div>
            <label className="text-sm mb-1 block">Durasi (Menit)</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          {/* NOTE: Jam Selesai (endTime) dihitung otomatis, tidak perlu input terpisah
          jika kita menggunakan Durasi sebagai input utama. Jika ingin Jam Selesai yang diinput,
          maka perlu menghitung Durasi dari Jam Mulai dan Jam Selesai */}
          
        </div>

        {/* Catatan Tambahan (dipindahkan dari bawah ke sini) */}
        <div className="mt-2 mb-6">
          <label className="text-sm mb-1 block">Catatan Tambahan (Notes)</label>
          <textarea 
            className="w-full border rounded-lg px-3 py-2 h-20" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Tambahkan catatan jika ada perubahan." 
          />
        </div>


        {/* Status */}
        <div className="mt-2 mb-6">
          <label className="text-sm mb-1 block">Ubah Status</label>
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

        {/* ====== Detail Customer (Sama persis dengan TambahReservasi) ====== */}
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

        {/* ====== Additional Info (Sama persis dengan TambahReservasi) ====== */}
        <div className="bg-white p-4 rounded-lg border shadow mt-6">
          <h2 className="text-base font-semibold mb-4">Additional Information</h2>

          <div className="flex items-center gap-3 mb-4">
            <IconCustomer />
            <span className="text-sm whitespace-nowrap">Customer ID</span>
            {/* Menggunakan ID Reservasi sebagai penanda, bukan Customer ID baru */}
            <span className="ml-auto font-medium text-sm">#{currentReservation.id}</span> 
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
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Batal</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#3ABAB4] text-white font-medium hover:bg-[#2EA7A6]">Simpan Perubahan</button>
        </div>
      </div>
    </>
  )
}