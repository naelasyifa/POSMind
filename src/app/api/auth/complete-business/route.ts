import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  try {
    const { email, adminName, businessField, businessType, address } = await req.json()

    if (!email) return NextResponse.json({ error: true, message: 'Email wajib diisi' }, { status: 400 })

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      return NextResponse.json({ error: true, message: 'Email belum verifikasi OTP' }, { status: 400 })
    }

    const user = existing.docs[0]

    // update data bisnis
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        adminName,
        businessField,
        businessType,
        address,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[COMPLETE-BUSINESS ERROR]', err)
    return NextResponse.json({ error: true, message: 'Internal Error' }, { status: 500 })
  }
}
