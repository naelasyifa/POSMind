import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/app/payloadClient'

export async function PATCH(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'ID wajib dikirim' }, { status: 400 })
    }

    const updated = await payload.update({
      collection: 'notifications',
      id,
      data: { isRead: true },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
