import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token dan password wajib' }, { status: 400 })
    }

    await payload.resetPassword({
      collection: 'users',
      data: {
        token,
        password,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('RESET PASSWORD ERROR:', err)
    return NextResponse.json({ error: 'Reset password gagal' }, { status: 500 })
  }
}
