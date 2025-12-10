// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    const products = await payload.find({
      collection: 'products',
      limit: 100,
      sort: 'nama',
    })

    const data = products.docs.map((p: any) => ({
      id: p.id,
      nama: p.nama,
      kategori: p.kategori,
      harga: p.harga,
      stok: p.stok,
      gambar: p.gambar,
      deskripsi: p.deskripsi,
    }))

    return NextResponse.json(data) // ← penting: langsung array
  } catch (err: any) {
    console.error('ERROR FETCH PRODUCTS:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
