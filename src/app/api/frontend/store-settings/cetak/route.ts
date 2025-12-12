import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/app/payloadClient'

// GET — ambil pengaturan dapur
export async function GET() {
  const payload = await getPayloadClient()

  try {
    // Ambil 1 storeSettings saja
    const data = await payload.find({
      collection: 'storeSettings',
      limit: 1,
      depth: 2,
    })

    if (!data.docs.length) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    const s = data.docs[0]

    // Kembalikan hanya group dapur
    const dapurData = {
      ...s.dapur,
      storeName: s.storeName,
      tenant: s.tenant,
    }

    return NextResponse.json(dapurData)
  } catch (err) {
    console.error('GET dapur error', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

// PATCH — update group dapur saja
export async function PATCH(req: Request) {
  const payload = await getPayloadClient()
  const body = await req.json()

  try {
    const existing = await payload.find({
      collection: 'storeSettings',
      limit: 1,
    })

    if (!existing.docs.length) {
      return NextResponse.json({ message: 'Tidak ada storeSettings' }, { status: 404 })
    }

    const current = existing.docs[0]

    const updated = await payload.update({
      collection: 'storeSettings',
      id: current.id,
      data: {
        dapur: {
          ...current.dapur,
          ...body, // update options atau field lain di group dapur
        },
      },
    })

    return NextResponse.json(updated.dapur)
  } catch (err) {
    console.error('PATCH dapur error', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
