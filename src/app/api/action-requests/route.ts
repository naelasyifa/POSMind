import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()

    const { actionType, payloadData } = body

    const authResult = await payload.auth({ headers: req.headers })
    const user = authResult?.user

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'kasir') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!user.tenant) {
      return NextResponse.json({ error: 'User has no tenant' }, { status: 400 })
    }

    const doc = await payload.create({
      collection: 'action-requests',
      data: {
        actionType,
        payload: payloadData,
        tenant: user.tenant,
        createdBy: user.id,
        status: 'pending',
      },
      user,
    })

    return NextResponse.json({ success: true, doc })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
