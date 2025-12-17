import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  try {
    const { email, adminName, businessField, businessType, address } = await req.json()

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 400 })
    }

    const user = existing.docs[0]

    // 🔒 VALIDASI NAMA BISNIS
    const rawBusinessName = user.businessName
    const businessName = typeof rawBusinessName === 'string' ? rawBusinessName.trim() : ''

    if (!businessName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nama bisnis belum diisi atau tidak valid',
        },
        { status: 400 },
      )
    }

    // 🟢 BUAT TENANT
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: businessName,
        createdBy: user.id,
      },
    })

    // 🟢 UPDATE USER
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        adminName,
        businessField,
        businessType,
        address,
        tenant: tenant.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[COMPLETE-BUSINESS ERROR]', err)
    return NextResponse.json({ success: false, message: 'Internal Error' }, { status: 500 })
  }
}
