import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('banner')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const payload = await getPayloadClient()

    const uploaded = await payload.create({
      collection: 'media',
      file: {
        name: file.name,
        data: buffer,
        mimetype: file.type,
      },
      data: {
        alt: file.name,
      },
    })

    return NextResponse.json({
      success: true,
      id: uploaded.id,
      url: uploaded.url,
    })
  } catch (err: any) {
    console.error('UPLOAD ERROR:', err)
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Upload gagal' },
      { status: 500 },
    )
  }
}
