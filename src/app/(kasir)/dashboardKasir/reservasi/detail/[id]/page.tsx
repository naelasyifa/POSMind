'use client'

import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import BatalReservasi from '../../components/BatalReservasi'
import PindahMeja from './components/PindahMeja'   // pastikan path ini sesuai!
import { DUMMY_RESERVATIONS } from '@/data/reservasi'

/* COMPONENT DETAIL ITEM */
function DetailItem({
  title,
  value,
  className = '',
}: {
  title: string
  value: string | number
  className?: string
}) {
  return (
    <div>
      <p className="text-[#3FA3A2] text-xs font-semibold">{title}</p>
      <p className={`font-medium text-gray-900 mt-1 ${className}`}>{value}</p>
    </div>
  )
}

export default function DetailReservasi() {
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)

  const data = DUMMY_RESERVATIONS.find((r) => r.id === id)

  /* ===== STATE ===== */
  const [showCancelPopup, setShowCancelPopup] = useState(false)
  const [openPindahMeja, setOpenPindahMeja] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<any>(null)

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Data reservasi tidak ditemukan.
      </div>
    )
  }

  /* FORMAT */
  const formattedPeople = `${String(data.people).padStart(2, '0')} persons`
  const formattedDeposit = `${data.deposit}.00 $`

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'text-green-600 font-bold'
      case 'Pending':
        return 'text-yellow-600 font-bold'
      case 'Checked In':
        return 'text-blue-600 font-bold'
      case 'Completed':
        return 'text-gray-600 font-bold'
      default:
        return 'font-bold'
    }
  }

  const statusClass = getStatusClass(data.status)

  /* CANCEL RESERVATION */
  const handleConfirmCancel = () => {
    const index = DUMMY_RESERVATIONS.findIndex((r) => r.id === id)
    if (index !== -1) {
      DUMMY_RESERVATIONS.splice(index, 1)
    }
    router.push('/reservasi')
  }

  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />

      {/* PAGE CONTENT */}
      <div className="flex-1 ml-28">
        <HeaderKasir 
          title="Detail Reservasi"
          showBack={true}
          onBack={() => router.push('/dashboardKasir/reservasi')}
        />

        <div className="p-8 space-y-6">

          {/* HEADER IMAGE */}
          <div className="bg-white/10 rounded-xl shadow-xl p-1 border border-white/20">
            <div className="relative rounded-lg overflow-hidden h-64">
              <Image
                src="/images/table.jpg"
                alt="Table"
                fill
                className="object-cover"
              />

              <div className="absolute bottom-3 left-3 bg-black/60 text-white px-4 py-1 rounded-md text-sm">
                Table # {data.table}
              </div>
            </div>
          </div>

          {/* RESERVATION DETAILS */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-3">
              Reservation Details
            </h2>

            <div className="bg-[#E4F5F5] rounded-xl p-5 shadow-inner grid grid-cols-6 gap-6 text-sm">
              <DetailItem title="Nomor Meja" value={data.table} />
              <DetailItem title="Jumlah Pax" value={formattedPeople} />
              <DetailItem title="Tanggal Reservasi" value={data.date} />
              <DetailItem title="Waktu Reservasi" value={data.time} />
              <DetailItem title="Deposit Fee" value={formattedDeposit} />
              <DetailItem
                title="Status"
                value={data.status}
                className={statusClass}
              />
            </div>
          </div>

          {/* CUSTOMER DETAILS */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-3">
              Customer Details
            </h2>

            <div className="bg-[#E4F5F5] rounded-xl p-5 shadow-inner grid grid-cols-4 gap-6 text-sm">
              <DetailItem title="Jenis Kelamin" value={data.gender} />
              <DetailItem title="Nama Lengkap" value={data.fullName} />
              <DetailItem title="No. Telepon" value={data.phone} />
              <DetailItem title="Alamat Email" value={data.email} />
            </div>
          </div>

          {/* ADDITIONAL INFO */}
          <div>
            <h2 className="text-white text-xl font-semibold mb-3">
              Additional Information
            </h2>

            <div className="bg-[#E4F5F5] rounded-xl p-5 shadow-inner grid grid-cols-4 gap-6 text-sm">
              <DetailItem title="Customer ID" value={data.customerId} />
              <DetailItem title="Metode Pembayaran" value={data.paymentMethod} />
              <DetailItem title="Name" value={data.cardName} />
              <DetailItem title="Card Number" value={data.cardNumber} />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4 mt-4 pb-10">
            <button
              onClick={() => setShowCancelPopup(true)}
              className="px-5 py-2 rounded-md bg-transparent border border-white text-white hover:bg-white hover:text-[#52BFBE] transition"
            >
              Batalkan Reservasi
            </button>

            <button
              onClick={() => {
                setSelectedReservation({
                  id: data.id,
                  table: data.table,
                  time: data.time,
                  duration: 60,
                  name: data.fullName,
                  people: data.people,
                  status: data.status,
                  contact: data.phone
                })
                setOpenPindahMeja(true)
              }}
              className="px-5 py-2 rounded-md bg-[#737373] text-white hover:bg-[#328786] transition"
            >
              Pindah Meja
            </button>
          </div>
        </div>
      </div>

      {/* POPUP BATAL */}
      <BatalReservasi
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleConfirmCancel}
        tableNumber={data.table}
      />

      {/* POPUP PINDAH MEJA */}
      <PindahMeja
        isOpen={openPindahMeja}
        onClose={() => setOpenPindahMeja(false)}
        currentReservation={selectedReservation}
        onSave={(updatedData) => {
          console.log('Updated:', updatedData)
          setOpenPindahMeja(false)
        }}
      />
    </div>
  )
}
