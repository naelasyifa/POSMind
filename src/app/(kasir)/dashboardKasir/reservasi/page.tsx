'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import { Edit, Trash2, CalendarPlus, Search, Loader2 } from 'lucide-react'
import TambahReservasi from './components/TambahReservasi'
import EditReservasi from './components/EditReservasi'
import HapusReservasi from './components/ReservasiCancelPopUp'
import TableReservationDetailModal from './components/TableReservationDetailModal'

// ==========================
// TYPES & CONSTANTS
// ==========================
export type StatusType = 'Menunggu' | 'Dikonfirmasi' | 'Checked In' | 'Selesai' | 'Tidak Datang' | 'Tersedia'

export interface Reservation {
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
  areaType: string 
  floor: string
}

export const STATUS_LABELS: Record<StatusType, string> = {
  'Menunggu': 'Menunggu',
  'Dikonfirmasi': 'Dikonfirmasi',
  'Checked In': 'Sudah Check In',
  'Selesai': 'Selesai',
  'Tidak Datang': 'Tidak Hadir',
  'Tersedia': 'Tersedia'
}

// ==========================
// HELPERS
// ==========================
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

const getStatusColors = (status: StatusType) => {
  switch (status) {
    case 'Dikonfirmasi': return { border: 'ring-green-700', bg: 'bg-green-300', text: 'text-green-700' }
    case 'Menunggu': return { border: 'ring-amber-700', bg: 'bg-amber-300', text: 'text-amber-700' }
    case 'Checked In': return { border: 'ring-blue-700', bg: 'bg-blue-300', text: 'text-blue-700' }
    case 'Selesai': return { border: 'ring-indigo-700', bg: 'bg-indigo-300', text: 'text-indigo-700' }
    case 'Tidak Datang': return { border: 'ring-gray-700', bg: 'bg-gray-300', text: 'text-gray-700' }
    case 'Tersedia': return { border: 'ring-gray-400', bg: 'bg-white', text: 'text-gray-600' }
    default: return { border: 'ring-gray-500', bg: 'bg-gray-200', text: 'text-gray-700' }
  }
}

// Logika untuk menentukan reservasi mana yang aktif "DETIK INI"
const getActiveReservationNow = (tableId: string, allReservations: Reservation[]) => {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  return allReservations.find(res => {
    if (res.tableNumber !== tableId) return false
    
    const [startH, startM] = res.startTime.split(':').map(Number)
    const [endH, endM] = res.endTime.split(':').map(Number)
    const startTotal = startH * 60 + startM
    const endTotal = endH * 60 + endM

    // Meja berwarna jika sekarang berada di rentang waktu booking (toleransi 15 menit sebelum)
    // atau jika statusnya sudah Checked In
    const isWithinTime = currentMinutes >= (startTotal - 15) && currentMinutes <= endTotal
    const isStillActive = res.status === 'Checked In' || res.status === 'Dikonfirmasi' || res.status === 'Menunggu'
    
    return isWithinTime && isStillActive
  })
}

// ==========================
// SUB-COMPONENTS
// ==========================
const TableItem = ({ table, reservation, handleTableClick, handleReservedTableClick }: any) => {
  const status: StatusType = reservation ? reservation.status : 'Tersedia'
  const colors = getStatusColors(status)
  const isReserved = status !== 'Tersedia'

  return (
    <div
      onClick={() => isReserved ? handleReservedTableClick(table.id, table.areaType, table.floor) : handleTableClick(table.id, table.areaType, table.floor)}
      className={`flex flex-col items-center justify-center p-3 cursor-pointer shadow-md transition-all duration-150 
        ${table.shape === "circle" ? "rounded-full" : "rounded-xl"} 
        ${colors.bg} ring-4 ${colors.border} text-gray-800 font-bold hover:scale-105 w-28 h-28`}
    >
      <div className="text-xl">{table.id}</div>
      <div className="text-[10px] font-normal mt-1 text-center leading-tight">
        {isReserved ? (
          <>
            <span className="block truncate font-bold w-20 mx-auto">{reservation.customerName}</span>
            <span className="block text-[9px] opacity-80">{reservation.startTime}</span>
          </>
        ) : (
          <span className="font-semibold uppercase text-[8px] text-gray-400">Tersedia</span>
        )}
      </div>
    </div>
  )
}

// ==========================
// MAIN PAGE
// ==========================
export default function ReservasiPage() {
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'layout'>('layout')
  const [rawTables, setRawTables] = useState<any[]>([])
  const [data, setData] = useState<Reservation[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedFloor, setSelectedFloor] = useState("")
  const [selectedArea, setSelectedArea] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [deletingReservation, setDeletingReservation] = useState<Reservation | null>(null)
  const [clickedTableData, setClickedTableData] = useState<any>(null)

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const fetchData = useCallback(async () => {
    try {
      const [resT, resR] = await Promise.all([
        fetch('/api/tables?limit=100'),
        fetch(`/api/reservations?where[tanggal][equals]=${today}&limit=100`)
      ])
      const tablesJson = await resT.json()
      const resJson = await resR.json()

      setRawTables(tablesJson.docs || [])
      
      const mapped: Reservation[] = (resJson.docs || []).map((r: any) => ({
        id: r.id,
        tableNumber: r.meja?.namaMeja || '?',
        pax: r.jumlahOrang?.toString(),
        date: r.tanggal,
        startTime: r.jamMulai,
        endTime: r.jamSelesai,
        deposit: r.dpNominal?.toString() || '0',
        status: mapStatusFromApi(r.status),
        customerName: r.namaPelanggan,
        phone: r.nomorTelepon,
        paymentMethod: r.metodePembayaran,
        areaType: r.meja?.area || 'indoor',
        floor: r.meja?.lantai || 'lantai_1'
      }))
      setData(mapped)

      if (tablesJson.docs?.length > 0 && !selectedFloor) {
        setSelectedFloor(tablesJson.docs[0].lantai)
        setSelectedArea(tablesJson.docs[0].area)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [today, selectedFloor])

  useEffect(() => { 
    fetchData()
    // Auto refresh status setiap 1 menit agar warna meja update otomatis
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [fetchData])

  const dynamicTableLayout = useMemo(() => {
    const layout: any = {}
    rawTables.forEach(t => {
      if (!layout[t.lantai]) layout[t.lantai] = {}
      if (!layout[t.lantai][t.area]) layout[t.lantai][t.area] = []
      layout[t.lantai][t.area].push({
        id: t.namaMeja,
        databaseId: t.id,
        shape: t.bentuk === 'bulat' ? 'circle' : 'square',
        kapasitas: t.kapasitas,
        areaType: t.area,
        floor: t.lantai
      })
    })
    return layout
  }, [rawTables])

  const handleTableClick = (tableNumber: string, areaType: string, floor: string) => {
    setClickedTableData({ tableNumber, areaType, floor })
    setIsAddModalOpen(true)
  }

  const handleReservedTableClick = (tableNumber: string, areaType: string, floor: string) => {
    setClickedTableData({ tableNumber, areaType, floor })
    setIsDetailModalOpen(true)
  }

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#52BFBE] text-white"><Loader2 className="animate-spin" /></div>

  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderKasir title="Manajemen Reservasi" />
        <div className="flex-1 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 min-h-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setViewMode('layout')} className={`px-6 py-2 rounded-lg font-bold ${viewMode === 'layout' ? 'bg-white shadow text-[#3ABAB4]' : 'text-gray-500'}`}>Layout</button>
                <button onClick={() => setViewMode('list')} className={`px-6 py-2 rounded-lg font-bold ${viewMode === 'list' ? 'bg-white shadow text-[#3ABAB4]' : 'text-gray-500'}`}>Daftar</button>
              </div>
              <button onClick={() => { setClickedTableData(null); setIsAddModalOpen(true) }} className="bg-[#3ABAB4] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><CalendarPlus size={20} /> Reservasi Baru</button>
            </div>

            {viewMode === 'layout' ? (
              <>
                <div className="flex gap-2 mb-4">
                  {Object.keys(dynamicTableLayout).map(f => (
                    <button key={f} onClick={() => { setSelectedFloor(f); setSelectedArea(Object.keys(dynamicTableLayout[f])[0]) }} className={`px-4 py-2 rounded-full border-2 capitalize font-bold ${selectedFloor === f ? 'bg-[#3ABAB4] text-white border-[#3ABAB4]' : 'bg-white text-gray-400'}`}>{f.replace('_', ' ')}</button>
                  ))}
                </div>
                <div className="flex gap-2 mb-8 border-b pb-4">
                  {selectedFloor && Object.keys(dynamicTableLayout[selectedFloor] || {}).map(a => (
                    <button key={a} onClick={() => setSelectedArea(a)} className={`px-4 py-2 rounded-lg capitalize font-medium ${selectedArea === a ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{a}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-8 border-2 border-dashed border-gray-100 rounded-3xl">
                  {dynamicTableLayout[selectedFloor]?.[selectedArea]?.map((table: any) => (
                    <TableItem 
                      key={table.databaseId} 
                      table={table} 
                      reservation={getActiveReservationNow(table.id, data)} 
                      handleTableClick={handleTableClick}
                      handleReservedTableClick={handleReservedTableClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* Table List View tetap sama seperti sebelumnya */
              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                      <tr>
                        <th className="p-4 text-left">Pelanggan</th>
                        <th className="p-4 text-center">Meja</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.filter(r => r.customerName.toLowerCase().includes(searchQuery.toLowerCase())).map(res => (
                        <tr key={res.id}>
                          <td className="p-4 font-bold">{res.customerName}</td>
                          <td className="p-4 text-center">{res.tableNumber}</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColors(res.status).bg} ${getStatusColors(res.status).text}`}>
                              {STATUS_LABELS[res.status]}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                             <button onClick={() => { setEditingReservation(res); setIsEditModalOpen(true) }} className="p-2 text-blue-600"><Edit size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}