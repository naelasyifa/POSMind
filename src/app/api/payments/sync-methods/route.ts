import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getPaymentHeaders } from '@/utils/payment-api'
import { NextResponse } from 'next/server'

export async function POST() {
  const payload = await getPayload({ config: configPromise })
  const apiURL = `${process.env.PAYMENT_BASE_URL}/method`

  let paymentMethods = []

  try {
    const headers = await getPaymentHeaders('GET')
    const response = await fetch(apiURL, {
      method: 'GET',
      headers: headers as any,
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    })

    const result = await response.json()
    if (result.status) {
      paymentMethods = result.data
    }
  } catch (error) {
    console.warn('⚠️ Gagal Fetch API, Menggunakan Data Lengkap sebagai cadangan...')

    paymentMethods = [
      // KITA TAMBAHKAN CASH SECARA MANUAL AGAR MASUK KE DATABASE
      { id: 0, name: 'Tunai (Cash)', code: 'cash', category: 'Cash', admin_fee: 0 },

      { id: 25, name: 'Cashless', code: 'cashless', category: 'Other', admin_fee: 0 },
      { id: 12, name: 'bnc saebo', code: 'bnc_saebo', category: 'Other', admin_fee: 3500 },
      { id: 11, name: 'OVO', code: '02', category: 'E-Wallet', admin_fee: 500 },
      { id: 10, name: 'Dana', code: '14', category: 'E-Wallet', admin_fee: 500 },
      { id: 9, name: 'Shopeepay', code: '15', category: 'E-Wallet', admin_fee: 500 },
      { id: 8, name: 'QRIS', code: '16', category: 'Other', admin_fee: 0.7 },
      { id: 7, name: 'VA Danamon', code: '17', category: 'Virtual Account', admin_fee: 500 },
      { id: 6, name: 'VA CIMB Niaga', code: '18', category: 'Virtual Account', admin_fee: 500 },
      { id: 5, name: 'VA Permata', code: '19', category: 'Virtual Account', admin_fee: 500 },
      { id: 4, name: 'VA BRI', code: '08', category: 'Virtual Account', admin_fee: 500 },
      { id: 3, name: 'VA BNI', code: '07', category: 'Virtual Account', admin_fee: 500 },
      { id: 1, name: 'VA Mandiri', code: '06', category: 'Virtual Account', admin_fee: 500 },
    ]
  }

  // // Tambahkan Cash ke paymentMethods jika dari API tidak ada
  // const hasCash = paymentMethods.some((m) => m.code === 'cash')
  // if (!hasCash) {
  //   paymentMethods.unshift({
  //     id: 0,
  //     name: 'Tunai (Cash)',
  //     code: 'cash',
  //     category: 'Cash',
  //     admin_fee: 0,
  //   })
  // }

  try {
    for (const item of paymentMethods) {
      const existing = await payload.find({
        collection: 'payment-methods',
        where: { externalId: { equals: item.id } },
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'payment-methods',
          id: existing.docs[0].id,
          data: {
            name: item.name,
            category: item.category || 'Other',
            code: item.code,
            fee: item.admin_fee || 0,
            // isActive tidak diupdate di sini agar pilihan Admin di dashboard tidak tertimpa saat sync
          },
        })
      } else {
        await payload.create({
          collection: 'payment-methods',
          data: {
            name: item.name,
            externalId: item.id,
            code: item.code,
            category: item.category || 'Other',
            fee: item.admin_fee || 0,
            isActive: true,
          } as any,
        })
      }
    }

    return NextResponse.json({ message: 'Sync Berhasil', count: paymentMethods.length })
  } catch (err: any) {
    console.error('Database Error:', err)
    return NextResponse.json({ error: 'Database Error: ' + err.message }, { status: 500 })
  }
}
