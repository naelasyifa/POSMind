'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import { Edit, CalendarPlus, Search, Loader2, Calendar, Users, CheckCircle2, Clock } from 'lucide-react'
import TambahReservasi from './components/TambahReservasi'
import EditReservasi from './components/EditReservasi'
import TableReservationDetailModal from './components/TableReservationDetailModal'

// ==========================
// TYPES & CONSTANTS
// ==========================
export type StatusType = 'Menunggu' | 'Dikonfirmasi' | 'Checked In' | 'Selesai' | 'Tidak Datang' | 'Tersedia'

export interface Reservation {
  id: string
  tableId: string // Tambahkan ini untuk pencarian ID Database
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
  switch (apiStatus?.toLowerCase()) {
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
    case 'Tidak Datang': return { border: 'ring-red-700', bg: 'bg-red-300', text: 'text-red-700' }
    case 'Tersedia': return { border: 'ring-gray-400', bg: 'bg-white', text: 'text-gray-600' }
    default: return { border: 'ring-gray-500', bg: 'bg-gray-200', text: 'text-gray-700' }
  }
}

// PERBAIKAN: Gunakan tableDatabaseId dan tambahkan null check
const getActiveReservationNow = (tableDatabaseId: string, allReservations: Reservation[] = []) => {
  if (!allReservations || !Array.isArray(allReservations)) return null;
  
  return allReservations.find(res => {
    // Membandingkan ID Database unik agar lebih akurat daripada sekedar Nama Meja
    return res.tableId === tableDatabaseId && (
      res.status === 'Menunggu' ||
      res.status === 'Dikonfirmasi' ||
      res.status === 'Checked In'
    )
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
      onClick={() =>
        isReserved
          ? handleReservedTableClick(table.databaseId, table.id, table.areaType, table.floor)
          : handleTableClick(table.databaseId, table.id, table.areaType, table.floor)
      }
      className={`flex flex-col items-center justify-center p-3 cursor-pointer shadow-md transition-all duration-150 
        ${table.shape === "circle" ? "rounded-full" : "rounded-xl"} 
        ${colors.bg} ring-4 ${colors.border} text-gray-800 font-bold hover:scale-105 w-28 h-28 relative overflow-hidden`}
    >
      <div className="text-xl z-10">{table.id}</div>
      <div className="text-[10px] font-normal mt-1 text-center leading-tight z-10">
        {isReserved ? (
          <>
            <span className="block truncate font-bold w-20 mx-auto uppercase">{reservation.customerName}</span>
            <span className="block text-[9px] opacity-80">{reservation.startTime}</span>
          </>
        ) : (
          <span className="font-semibold uppercase text-[8px] text-gray-400 tracking-wider">Tersedia</span>
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

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const isToday = selectedDate === new Date().toISOString().split('T')[0]

  const [selectedFloor, setSelectedFloor] = useState("")
  const [selectedArea, setSelectedArea] = useState("")
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [clickedTableData, setClickedTableData] = useState<any>(null)

  const stats = useMemo(() => ({
    total: data.length,
    confirmed: data.filter(r => r.status === 'Dikonfirmasi').length,
    checkedIn: data.filter(r => r.status === 'Checked In').length
  }), [data])

  const fetchData = useCallback(async () => {
    try {
      const [resT, resR] = await Promise.all([
        fetch('/api/tables?limit=100'),
        fetch(`/api/reservations?where[tanggal][equals]=${selectedDate}&limit=100`)
      ])
      const tablesJson = await resT.json()
      const resJson = await resR.json()

      setRawTables(tablesJson.docs || [])
      
      const mapped: Reservation[] = (resJson.data || resJson.docs || []).map((r: any) => ({
        id: r.id,
        // PERBAIKAN: Simpan ID Database Meja di sini
        tableId: typeof r.meja === 'object' ? r.meja.id : r.meja, 
        tableNumber: r.meja?.namaMeja || '?',
        pax: r.pax?.toString() || r.jumlahOrang?.toString() || '0',
        date: r.tanggal,
        startTime: r.jamMulai,
        endTime: r.jamSelesai,
        deposit: r.dpNominal?.toString() || r.deposit?.toString() || '0',
        status: mapStatusFromApi(r.status),
        customerName: r.namaPelanggan,
        phone: r.noTelepon || r.nomorTelepon || '-',
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
      console.error("Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }, [selectedDate, selectedFloor])

  useEffect(() => { 
    fetchData()
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

  const handleTableClick = (tableId: string, tableNumber: string, areaType: string, floor: string) => {
    setClickedTableData({ tableId, tableNumber, areaType, floor })
    setIsAddModalOpen(true)
  }

  const handleReservedTableClick = (tableId: string, tableNumber: string, areaType: string, floor: string) => {
    setClickedTableData({ tableId, tableNumber, areaType, floor })
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
            
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
                  <button onClick={() => setViewMode('layout')} className={`px-6 py-2 rounded-lg font-bold transition-all ${viewMode === 'layout' ? 'bg-white shadow text-[#3ABAB4]' : 'text-gray-500'}`}>Layout</button>
                  <button onClick={() => setViewMode('list')} className={`px-6 py-2 rounded-lg font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow text-[#3ABAB4]' : 'text-gray-500'}`}>Daftar</button>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#3ABAB4] transition-all">
                  <Calendar className="text-gray-400" size={18} />
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="font-bold text-gray-700 outline-none bg-transparent cursor-pointer" />
                  {isToday && <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">HARI INI</span>}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-4 text-sm border-r pr-6 border-gray-100">
                  <div className="flex items-center gap-1 text-gray-500"><Users size={16}/> <b className="text-gray-800">{stats.total}</b> Tamu</div>
                  <div className="flex items-center gap-1 text-gray-500"><CheckCircle2 size={16} className="text-green-500"/> <b className="text-gray-800">{stats.confirmed}</b> OK</div>
                  <div className="flex items-center gap-1 text-gray-500"><Clock size={16} className="text-blue-500"/> <b className="text-gray-800">{stats.checkedIn}</b> In</div>
                </div>
                <button onClick={() => { setClickedTableData(null); setIsAddModalOpen(true) }} className="bg-[#3ABAB4] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#2d9691] shadow-lg shadow-[#3abab4]/30 active:scale-95 transition-all">
                  <CalendarPlus size={20} /> Reservasi Baru
                </button>
              </div>
            </div>

            {viewMode === 'layout' ? (
              <>
                <div className="flex gap-2 mb-4">
                  {Object.keys(dynamicTableLayout).map(f => (
                    <button key={f} onClick={() => { setSelectedFloor(f); setSelectedArea(Object.keys(dynamicTableLayout[f])[0]) }} className={`px-4 py-2 rounded-full border-2 capitalize font-bold transition-all ${selectedFloor === f ? 'bg-[#3ABAB4] text-white border-[#3ABAB4]' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}>
                      {f.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mb-8 border-b pb-4 overflow-x-auto no-scrollbar">
                  {selectedFloor && Object.keys(dynamicTableLayout[selectedFloor] || {}).map(a => (
                    <button key={a} onClick={() => setSelectedArea(a)} className={`px-4 py-2 rounded-lg capitalize font-bold text-sm transition-all ${selectedArea === a ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {a}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-8 border-2 border-dashed border-gray-100 rounded-3xl min-h-[400px] bg-gray-50/30">
                  {dynamicTableLayout[selectedFloor]?.[selectedArea]?.map((table: any) => (
                    <TableItem 
                      key={table.databaseId} 
                      table={table} 
                      // PERBAIKAN: Gunakan table.databaseId sebagai pencari
                      reservation={getActiveReservationNow(table.databaseId, data)} 
                      handleTableClick={handleTableClick}
                      handleReservedTableClick={handleReservedTableClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="overflow-x-auto">
                {/* Tabel Daftar Reservasi */}
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
                    <tr>
                      <th className="p-4 text-left font-bold">Pelanggan</th>
                      <th className="p-4 text-center font-bold">Meja</th>
                      <th className="p-4 text-center font-bold">Jam</th>
                      <th className="p-4 text-center font-bold">Status</th>
                      <th className="p-4 text-right font-bold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-b">
                    {data.filter(r => r.customerName.toLowerCase().includes(searchQuery.toLowerCase())).map(res => (
                      <tr key={res.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="p-4">
                          <p className="font-bold text-gray-800 group-hover:text-[#3ABAB4] transition-colors">{res.customerName}</p>
                          <p className="text-xs text-gray-400 font-medium">{res.phone}</p>
                        </td>
                        <td className="p-4 text-center"><span className="bg-gray-100 px-3 py-1 rounded-lg font-bold text-gray-700">{res.tableNumber}</span></td>
                        <td className="p-4 text-center text-sm font-semibold text-gray-600">{res.startTime} - {res.endTime}</td>
                        <td className="p-4 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black shadow-sm ${getStatusColors(res.status).bg} ${getStatusColors(res.status).text}`}>
                            {STATUS_LABELS[res.status]}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => { setEditingReservation(res); setIsEditModalOpen(true) }} className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-xl transition-all">
                            <Edit size={18} />
                          </button>
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

      {/* MODALS */}
      {clickedTableData && (
        <TableReservationDetailModal 
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          tableId={clickedTableData.tableId}
          tableNumber={clickedTableData.tableNumber}
          floor={clickedTableData.floor}
          areaType={clickedTableData.areaType}
          onEditClick={(res) => { 
            setIsDetailModalOpen(false); 
            // Berikan casting 'as any' atau 'as Reservation' untuk membungkam error TS
            setEditingReservation(res as any); 
            setIsEditModalOpen(true); 
          }}
          onAddReservationClick={() => { 
            setIsDetailModalOpen(false); 
            setIsAddModalOpen(true); 
          }}
        />
      )}

      <TambahReservasi 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setClickedTableData(null); }} 
        initialData={clickedTableData}
        onSuccess={fetchData}
      />

      {editingReservation && (
        <EditReservasi
          isOpen={isEditModalOpen}
          reservationId={editingReservation.id}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}