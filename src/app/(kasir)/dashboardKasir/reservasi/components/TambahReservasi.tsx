'use client'

import React, { useState, useEffect } from 'react'
import { User, CreditCard } from 'lucide-react'
import type { StatusType } from '@/types/reservation'

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
    INTERFACE
===============================================*/

export interface ReservationData {
    table: string
    pax: number
    date: string
    startTime: string
    endTime: string
    deposit: number
    status: StatusType
    gender: string
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
    // Tambahkan prop ini agar sinkron dengan denah meja
    initialTableData: { tableNumber: string; areaType: string; floor: string } | null
}

/* ============================================
    CONSTANTS
===============================================*/

const STATUS_LIST: StatusType[] = [
    'Menunggu',
    'Dikonfirmasi',
    'Checked In',
    'Selesai',
    'Tidak Datang',
    'Tersedia'
]

const initialFormData: ReservationData = {
    table: '',
    pax: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    deposit: 0,
    status: 'Dikonfirmasi',
    gender: 'Pria',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    paymentMethod: 'Tunai',
    areaType: 'Indoor',
    floor: 'Lantai 1',
}

/* ============================================
    COMPONENT
===============================================*/

export default function TambahReservasi({ isOpen, onClose, onSave, initialTableData }: AddReservationProps) {
    const [formData, setFormData] = useState<ReservationData>(initialFormData)

    // PERBAIKAN: Logika untuk menangkap data dari klik meja di denah
    useEffect(() => {
        if (isOpen) {
            if (initialTableData) {
                setFormData({
                    ...initialFormData,
                    table: initialTableData.tableNumber,
                    areaType: initialTableData.areaType,
                    floor: initialTableData.floor
                })
            } else {
                setFormData(initialFormData)
            }
        }
    }, [isOpen, initialTableData])

    const tables = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'Bar', 'S1', 'S2', 'O1', 'V1', 'R1']
    const genderList = ['Pria', 'Wanita']
    const paymentList = ['Tunai', 'QRIS', 'Debit', 'Kartu Kredit', 'Transfer']
    const areaTypeList = ['Indoor', 'Outdoor', 'Smoking', 'VIP', 'Rooftop']
    const floorList = ['Lantai 1', 'Lantai 2', 'Lantai 3', 'Rooftop']

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        let processed: string | number = value

        if (name === 'pax') processed = Math.max(1, parseInt(value) || 1)
        if (name === 'deposit') processed = parseFloat(value) || 0

        setFormData((prev) => ({ ...prev, [name]: processed }))
    }

    const handleSave = () => {
        if (!formData.table) return alert('Harap pilih Nomor Meja.')
        if (!formData.firstName) return alert('Harap isi Nama Depan.')
        if (!formData.phone) return alert('Harap isi No. Telepon.')

        if (formData.startTime >= formData.endTime)
            return alert('Jam selesai harus lebih lambat dari jam mulai.')

        onSave(formData)
    }

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all ${
                    isOpen ? 'opacity-100 visible z-[55]' : 'opacity-0 invisible z-[-1]'
                }`}
                onClick={onClose}
            />

            {/* Slide Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-[60] rounded-l-2xl p-8 overflow-y-auto transition-transform duration-500 ${
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

                {/* FORM */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSave()
                    }}
                >
                    {/* ================= DETAILS ================= */}
                    <p className="text-sm font-semibold mb-3">Detail Reservasi</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Table */}
                        <div>
                            <label className="text-sm mb-1 block">Nomor Meja</label>
                            <select className="w-full border rounded-lg px-3 py-2" name="table" value={formData.table} onChange={handleChange}>
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
                                type="number"
                                className="w-full border rounded-lg px-3 py-2"
                                name="pax"
                                value={formData.pax}
                                onChange={handleChange}
                                min={1}
                            />
                        </div>

                        {/* Area */}
                        <div>
                            <label className="text-sm mb-1 block">Tipe Area</label>
                            <select className="w-full border rounded-lg px-3 py-2" name="areaType" value={formData.areaType} onChange={handleChange}>
                                {areaTypeList.map((a) => (
                                    <option key={a}>{a}</option>
                                ))}
                            </select>
                        </div>

                        {/* Floor */}
                        <div>
                            <label className="text-sm mb-1 block">Lantai</label>
                            <select className="w-full border rounded-lg px-3 py-2" name="floor" value={formData.floor} onChange={handleChange}>
                                {floorList.map((f) => (
                                    <option key={f}>{f}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="text-sm mb-1 block">Tanggal Reservasi</label>
                            <input type="date" className="w-full border rounded-lg px-3 py-2" name="date" value={formData.date} onChange={handleChange} />
                        </div>

                        {/* Deposit */}
                        <div>
                            <label className="text-sm mb-1 block">Uang Muka (Rp)</label>
                            <input type="number" className="w-full border rounded-lg px-3 py-2" name="deposit" value={formData.deposit} onChange={handleChange} />
                        </div>

                        {/* Start */}
                        <div>
                            <label className="text-sm mb-1 block">Jam Mulai</label>
                            <input type="time" className="w-full border rounded-lg px-3 py-2" name="startTime" value={formData.startTime} onChange={handleChange} />
                        </div>

                        {/* End */}
                        <div>
                            <label className="text-sm mb-1 block">Jam Selesai</label>
                            <input type="time" className="w-full border rounded-lg px-3 py-2" name="endTime" value={formData.endTime} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mb-6">
                        <label className="text-sm mb-1 block">Status</label>
                        <select className="w-full border rounded-lg px-3 py-2" name="status" value={formData.status} onChange={handleChange}>
                            {STATUS_LIST.map((s) => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* ================= CUSTOMER ================= */}
                    <p className="text-sm font-semibold mb-3">Detail Customer</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Gender */}
                        <div className="col-span-2">
                            <label className="text-sm mb-1 block">Jenis Kelamin</label>
                            <select className="w-full border rounded-lg px-3 py-2" name="gender" value={formData.gender} onChange={handleChange}>
                                {genderList.map((g) => (
                                    <option key={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm mb-1 block">Nama Depan</label>
                            <input type="text" className="w-full border rounded-lg px-3 py-2" name="firstName" value={formData.firstName} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="text-sm mb-1 block">Nama Belakang</label>
                            <input type="text" className="w-full border rounded-lg px-3 py-2" name="lastName" value={formData.lastName} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="text-sm mb-1 block">No. Telepon</label>
                            <input type="text" className="w-full border rounded-lg px-3 py-2" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="text-sm mb-1 block">Email</label>
                            <input type="email" className="w-full border rounded-lg px-3 py-2" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                    </div>

                    {/* ================= Additional ================= */}
                    <div className="bg-white p-4 rounded-lg border shadow">
                        <h2 className="text-base font-semibold mb-4">Additional Information</h2>

                        <div className="flex items-center gap-3 mb-4">
                            <IconCustomer />
                            <span className="text-sm whitespace-nowrap">Customer Info</span>
                            <span className="ml-auto font-medium text-sm">Pelanggan Baru</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <IconPayment />
                            <span className="text-sm whitespace-nowrap">Metode Pembayaran</span>

                            <select className="ml-auto border rounded-lg px-3 py-2 text-sm w-44" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                                {paymentList.map((p) => (
                                    <option key={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ACTION */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">
                            Batal
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-[#3ABAB4] text-white font-medium">
                            Simpan Reservasi
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}