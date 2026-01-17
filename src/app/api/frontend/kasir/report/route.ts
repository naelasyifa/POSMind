import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../../payloadClient'

/* =====================
 * TYPES (MINIMAL & AMAN)
 * ===================== */
type Transaction = {
  id: string
  grandTotal?: number
  paymentMethod?: string
  createdAt?: string
}

type Reservation = {
  customerName?: string
  grandTotal?: number
  dpAmount?: number
}

export async function GET(req: Request) {
  try {
    const payload = await getPayloadClient()

    /* =====================
     * AUTH (COOKIE BASED)
     * ===================== */
    const { user } = await payload.auth({
      headers: req.headers,
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    /* =====================
     * QUERY PARAM
     * ===================== */
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    const startDate = date
      ? new Date(`${date}T00:00:00`)
      : new Date()

    const endDate = date
      ? new Date(`${date}T23:59:59`)
      : new Date()

    /* =====================
     * TRANSACTIONS
     * ===================== */
    const trxRes = await payload.find({
      collection: 'transactions',
      where: {
        createdAt: {
          greater_than_equal: startDate.toISOString(),
          less_than_equal: endDate.toISOString(),
        },
      },
      limit: 1000,
    })

    const transactions = trxRes.docs as Transaction[]

    /* =====================
     * SUMMARY
     * ===================== */
    const totalSales = transactions.reduce(
      (sum: number, t: Transaction) => sum + (t.grandTotal ?? 0),
      0
    )

    const paymentMap: Record<string, number> = {}

    transactions.forEach((t: Transaction) => {
      const type = t.paymentMethod ?? 'LAINNYA'
      paymentMap[type] =
        (paymentMap[type] ?? 0) + (t.grandTotal ?? 0)
    })

    const paymentDetails = Object.entries(paymentMap).map(
      ([type, value]) => ({
        type,
        value,
        percentage:
          totalSales > 0
            ? Math.round((value / totalSales) * 100)
            : 0,
      })
    )

    /* =====================
     * RESERVATIONS & DP
     * ===================== */
    const reservationRes = await payload.find({
      collection: 'reservations',
      where: {
        createdAt: {
          greater_than_equal: startDate.toISOString(),
          less_than_equal: endDate.toISOString(),
        },
      },
      limit: 500,
    })

    const reservations = reservationRes.docs as Reservation[]

    const dpReceived = reservations.reduce(
      (sum, r) => sum + (r.dpAmount ?? 0),
      0
    )

    /* =====================
     * RESPONSE FINAL
     * ===================== */
    return NextResponse.json({
      summary: {
        netSales: totalSales,
        totalTransactions: transactions.length,
        averageTransactionValue:
          transactions.length > 0
            ? Math.round(totalSales / transactions.length)
            : 0,
      },

      paymentDetails,

      reservations: {
        dpReceived,
        dpUsed: dpReceived,
        transactions: reservations.map((r) => ({
          name: r.customerName ?? '-',
          billTotal: r.grandTotal ?? 0,
          dpUsed: r.dpAmount ?? 0,
          cashierReceived:
            (r.grandTotal ?? 0) - (r.dpAmount ?? 0),
        })),
      },

      audit: {
        startingCash: 0,
        expectedCash: totalSales,
        actualCash: totalSales,
        notes: 'Audit otomatis sistem',
      },

      meta: {
        cashierName: user.email,
        date: startDate.toISOString().split('T')[0],
      },
    })
  } catch (error: any) {
    console.error('REPORT ERROR:', error)

    return NextResponse.json(
      {
        message: 'Gagal mengambil laporan kasir',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
