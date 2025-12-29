import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../../../payloadClient'

export const runtime = 'nodejs'

// ==========================
// PATCH – Update meja
// ==========================
export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient()
    const { params } = context
    const id = params.id
    const body = await req.json()

    const data: Record<string, any> = {}

    // Update posisi jika x & y dikirim
    if (body.x !== undefined && body.y !== undefined) {
      data.posisi = { x: Number(body.x), y: Number(body.y) }
    }

    // Update status
    if (body.status !== undefined) {
      data.status = body.status
    }

    // Update area
    if (body.area !== undefined) {
      data.area = body.area
    }

    // Update kapasitas
    if (body.kapasitas !== undefined) {
      data.kapasitas = Number(body.kapasitas)
    }

    // Update bentuk/shape jika dikirim
    if (body.shape !== undefined) {
      data.bentuk = body.shape
    }

    const table = await payload.update({
      collection: 'tables',
      id: id,
      data,
    })

    return NextResponse.json(table)
  } catch (error) {
    console.error('PATCH table error:', error)
    return NextResponse.json(
      { message: 'Gagal update meja' },
      { status: 500 }
    )
  }
}

// ==========================
// DELETE – Hapus meja
// ==========================
export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  try {
    const payload = await getPayloadClient()
    const { params } = context
    const id = params.id

    await payload.delete({
      collection: 'tables',
      id: id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE table error:', error)
    return NextResponse.json(
      { message: 'Gagal hapus meja' },
      { status: 500 }
    )
  }
}
