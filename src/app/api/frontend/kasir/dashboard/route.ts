import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../../payloadClient'

export const runtime = 'nodejs'

type TableData = {
  id: string
  floor: string
  name: string
  status: string
  pax: number
  customer: string | null
}

export async function GET() {
  try {
    const payload = await getPayloadClient()

    /* ======================
       DATE SETUP (TODAY)
    ====================== */
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    /* ======================
       FETCH DATA
    ====================== */
    const [transactionsToday, tables, products] = await Promise.all([
      payload.find({
        collection: 'transactions',
        where: {
          createdAt: {
            greater_than_equal: today.toISOString(),
          },
        },
        limit: 500,
      }),
      payload.find({
        collection: 'tables',
        limit: 200,
      }),
      payload.find({
        collection: 'products',
        limit: 500,
      }),
    ])

    /* ======================
       TRANSACTION SUMMARY
    ====================== */
    const summary = {
      total: transactionsToday.totalDocs,
      selesai: 0,
      proses: 0,
      batal: 0,
      revenue: 0,
      cashIn: 0,
      customers: 0,
    }

    const paymentDetails: Record<
      string,
      { count: number; total: number }
    > = {}

    transactionsToday.docs.forEach((t: any) => {
      const amount = Number(t.total ?? t.totalAmount ?? 0)
      const status = t.status
      const method = t.paymentMethod ?? 'Unknown'

      // STATUS COUNT
      if (status === 'selesai') {
        summary.selesai++
        summary.revenue += amount

        if (method.toUpperCase() === 'CASH') {
          summary.cashIn += amount
        }
      } else if (status === 'dalam_proses') {
        summary.proses++
      } else if (status === 'dibatalkan') {
        summary.batal++
      }

      // PAYMENT DETAIL
      if (!paymentDetails[method]) {
        paymentDetails[method] = { count: 0, total: 0 }
      }

      paymentDetails[method].count++
      if (status === 'selesai') {
        paymentDetails[method].total += amount
      }
    })

    /* ======================
       TABLE OVERVIEW
    ====================== */
    const tableData: TableData[] = tables.docs.map((t: any) => ({
      id: String(t.id),
      floor: t.lantai ?? '-',
      name: t.namaMeja ?? '-',
      status: t.status ?? 'kosong',
      pax: Number(t.kapasitasTerpakai ?? 0),
      customer: t.namaPelanggan ?? null,
    }))

    summary.customers = tableData
      .filter((t) => t.status !== 'kosong')
      .reduce((sum, t) => sum + t.pax, 0)

    /* ======================
       LOW STOCK
    ====================== */
    const lowStocks = products.docs
      .filter((p: any) => (p.stock ?? 0) <= (p.minStock ?? 5))
      .map((p: any) => ({
        id: String(p.id),
        name: p.namaProduk ?? '-',
        qty: Number(p.stock ?? 0),
        threshold: Number(p.minStock ?? 5),
      }))

    /* ======================
       POPULAR PRODUCTS
    ====================== */
    const productMap: Record<string, number> = {}

    transactionsToday.docs.forEach((t: any) => {
      if (!Array.isArray(t.items)) return

      t.items.forEach((i: any) => {
        const name =
          i.nama ??
          i.product?.namaProduk ??
          null

        if (!name) return

        productMap[name] =
          (productMap[name] ?? 0) + Number(i.qty ?? 0)
      })
    })

    const popularProducts = Object.entries(productMap)
      .map(([name, timesOrdered]) => ({
        name,
        timesOrdered,
        imagePath: null,
      }))
      .sort((a, b) => b.timesOrdered - a.timesOrdered)
      .slice(0, 5)

    /* ======================
       ACTIVITY LOG
    ====================== */
    const activities = transactionsToday.docs.slice(0, 10).map((t: any) => ({
      id: String(t.id),
      text: `Transaksi ${t.status} • ${t.paymentMethod ?? '-'}`,
      time: t.createdAt,
    }))

    /* ======================
       RESPONSE
    ====================== */
    return NextResponse.json({
      summary,
      paymentDetails,
      tables: tableData,
      lowStocks,
      popularProducts,
      activities,
    })
  } catch (err: any) {
    console.error('KASIR DASHBOARD ERROR:', err)
    return NextResponse.json(
      {
        message: 'Gagal mengambil dashboard kasir',
        error: err.message,
      },
      { status: 500 },
    )
  }
}
