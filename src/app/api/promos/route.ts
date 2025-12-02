export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../payloadClient'

// Fungsi opsional untuk adjust kuota promo
async function adjustPromoQuota(payload: any, promoId: string, qty: number, increment = false) {
  const promo = await payload.findByID({ collection: 'promos', id: promoId })
  if (!promo) return
  const newQuota = increment ? promo.kuota + qty : promo.kuota - qty
  await payload.update({
    collection: 'promos',
    id: promoId,
    data: { kuota: newQuota },
  })
}

// Auto nonaktifkan promo jika tanggal akhir terlewat
async function autoDeactivateExpiredPromos(payload: any) {
  const promos = await payload.find({
    collection: 'promos',
    where: { akhir: { less_than: new Date().toISOString() }, status: { equals: 'Aktif' } },
  })
  for (const promo of promos.docs) {
    await payload.update({
      collection: 'promos',
      id: promo.id,
      data: { status: 'Nonaktif' },
    })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const body = await req.json()

    if (!body.nama) return NextResponse.json({ error: 'nama is required' }, { status: 400 })
    if (!body.kode) return NextResponse.json({ error: 'kode is required' }, { status: 400 })
    if (!body.mulai || !body.akhir)
      return NextResponse.json({ error: 'mulai & akhir is required' }, { status: 400 })
    if (!body.tipeDiskon || !body.nilaiDiskon)
      return NextResponse.json({ error: 'tipeDiskon & nilaiDiskon is required' }, { status: 400 })
    if (!body.kuota) body.kuota = 1
    if (!body.status) body.status = 'Aktif'

    const promo = await payload.create({ collection: 'promos', data: body })

    return NextResponse.json(promo)
  } catch (err: any) {
    console.error('ERROR CREATE PROMO:', err.stack || err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { id, data } = await req.json()
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const promo = await payload.update({ collection: 'promos', id, data })

    return NextResponse.json(promo)
  } catch (err: any) {
    console.error('ERROR UPDATE PROMO:', err.stack || err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const deleted = await payload.delete({ collection: 'promos', id })
    return NextResponse.json(deleted)
  } catch (err: any) {
    console.error('ERROR DELETE PROMO:', err.stack || err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const payload = await getPayloadClient()
    await autoDeactivateExpiredPromos(payload) // opsional: update status otomatis saat fetch
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const promo = await payload.findByID({ collection: 'promos', id })
      return NextResponse.json(promo)
    } else {
      const promos = await payload.find({ collection: 'promos', sort: '-mulai' })
      return NextResponse.json(promos)
    }
  } catch (err: any) {
    console.error('ERROR FETCH PROMOS:', err.stack || err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
