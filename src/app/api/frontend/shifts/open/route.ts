// src/app/api/frontend/shifts/open/route.ts
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: req.headers }) 
    
    if (!user) {
      return NextResponse.json({ message: 'Sesi habis, silakan login ulang' }, { status: 401 })
    }

    const body = await req.json()
    const { shiftName, openingCash, openingNote = '' } = body

    if (!shiftName || openingCash === undefined) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 })
    }

    // Cek apakah user sudah punya shift yang masih 'open'
    const activeShift = await payload.find({
      collection: 'shifts',
      where: {
        and: [
          { cashier: { equals: user.id } },
          { status: { equals: 'open' } },
        ],
      },
    })

    if (activeShift.totalDocs > 0) {
      return NextResponse.json({ message: 'Anda masih memiliki shift aktif' }, { status: 400 })
    }

    // Buat shift baru
    const newShift = await payload.create({
    collection: 'shifts',
    data: {
      shiftName,
      openingCash: Number(openingCash),
      openingNote,
      cashier: user.id,
      cashierEmail: user.email,
    },
    req, // 🔥 WAJIB
  })

    return NextResponse.json({ message: 'Shift berhasil dibuka', data: newShift }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 })
  }
}