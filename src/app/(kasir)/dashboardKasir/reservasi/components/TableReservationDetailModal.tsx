import React from 'react'
import { X, Edit, CalendarPlus, Circle } from 'lucide-react'

// ==============================
// DEFINISI INTERFACE & UTILITY (Harus sama dengan ReservasiPage.tsx)
// ==============================

type StatusType = 'Menunggu' | 'Dikonfirmasi' | 'Checked In' | 'Selesai' | 'Tidak Datang' | 'Tersedia'

interface Reservation {
    id: string
    tableNumber: string
    pax: string
    date: string
    startTime: string
    endTime: string
    deposit: string
    status: StatusType
    customerName: string
    phone: string
    paymentMethod: string
    areaType: 'Indoor' | 'Outdoor' | 'Smoking' | 'VIP' 
    floor: string
}

const STATUS_LABELS: Record<StatusType, string> = {
    'Menunggu': 'Menunggu',
    'Dikonfirmasi': 'Dikonfirmasi',
    'Checked In': 'Sudah Check In',
    'Selesai': 'Selesai',
    'Tidak Datang': 'Tidak Hadir',
    'Tersedia': 'Tersedia'
}

interface TableReservationDetailModalProps {
    isOpen: boolean
    onClose: () => void // Hanya dipanggil saat tombol X diklik
    isChildModalOpen: boolean
    reservations: Reservation[]
    tableNumber: string
    floor: string
    areaType: string
    onEditClick: (reservation: Reservation) => void
    onAddReservationClick: () => void // Handler untuk chaining modal Tambah
}

// Fungsi untuk mendapatkan warna status
const getStatusColors = (status: StatusType) => {
    switch (status) {
        case 'Dikonfirmasi': return { border: 'ring-green-700', bg: 'bg-green-100', text: 'text-green-700' }
        case 'Menunggu': return { border: 'ring-amber-700', bg: 'bg-amber-100', text: 'text-amber-700' }
        case 'Checked In': return { border: 'ring-blue-700', bg: 'bg-blue-100', text: 'text-blue-700' }
        case 'Selesai': return { border: 'ring-indigo-700', bg: 'bg-indigo-100', text: 'text-indigo-700' }
        case 'Tidak Datang': return { border: 'ring-gray-700', bg: 'bg-gray-100', text: 'text-gray-700' }
        default: return { border: 'ring-gray-500', bg: 'bg-gray-200', text: 'text-gray-700' }
    }
}

// ==============================
// KOMPONEN UTAMA
// ==============================
export default function TableReservationDetailModal({
    isOpen,
    onClose,
    isChildModalOpen,
    reservations,
    tableNumber,
    floor,
    areaType,
    onEditClick,
    onAddReservationClick 
}: TableReservationDetailModalProps) {

    if (!isOpen) return null

    const today = (new Date()).toISOString().split('T')[0]
    
    // Filter dan urutkan reservasi aktif hari ini
    const activeReservations = reservations
        .filter(r => r.date === today && r.status !== 'Selesai' && r.status !== 'Tidak Datang')
        .sort((a, b) => a.startTime.localeCompare(b.startTime)) 

    // Handler saat item reservasi diklik (membuka modal edit)
    const handleEditClick = (res: Reservation) => {
        // HANYA panggil onEditClick, TIDAK panggil onClose()
        onEditClick(res) 
    }

    // Handler saat tombol "Tambah Reservasi" diklik
    const handleAddClick = () => {
        // HANYA panggil onAddReservationClick, TIDAK panggil onClose()
        onAddReservationClick() 
    }

    return (
        <>
            {/* 1. Overlay Backdrop (Z-30) */}
            {/* HAPUS onClick={onClose} dari sini agar modal detail tidak otomatis hilang saat modal baru muncul */}
            <div
                className={`fixed inset-0 bg-black/20 z-30 transition-all ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
            />

            {/* 2. Modal Content (Z-40) */}
            <div className={`fixed inset-0 flex items-center justify-center z-40 transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}>
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
                    
                    {/* HEADER MODAL DENGAN TOMBOL X (Batal) */}
                    <div className="p-6 border-b sticky top-0 bg-white rounded-t-3xl z-10">
                        <div className="flex justify-between items-center">
                            
                            {/* TOMBOL X (Batal) - **Ini satu-satunya cara menutup modal detail dari dalam** */}
                            <button
                                onClick={onClose} 
                                className="p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                                title="Tutup / Batal"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-xl font-bold text-center flex-1">
                                Jadwal Meja **{tableNumber}**
                            </h2>
                            
                            <div className="w-[32px]"></div> 
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-1">Area: {areaType} | Lantai: {floor}</p>
                    </div>

                    {/* BODY MODAL - List Reservasi */}
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Reservasi Aktif Hari Ini ({activeReservations.length})</h3>

                        {activeReservations.length > 0 ? (
                            activeReservations.map((res) => {
                                const colors = getStatusColors(res.status as StatusType)
                                return (
                                    <div 
                                        key={res.id} 
                                        className="flex justify-between items-center p-4 rounded-xl border-2 border-gray-200 hover:border-[#3ABAB4] transition duration-200 cursor-pointer shadow-sm"
                                        onClick={() => handleEditClick(res)} // Membuka Modal Edit
                                    >
                                        <div className="flex-1 min-w-0 flex items-center gap-3">
                                            <Circle size={10} className={`${colors.text}`} fill={colors.text} />
                                            <div className="min-w-0">
                                                <span className="font-semibold block truncate">{res.customerName}</span>
                                                <span className="text-xs text-gray-500">{res.pax} Pax | ID: {res.id}</span>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4 flex-shrink-0">
                                            <span className="font-medium text-lg block">{res.startTime} - {res.endTime}</span>
                                            <span className={`text-sm font-semibold ${colors.text} flex items-center gap-1 justify-end`}>
                                                {STATUS_LABELS[res.status]}
                                                <Edit size={14} className="ml-1 text-gray-500 hover:text-[#3ABAB4]" />
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-10 text-gray-500 italic bg-gray-50 rounded-lg border">
                                Meja ini tidak memiliki reservasi aktif hari ini.
                            </div>
                        )}
                    </div>

                    {/* FOOTER MODAL - Tombol Tambah Reservasi */}
                    <div className="p-6 border-t sticky bottom-0 bg-white rounded-b-3xl z-10">
                        <button
                            onClick={handleAddClick} // Membuka Modal Tambah
                            className="w-full px-4 py-3 rounded-xl bg-[#3ABAB4] text-white font-semibold hover:bg-[#32A9A4] transition flex items-center justify-center gap-2"
                        >
                            <CalendarPlus size={20} />
                            Tambah Reservasi Baru
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}