import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getPaymentHeaders } from '@/utils/payment-api'
import { NextResponse } from 'next/server'

export async function POST() {
  // Gunakan getPayload sesuai rekomendasi terbaru
  const payload = await getPayload({ config: configPromise })
  const apiURL = `${process.env.PAYMENT_BASE_URL}/transfer/api/v1/method`

  try {
    // Ambil Header dengan Signature (Auth)
    const headers = await getPaymentHeaders('GET')

    const response = await fetch(apiURL, {
      method: 'GET',
      headers: headers as any,
      cache: 'no-store', // Hindari caching API sandbox
    })

    const result = await response.json()

    if (!result.status) {
      return NextResponse.json({ error: result.message || 'Gagal dari API Pusat' }, { status: 400 })
    }

    // Iterasi data hasil fetch
    for (const item of result.data) {
      // Pastikan pencarian berdasarkan externalId dilakukan dengan benar
      const existing = await payload.find({
        collection: 'payment-methods',
        where: {
          externalId: { equals: item.id },
        },
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'payment-methods',
          data: {
            name: item.name,
            externalId: item.id,
            code: item.code,
            isActive: true,
            // Tambahkan pengecekan null pada category
            type: mapCategoryToType(item.category || ''),
          },
        })
      }
    }

    return NextResponse.json({ message: 'Sync Berhasil' })
  } catch (error: any) {
    console.error('Error Detail:', error) // Lihat error sebenarnya di terminal
    return NextResponse.json({ error: 'Gagal Sync: ' + error.message }, { status: 500 })
  }
}

function mapCategoryToType(cat: string) {
  if (cat === 'Virtual Account') return 'bank_transfer'
  if (cat === 'E-Wallet') return 'ewallet'
  if (cat === 'Other' || cat.toLowerCase().includes('qris')) return 'qris'
  return 'cash' // default
}
