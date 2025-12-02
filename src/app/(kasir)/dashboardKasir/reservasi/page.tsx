'use client'

import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import TambahReservasi from './components/TambahReservasi'

// ===========================================
// HELPER: Mendapatkan Tanggal Aman (YYYY-MM-DD)
// Ini harus di luar komponen untuk menghindari Hydration Error jika menggunakan new Date()
// Jika ingin menguji data dummy (2025-12-01), ubah return value di bawah ini.
// ===========================================
const getTodayDateString = () => {
  // Gunakan 'en-CA' untuk format YYYY-MM-DD yang konsisten dan aman dari Timezone/Locale.
  // Catatan: Jika ingin melihat data dummy 2025-12-01, ganti baris di bawah:
  // return '2025-12-01'; 
  return new Date().toLocaleDateString('en-CA');
};

const TODAY_DATE = getTodayDateString();

// ===========================================
// DEFINISI DATA DUMMY (Diselaraskan dengan TODAY_DATE)
// ===========================================
const DUMMY_RESERVATIONS_LOCAL = [
  // Semua tanggal diubah menjadi TODAY_DATE agar terlihat pada tampilan awal
  {
    id: 1,
    table: 'A2',
    date: TODAY_DATE,
    time: '11:00',
    duration: 60,
    fullName: 'Mila',
    people: 1,
    status: 'Confirmed',
    gender: 'Wanita',
    phone: '081234567890',
    email: 'mila@email.com',
    customerId: '#1001',
    paymentMethod: 'QRIS',
    deposit: 50000,
    cardName: 'Mila A.',
    cardNumber: '**** 1234',
  },
  {
    id: 2,
    table: 'B1',
    date: TODAY_DATE,
    time: '12:00',
    duration: 60,
    fullName: 'Dewi',
    people: 2,
    status: 'Pending',
    gender: 'Wanita', phone: '-', email: '-', customerId: '#1002', paymentMethod: 'Cash', deposit: 0, cardName: '-', cardNumber: '-',
  },
  {
    id: 3,
    table: 'A2',
    date: TODAY_DATE,
    time: '12:00',
    duration: 120,
    fullName: 'Nala',
    people: 3,
    status: 'Checked In',
    gender: 'Pria', phone: '-', email: '-', customerId: '#1003', paymentMethod: 'Debit', deposit: 0, cardName: '-', cardNumber: '-',
  },
  {
    id: 4,
    table: 'B2',
    date: TODAY_DATE,
    time: '16:00',
    duration: 60,
    fullName: 'Syifa',
    people: 4,
    status: 'Confirmed',
    gender: 'Wanita', phone: '-', email: '-', customerId: '#1004', paymentMethod: 'Cash', deposit: 0, cardName: '-', cardNumber: '-',
  },
  {
    id: 5,
    table: 'B3',
    date: TODAY_DATE,
    time: '15:00',
    duration: 60,
    fullName: 'Atifa',
    people: 5,
    status: 'Pending',
    gender: 'Wanita', phone: '-', email: '-', customerId: '#1005', paymentMethod: 'Cash', deposit: 0, cardName: '-', cardNumber: '-',
  },
  {
    id: 7,
    table: 'A1',
    date: TODAY_DATE,
    time: '10:00',
    duration: 120,
    fullName: 'Nanda',
    people: 7,
    status: 'Completed',
    gender: 'Pria', phone: '-', email: '-', customerId: '#1007', paymentMethod: 'Cash', deposit: 0, cardName: '-', cardNumber: '-',
  },
  {
    id: 8,
    table: 'Bar',
    date: TODAY_DATE,
    time: '10:00',
    duration: 120,
    fullName: 'Hidayah',
    people: 8,
    status: 'Confirmed',
    gender: 'Pria', phone: '-', email: '-', customerId: '#1008', paymentMethod: 'Cash', deposit: 0, cardName: '-', cardNumber: '-',
  },
]
// ===========================================


// ===========================================
// DEFINISI WARNA STATUS
// ===========================================
const STATUS_COLORS: { [key: string]: string } = {
  Confirmed: 'bg-green-600',
  Pending: 'bg-yellow-500',
  'Checked In': 'bg-blue-600',
  Completed: 'bg-gray-600',
  Cancelled: 'bg-red-600',
  'No Show': 'bg-purple-600',
}

const TEXT_COLOR_DARK: { [key: string]: string } = {
  Confirmed: 'text-white',
  Pending: 'text-gray-900',
  'Checked In': 'text-white',
  Completed: 'text-white',
  Cancelled: 'text-white',
  'No Show': 'text-white',
}

// ===========================================

export default function ReservasiKasir() {
  const router = useRouter()

  const [selectedFloor, setSelectedFloor] = useState(1)
  const [openDateDropdown, setOpenDateDropdown] = useState(false)
  
  // Menggunakan TODAY_DATE yang sudah dihitung di luar komponen
  const [selectedDate, setSelectedDate] = useState(TODAY_DATE) 

  const [openAdd, setOpenAdd] = useState(false)

  const [reservations, setReservations] = useState(DUMMY_RESERVATIONS_LOCAL)

  const floors = [1, 2, 3]

  const START_HOUR = 9
  const END_HOUR = 21
  const TOTAL_HOURS = END_HOUR - START_HOUR + 1
  const TOTAL_MINUTES = TOTAL_HOURS * 60 
  const tables = ['Bar', 'A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2']

  const times: string[] = Array.from({ length: TOTAL_HOURS }, (_, i) => {
    const h = i + START_HOUR
    // Jika jam adalah 21, tampilkan 21:00
    if (h > END_HOUR) return null; 
    return `${String(h).padStart(2, '0')}:00`
  }).filter(t => t !== null) as string[]
  
  // ===========================================
  // HANDLE ADD RESERVATION
  // ===========================================
  const handleAddReservation = (newData: any) => {
    const startParts = newData.startTime.split(':').map(Number)
    const endParts = newData.endTime.split(':').map(Number)

    const startMinutesTotal = startParts[0] * 60 + startParts[1]
    const endMinutesTotal = endParts[0] * 60 + endParts[1]

    let durationMinutes = endMinutesTotal - startMinutesTotal
    if (durationMinutes <= 0) durationMinutes += 24 * 60

    const newReservation = {
      id: reservations.length + 1 + Date.now(), 
      table: newData.table,
      date: selectedDate, 
      time: newData.startTime,
      duration: durationMinutes,
      fullName: newData.firstName + ' ' + newData.lastName,
      people: parseInt(newData.pax),
      status: newData.status,
      
      gender: newData.gender || 'Tidak Diketahui',
      phone: newData.phone || '-',
      email: newData.email || '-',
      customerId: `#${Math.floor(Math.random() * 90000000) + 10000000}`,
      paymentMethod: newData.paymentMethod || 'Cash',
      deposit: parseInt(newData.deposit) || 0, 
      cardName: '-',
      cardNumber: '-',
    }

    setReservations((prev) => [...prev, newReservation])
    setOpenAdd(false)
  }

  // ===========================================
  // RENDER PAGE
  // ===========================================
  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />

      <div
        className={`flex-1 flex flex-col ml-28 transition-all duration-300 ${
          openAdd ? 'blur-md scale-[0.98]' : ''
        }`}
      >
        <HeaderKasir title="Reservasi" showBack={true}/>

        <div className="p-6">
          {/* TOP BAR */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-5 py-2 rounded-lg font-medium border ${
                    selectedFloor === floor
                      ? 'bg-white text-[#3FA3A2] border-white'
                      : 'bg-transparent text-white border-white/40'
                  }`}
                >
                  Lantai {floor}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* DATE PICKER */}
              <div className="relative">
                <button
                  onClick={() => setOpenDateDropdown(!openDateDropdown)}
                  className="bg-[#696969] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                >
                  {new Date(selectedDate).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })} <ChevronDown size={16} />
                </button>

                {openDateDropdown && (
                  <div className="absolute mt-2 right-0 bg-white rounded-lg shadow-lg p-3 w-56 z-50">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value)
                        setOpenDateDropdown(false)
                      }}
                      className="w-full border p-2 rounded-md text-gray-900 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* ADD BUTTON */}
              <button
                className="bg-white text-[#3FA3A2] px-4 py-2 rounded-lg shadow font-medium 
                transition-all hover:bg-[#F2FFFE] hover:scale-[1.04] hover:shadow-lg"
                onClick={() => setOpenAdd(true)}
              >
                + Tambah Reservasi
              </button>
            </div>
          </div>

          {/* GRID */}
          {/* Tambahkan overflow-x-hidden pada kontainer utama grid agar overflow visual terpotong rapi */}
          <div className="bg-[#2EA7A6] rounded-xl p-5 shadow-lg overflow-x-hidden"> 
            <div className="w-full border-4 border-[#1C8E8D] p-3 rounded-xl">
              {/* HEADER JAM */}
              <div
                className="grid text-white font-medium text-sm"
                style={{ gridTemplateColumns: `70px repeat(${TOTAL_HOURS}, 1fr)` }}
              >
                <div></div>
                {times.map((t, i) => (
                  <div key={i} className="text-center">
                    {t}
                  </div>
                ))}
              </div>
              <div> 
                {tables.map((table) => (
                  <div
                    key={table}
                    // Setiap baris kini adalah kontainer RELATIVE
                    className="grid h-14 items-center border-t border-white/20 relative"
                    style={{
                      gridTemplateColumns: `70px repeat(${TOTAL_HOURS}, 1fr)`,
                    }}
                  >
                    {/* Kolom Nama Meja */}
                    <div className="text-white font-medium z-10">{table}</div>

                    {/* Garis Grid Vertikal */}
                    {times.map((_, idx) => (
                      <div key={idx} className="border-l border-white/10 h-full"></div>
                    ))}
                    
                    {/* RESERVATION BOX DITEMPATKAN DI SINI (ABSOLUTE) */}
                    {reservations
                      // Filter HANYA untuk meja saat ini dan tanggal yang dipilih
                      .filter(item => item.date === selectedDate && item.table === table)
                      .map((item) => {
                        
                        const startParts = item.time.split(':').map(Number)
                        const startMinutes = startParts[0] * 60 + startParts[1]
                        const minutesFromStart = startMinutes - START_HOUR * 60

                        if (minutesFromStart < 0 || minutesFromStart >= TOTAL_MINUTES) return null

                        let actualDuration = item.duration;
                        const minutesUntilEnd = TOTAL_MINUTES - minutesFromStart;
                        
                        if (actualDuration > minutesUntilEnd) {
                            actualDuration = minutesUntilEnd;
                        }

                        const timeAreaWidth = 100 
                        const leftPercentage = (minutesFromStart / TOTAL_MINUTES) * timeAreaWidth
                        const widthPercentage = (actualDuration / TOTAL_MINUTES) * timeAreaWidth 

                        const cardColorClass = STATUS_COLORS[item.status] || 'bg-gray-400'
                        const textColorClass = TEXT_COLOR_DARK[item.status] || 'text-white'

                        return (
                          <div
                            key={item.id}
                            onClick={() =>
                              router.push(`/dashboardKasir/reservasi/detail/${item.id}`)
                            }

                            className={`${cardColorClass} ${textColorClass} absolute text-xs rounded-md shadow cursor-pointer 
                            hover:scale-[1.03] transition-all whitespace-nowrap overflow-hidden z-20`}
                            style={{
                              // Posisi Vertikal FIX (1px dari atas baris)
                              top: '1px', 
                              
                              // Posisi Horizontal (70px + persentase waktu)
                              left: `calc(70px + ${leftPercentage}%)`, 
                              width: `calc(${widthPercentage}% - 2px)`,
                              height: '54px', 
                              minWidth: item.duration < 30 ? '30px' : 'none', 
                            }}
                          >
                            <div className="p-1.5 h-full flex flex-col justify-center">
                              <p className="font-semibold">{item.fullName}</p>
                              <p className="opacity-80">👤 {String(item.people).padStart(2, '0')}</p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {openAdd && <div className="fixed inset-0 bg-black/40 z-40"></div>}

      <TambahReservasi
        isOpen={openAdd}
        onSave={handleAddReservation}
        onClose={() => setOpenAdd(false)}
      />
    </div>
  )
}