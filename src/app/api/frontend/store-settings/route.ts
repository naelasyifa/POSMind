import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/app/payloadClient'

export async function GET() {
  const payload = await getPayloadClient()

  try {
    const data = await payload.find({
      collection: 'storeSettings',
      limit: 1,
    })

    if (!data.docs.length) {
      return NextResponse.json({ message: 'Settings not found' }, { status: 404 })
    }

    const settings = data.docs[0]

    return NextResponse.json({
      ...settings,
      jamBuka: settings.jamBuka ?? [], // pastikan selalu array
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const payload = await getPayloadClient()
  const body = await req.json()

  try {
    const existing = await payload.find({
      collection: 'storeSettings',
      limit: 1,
    })

    let updated
    if (!existing.docs.length) {
      // jika belum ada, buat baru
      updated = await payload.create({
        collection: 'storeSettings',
        data: { ...body },
      })
    } else {
      // jika ada, update
      updated = await payload.update({
        collection: 'storeSettings',
        id: existing.docs[0].id,
        data: body,
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
