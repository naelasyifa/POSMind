// src/app/api/mock-payment/method/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: true,
    message: 'Get method successfully',
    data: [
      { id: 25, name: 'Cashless', code: 'cashless', category: 'Other', admin_fee: 0 },
      { id: 12, name: 'bnc saebo', code: 'bnc_saebo', category: 'Other', admin_fee: 3500 },
      { id: 11, name: 'OVO', code: '02', category: 'E-Wallet', admin_fee: 500 },
      { id: 10, name: 'Dana', code: '14', category: 'E-Wallet', admin_fee: 500 },
      { id: 9, name: 'Shopeepay', code: '15', category: 'E-Wallet', admin_fee: 500 },
      { id: 8, name: 'QRIS', code: '16', category: 'Other', admin_fee: 0.7 },
      { id: 7, name: 'VA Danamon', code: '17', category: 'Virtual Account', admin_fee: 500 },
      { id: 1, name: 'VA Mandiri', code: '06', category: 'Virtual Account', admin_fee: 500 },
    ],
  })
}
