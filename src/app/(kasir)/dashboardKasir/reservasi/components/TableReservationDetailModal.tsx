'use client'

import React, { useState, useEffect } from 'react'
import { X, CalendarPlus, Loader2 } from 'lucide-react'

// ==============================
// DEFINISI INTERFACE & HELPERS
// ==============================
type StatusType = 'Menunggu' | 'Dikonfirmasi' | 'Checked In' | 'Selesai' | 'Tidak Datang' | 'Tersedia'

interface Reservation {
  id: string
  tableNumber: string
  pax: string
  date: string
  startTime: string
  endTime: string
  status: StatusType
  deposit: string
  customerName: string
  phone: string
  areaType: string 
  floor: string
  paymentMethod?: string
}

const STATUS_LABELS: Record<StatusType, string> = {
  'Menunggu': 'Menunggu',
  'Dikonfirmasi': 'Dikonfirmasi',
  'Checked In': 'Sudah Check In',
  'Selesai': 'Selesai',
  'Tidak Datang': 'Tidak Hadir',
  'Tersedia': 'Tersedia'
}

// Helper untuk mapping status dari database (lowercase) ke UI (Capitalize)
const mapStatusFromApi = (apiStatus: string): StatusType => {
  switch (apiStatus) {
    case 'menunggu': return 'Menunggu'
    case 'dikonfirmasi': return 'Dikonfirmasi'
    case 'checkin': return 'Checked In'
    case 'selesai': return 'Selesai'
    case 'noshow': return 'Tidak Datang'
    default: return 'Tersedia'
  }
}

interface Props {
  isOpen: boolean
  onClose: () => void
  tableId: string
  tableNumber: string 
  floor: string
  areaType: string
  onEditClick: (reservation: Reservation) => void
  onAddReservationClick: () => void
}

export default function TableReservationDetailModal({
  isOpen,
  onClose,
  tableNumber,
  tableId,
  floor,
  areaType,
  onEditClick,
  onAddReservationClick 
}: Props) {
  const [loading, setLoading] = useState(false)
  const [localReservations, setLocalReservations] = useState<Reservation[]>([])

  // 1. AMBIL DATA DARI API SETIAP MODAL DIBUKA
  useEffect(() => {
    if (isOpen && tableId) {
      const fetchDetailMeja = async () => {
        setLoading(true)
        const today = new Date().toISOString().split('T')[0]
        try {
          // Sesuaikan dengan route API kamu: /api/reservations
          // Menambahkan filter untuk tanggal hari ini dan nomor meja yang diklik
          const res = await fetch(`/api/frontend/reservations?tableId=${tableId}&tanggal=${today}`)
          const json = await res.json()
          
          if (json.success) {
            const mapped: Reservation[] = (json.data || []).map((r: any) => ({
              id: r.id,
              tableId: typeof r.meja === 'object' ? r.meja.id : r.meja,
              tableNumber: r.meja?.namaMeja || '?',
              pax: r.pax?.toString() || r.jumlahOrang?.toString() || '0', // Fallback jika nama field berbeda
              date: r.tanggal,
              startTime: r.jamMulai,
              endTime: r.jamSelesai,
              status: mapStatusFromApi(r.status),
              customerName: r.namaPelanggan,
              phone: r.noTelepon || r.nomorTelepon || '-',
              areaType: r.meja?.area || '',
              floor: r.meja?.lantai || '',
              deposit: r.deposit?.toString() || '0'
            }))

            // Urutkan berdasarkan jam mulai agar tampilan rapi
            setLocalReservations(mapped.sort((a, b) => a.startTime.localeCompare(b.startTime)))
          }
        } catch (err) {
          console.error("Gagal ambil detail reservasi:", err)
        } finally {
          setLoading(false)
        }
      }
      fetchDetailMeja()
    }
}, [isOpen, tableId])

  if (!isOpen) return null

  const getStatusColors = (status: StatusType) => {
    switch (status) {
      case 'Dikonfirmasi': return { bg: 'bg-green-100', text: 'text-green-700' }
      case 'Menunggu': return { bg: 'bg-amber-100', text: 'text-amber-700' }
      case 'Checked In': return { bg: 'bg-blue-100', text: 'text-blue-700' }
      case 'Selesai': return { bg: 'bg-indigo-100', text: 'text-indigo-700' }
      case 'Tidak Datang': return { bg: 'bg-red-100', text: 'text-red-700' }
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' }
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* HEADER */}
          <div className="p-6 border-b text-center relative">
            <button onClick={onClose} className="absolute left-6 top-6 p-2 rounded-full hover:bg-gray-100 text-gray-400">
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mt-1">Jadwal Meja <span className="text-[#3ABAB4]">{tableNumber}</span></h2>
            <p className="text-xs text-gray-400 font-medium uppercase mt-1 tracking-widest">
                {floor.replace('_', ' ')} • {areaType}
            </p>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-gray-50/50 min-h-[350px] max-h-[500px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#3ABAB4]">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p className="text-sm font-medium">Memuat data...</p>
              </div>
            ) : localReservations.length > 0 ? (
              localReservations.map((res) => (
                <div 
                  key={res.id} 
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#3ABAB4] transition-all cursor-pointer group"
                  onClick={() => onEditClick(res)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-current ${getStatusColors(res.status).text}`} />
                      <div>
                        <p className="font-bold text-gray-800">{res.customerName}</p>
                        <p className="text-xs text-gray-500">{res.pax} Pax • {res.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{res.startTime}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getStatusColors(res.status).bg} ${getStatusColors(res.status).text}`}>
                        {STATUS_LABELS[res.status]}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <CalendarPlus size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 text-sm italic">Belum ada reservasi hari ini.</p>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 bg-white border-t">
            <button
              onClick={onAddReservationClick}
              className="w-full py-4 rounded-2xl bg-[#3ABAB4] text-white font-bold hover:bg-[#2d9691] shadow-lg shadow-[#3ABAB4]/20 transition-all flex items-center justify-center gap-2 active:scale-95"
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