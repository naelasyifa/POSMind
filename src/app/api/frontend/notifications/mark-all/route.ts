import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/app/payloadClient'

export async function PATCH() {
  try {
    const payload = await getPayloadClient()

    await payload.update({
      collection: 'notifications',
      where: { isRead: { equals: false } },
      data: { isRead: true },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
