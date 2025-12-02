export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const today = `${y}${m}${d}`

    const prefix = `PSN-${today}-`

    // Ambil transaksi terbaru hari ini
    const latest = await payload.find({
      collection: 'transactions',
      limit: 1,
      sort: '-createdAt',
      where: {
        noPesanan: {
          starts_with: prefix,
        },
      },
    })

    let nextSeq = 1
    if (latest.docs.length > 0) {
      const lastNo = latest.docs[0].noPesanan
      const lastSeq = parseInt(lastNo.replace(prefix, ''), 10)
      if (!isNaN(lastSeq)) nextSeq = lastSeq + 1
    }

    const newNo = `${prefix}${String(nextSeq).padStart(4, '0')}`

    return NextResponse.json({ noPesanan: newNo })
  } catch (err: any) {
    console.error('ERROR GENERATE NO:', err.stack || err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
