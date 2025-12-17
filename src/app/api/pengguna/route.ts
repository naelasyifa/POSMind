import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  const payload = await getPayloadClient()

  const users = await payload.find({
    collection: 'users',
    sort: 'createdAt',
  })

  return NextResponse.json(users.docs)
}

export async function POST(req: Request) {
  const payload = await getPayloadClient()
  const body = await req.json()

  const user = await payload.create({
    collection: 'users',
    data: {
      email: body.email,
      password: body.password,
      role: body.role,

      adminName: body.adminName,

      // 🔥 KUNCI UTAMA (WAJIB)
      businessName: body.businessName || body.adminName || 'Bisnis Baru',

      isBusinessUser: true,
      emailVerified: true,
    },
    overrideAccess: true, // 🔐 WAJIB UNTUK AUTH COLLECTION
  })

  return NextResponse.json(user)
}
