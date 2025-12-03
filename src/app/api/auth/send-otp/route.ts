import { NextResponse } from 'next/server'
import payload from 'payload' // pastikan ini jalan di server
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json(
        { error: true, message: 'Email wajib diisi' },
        { status: 400 }
      )
    }

    // generate OTP 6 digit
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 menit

    // cek apakah email sudah ada
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      // update OTP jika email sudah ada
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: { otp, otpExpiration },
      })
    } else {
      // buat user sementara
      await payload.create({
        collection: 'users',
        data: {
          email,
          otp,
          otpExpiration,
          emailVerified: false,
          isBusinessUser: true,
        },
      })
    }

    // kirim OTP ke email
    await payload.sendEmail({
      to: email,
      subject: 'Kode OTP POS Mind',
      html: `<h3>Kode OTP kamu: ${otp}</h3>`,
    })

    return NextResponse.json({ success: true, message: 'OTP terkirim!' })
  } catch (err) {
    console.error('[SEND-OTP ERROR]', err)
    return NextResponse.json(
      { error: true, message: 'Gagal mengirim OTP' },
      { status: 500 }
    )
  }
}