export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

interface Media {
  id: string
  url: string
  filename?: string
  [key: string]: any
}

interface Promo {
  banner?: string | Media | null
  promoType?: string
  buyQuantity?: number
  freeQuantity?: number
  isMultiple?: boolean
  applicableProducts?: any[]
  [key: string]: any
}

//fungsi bxgy
function applyBxGyPromo(qtyBeli: number, X: number, Y: number, isMultiple: boolean = true) {
  if (qtyBeli <= 0) {
    return {
      qtyBayar: 0,
      qtyGratis: 0,
      items: [],
    }
  }

  // mode kelipatan (unlimited)
  if (isMultiple) {
    // total gratis berdasarkan kelipatan
    const totalBonus = Math.floor(qtyBeli / X) * Y

    // pola blok: X bayar + Y gratis
    const block = X + Y
    const fullBlock = Math.floor(qtyBeli / block)
    const sisa = qtyBeli % block

    let qtyBayar

    if (sisa <= X) qtyBayar = fullBlock * X + sisa
    else qtyBayar = fullBlock * X + X

    return {
      qtyBayar,
      qtyGratis: totalBonus,
      items: [
        { qty: qtyBayar, isFree: false },
        { qty: totalBonus, isFree: true },
      ],
    }
  }

  // mode tidak kelipatan → hanya 1x bonus
  const bonus = qtyBeli >= X ? Y : 0

  return {
    qtyBayar: qtyBeli - bonus,
    qtyGratis: bonus,
    items: [
      { qty: qtyBeli - bonus, isFree: false },
      ...(bonus > 0 ? [{ qty: bonus, isFree: true }] : []),
    ],
  }
}

// Fungsi untuk menentukan status promo berdasarkan tanggal mulai dan akhir
function autoStatus(mulai: string, akhir: string, startTime?: string, endTime?: string) {
  const now = new Date()
  const tMulai = mulai ? new Date(mulai) : null
  const tAkhir = akhir ? new Date(akhir) : null

  // 1. Cek Tanggal Akhir
  if (tAkhir) {
    // Set jam ke 23:59 agar promo berlaku sampai akhir hari tersebut
    const endOfDay = new Date(tAkhir)
    endOfDay.setHours(23, 59, 59, 999)
    if (endOfDay < now) return 'Nonaktif'
  }

  // 2. Cek Tanggal Mulai
  if (tMulai && tMulai > now) return 'Belum Dimulai'

  // 3. Cek Jam (Jika ada)
  if (startTime && endTime) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const startMinutes = sh * 60 + sm
    const endMinutes = eh * 60 + em

    // Jika waktu sekarang di luar jam operasional promo
    if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
      // Kita biarkan status tetap 'Aktif' di DB agar tidak gonta-ganti status tiap jam,
      // tapi nanti divalidasi di Kasir (DetailPesanan)
    }
  }

  return 'Aktif'
}

// Fungsi opsional untuk adjust kuota promo
async function adjustPromoQuota(payload: any, promoId: string, qty: number, increment = false) {
  const promo = await payload.findByID({ collection: 'promos', id: promoId })
  if (!promo) return
  const newQuota = increment ? promo.kuota + qty : promo.kuota - qty
  await payload.update({
    collection: 'promos',
    id: promoId,
    data: { kuota: newQuota },
  })
}

// Auto nonaktifkan promo jika tanggal akhir terlewat
async function autoDeactivateExpiredPromos(payload: any) {
  const now = new Date().toISOString()

  const promos = await payload.find({
    collection: 'promos',
    where: {
      akhir: { less_than: now },
      status: { equals: 'Aktif' },
    },
    limit: 200,
  })
  for (const p of promos.docs) {
    await payload.update({
      collection: 'promos',
      id: p.id,
      data: { status: 'Nonaktif' },
    })
  }
}

// create promo
export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const body = await req.json()

    if (!body.nama) return NextResponse.json({ error: 'nama is required' }, { status: 400 })
    if (!body.kode) return NextResponse.json({ error: 'kode is required' }, { status: 400 })
    if (!body.mulai || !body.akhir)
      return NextResponse.json({ error: 'mulai & akhir is required' }, { status: 400 })

    if (body.promoType === 'discount') {
      if (!body.tipeDiskon || body.nilaiDiskon == null) {
        return NextResponse.json(
          { error: 'tipeDiskon & nilaiDiskon is required for discount promo' },
          { status: 400 },
        )
      }
    } else if (body.promoType === 'bxgy') {
      if (body.buyQuantity == null || body.freeQuantity == null || !body.applicableProducts) {
        return NextResponse.json(
          { error: 'buyQuantity, freeQuantity & applicableProducts required for BXGY promo' },
          { status: 400 },
        )
      }
      if (!body.applicableProducts || body.applicableProducts.length === 0) {
        return NextResponse.json({ error: 'Pilih minimal 1 produk untuk BXGY' }, { status: 400 })
      }

      // default jika tidak dikirim dari frontend
      if (body.isMultiple === undefined) body.isMultiple = true
    }

    // AUTO SET STATUS
    body.status = autoStatus(body.mulai, body.akhir)
    // SET DEFAULT VALUES
    if (body.useQuota && body.kuota == null) body.kuota = 1
    if (!body.showOnDashboard) body.showOnDashboard = true

    const promo = await payload.create({ collection: 'promos', data: body })

    return NextResponse.json(promo)
  } catch (err: any) {
    console.error('ERROR CREATE PROMO:', err.stack || err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

//update promo
export async function PATCH(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { id, data } = await req.json()

    // PROTEKSI BANNER:
    // Jika data.banner adalah object (dari GET sebelumnya), ambil .id-nya saja.
    if (data.banner && typeof data.banner === 'object') {
      data.banner = data.banner.id
    }

    // Pastikan field 'bannerImage' (yang hanya untuk preview frontend) dihapus
    // agar tidak ikut dikirim ke Payload.update
    if ('bannerImage' in data) {
      delete data.bannerImage
    }

    const oldPromo = await payload.findByID({ collection: 'promos', id })
    const mulai = data.mulai ?? oldPromo.mulai
    const akhir = data.akhir ?? oldPromo.akhir
    const sTime = data.startTime ?? oldPromo.startTime
    const eTime = data.endTime ?? oldPromo.endTime

    data.status = autoStatus(mulai, akhir, sTime, eTime)

    const promo = await payload.update({ collection: 'promos', id, data })
    return NextResponse.json(promo)
  } catch (err: any) {
    console.error('ERROR UPDATE PROMO:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

//delete promo
export async function DELETE(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const deleted = await payload.delete({ collection: 'promos', id })
    return NextResponse.json(deleted)
  } catch (err: any) {
    console.error('ERROR DELETE PROMO:', err.stack || err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

//get promo
export async function GET(req: Request) {
  try {
    const payload = await getPayloadClient()

    // Auto nonaktif expired
    await autoDeactivateExpiredPromos(payload)

    const { searchParams } = new URL(req.url)
    const forDashboard = searchParams.get('dashboard') === '1' // ?dashboard=1

    const now = new Date()

    let where: any = {}
    if (forDashboard) {
      where = {
        status: { equals: 'Aktif' },
        showOnDashboard: { equals: true },
        mulai: { less_than_equal: now.toISOString() },
        akhir: { greater_than_equal: now.toISOString() },
      }
    }

    const promos = await payload.find({
      collection: 'promos',
      where,
      sort: '-mulai',
      limit: 100,
      depth: 1,
    })

    const promosWithBanner = promos.docs.map((p: Promo) => {
      // --- Banner aman anti error ---
      const banner =
        typeof p.banner === 'string'
          ? p.banner
          : p.banner && 'url' in p.banner
            ? p.banner.url
            : '/images/default-promo.jpg'

      // --- BXGY LOGIC ---
      let bxgyLogic = null

      if (p.promoType === 'bxgy') {
        bxgyLogic = applyBxGyPromo(
          10, // qty default (kasir hitung ulang)
          p.buyQuantity!, // X
          p.freeQuantity!, // Y
          p.isMultiple ?? true,
        )
      }

      return {
        ...p,
        banner,
        bxgyLogic,
      }
    })

    if (forDashboard) {
      // filter hari & jam hanya untuk dashboard
      const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
      const currentTime = now.getHours() * 60 + now.getMinutes()
      return NextResponse.json(
        promosWithBanner.filter((p: Promo) => {
          if (p.availableDays?.length && !p.availableDays.includes(dayOfWeek)) return false
          if (p.startTime && p.endTime) {
            const [startH, startM] = p.startTime.split(':').map(Number)
            const [endH, endM] = p.endTime.split(':').map(Number)
            const startMinutes = startH * 60 + startM
            const endMinutes = endH * 60 + endM
            if (currentTime < startMinutes || currentTime > endMinutes) return false
          }
          return true
        }),
      )
    }

    return NextResponse.json(promosWithBanner) // semua promo untuk admin
  } catch (err: any) {
    console.error('ERROR FETCH PROMOS:', err.stack || err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
