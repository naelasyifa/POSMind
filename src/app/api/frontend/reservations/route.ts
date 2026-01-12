import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

export const runtime = 'nodejs'

/* =========================================
   GET - LIST RESERVASI
========================================= */
export async function GET(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(req.url)

    const tableId = searchParams.get('tableId')
    const tanggal = searchParams.get('tanggal')

    if (!tableId || !tanggal) {
      return NextResponse.json({
        success: false,
        message: 'tableId dan tanggal wajib',
      })
    }

    const reservations = await payload.find({
      collection: 'reservations',
      depth: 2,
      where: {
        and: [
          { meja: { equals: tableId } },
          { tanggal: { equals: tanggal } },
        ],
      },
      sort: 'jamMulai',
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

    // 🔥 AMBIL USER LOGIN
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()

    const newReservation = await payload.create({
      collection: 'reservations',
      data: {
        tenant: 3,
        namaPelanggan: body.namaPelanggan,
        jenisKelamin: body.jenisKelamin,
        noTelepon: body.noTelepon,
        email: body.email,
        tanggal: body.tanggal,
        jamMulai: body.jamMulai,
        jamSelesai: body.jamSelesai,
        pax: Number(body.pax) || 0,
        deposit: Number(body.deposit) || 0,
        totalTagihan: Number(body.totalTagihan) || 0,
        statusPembayaran: body.statusPembayaran,
        metodePembayaran: body.metodePembayaran,
        meja: body.meja,
        status: body.status,
        catatan: body.catatan,

        // 🔥 INI KUNCI UTAMA
        kasir: user.id,
      },
      req, // 🔥 WAJIB
    })

    return NextResponse.json({ success: true, data: newReservation })
  } catch (error: any) {
    // Agar kamu bisa lihat di Terminal VS Code field mana yang sebenarnya error
    console.dir(error, { depth: null }); 
    
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal simpan' },
      { status: 400 }
    )
  }
}
