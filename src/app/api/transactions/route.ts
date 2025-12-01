export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../payloadClient'

async function adjustStock(payload: any, productId: string, qty: number, increment = false) {
  const product = await payload.findByID({ collection: 'products', id: productId })
  if (!product) return
  const newQty = increment ? product.stok + qty : product.stok - qty
  await payload.update({
    collection: 'products',
    id: productId,
    data: { stok: newQty },
  })
}

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const body = await req.json()

    if (!body.metode) {
      return NextResponse.json({ error: 'metode is required' }, { status: 400 })
    }
    if (!body.tenant) {
      return NextResponse.json({ error: 'tenant is required' }, { status: 400 })
    }

    // map metode
    if (body.metode === 'cash') body.metode = 'Cash'
    if (body.metode === 'qris') body.metode = 'E-Wallet'

    if (!body.status) {
      body.status = 'selesai'
    }

    // Create transaction
    const trx = await payload.create({
      collection: 'transactions',
      data: body,
    })

    // Update stok otomatis
    if (Array.isArray(body.items)) {
      for (const item of body.items) {
        if (!item.productId) continue
        if (body.status === 'selesai') {
          await adjustStock(payload, item.productId, item.qty, false) // kurangi stok
        } else if (body.status === 'batal') {
          await adjustStock(payload, item.productId, item.qty, true) // kembalikan stok
        }
      }
    }

    return NextResponse.json(trx)
  } catch (err: any) {
    console.error('ERROR CREATE TRX:', err.stack || err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
