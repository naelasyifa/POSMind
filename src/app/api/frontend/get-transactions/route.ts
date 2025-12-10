export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const data = await payload.find({
      collection: 'transactions',
      sort: '-createdAt',
    })

    return NextResponse.json(data.docs)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
