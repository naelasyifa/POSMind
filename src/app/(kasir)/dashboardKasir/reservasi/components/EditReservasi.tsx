'use client'

import React, { useState, useEffect } from 'react'
import { User, CreditCard, Loader2, DollarSign, Receipt, Calendar } from 'lucide-react'

interface EditReservationProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  reservationId: string | null
}

export default function EditReservasi({
  isOpen,
  onClose,
  onSuccess,
  reservationId,
}: EditReservationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    namaPelanggan: '',
    jenisKelamin: 'laki-laki',
    noTelepon: '',
    email: '',
    tanggal: '',
    jamMulai: '',
    jamSelesai: '',
    pax: 0,
    deposit: 0,
    totalTagihan: 0,
    statusPembayaran: 'unpaid',
    metodePembayaran: 'tunai',
    meja: '',
    status: 'menunggu',
    catatan: '',
    tableNumber: '',
    floor: '',
  })

  // 🔥 FETCH DATA DETAIL DARI API
  useEffect(() => {
    if (!isOpen || !reservationId) return

const fetchDetail = async () => {
  setLoading(true)
  try {
    const res = await fetch(`/api/frontend/reservations/${reservationId}`)
    
    // Cek apakah response sukses (status 200-299)
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`)
    }

    const data = await res.json()

        setFormData({
          namaPelanggan: data.namaPelanggan || '',
          jenisKelamin: data.jenisKelamin || 'laki-laki',
          noTelepon: data.noTelepon || '',
          email: data.email || '',
          tanggal: data.tanggal ? new Date(data.tanggal).toISOString().split('T')[0] : '',
          jamMulai: data.jamMulai || '',
          jamSelesai: data.jamSelesai || '',
          pax: Number(data.pax || 0),
          deposit: Number(data.dpNominal || data.deposit || 0),
          totalTagihan: Number(data.totalTagihan || 0),
          statusPembayaran: data.statusPembayaran || 'unpaid',
          metodePembayaran: data.metodePembayaran || 'tunai',
          meja: data.meja?.id || data.meja || '',
          status: data.status || 'menunggu',
          catatan: data.catatan || '',
          tableNumber: data.meja?.namaMeja || '?',
          floor: data.meja?.lantai || '-',
        })
      } catch (error) {
        console.error("Fetch Detail Error:", error)
        alert("Gagal memuat detail reservasi")
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [isOpen, reservationId])

  const handleSave = async () => {
    if (!reservationId) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/frontend/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pax: Number(formData.pax),
          deposit: Number(formData.deposit),
          totalTagihan: Number(formData.totalTagihan),
        }),
      })

      const resJson = await res.json()
      if (!res.ok) throw new Error(resJson.message || 'Gagal update reservasi')

      alert('Reservasi berhasil diperbarui!')
      onSuccess()
      onClose()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-all ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`} 
        onClick={onClose} 
      />

      {/* Slide Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-[101] shadow-2xl p-8 overflow-y-auto transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold">Edit Reservasi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">✕</button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
            <Loader2 className="animate-spin" size={32} />
            <p>Memuat detail reservasi...</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
            
            {/* INFO MEJA (Read Only) */}
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <p className="text-[10px] text-orange-600 uppercase font-bold tracking-wider">Meja Terpilih</p>
              <p className="text-lg font-bold text-orange-800">{formData.tableNumber} - {formData.floor.replace('_', ' ')}</p>
            </div>

            {/* DATA PELANGGAN */}
            <div className="space-y-4">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Detail Pelanggan</p>
              <input 
                required 
                placeholder="Nama Pelanggan" 
                type="text" 
                className="w-full border-b py-2 outline-none focus:border-teal-500" 
                value={formData.namaPelanggan} 
                onChange={e => setFormData({...formData, namaPelanggan: e.target.value})} 
              />
              <div className="flex flex-col gap-4">
                <select 
                  className="w-full border-b py-2 outline-none" 
                  value={formData.jenisKelamin} 
                  onChange={e => setFormData({...formData, jenisKelamin: e.target.value})}
                >
                  <option value="laki-laki">Laki-laki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
                <input 
                  required 
                  placeholder="No. Telepon" 
                  type="text" 
                  className="w-full border-b py-2 outline-none" 
                  value={formData.noTelepon} 
                  onChange={e => setFormData({...formData, noTelepon: e.target.value})} 
                />
              </div>
            </div>

            {/* WAKTU & PAX */}
            <div className="space-y-4">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Waktu & Pax</p>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="date" 
                  className="border rounded-lg p-2 text-sm" 
                  value={formData.tanggal} 
                  onChange={e => setFormData({...formData, tanggal: e.target.value})} 
                />
                <input 
                  type="number" 
                  placeholder="Pax" 
                  className="border rounded-lg p-2 text-sm" 
                  value={formData.pax || ''} 
                  onChange={e => setFormData({...formData, pax: e.target.value === '' ? 0 : parseInt(e.target.value)})} 
                />
                <input 
                  type="time" 
                  className="border rounded-lg p-2 text-sm" 
                  value={formData.jamMulai} 
                  onChange={e => setFormData({...formData, jamMulai: e.target.value})} 
                />
                <input 
                  type="time" 
                  className="border rounded-lg p-2 text-sm" 
                  value={formData.jamSelesai} 
                  onChange={e => setFormData({...formData, jamSelesai: e.target.value})} 
                />
              </div>
            </div>

            {/* BILLING */}
            <div className="space-y-4 pt-4 border-t">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Informasi Billing</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center"><Receipt size={16}/></div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block">Total Tagihan</label>
                    <input 
                      type="number" 
                      className="w-full font-bold outline-none text-black" 
                      value={formData.totalTagihan || ''} 
                      onChange={e => setFormData({...formData, totalTagihan: e.target.value === '' ? 0 : parseInt(e.target.value)})} 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center"><DollarSign size={16}/></div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block">Status Pembayaran</label>
                    <select 
                      className="w-full font-bold outline-none text-teal-600" 
                      value={formData.statusPembayaran} 
                      onChange={e => setFormData({...formData, statusPembayaran: e.target.value})}
                    >
                      <option value="unpaid">Belum Dibayar</option>
                      <option value="partial">DP (Uang Muka)</option>
                      <option value="paid">Lunas</option>
                    </select>
                  </div>
                </div>

                {formData.statusPembayaran !== 'unpaid' && (
                  <div className="pl-11 space-y-3 animate-in fade-in duration-300">
                    <div>
                      <label className="text-xs text-gray-500 block">Nominal Pembayaran / DP</label>
                      <input 
                        type="number" 
                        className="w-full border-b font-bold text-orange-600 outline-none" 
                        value={formData.deposit || ''} 
                        onChange={e => setFormData({...formData, deposit: e.target.value === '' ? 0 : parseInt(e.target.value)})} 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Metode Pembayaran</label>
                      <select 
                        className="w-full border-b font-bold outline-none" 
                        value={formData.metodePembayaran} 
                        onChange={e => setFormData({...formData, metodePembayaran: e.target.value})}
                      >
                        <option value="tunai">Tunai</option>
                        <option value="qris">QRIS</option>
                        <option value="ewallet">E-Wallet</option>
                        <option value="va">Virtual Account</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STATUS RESERVASI */}
            <div className="pt-4 border-t">
              <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Update Status Reservasi</label>
              <select 
                className="w-full border rounded-lg p-3 font-bold bg-gray-50 outline-none" 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="menunggu">Menunggu</option>
                <option value="dikonfirmasi">Dikonfirmasi</option>
                <option value="checkin">Checked In</option>
                <option value="selesai">Selesai</option>
                <option value="noshow">Tidak Datang</option>
              </select>
            </div>

            <button 
              disabled={isSubmitting} 
              type="submit" 
              className="w-full bg-[#3ABAB4] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2d9691] transition-all shadow-lg"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Update Reservasi'}
            </button>
          </form>
        )}
      </div>
    </>
  )
}