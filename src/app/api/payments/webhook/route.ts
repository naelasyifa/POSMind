import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    /**
     * CONTOH payload dari payment sandbox:
     * {
     *   orderId: "PSN-20251224-0001",
     *   status: "paid",
     *   reference: "QRIS123XXX"
     * }
     */

    const { orderId, status, reference } = body

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // 1️⃣ Update PAYMENT
    const payment = await payload.update({
      collection: 'payments',
      where: { orderId: { equals: orderId } },
      data: {
        status,
        reference,
      },
    })

    // 2️⃣ Jika PAID → UPDATE TRANSACTION
    if (status === 'paid') {
      await payload.update({
        collection: 'transactions',
        where: { noPesanan: { equals: orderId } },
        data: {
          status: 'selesai',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('WEBHOOK ERROR', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
