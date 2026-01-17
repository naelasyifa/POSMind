import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../../payloadClient'

export const runtime = 'nodejs'

export async function GET() {
  const payload = await getPayloadClient()

  /* ==========================
   DATE SETUP
  ========================== */
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const last7Days = new Date(today)
  last7Days.setDate(today.getDate() - 6)

  const last30Days = new Date(today)
  last30Days.setDate(today.getDate() - 29)

  /* ==========================
   SUMMARY CARDS
  ========================== */
  const [tables, reservationsToday, transactionsToday, products] =
    await Promise.all([
      payload.find({ collection: 'tables', limit: 1000 }),
      payload.find({
        collection: 'reservations',
        where: { createdAt: { greater_than_equal: today } },
      }),
      payload.find({
        collection: 'transactions',
        where: { createdAt: { greater_than_equal: today } },
      }),
      payload.find({ collection: 'products', limit: 1000 }),
    ])

  const omzetHariIni = transactionsToday.docs.reduce(
    (sum: number, t: any) => sum + (t.totalAmount ?? 0),
    0,
  )

  /* ==========================
   SALES OVERVIEW (30 DAYS)
  ========================== */
  const sales30Days = await payload.find({
    collection: 'transactions',
    where: { createdAt: { greater_than_equal: last30Days } },
    limit: 1000,
  })

  const salesOverviewMap: Record<
    string,
    { penjualan: number; pendapatan: number }
  > = {}

  sales30Days.docs.forEach((t: any) => {
    const date =
      typeof t.createdAt === 'string'
        ? t.createdAt.slice(0, 10)
        : t.createdAt.toISOString().slice(0, 10)

    if (!salesOverviewMap[date]) {
      salesOverviewMap[date] = { penjualan: 0, pendapatan: 0 }
    }

    salesOverviewMap[date].penjualan += 1
    salesOverviewMap[date].pendapatan += t.totalAmount ?? 0
  })

  const salesOverview = Object.entries(salesOverviewMap).map(
    ([name, v]) => ({
      name,
      penjualan: v.penjualan,
      pendapatan: v.pendapatan,
    }),
  )

  /* ==========================
   RESERVATION SUMMARY
  ========================== */
  const mejaTerisi = tables.docs.filter(
    (t: any) => t.status === 'occupied',
  ).length

  const persenMejaTerisi =
    tables.totalDocs > 0
      ? Math.round((mejaTerisi / tables.totalDocs) * 100)
      : 0

  /* ==========================
   CASHIER PERFORMANCE
  ========================== */
  const cashierMap: Record<
    string,
    { name: string; transaksi: number; total: number }
  > = {}

  transactionsToday.docs.forEach((t: any) => {
    const cashier = t.cashier?.name ?? 'Unknown'

    if (!cashierMap[cashier]) {
      cashierMap[cashier] = {
        name: cashier,
        transaksi: 0,
        total: 0,
      }
    }

    cashierMap[cashier].transaksi += 1
    cashierMap[cashier].total += t.totalAmount ?? 0
  })

  const cashierPerformance = Object.values(cashierMap)

  /* ==========================
   PRODUCT STOCK ALERT
  ========================== */
  const stokMenipis = products.docs.filter(
    (p: any) => (p.stock ?? 0) <= 5,
  )

  /* ==========================
   ORDER TYPE SHARE
  ========================== */
  const orderTypeCount: Record<string, number> = {}

  transactionsToday.docs.forEach((t: any) => {
    const type = t.orderType ?? 'Lainnya'
    orderTypeCount[type] = (orderTypeCount[type] || 0) + 1
  })

  const totalOrder = transactionsToday.totalDocs || 1

  const orderTypeShare = Object.entries(orderTypeCount).map(
    ([name, value]) => ({
      name,
      value: Math.round((value / totalOrder) * 100),
    }),
  )

  /* ==========================
   RESERVATION CHART (30 DAYS)
  ========================== */
  const reservation30Days = await payload.find({
    collection: 'reservations',
    where: { createdAt: { greater_than_equal: last30Days } },
    limit: 1000,
  })

  const reservationMap: Record<string, number> = {}

  reservation30Days.docs.forEach((r: any) => {
    const date =
      typeof r.createdAt === 'string'
        ? r.createdAt.slice(0, 10)
        : r.createdAt.toISOString().slice(0, 10)

    reservationMap[date] = (reservationMap[date] || 0) + 1
  })

  const reservationChart30Days = Object.entries(reservationMap).map(
    ([date, reservations]) => ({ date, reservations }),
  )

  /* ==========================
   SALES BY CATEGORY
  ========================== */
  const categoryMap: Record<string, number> = {}

  sales30Days.docs.forEach((t: any) => {
    t.items?.forEach((i: any) => {
      const cat = i.category?.name
      if (!cat) return
      categoryMap[cat] = (categoryMap[cat] || 0) + (i.qty ?? 0)
    })
  })

  const salesByCategory = Object.entries(categoryMap).map(
    ([nama, jumlah]) => ({ nama, jumlah }),
  )

  /* ==========================
   SALES TREND 7 DAYS
  ========================== */
  const salesTrendMap: Record<string, number> = {}

  sales30Days.docs
    .filter((t: any) => new Date(t.createdAt) >= last7Days)
    .forEach((t: any) => {
      const date =
        typeof t.createdAt === 'string'
          ? t.createdAt.slice(0, 10)
          : t.createdAt.toISOString().slice(0, 10)

      salesTrendMap[date] = (salesTrendMap[date] || 0) + 1
    })

  const salesTrend7Days = Object.entries(salesTrendMap).map(
    ([tanggal, jumlah]) => ({ tanggal, jumlah }),
  )

  /* ==========================
   RESPONSE (1:1 UI)
  ========================== */
  return NextResponse.json({
    summaryCards: {
      reservasiHariIni: reservationsToday.totalDocs,
      mejaTerisi: persenMejaTerisi,
      transaksiHariIni: transactionsToday.totalDocs,
      omzetHariIni,
      stokKritis: stokMenipis.length,
    },
    salesOverview,
    reservasiSummary: {
      totalHariIni: reservationsToday.totalDocs,
      avgWaiting: 10, // bisa dihitung nanti
    },
    cashierPerformance,
    products: {
      stokMenipis,
    },
    orderTypeShare,
    reservationChart30Days,
    salesByCategory,
    salesTrend7Days,
  })
}
