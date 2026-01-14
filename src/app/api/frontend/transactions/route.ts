export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

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

    if (!body.tenant) {
      return NextResponse.json({ error: 'tenant is required' }, { status: 400 })
    }

    if (!body.paymentMethodId) {
      return NextResponse.json({ error: 'paymentMethodId is required' }, { status: 400 })
    }

    const paymentMethod = await payload.findByID({
      collection: 'payment-methods',
      id: body.paymentMethodId,
    })

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    if (!body.status) {
      body.status = paymentMethod.type === 'cash' ? 'selesai' : 'pending'
    }

    // VALIDASI PROMO ID & KUOTA
    let validPromo = null

    if (body.promoId) {
      const promo = await payload.findByID({
        collection: 'promos',
        id: body.promoId,
      })
      if (promo) {
        const kuota = promo.kuota // bisa number / null / undefined / "-"

        // Jika kuota null / "-" → promo dianggap tanpa kuota (bebas)
        if (kuota === null || kuota === '-' || kuota === undefined) {
          validPromo = promo
        }
        // Jika kuota ada dan > 0
        else if (typeof kuota === 'number' && kuota > 0) {
          validPromo = promo
        }
        // Jika kuota habis → promo diabaikan
        else {
          console.log('Promo habis → promo diabaikan')
          body.promoId = null
        }
      }
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

    // Update kuota promo jika ada
    if (validPromo) {
      const kuota = validPromo.kuota

      // Promo tanpa kuota → skip update
      if (kuota === null || kuota === '-' || kuota === undefined) {
        console.log('Promo tanpa kuota → tidak dikurangi')
      }
      // Promo punya kuota → kurangi
      else if (typeof kuota === 'number') {
        const newKuota = kuota - 1

        await payload.update({
          collection: 'promos',
          id: validPromo.id,
          data: { kuota: newKuota < 0 ? 0 : newKuota },
        })
      }
    }

    return NextResponse.json(trx)
  } catch (err: any) {
    console.error('ERROR CREATE TRX:', err.stack || err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
