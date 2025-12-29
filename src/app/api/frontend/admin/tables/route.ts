import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../../payloadClient'

export const runtime = 'nodejs'

// ==========================
// GET – Ambil semua meja
// ==========================
export async function GET() {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'tables',
      limit: 1000,
      sort: 'namaMeja',
    })

    return NextResponse.json(result.docs)
  } catch (error) {
    console.error('GET tables error:', error)
    return NextResponse.json(
      { message: 'Gagal mengambil data meja' },
      { status: 500 }
    )
  }
}

// ==========================
// POST – Tambah meja baru
// ==========================
export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const body = await req.json()

    // VALIDASI
    if (!body.namaMeja || !body.lantai) {
      return NextResponse.json(
        { message: 'Nama meja & lantai wajib diisi' },
        { status: 400 }
      )
    }

    const table = await payload.create({
      collection: 'tables',
      data: {
        namaMeja: body.namaMeja,
        kapasitas: Number(body.kapasitas ?? 4),
        lantai: body.lantai,
        area: body.area ?? 'indoor',
        bentuk: body.bentuk ?? 'kotak',
        posisi: {
          x: Number(body.posisi?.x ?? 100),
          y: Number(body.posisi?.y ?? 100),
        },
        dpMeja: Number(body.dpMeja ?? 0),
        catatan: body.catatan ?? '',
      },
    })

    return NextResponse.json(table, { status: 201 })
  } catch (error) {
    console.error('POST table error:', error)
    return NextResponse.json(
      { message: 'Gagal menambahkan meja' },
      { status: 500 }
    )
  }
}
