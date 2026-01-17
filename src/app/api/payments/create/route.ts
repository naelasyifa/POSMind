import { NextResponse } from 'next/server'
import { getPaymentHeaders } from '@/utils/payment-api'

export async function POST(req: Request) {
  const body = await req.json()
  const { orderId, amount, paymentMethodId } = body

  const apiURL = `${process.env.PAYMENT_BASE_URL}/transfer/api/v1/create`

  const payload = {
    partner_reference: orderId,
    amount: amount.toString(),
    payment_method_id: paymentMethodId, // ID eksternal (misal: 3)
    description: `Bayar Order ${orderId}`,
  }

  const headers = await getPaymentHeaders('POST', payload)

  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: headers as any,
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ status: false, message: 'API Error' }, { status: 500 })
  }
}
