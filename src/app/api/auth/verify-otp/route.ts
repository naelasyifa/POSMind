import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email dan OTP wajib diisi' },
        { status: 400 },
      )
    }

    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    const user = users.docs[0]
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 },
      )
    }

    if (!user.otp || !user.otpExpiration) {
      return NextResponse.json(
        { success: false, message: 'OTP tidak tersedia atau sudah digunakan' },
        { status: 400 },
      )
    }

    // 🔐 cek OTP
    if (String(user.otp) !== String(otp)) {
      return NextResponse.json(
        { success: false, message: 'OTP salah' },
        { status: 400 },
      )
    }

    // ⏰ cek expired
    if (new Date(user.otpExpiration).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: 'OTP sudah kedaluwarsa' },
        { status: 400 },
      )
    }

    // ✅ update user
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
    return NextResponse.json(
      { success: false, message: 'Verifikasi gagal' },
      { status: 500 },
    )
  }
}
