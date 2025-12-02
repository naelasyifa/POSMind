import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: true, message: 'Email dan kode OTP wajib diisi' },
        { status: 400 },
      )
    }

    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })

    const user = users.docs[0]
    if (!user) {
      return NextResponse.json({ error: true, message: 'User tidak ditemukan' }, { status: 404 })
    }

    // Pastikan field tersedia dan valid
    if (!user.otp || !user.otpExpiration) {
      return NextResponse.json(
        { error: true, message: 'OTP tidak tersedia atau sudah digunakan' },
        { status: 400 },
      )
    }

    const expiration = new Date(user.otpExpiration)
    const now = new Date()

    if (user.otp !== code || expiration < now) {
      return NextResponse.json(
        { error: true, message: 'OTP salah atau sudah kadaluarsa' },
        { status: 400 },
      )
    }

    // Update status verifikasi
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        emailVerified: true,
        otp: null,
        otpExpiration: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[VERIFY-OTP ERROR]', err)
    return NextResponse.json({ error: true, message: 'Verifikasi gagal' }, { status: 500 })
  }
}
