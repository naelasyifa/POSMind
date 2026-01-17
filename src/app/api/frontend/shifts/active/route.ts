// src/app/api/frontend/shifts/active/route.ts
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET(req: Request) {
  try {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: req.headers })

    if (!user) {
      return NextResponse.json({ active: false }, { status: 401 })
    }

    const result = await payload.find({
      collection: 'shifts',
      where: {
        cashier: { equals: user.id },
        status: { equals: 'open' },
      },
      depth: 1, // 🔥 PENTING: Supaya data cashier ditarik lengkap (termasuk email)
      sort: '-openedAt',
      limit: 1,
    })

    if (result.totalDocs === 0) {
      return NextResponse.json({ active: false })
    }

    return NextResponse.json({
      active: true,
      shift: result.docs[0],
    })
  } catch (error) {
    return NextResponse.json({ active: false }, { status: 500 })
  }
}