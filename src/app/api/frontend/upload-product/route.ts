import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: 'Image base64 tidak ditemukan' }, { status: 400 })
    }

    const base64Data = image.split(';base64,').pop()
    if (!base64Data) {
      return NextResponse.json({ error: 'Format Base64 tidak valid' }, { status: 400 })
    }

    const buffer = Buffer.from(base64Data, 'base64')

    const payload = await getPayloadClient()
    const uploaded = await payload.create({
      collection: 'media',
      data: {},
      file: {
        name: `upload-${Date.now()}.png`, // ✔ pakai "name", bukan "filename"
        data: buffer,
        mimetype: 'image/png',
      },
    })

    return NextResponse.json({
      id: uploaded.id,
      url: uploaded.url,
    })
  } catch (err) {
    console.error('UPLOAD ERROR:', err)
    return NextResponse.json({ error: 'Upload gagal' }, { status: 500 })
  }
}
