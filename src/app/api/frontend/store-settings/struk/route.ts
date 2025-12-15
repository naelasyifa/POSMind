import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/app/payloadClient'

// GET — ambil struk + pajak + service
export async function GET() {
  const payload = await getPayloadClient()

  try {
    const data = await payload.find({
      collection: 'storeSettings',
      limit: 1,
      depth: 2,
    })

    if (!data.docs.length) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    const s = data.docs[0]

    const merged = {
      ...s.struk,
      storeName: s.storeName,
      tenant: s.tenant,
      pajakPercentage: s.pajakPercentage,
      serviceChargePercentage: s.serviceChargePercentage,
    }

    return NextResponse.json(merged)
  } catch (err) {
    console.error('GET struk error', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

// PATCH — update group struk saja
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
        struk: {
          ...current.struk,
          ...body, // header/footer/logo/options/paperSize
        },
      },
    })

    return NextResponse.json(updated.struk)
  } catch (err) {
    console.error('PATCH struk error', err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
