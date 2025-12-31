import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { email, adminName, businessField, businessType, address, businessName } =
      await req.json()

    // 1️⃣ Cari user
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 })
    }

    const user = existing.docs[0]

    // 2️⃣ Pastikan email sudah terverifikasi
    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Email belum diverifikasi' },
        { status: 403 },
      )
    }

    // 3️⃣ Pastikan belum punya tenant
    if (user.tenant) {
      return NextResponse.json({ success: false, message: 'Tenant sudah dibuat' }, { status: 400 })
    }

    // 4️⃣ Ambil businessName (BODY > TEMP)
    const finalBusinessName =
      typeof businessName === 'string' && businessName.trim()
        ? businessName.trim()
        : typeof user.tempBusinessName === 'string'
          ? user.tempBusinessName.trim()
          : ''

    if (!finalBusinessName) {
      return NextResponse.json(
        { success: false, message: 'Nama bisnis tidak valid' },
        { status: 400 },
      )
    }

    // 5️⃣ Buat tenant
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: finalBusinessName,
        createdBy: user.id,
      },
      overrideAccess: true,
    })

    // 6️⃣ Update user (FINAL)
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        adminName,
        businessField,
        businessType,
        address,
        businessName: finalBusinessName, // 🔥 INI YANG KURANG
        tenant: tenant.id,
        tempBusinessName: null,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[COMPLETE-BUSINESS ERROR]', err)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
