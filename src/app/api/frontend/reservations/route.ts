import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

export const runtime = 'nodejs'

/* =========================================
   GET - LIST RESERVASI
========================================= */
export async function GET() {
  try {
    const payload = await getPayloadClient()

    const reservations = await payload.find({
      collection: 'reservations',
      depth: 2,
      sort: '-createdAt',
      limit: 100,
    })

    return NextResponse.json({
      success: true,
      total: reservations.totalDocs,
      data: reservations.docs,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

/* =========================================
   POST - TAMBAH RESERVASI BARU
========================================= */
export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const body = await req.json()

    const newReservation = await payload.create({
      collection: 'reservations',
      data: {
        tenant: body.tenant,
        table: body.tableId, // ID Tenant (Relationship)
        namaPelanggan: body.namaPelanggan,
        noTelepon: body.noTelepon,
        email: body.email,
        tanggal: body.tanggal,
        jamMulai: body.jamMulai,
        jamSelesai: body.jamSelesai,
        pax: Number(body.pax),
        deposit: Number(body.deposit || 0),
        totalTagihan: Number(body.totalTagihan || 0),
        statusPembayaran: body.statusPembayaran,
        meja: body.meja, // Pastikan ini berisi ID Meja
        status: body.status,
        catatan: body.catatan,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Reservasi berhasil dibuat',
      data: newReservation,
    })
  } catch (error: any) {
    // Error jam bentrok dari hooks akan tertangkap di sini
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    )
  }
}