import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/app/payloadClient'
import { generateSignature } from '@/lib/paymentSignature'

export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const body = await req.json()
  const { orderId, amount, paymentMethodId } = body

  const method = await payload.findByID({
    collection: 'payment-methods',
    id: paymentMethodId,
  })

  if (!method || method.type !== 'qris') {
    return NextResponse.json({ error: 'Invalid QRIS method' }, { status: 400 })
  }

  const gatewayPayload = {
    order_id: orderId,
    amount,
  }

  const headers = generateSignature('post', gatewayPayload)

  const res = await fetch(`${process.env.PAYMENT_BASE_URL}/qris`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(gatewayPayload),
  })

  const data = await res.json()

  await payload.create({
    collection: 'payments',
    data: {
      orderId,
      method: paymentMethodId,
      amount,
      reference: data.qr_id ?? null,
      status: 'pending',
    },
  })

  return NextResponse.json(data)
}
