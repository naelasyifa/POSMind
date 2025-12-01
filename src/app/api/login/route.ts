import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const dummyUsers = [
    { id: '1', email: 'kasir@tokoku.com', password: '123456', role: 'kasir', tenantId: 'tenantA' },
    { id: '2', email: 'admin@tokoku.com', password: '123456', role: 'admin', tenantId: 'tenantA' },
  ]

  const user = dummyUsers.find((u) => u.email === email && u.password === password)
  if (!user) return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'SECRET_KEY_POSMIND')
  const token = await new SignJWT({
    userId: user.id,
    role: user.role,
    tenantId: user.tenantId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(secret)

  return NextResponse.json({ message: 'Login berhasil', token, role: user.role })
}
