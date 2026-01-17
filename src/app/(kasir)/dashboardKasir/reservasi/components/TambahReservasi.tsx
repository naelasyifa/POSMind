'use client'

import React, { useState, useEffect } from 'react'
import { User, CreditCard, Loader2, DollarSign, Receipt } from 'lucide-react'

interface AddReservationProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    initialData: {
        tableId: string
        tableNumber: string
        areaType: string
        floor: string
    } | null
}

export default function TambahReservasi({ isOpen, onClose, onSuccess, initialData }: AddReservationProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    // --- TAMBAHAN: State untuk menampung daftar meja dari API ---
    const [allTables, setAllTables] = useState<any[]>([])

    const [formData, setFormData] = useState({
        namaPelanggan: '',
        jenisKelamin: 'laki-laki',
        noTelepon: '',
        email: '',
        tanggal: new Date().toISOString().split('T')[0],
        jamMulai: '12:00',
        jamSelesai: '14:00',
        pax: 1,
        deposit: 0,
        totalTagihan: 0,
        statusPembayaran: 'unpaid',
        metodePembayaran: 'tunai',
        meja: '', // ID Meja dari Payload
        status: 'menunggu',
        catatan: ''
    })

    // --- TAMBAHAN: Fetch data meja saat modal dibuka ---
    useEffect(() => {
        if (isOpen) {
            fetch('/api/tables?limit=100')
                .then(res => res.json())
                .then(json => setAllTables(json.docs || []))
                .catch(err => console.error("Gagal ambil meja:", err))
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            if (initialData?.tableId) {
                setFormData(prev => ({ ...prev, meja: initialData.tableId }))
            } else {
                setFormData(prev => ({ ...prev, meja: '' }))
            }
        }
    }, [isOpen, initialData])

    const handleSave = async () => {
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/frontend/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    pax: Number(formData.pax) || 0,
                    deposit: Number(formData.deposit) || 0,
                    totalTagihan: Number(formData.totalTagihan) || 0,
                }),
            })

            const resJson = await response.json()
            if (!response.ok) {
                throw new Error(resJson.message || resJson.errors?.[0]?.message || 'Gagal simpan')
            }

            alert('Reservasi Berhasil!')
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
            <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-all ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`} onClick={onClose} />
            
            <div className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-[101] shadow-2xl p-8 overflow-y-auto transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold">Tambah Reservasi</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">✕</button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                    
                    {/* INFO MEJA - DIUBAH AGAR BISA DROPDOWN JIKA BUKAN DARI LAYOUT */}
                    <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                        <p className="text-[10px] text-teal-600 uppercase font-bold tracking-wider">Meja Terpilih</p>
                        {initialData ? (
                            <p className="text-lg font-bold text-teal-800">{initialData.tableNumber} - {initialData.floor}</p>
                        ) : (
                            <select 
                                required
                                className="w-full bg-transparent text-lg font-bold text-teal-800 outline-none border-b border-teal-200"
                                value={formData.meja}
                                onChange={e => setFormData({...formData, meja: e.target.value})}
                            >
                                <option value="">Pilih Meja</option>
                                {allTables.map(table => (
                                    <option key={table.id} value={table.id}>
                                        {table.namaMeja} - {table.lantai}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* DATA PELANGGAN */}
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Detail Pelanggan</p>
                        <input required placeholder="Nama Pelanggan" type="text" className="w-full border-b py-2 outline-none focus:border-teal-500" value={formData.namaPelanggan} onChange={e => setFormData({...formData, namaPelanggan: e.target.value})} />
                        <div className="flex flex-col gap-4">
                            <select className="w-full border-b py-2 outline-none" value={formData.jenisKelamin} onChange={e => setFormData({...formData, jenisKelamin: e.target.value})}>
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </select>
                            <input required placeholder="No. Telepon" type="text" className="w-full border-b py-2 outline-none" value={formData.noTelepon} onChange={e => setFormData({...formData, noTelepon: e.target.value})} />
                        </div>
                    </div>

                    {/* WAKTU & PAX */}
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Waktu & Pax</p>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" className="border rounded-lg p-2 text-sm" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} />
                            <input type="number" placeholder="Pax" className="border rounded-lg p-2 text-sm" value={formData.pax === 0 ? '' : formData.pax} onChange={e => setFormData({...formData, pax: e.target.value === '' ? 0 : parseInt(e.target.value)})} />
                            <input type="time" className="border rounded-lg p-2 text-sm" value={formData.jamMulai} onChange={e => setFormData({...formData, jamMulai: e.target.value})} />
                            <input type="time" className="border rounded-lg p-2 text-sm" value={formData.jamSelesai} onChange={e => setFormData({...formData, jamSelesai: e.target.value})} />
                        </div>
                    </div>

                    {/* PEMBAYARAN & TAGIHAN */}
                    <div className="space-y-4 pt-4 border-t">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Informasi Billing</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center"><Receipt size={16}/></div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 block">Total Tagihan (Estimasi)</label>
                                    <input type="number" className="w-full font-bold outline-none text-black" value={formData.totalTagihan === 0 ? '' : formData.totalTagihan} onChange={e => setFormData({...formData, totalTagihan: e.target.value === '' ? 0 : parseInt(e.target.value)})} placeholder="0" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center"><DollarSign size={16}/></div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 block">Status Pembayaran</label>
                                    <select className="w-full font-bold outline-none text-teal-600" value={formData.statusPembayaran} onChange={e => setFormData({...formData, statusPembayaran: e.target.value})}>
                                        <option value="unpaid">Belum Dibayar</option>
                                        <option value="partial">DP (Uang Muka)</option>
                                        <option value="paid">Lunas</option>
                                    </select>
                                </div>
                            </div>
                            {formData.statusPembayaran !== 'unpaid' && (
                                <div className="pl-11 space-y-3 animate-in fade-in duration-300">
                                    <div>
                                        <label className="text-xs text-gray-500 block">Nominal DP / Bayar</label>
                                        <input type="number" className="w-full border-b font-bold text-orange-600 outline-none" value={formData.deposit === 0 ? '' : formData.deposit} onChange={e => setFormData({...formData, deposit: e.target.value === '' ? 0 : parseInt(e.target.value)})} placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block">Metode Pembayaran</label>
                                        <select className="w-full border-b font-bold outline-none" value={formData.metodePembayaran} onChange={e => setFormData({...formData, metodePembayaran: e.target.value})}>
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
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Status Reservasi</label>
                        <select className="w-full border rounded-lg p-3 font-bold bg-gray-50 outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option value="menunggu">Menunggu</option>
                            <option value="dikonfirmasi">Dikonfirmasi</option>
                            <option value="checkin">Checked In</option>
                        </select>
                    </div>

                    <button disabled={isSubmitting} type="submit" className="w-full py-4 rounded-2xl bg-[#3ABAB4] text-white font-bold hover:bg-[#2d9691] shadow-lg shadow-[#3ABAB4]/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Simpan Reservasi'}
                    </button>
                </form>
            </div>
        </>
    )
}