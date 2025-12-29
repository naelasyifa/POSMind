import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../../payloadClient'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const tables = await payload.find({
      collection: 'tables',
      sort: 'namaMeja',
      limit: 100,
    })

    return NextResponse.json({
      success: true,
      data: tables.docs,
    })
  } catch (error) {
    console.error('GET kasir tables error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data meja',
      },
      { status: 500 }
    )
  }
}
