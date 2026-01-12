import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayloadClient()
    const body = await req.json()

    const email = body.email
    const password = body.password
    const phone = body.phone
    const businessName = body.businessName

    if (!email) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 })
    }

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    // ===============================
    // 🚫 BLOK RESEND JIKA OTP MASIH AKTIF
    // ===============================
    if (
      existing.totalDocs > 0 &&
      existing.docs[0].otpExpiration &&
      new Date(existing.docs[0].otpExpiration) > new Date()
    ) {
      return NextResponse.json({ error: 'OTP masih berlaku, silakan cek email' }, { status: 400 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiration = new Date(Date.now() + 5 * 60 * 1000)

    // ===============================
    // 👤 USER BARU (REGISTER)
    // ===============================
    if (existing.totalDocs === 0) {
      if (!password || !businessName) {
        return NextResponse.json({ error: 'Password dan Nama Bisnis wajib diisi' }, { status: 400 })
      }

      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          phone,
          tempBusinessName: businessName,
          otp,
          otpExpiration: expiration,
          emailVerified: false,
          isBusinessUser: true,
          role: 'admintoko',
        },
        overrideAccess: true,
      })
    }

    // ===============================
    // 🔁 RESEND OTP (USER SUDAH ADA)
    // ===============================
    else {
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: {
          otp,
          otpExpiration: expiration,
        },
        overrideAccess: true,
      })
    }

    await payload.sendEmail({
      to: email,
      subject: 'Kode OTP POSMind',
      html: `<h2>${otp}</h2><p>Berlaku selama 5 menit</p>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[SEND-OTP ERROR]', err)
    return NextResponse.json({ error: 'Gagal mengirim OTP' }, { status: 500 })
  }
}
