import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 })
    }

    await payload.forgotPassword({
      collection: 'users',
      data: { email },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('FORGOT PASSWORD ERROR:', err)
    return NextResponse.json(
      { error: 'Gagal mengirim email reset password' },
      { status: 500 },
    )
  }
}
