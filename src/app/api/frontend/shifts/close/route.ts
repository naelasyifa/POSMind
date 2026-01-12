import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: Request) {
  try {
    const payload = await getPayloadClient()

    // 🔐 AUTH WAJIB
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      shiftId,
      actualCash,
      actualNonCash,
      cashierNote,
      settlementConfirmed,
    } = body

    /* ================= VALIDASI ================= */
    if (!shiftId) {
      return NextResponse.json({ error: 'Shift ID wajib ada' }, { status: 400 })
    }

    if (!settlementConfirmed) {
      return NextResponse.json(
        { error: 'Settlement non-tunai belum dikonfirmasi' },
        { status: 400 }
      )
    }

    /* ================= AMBIL SHIFT ================= */
    const shiftResult = await payload.find({
      collection: 'shifts',
      where: {
        and: [
          { id: { equals: shiftId } },
          { status: { equals: 'open' } },
        ],
      },
      limit: 1,
      req, // 🔥 WAJIB
    })

    const shift = shiftResult.docs[0]

    if (!shift) {
      return NextResponse.json(
        { error: 'Shift tidak ditemukan atau sudah ditutup' },
        { status: 404 }
      )
    }

    /* ================= UPDATE SHIFT ================= */
    await payload.update({
      collection: 'shifts',
      id: shift.id,
      data: {
        actualCash,
        actualNonCash,
        closingNote: cashierNote,
        closingAction: true, // 🔑 trigger hook
      },
      req, // 🔥 INI KUNCI UTAMA
    })

    return NextResponse.json({
      success: true,
      message: 'Shift berhasil ditutup',
    })
  } catch (error: any) {
    console.error('CLOSE SHIFT ERROR:', error)
    return NextResponse.json(
      { error: error.message || 'Gagal menutup shift' },
      { status: 500 }
    )
  }
}
