import { NextResponse } from 'next/server'
import payload from 'payload'
import { generateSignature } from '@/lib/paymentSignature'

export async function POST(req: Request) {
  const body = await req.json()
  const { orderId, amount, paymentMethodId } = body

  // 1️⃣ Ambil payment method dari Payload
  const method = await payload.findByID({
    collection: 'payment-methods',
    id: paymentMethodId,
  })

  if (!method || method.type !== 'bank_transfer') {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
  }

  // 2️⃣ Payload ke payment gateway
  const gatewayPayload = {
    order_id: orderId,
    amount,
    bank_code: method.bankCode,
  }

  // 3️⃣ Signature
  const signatureHeaders = generateSignature('post', gatewayPayload)

  const headers = new Headers()
  headers.set('Content-Type', 'application/json')
  Object.entries(signatureHeaders).forEach(([k, v]) => headers.set(k, v))

  // 4️⃣ Call sandbox API
  const res = await fetch(`${process.env.PAYMENT_BASE_URL}/transfer`, {
    method: 'POST',
    headers,
    body: JSON.stringify(gatewayPayload),
  })

  const data = await res.json()

  // 5️⃣ Simpan ke collection payments
  await payload.create({
    collection: 'payments',
    data: {
      orderId,
      method: paymentMethodId,
      amount,
      reference: data.reference ?? null,
      status: 'pending',
    },
  })

  return NextResponse.json(data)
}
