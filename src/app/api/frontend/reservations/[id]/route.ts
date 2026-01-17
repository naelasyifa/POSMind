import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../../payloadClient'

export const runtime = 'nodejs'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient()

    if (!params.id) {
      return NextResponse.json({ success: false, message: 'ID diperlukan' }, { status: 400 })
    }

    const reservation = await payload.findByID({
      collection: 'reservations',
      id: params.id,
      depth: 1, // Agar data relasi meja ikut terbawa
    })

    if (!reservation) {
      return NextResponse.json({ success: false, message: 'Data tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(reservation)
  } catch (error: any) {
    console.error('GET Error:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient()
    const data = await req.json()

    // Validasi ID sebelum dikirim ke Payload
    if (!params.id) throw new Error("ID tidak ditemukan")

    const updated = await payload.update({
      collection: 'reservations',
      id: params.id, // Payload butuh ID internal (seperti '3'), bukan kode reservasi
      data: {
        ...data,
        // Pastikan status yang dikirim adalah 'menunggu', bukan 'pending'
        status: data.status === 'pending' ? 'menunggu' : data.status 
      },
      overrideAccess: true, // Ubah ke true jika ingin mengizinkan update tanpa login admin
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('PATCH Error:', error)
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal memperbarui' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient()

    await payload.delete({
      collection: 'reservations',
      id: params.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Reservasi berhasil dihapus',
    })
  } catch (error: any) {
    console.error('DELETE Error:', error)

    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Gagal menghapus reservasi',
      },
      { status: 500 }
    )
  }
}
