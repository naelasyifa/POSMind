// src/types/reservation.ts

export type StatusType =
  | 'Menunggu'
  | 'Dikonfirmasi'
  | 'Checked In'
  | 'Selesai'
  | 'Tidak Datang'
  | 'Tersedia'

export type AreaType =
  | 'Indoor'
  | 'Outdoor'
  | 'Smoking'
  | 'VIP'

export type FloorType =
  | 'Lantai 1'
  | 'Lantai 2'
  | 'Lantai 3'
  | 'Rooftop'

export interface Reservation {
  id: string
  tableNumber: string
  pax: number
  date: string
  startTime: string
  endTime: string
  deposit: number
  status: StatusType
  customerName: string
  gender?: 'Pria' | 'Wanita' | ''
  phone: string
  email?: string
  paymentMethod: string
  areaType: AreaType
  floor: FloorType
}

export interface TableInitialData {
  tableNumber: string
  areaType: AreaType
  floor: FloorType
}

export interface ReservationDataForAdd {
  table: string
  pax: number
  date: string
  startTime: string
  endTime: string
  deposit: number
  status: StatusType
  gender: 'Pria' | 'Wanita'
  firstName: string
  lastName: string
  phone: string
  email?: string
  paymentMethod: string
  areaType: AreaType
  floor: FloorType
}
