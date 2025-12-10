import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/app/payloadClient'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('logo')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const payload = await getPayloadClient()

    // 1. Upload ke media
    const media = await payload.create({
      collection: 'media',
      file: {
        name: file.name,
        data: buffer,
        mimetype: file.type,
      },
      data: { alt: file.name },
    })

    // 2. Ambil storeSettings
    const existing = await payload.find({
      collection: 'storeSettings',
      limit: 1,
    })

    // 3. Update storeSettings.struk.logo = media.id
    if (existing.docs.length) {
      await payload.update({
        collection: 'storeSettings',
        id: existing.docs[0].id,
        data: {
          struk: {
            ...existing.docs[0].struk,
            logo: media.id,
          },
        },
      })
    } else {
      await payload.create({
        collection: 'storeSettings',
        data: {
          struk: {
            logo: media.id,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      id: media.id,
      url: media.url,
    })
  } catch (err: any) {
    console.error('UPLOAD LOGO ERROR:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
