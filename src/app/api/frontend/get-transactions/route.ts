export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/app/payloadClient'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const data = await payload.find({
      collection: 'transactions',
      sort: '-createdAt',
      depth: 2,
    })

    return NextResponse.json(data.docs)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
