import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { email, password } = await req.json()

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (!result?.user || !result?.token) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    return NextResponse.json({
      token: result.token,
      role: result.user.role,
      user: {
        id: result.user.id,
        email: result.user.email,
      },
    })
  } catch (err: any) {
    console.error('LOGIN ERROR:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan saat login' }, { status: 500 })
  }
}
