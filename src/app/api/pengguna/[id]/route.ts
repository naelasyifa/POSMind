import { getPayloadClient } from '@/lib/payload'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params

  const payload = await getPayloadClient()
  const body = await req.json()

  const data: any = {
    email: body.email,
    role: body.role,
    adminName: body.adminName,
  }

  // password hanya diupdate jika diisi
  if (body.password) {
    data.password = body.password
  }

  const updated = await payload.update({
    collection: 'users',
    id,
    data,
    overrideAccess: true

  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const payload = await getPayloadClient()

  await payload.delete({
    collection: 'users',
    id,
    overrideAccess: true,
  })

  return NextResponse.json({ success: true })
}
