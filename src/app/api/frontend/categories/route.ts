import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

export const runtime = 'nodejs'

// GET categories dengan count produk
export async function GET() {
  try {
    const payload = await getPayloadClient()
    const categories = await payload.find({
      collection: 'categories',
      limit: 100,
      depth: 1,
    })

    const products = await payload.find({
      collection: 'products',
      limit: 100,
      depth: 1,
    })

    // hitung jumlah produk per kategori
    const categoryData = categories.docs.map((c: any) => {
      const count = products.docs.filter((p: any) => p.kategori?.id === c.id).length
      return {
        id: c.id,
        name: c.nama,
        count,
        ikon: c.ikon,
      }
    })

    // total semua produk
    const totalCount = products.docs.length

    // tambahkan "Semua" di awal
    const data = [
      {
        id: 'all', // <--- ganti dari 0 ke 'all'
        name: 'Semua',
        count: totalCount,
        ikon: undefined,
      },
      ...categoryData,
    ]

    return NextResponse.json(data)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const form = await req.formData()

    const nama = form.get('nama') as string
    const ikonFile = form.get('iconFile') as File | null

    let mediaId: string | undefined

    if (ikonFile) {
      const arrayBuffer = await ikonFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploaded = await payload.create({
        collection: 'media',
        file: {
          name: ikonFile.name,
          data: buffer,
          mimetype: ikonFile.type,
        },
        data: { alt: nama },
      })

      mediaId = uploaded.id
    }

    const category = await payload.create({
      collection: 'categories',
      data: {
        nama,
        ikon: mediaId,
      },
    })

    return NextResponse.json(category)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// UPDATE category
export async function PATCH(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { id, nama, ikonId } = await req.json()

    const updated = await payload.update({
      collection: 'categories',
      id,
      data: {
        nama,
        ikon: ikonId ? { relationTo: 'media', value: ikonId } : undefined,
      },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE category
export async function DELETE(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { id } = await req.json()

    const deleted = await payload.delete({
      collection: 'categories',
      id,
    })

    return NextResponse.json({ success: true, deleted })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
