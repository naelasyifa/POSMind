// src/app/api/mock-payment/pay/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { payment_method, amount } = body // payment_method di sini berisi 'code'

  switch (payment_method) {
    case '06': // Mandiri
      return NextResponse.json({
        status: true,
        data: { va_number: '88906' + Math.floor(Math.random() * 100000000), bank: 'Mandiri' },
      })
    case '07': // BNI
      return NextResponse.json({
        status: true,
        data: { va_number: '8807' + Math.floor(Math.random() * 100000000), bank: 'BNI' },
      })
    case '08': // BRI
      return NextResponse.json({
        status: true,
        data: { va_number: '8808' + Math.floor(Math.random() * 100000000), bank: 'BRI' },
      })
    case '16': // QRIS
      return NextResponse.json({
        status: true,
        data: {
          qr_string: '00020101021226540015ID1020221312312502030006011012345678',
          name: 'QRIS POSMind',
        },
      })
    default:
      return NextResponse.json({ status: false, message: 'Kode Bank tidak dikenali' })
  }
}
