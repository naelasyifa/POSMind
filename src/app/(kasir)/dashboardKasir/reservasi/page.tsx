'use client'

import { useState, useMemo, useEffect } from 'react'
import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import { Edit, Trash2, CalendarPlus, Search } from 'lucide-react'
import TambahReservasi from './components/TambahReservasi'
import EditReservasi from './components/EditReservasi'
import HapusReservasi from './components/ReservasiCancelPopUp'
import TableReservationDetailModal from './components/TableReservationDetailModal'

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
  areaType: 'Indoor' | 'Outdoor' | 'Smoking' | 'VIP' 
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

export const tableLayout: any = {
  "Lantai 1": {
    Indoor: [
      { id: "A1", shape: "square" }, { id: "A2", shape: "square" }, { id: "A3", shape: "square" },
      { id: "A4", shape: "square" }, { id: "A5", shape: "square" }, { id: "A6", shape: "square" },
      { id: "B1", shape: "circle" }, { id: "B2", shape: "circle" }, { id: "B3", shape: "circle" },
      { id: "B4", shape: "circle" }, { id: "B5", shape: "circle" }
    ],
    Outdoor: [
      { id: "O1", shape: "square" }, { id: "O2", shape: "square" }, { id: "O3", shape: "square" },
      { id: "O4", shape: "circle" }, { id: "O5", shape: "circle" }
    ],
    Smoking: [
      { id: "S1", shape: "circle" }, { id: "S2", shape: "square" },
      { id: "S3", shape: "circle" }, { id: "S4", shape: "square" }
    ],
    VIP: []
  },
  "Lantai 2": {
    Indoor: [
      { id: "I2A1", shape: "square" }, { id: "I2A2", shape: "circle" }, { id: "I2A3", shape: "square" },
      { id: "I2B1", shape: "square" }, { id: "I2B2", shape: "circle" }, { id: "I2B3", shape: "square" }
    ],
    Outdoor: [
      { id: "O2A", shape: "square" }, { id: "O2B", shape: "square" }, { id: "O2C", shape: "circle" },
      { id: "O2D", shape: "circle" }, { id: "O2E", shape: "square" }
    ],
    Smoking: [
      { id: "S2A", shape: "circle" }, { id: "S2B", shape: "square" },
      { id: "S2C", shape: "circle" }, { id: "S2D", shape: "square" }
    ],
    VIP: [
      { id: "V2A", shape: "circle" }, { id: "V2B", shape: "square" },
      { id: "V2C", shape: "circle" }, { id: "V2D", shape: "square" }
    ]
  },
  "Lantai 3": {
    Indoor: [
      { id: "I3A", shape: "circle" }, { id: "I3B", shape: "square" }, { id: "I3C", shape: "square" },
      { id: "I3D", shape: "circle" }, { id: "I3E", shape: "square" }, { id: "I3F", shape: "square" }
    ],
    Outdoor: [
      { id: "O3A", shape: "square" }, { id: "O3B", shape: "square" }, { id: "O3C", shape: "circle" },
      { id: "O3D", shape: "circle" }, { id: "O3E", shape: "square" }
    ],
    Smoking: [
      { id: "S3A", shape: "square" }, { id: "S3B", shape: "circle" },
      { id: "S3C", shape: "square" }, { id: "S3D", shape: "circle" }
    ],
    VIP: [
      { id: "V3A", shape: "circle" }, { id: "V3B", shape: "square" }, { id: "V3C", shape: "circle" },
      { id: "V3D", shape: "square" }
    ]
  },
  "Rooftop": {
    Indoor: [],
    Outdoor: [
      { id: "RTA1", shape: "square" }, { id: "RTA2", shape: "square" }, { id: "RTB1", shape: "circle" },
      { id: "RTB2", shape: "circle" }, { id: "RTC1", shape: "square" }, { id: "RTC2", shape: "square" }
    ],
    Smoking: [
      { id: "RTSM1", shape: "circle" }, { id: "RTSM2", shape: "square" }
    ],
    VIP: [
      { id: "RTV1", shape: "square" }, { id: "RTV2", shape: "square" },
      { id: "RTV3", shape: "circle" }
    ]
  }
}

export const floors = Object.keys(tableLayout)

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

const LegendStatus = () => {
  const statuses: { status: StatusType; label: string }[] = Object.entries(STATUS_LABELS).map(([key, value]) => ({
    status: key as StatusType,
    label: value
  }))

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-4 p-3 border rounded-lg bg-gray-50">
      <span className="font-semibold text-gray-700 mr-2">Keterangan Status:</span>
      {statuses.map((s) => {
        const colors = getStatusColors(s.status)
        let statusClass = colors.bg.replace('bg-', 'bg-')

        if (s.status === 'Tersedia') {
          statusClass += ' border border-gray-400'
        }

        return (
          <div key={s.status} className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${statusClass}`}></span>
            <span className={colors.text}>{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}

interface TableItemProps {
  table: { id: string, shape: string, areaType: Reservation['areaType'], floor: string }
  reservation: Reservation | undefined
  handleEditClick: (reservation: Reservation) => void
  handleTableClick: (tableId: string, areaType: Reservation['areaType'], floor: string) => void
  handleReservedTableClick: (tableId: string, areaType: Reservation['areaType'], floor: string) => void
}

const TableItem = ({ table, reservation, handleEditClick, handleTableClick, handleReservedTableClick }: TableItemProps) => {
  const status: StatusType = reservation ? reservation.status : 'Tersedia'
  const colors = getStatusColors(status)
  const isReserved = status !== 'Tersedia'

  const handleClick = () => {
    if (isReserved) {
      handleReservedTableClick(table.id, table.areaType, table.floor)
    } else {
      handleTableClick(table.id, table.areaType, table.floor)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center p-3 cursor-pointer shadow-md transition-transform duration-150 ease-in-out transform
        ${table.shape === "circle" ? "rounded-full aspect-square w-26 h-26" : "rounded-xl w-26 h-26"}
        ${colors.bg}
        ring-4 ${colors.border}
        text-gray-800 font-bold
        ${isReserved ? 'hover:scale-[1.05] ring-offset-2' : 'hover:scale-[1.05]'}
      `}
      title={isReserved ? `Reservasi oleh ${reservation!.customerName} (${STATUS_LABELS[status]})` : `Meja ${table.id} Tersedia`}
    >
      <div className="text-xl">{table.id}</div>
      <div className="text-xs font-normal mt-1 text-center">
        {isReserved ? (
          <>
            <span className="block truncate font-semibold">{reservation!.customerName}</span>
            <span className="block text-sm">{reservation!.startTime}</span>
            <span className={`block text-xs font-medium ${colors.text}`}>({STATUS_LABELS[status]})</span>
          </>
        ) : (
          <span className={`font-semibold ${colors.text}`}>{STATUS_LABELS[status]}</span>
        )}
      </div>
    </div>
  )
}

export default function ReservasiPage() {
  const [viewMode, setViewMode] = useState<'list' | 'layout'>('layout')
  const [selectedFloor, setSelectedFloor] = useState("Lantai 1")
  const [selectedArea, setSelectedArea] = useState<Reservation['areaType']>("Indoor")

  const today = (new Date()).toISOString().split('T')[0]

  const [data, setData] = useState<Reservation[]>([
    { id: 'R001', tableNumber: 'A1', pax: '4', date: today, startTime: '19:00', endTime: '20:30', deposit: '50000', status: 'Dikonfirmasi', customerName: 'Budi Santoso', phone: '081xxx', paymentMethod: 'QRIS', areaType: 'Indoor', floor: 'Lantai 1' },
    { id: 'R001a', tableNumber: 'A1', pax: '2', date: today, startTime: '21:00', endTime: '22:00', deposit: '30000', status: 'Menunggu', customerName: 'Agus Budi', phone: '081xxx', paymentMethod: 'Transfer', areaType: 'Indoor', floor: 'Lantai 1' },
    { id: 'R005', tableNumber: 'A3', pax: '2', date: today, startTime: '12:00', endTime: '13:00', deposit: '0', status: 'Checked In', customerName: 'Dina Permata', phone: '081xxx', paymentMethod: 'Tunai', areaType: 'Indoor', floor: 'Lantai 1' },
    { id: 'R007', tableNumber: 'A5', pax: '3', date: today, startTime: '21:00', endTime: '22:00', deposit: '20000', status: 'Menunggu', customerName: 'Gita Rani', phone: '081xxx', paymentMethod: 'QRIS', areaType: 'Indoor', floor: 'Lantai 1' },
    { id: 'R028', tableNumber: 'B2', pax: '5', date: today, startTime: '17:00', endTime: '18:00', deposit: '50000', status: 'Dikonfirmasi', customerName: 'Indah Sari', phone: '081xxx', paymentMethod: 'Transfer', areaType: 'Indoor', floor: 'Lantai 1' },
    { id: 'R008', tableNumber: 'O1', pax: '8', date: today, startTime: '11:00', endTime: '12:00', deposit: '50000', status: 'Selesai', customerName: 'Hendra Jaya', phone: '081xxx', paymentMethod: 'Kartu Kredit', areaType: 'Outdoor', floor: 'Lantai 1' },
    { id: 'R029', tableNumber: 'O4', pax: '2', date: today, startTime: '19:00', endTime: '20:00', deposit: '20000', status: 'Menunggu', customerName: 'Joko R', phone: '081xxx', paymentMethod: 'QRIS', areaType: 'Outdoor', floor: 'Lantai 1' },
    { id: 'R009', tableNumber: 'S1', pax: '2', date: today, startTime: '15:00', endTime: '16:00', deposit: '0', status: 'Dikonfirmasi', customerName: 'Irma Sari', phone: '081xxx', paymentMethod: 'Tunai', areaType: 'Smoking', floor: 'Lantai 1' },
    { id: 'R011', tableNumber: 'I2A2', pax: '5', date: today, startTime: '18:30', endTime: '20:00', deposit: '50000', status: 'Menunggu', customerName: 'Lisa Indah', phone: '081xxx', paymentMethod: 'Transfer', areaType: 'Indoor', floor: 'Lantai 2' },
    { id: 'R019', tableNumber: 'I2B1', pax: '3', date: today, startTime: '14:00', endTime: '15:00', deposit: '0', status: 'Checked In', customerName: 'Rian Hidayat', phone: '081xxx', paymentMethod: 'Tunai', areaType: 'Indoor', floor: 'Lantai 2' },
    { id: 'R002', tableNumber: 'O2A', pax: '2', date: today, startTime: '10:00', endTime: '11:00', deposit: '0', status: 'Checked In', customerName: 'Siti Aminah', phone: '081xxx', paymentMethod: 'Tunai', areaType: 'Outdoor', floor: 'Lantai 2' },
    { id: 'R020', tableNumber: 'O2C', pax: '7', date: today, startTime: '20:30', endTime: '22:00', deposit: '150000', status: 'Dikonfirmasi', customerName: 'Zaki Akbar', phone: '081xxx', paymentMethod: 'Transfer', areaType: 'Outdoor', floor: 'Lantai 2' },
    { id: 'R012', tableNumber: 'S2A', pax: '3', date: today, startTime: '20:00', endTime: '21:00', deposit: '20000', status: 'Dikonfirmasi', customerName: 'Maria Ulfah', phone: '081xxx', paymentMethod: 'Tunai', areaType: 'Smoking', floor: 'Lantai 2' },
    { id: 'R013', tableNumber: 'V2A', pax: '6', date: today, startTime: '22:00', endTime: '23:30', deposit: '150000', status: 'Menunggu', customerName: 'Naufal Rizki', phone: '081xxx', paymentMethod: 'Kartu Kredit', areaType: 'VIP', floor: 'Lantai 2' },
    { id: 'R003', tableNumber: 'V3A', pax: '6', date: today, startTime: '13:00', endTime: '14:00', deposit: '100000', status: 'Menunggu', customerName: 'Joko Widodo', phone: '085xxx', paymentMethod: 'Kartu Kredit', areaType: 'VIP', floor: 'Lantai 3' },
    { id: 'R033', tableNumber: 'V3C', pax: '4', date: today, startTime: '19:00', endTime: '20:00', deposit: '50000', status: 'Checked In', customerName: 'Qila Z', phone: '085xxx', paymentMethod: 'QRIS', areaType: 'VIP', floor: 'Lantai 3' },
    { id: 'R015', tableNumber: 'I3B', pax: '4', date: today, startTime: '17:00', endTime: '18:00', deposit: '50000', status: 'Dikonfirmasi', customerName: 'Rudi Hartono', phone: '085xxx', paymentMethod: 'QRIS', areaType: 'Indoor', floor: 'Lantai 3' },
    { id: 'R024', tableNumber: 'O3A', pax: '5', date: today, startTime: '11:00', endTime: '12:30', deposit: '50000', status: 'Dikonfirmasi', customerName: 'Mega Sari', phone: '085xxx', paymentMethod: 'QRIS', areaType: 'Outdoor', floor: 'Lantai 3' },
    { id: 'R016', tableNumber: 'S3A', pax: '2', date: today, startTime: '16:00', endTime: '17:00', deposit: '0', status: 'Checked In', customerName: 'Sinta Dewi', phone: '085xxx', paymentMethod: 'Tunai', areaType: 'Smoking', floor: 'Lantai 3' },
    { id: 'R017', tableNumber: 'RTA1', pax: '8', date: today, startTime: '18:00', endTime: '19:30', deposit: '100000', status: 'Dikonfirmasi', customerName: 'Taufik Hidayat', phone: '087xxx', paymentMethod: 'QRIS', areaType: 'Outdoor', floor: 'Rooftop' },
    { id: 'R004', tableNumber: 'RTSM1', pax: '10', date: today, startTime: '21:00', endTime: '23:00', deposit: '200000', status: 'Dikonfirmasi', customerName: 'Rina Dewi', phone: '087xxx', paymentMethod: 'Transfer', areaType: 'Smoking', floor: 'Rooftop' },
    { id: 'R018', tableNumber: 'RTV1', pax: '4', date: today, startTime: '12:30', endTime: '13:30', deposit: '50000', status: 'Checked In', customerName: 'Umar Bakri', phone: '087xxx', paymentMethod: 'Kartu Kredit', areaType: 'VIP', floor: 'Rooftop' }
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [deletingReservation, setDeletingReservation] = useState<Reservation | null>(null)
  const [clickedTableData, setClickedTableData] = useState<{ tableNumber: string, areaType: Reservation['areaType'], floor: string } | null>(null)

  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false)
  // Definisikan 'isChildModalOpen' dengan tipe yang eksplisit (boolean)
  const isChildModalOpen: boolean = isAddModalOpen || isEditModalOpen || isDeleteModalOpen;

  useEffect(() => {
    setIsAnyModalOpen(isAddModalOpen || isEditModalOpen || isDetailModalOpen || isDeleteModalOpen)
  }, [isAddModalOpen, isEditModalOpen, isDetailModalOpen, isDeleteModalOpen])

  const getAllReservationsForTable = useMemo(() => (tableId: string): Reservation[] => {
    return data.filter(r => r.tableNumber === tableId && r.date === today && r.status !== 'Selesai' && r.status !== 'Tidak Datang')
  }, [data, today])

  const getReservationDetails = useMemo(() => (tableId: string): Reservation | undefined => {
    const activeReservations = getAllReservationsForTable(tableId)
    return activeReservations.sort((a, b) => a.startTime.localeCompare(b.startTime))[0]
  }, [getAllReservationsForTable])

  const handleTableClick = (tableNumber: string, areaType: Reservation['areaType'], floor: string) => {
    setClickedTableData({ tableNumber, areaType, floor })
    setIsAddModalOpen(true)
  }

  const handleReservedTableClick = (tableNumber: string, areaType: Reservation['areaType'], floor: string) => {
    setClickedTableData({ tableNumber, areaType, floor })
    setIsDetailModalOpen(true)
  }

  const handleAddReservationClick = () => {
    setIsAddModalOpen(true)
  }

  const handleEditClick = (reservation: Reservation) => {
    setEditingReservation(reservation)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteModal = (reservation: Reservation) => {
    setDeletingReservation(reservation)
    setIsEditModalOpen(false)
    setIsDetailModalOpen(false)
    setIsDeleteModalOpen(true)
  }

  // Perbaikan: Ubah tipe parameter menjadi 'string' agar sesuai dengan 'reservationId'
  const handleConfirmDelete = (reservationId: string) => {
    setData(prev => prev.filter(res => res.id !== reservationId))
    setIsDeleteModalOpen(false)
    setDeletingReservation(null)

    if (!isDetailModalOpen) {
      setClickedTableData(null)
    }
  }

  const handleAddReservation = (newReservationData: any) => {
// ... (handleAddReservation tetap)
    const newStatus: StatusType = newReservationData.status || 'Menunggu'
    const newReservation: Reservation = {
      id: `R${(data.length + 1).toString().padStart(3, '0')}`,
      tableNumber: newReservationData.tableNumber,
      pax: newReservationData.pax,
      date: newReservationData.date,
      startTime: newReservationData.startTime,
      endTime: newReservationData.endTime,
      deposit: newReservationData.deposit,
      status: newStatus,
      customerName: newReservationData.customerName || `${newReservationData.firstName} ${newReservationData.lastName}`,
      phone: newReservationData.phone,
      paymentMethod: newReservationData.paymentMethod,
      areaType: newReservationData.areaType as Reservation['areaType'],
      floor: newReservationData.floor
    }
    setData(prev => [...prev, newReservation])
    setIsAddModalOpen(false)
  }

  // Perbaikan: Ubah tipe parameter menjadi 'Reservation'
  const handleUpdateReservation = (updatedData: Reservation) => {
    setData(prev => prev.map((r) => (r.id === updatedData.id ? updatedData : r)))
    setIsEditModalOpen(false)
    setEditingReservation(null)
  }

  const handleAddHeaderClick = () => {
    setClickedTableData(null)
    setIsAddModalOpen(true)
  }

  const areasForSelectedFloor = useMemo(() => {
// ... (areasForSelectedFloor tetap)
    return Object.keys(tableLayout[selectedFloor]).filter(area => tableLayout[selectedFloor][area]?.length > 0)
  }, [selectedFloor])

  useEffect(() => {
// ... (useEffect tetap)
    if (!areasForSelectedFloor.includes(selectedArea) && areasForSelectedFloor.length > 0) {
      setSelectedArea(areasForSelectedFloor[0] as Reservation['areaType'])
    } else if (areasForSelectedFloor.length === 0) {
      setSelectedArea("Indoor")
    }
  }, [selectedFloor, areasForSelectedFloor, selectedArea])

  const columns = ['ID Reservasi', 'Pelanggan', 'Meja Area', 'Pax/Tanggal', 'Waktu', 'Status', 'Deposit', 'Aksi']

  return (
    <div className="flex min-h-screen bg-[#52BFBE] relative overflow-hidden">
      <Sidebar />

      <div
        className={`flex-1 flex flex-col transition-filter duration-300`}
        style={{
          marginLeft: '7rem',
          filter: isAnyModalOpen ? 'blur(3px)' : 'none',
          pointerEvents: isAnyModalOpen ? 'none' : 'auto'
        }}
      >
        <HeaderKasir title="Reservasi" />

        <div className="flex-1 p-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold">Reservasi</h2>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('layout')}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition
                    ${viewMode === 'layout' ? 'bg-[#3ABAB4]' : 'bg-gray-400 hover:bg-gray-500'}
                  `}
                >
                  Layout
                </button>

                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition
                    ${viewMode === 'list' ? 'bg-[#3ABAB4]' : 'bg-gray-400 hover:bg-gray-500'}
                  `}
                >
                  List
                </button>

                <button
                  onClick={handleAddHeaderClick}
                  className="bg-[#3ABAB4] hover:bg-[#32A9A4] text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <CalendarPlus size={18} />
                  Tambah Reservasi
                </button>
              </div>
            </div>

            <hr className="my-4" />

            {viewMode === 'layout' && (
              <div className="p-4">
                <LegendStatus />

                <h3 className="text-lg font-semibold mb-2">Pilih Lantai:</h3>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {floors.map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setSelectedFloor(floor)}
                      className={`
                        px-4 py-2 rounded-full border-2 transition whitespace-nowrap
                        ${selectedFloor === floor
                          ? 'bg-[#3ABAB4] text-white border-[#3ABAB4] font-semibold'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }
                      `}
                    >
                      {floor}
                    </button>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mb-2 mt-4">Pilih Area ({selectedFloor}):</h3>
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {areasForSelectedFloor.map((area) => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area as Reservation['areaType'])}
                      className={`
                        px-4 py-2 rounded-full border-2 transition whitespace-nowrap
                        ${selectedArea === area
                          ? 'bg-blue-500 text-white border-blue-500 font-semibold'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }
                      `}
                    >
                      {area}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-8 justify-start p-4 border-2 border-dashed border-gray-200 min-h-[300px] rounded-xl bg-white/50">
                  {tableLayout[selectedFloor] && tableLayout[selectedFloor][selectedArea] && tableLayout[selectedFloor][selectedArea].length > 0 ? (
                    tableLayout[selectedFloor][selectedArea].map((table: any) => {
                      const reservation = getReservationDetails(table.id)

                      return (
                        <TableItem
                          key={table.id}
                          table={{...table, areaType: selectedArea, floor: selectedFloor}}
                          reservation={reservation}
                          handleEditClick={handleEditClick}
                          handleTableClick={handleTableClick}
                          handleReservedTableClick={handleReservedTableClick}
                        />
                      )
                    })
                  ) : (
                    <p className="text-gray-500 italic">Tidak ada meja di area **{selectedArea}** pada **{selectedFloor}**.</p>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'list' && (
              <>
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari berdasarkan Nama Pelanggan atau ID Reservasi..."
                      className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-[#3ABAB4] focus:border-[#3ABAB4] transition"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
<thead>
  <tr className="border-b-2 border-gray-300 text-sm text-gray-600">
    <th className="pb-4 pt-2 text-left font-semibold w-[12%]">ID Reservasi</th>
    <th className="pb-4 pt-2 text-left font-semibold w-[18%]">Pelanggan</th>
    <th className="pb-4 pt-2 text-center font-semibold w-[15%]">Meja Area</th>
    <th className="pb-4 pt-2 text-center font-semibold w-[15%]">Pax/Tanggal</th>
    <th className="pb-4 pt-2 text-center font-semibold w-[15%]">Waktu</th>
    <th className="pb-4 pt-2 text-center font-semibold w-[12%]">Status</th>
    <th className="pb-4 pt-2 text-right font-semibold w-[13%] pr-4">Deposit</th>
    <th className="pb-4 pt-2 text-center font-semibold w-[10%]">Aksi</th>
  </tr>
</thead>

<tbody>
  {data.map((reservation) => {
    const colors = getStatusColors(reservation.status)

    return (
      <tr
        key={reservation.id}
        className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
        onClick={() => handleEditClick(reservation)}
      >
        <td className="py-4 text-left">{reservation.id}</td>
        <td className="py-4 text-left">{reservation.customerName}</td>

        <td className="py-4 text-center">
          <div className="flex flex-col items-center leading-tight">
            <span className="font-semibold">{reservation.tableNumber}</span>
            <span className="text-xs text-gray-500">
              {reservation.areaType} - {reservation.floor}
            </span>
          </div>
        </td>

        <td className="py-4 text-center">
          <div className="flex flex-col items-center leading-tight">
            <span className="font-semibold">{reservation.pax} Pax</span>
            <span className="text-xs text-gray-500">{reservation.date}</span>
          </div>
        </td>

        <td className="py-4 text-center whitespace-nowrap">
          {reservation.startTime} - {reservation.endTime}
        </td>

        <td className="py-4 text-center">
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold border-2
            ${colors.border.replace('ring', 'border')}
            ${colors.bg} ${colors.text}`}
          >
            {STATUS_LABELS[reservation.status]}
          </span>
        </td>

        <td className="py-4 text-right pr-4 whitespace-nowrap">
          Rp {parseInt(reservation.deposit).toLocaleString('id-ID')}
        </td>

        <td className="py-4 flex justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEditClick(reservation)
            }}
            className="p-2 bg-white border-2 border-gray-300 hover:border-[#3ABAB4] hover:bg-[#3ABAB4] hover:text-white text-gray-700 rounded-lg transition-all"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleOpenDeleteModal(reservation)
            }}
            className="p-2 bg-white border-2 border-gray-300 hover:border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    )
  })}
</tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <TambahReservasi
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)

          if (!isDetailModalOpen) {
            setClickedTableData(null)
          }
        }}
        onSave={handleAddReservation}
        initialTableData={clickedTableData}
      />

      <EditReservasi
        isOpen={isEditModalOpen && editingReservation !== null}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingReservation(null)

          if (!isDetailModalOpen) {
            setClickedTableData(null)
          }
        }}
        initialData={editingReservation}
        onUpdate={handleUpdateReservation}
      />

      {isDeleteModalOpen && deletingReservation && (
        <HapusReservasi
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setDeletingReservation(null)
          }}
          // Perbaikan: Ubah argumen menjadi hanya 'reservationId'
          onConfirm={() => handleConfirmDelete(deletingReservation.id)}
          reservationId={deletingReservation.id}
          customerName={deletingReservation.customerName}
          tableNumber={deletingReservation.tableNumber}
        />
      )}

      <TableReservationDetailModal
        isOpen={isDetailModalOpen && clickedTableData !== null}
        onClose={() => {
          setIsDetailModalOpen(false)
          setClickedTableData(null)
        }}
        // Perbaikan: Tambahkan properti 'isChildModalOpen'
        isChildModalOpen={isChildModalOpen}
        reservations={clickedTableData ? getAllReservationsForTable(clickedTableData.tableNumber) : []}
        tableNumber={clickedTableData?.tableNumber || ''}
        floor={clickedTableData?.floor || ''}
        areaType={clickedTableData?.areaType || ''}
        onEditClick={handleEditClick}
        onAddReservationClick={handleAddReservationClick}
      />
    </div>
  )
}