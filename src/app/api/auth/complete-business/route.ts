import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  try {
    const { email, adminName, businessName, businessField, businessType, address } =
      await req.json()

    if (!email) {
      return NextResponse.json({ error: true, message: 'Email wajib diisi' }, { status: 400 })
    }

    const found = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (found.totalDocs === 0) {
      return NextResponse.json(
        { error: true, message: 'Email belum verifikasi OTP' },
        { status: 400 },
      )
    }

    const user = found.docs[0]

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: true, message: 'Email belum diverifikasi' },
        { status: 400 },
      )
    }

    // 1. CREATE TENANT
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        businessName,
        businessField,
        businessType,
        address,
        owner: user.id,
        createdBy: user.id,
      },
    })

    // 2. UPDATE USER with tenant + role
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        adminName,
        businessField,
        businessType,
        address,
        tenant: tenant.id,
        role: 'admintoko',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[COMPLETE-BUSINESS ERROR]', err)
    return NextResponse.json({ error: true, message: 'Internal Server Error' }, { status: 500 })
  }
}
