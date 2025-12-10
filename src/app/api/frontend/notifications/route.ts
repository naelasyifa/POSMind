import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/app/payloadClient'

const FILTER_MAP: Record<string, any> = {
  unread: { isRead: { equals: false } },
  transaksi: { type: { equals: 'transaksi' } },
  produk: { type: { equals: 'produk' } },
  promo: { tipe: { in: ['promo_low_quota', 'promo_out_quota'] } },
  reservasi: {
    tipe: {
      in: ['reservation_new', 'reservation_confirm', 'reservation_cancel'],
    },
  },
}

export async function GET(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(req.url)

    const filter = searchParams.get('filter') || 'all'
    const where = FILTER_MAP[filter] || {} // default = semua

    const notif = await payload.find({
      collection: 'notifications',
      where,
      sort: '-createdAt',
      limit: 100,
    })

    return NextResponse.json({ success: true, docs: notif.docs })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ========== PATCH: Mark Read ==========
export async function PATCH(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'ID wajib dikirim' }, { status: 400 })
    }

    const updated = await payload.update({
      collection: 'notifications',
      id,
      data: { isRead: true },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ========== DELETE: Hapus by ID ==========
export async function DELETE(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'ID wajib dikirim' }, { status: 400 })
    }

    await payload.delete({
      collection: 'notifications',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
