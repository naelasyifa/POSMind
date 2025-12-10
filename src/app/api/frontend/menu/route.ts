import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

export const runtime = 'nodejs'

// GET semua produk dengan kategori & media
export async function GET() {
  try {
    const payload = await getPayloadClient()
    const products = await payload.find({
      collection: 'products',
      limit: 100,
      depth: 1, // supaya relasi kategori & media bisa terbaca
    })

    // transform supaya kategori selalu ada
    // transform supaya kategori selalu ada
    const data = products.docs.map((p: any) => ({
      id: p.id,
      nama: p.nama,
      kategori: p.kategori ? { id: p.kategori.id, nama: p.kategori.nama } : { id: '', nama: '' },
      harga: p.harga,
      stok: p.stok,
      gambar: p.gambar,
      deskripsi: p.deskripsi,
      status: p.status,
      tenant: p.tenant,
      sku: p.sku || `SKU-${p.id}`,
      useAutoSku: !p.sku,
    }))

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('ERROR FETCH PRODUCTS:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// CREATE product
export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const data = await req.json()

    const created = await payload.create({
      collection: 'products',
      data: {
        nama: data.name,
        kategori: data.kategori, // harus ID category
        harga: data.price,
        stok: data.stock,
        gambar: data.image ? { relationTo: 'media', value: data.image } : undefined,
        status: 'aktif',
        tenant: data.tenant || null,
        deskripsi: data.deskripsi || '',
      },
    })

    return NextResponse.json(created)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// UPDATE product
export async function PATCH(req: Request) {
  try {
    const payload = await getPayloadClient()
    const data = await req.json()
    if (!data.id) return NextResponse.json({ error: 'ID produk dibutuhkan' }, { status: 400 })

    const updated = await payload.update({
      collection: 'products',
      id: data.id,
      data: {
        nama: data.name,
        kategori: data.category,
        harga: data.price,
        stok: data.stock,
        gambar: data.image ? { relationTo: 'media', value: data.image } : undefined,
        status: data.status || 'aktif',
      },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID produk dibutuhkan' }, { status: 400 })

    await payload.delete({
      collection: 'products',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
