import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../../payloadClient'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const now = new Date()
    const startToday = new Date(new Date().setHours(0, 0, 0, 0))
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // 1. AMBIL TRANSAKSI SELESAI
    const transactions = await payload.find({
      collection: 'transactions',
      where: {
        status: { equals: 'selesai' },
      },
      limit: 1000,
      sort: '-waktu',
    })

    let penjualanHariIni = 0
    let pendapatanBulanan = 0
    let transaksiHariIni = 0
    let totalTransaksi = 0

    const metodeMap: Record<string, number> = {}

    // WAKTU TRANSAKSI TERAKHIR
    const waktuTerakhir =
      transactions.docs.length > 0
        ? transactions.docs[0].waktu
        : null

    transactions.docs.forEach((trx: any) => {
      const trxDate = new Date(trx.waktu)
      const total = trx.total || 0

      totalTransaksi++

      if (trxDate >= startToday) {
        penjualanHariIni += total
        transaksiHariIni++
      }

      if (trxDate >= startMonth) {
        pendapatanBulanan += total
      }

      // METODE PEMBAYARAN (FIX)
      const metode =
        trx.caraBayar === 'cash' ? 'Tunai' : 'Non Tunai'

      metodeMap[metode] = (metodeMap[metode] || 0) + 1
    })

    const metodePembayaran = Object.entries(metodeMap).map(
      ([name, value]) => ({ name, value })
    )

    // 3. GRAFIK BULANAN
    const grafikBulananMap: Record<number, number> = {}

    transactions.docs.forEach((trx: any) => {
      const d = new Date(trx.waktu)
      if (d.getFullYear() === now.getFullYear()) {
        const m = d.getMonth()
        grafikBulananMap[m] =
          (grafikBulananMap[m] || 0) + (trx.total || 0)
      }
    })

    const grafikBulanan = Array.from({ length: 12 }).map((_, i) => ({
      label: new Date(0, i).toLocaleString('id-ID', { month: 'short' }),
      total: grafikBulananMap[i] || 0,
    }))

    // 4. GRAFIK HARIAN (7 HARI)
    const grafikHarianMap = new Map<string, number>()

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      grafikHarianMap.set(key, 0)
    }

    transactions.docs.forEach((trx: any) => {
      const key = new Date(trx.waktu).toISOString().split('T')[0]
      if (grafikHarianMap.has(key)) {
        grafikHarianMap.set(
          key,
          grafikHarianMap.get(key)! + (trx.total || 0)
        )
      }
    })

    const grafikHarian = Array.from(grafikHarianMap.entries()).map(
      ([key, total]) => ({
        label: new Date(key).toLocaleDateString('id-ID', {
          weekday: 'short',
        }),
        total,
      })
    )

    // 5. KEUANGAN
    const totalPengeluaran = 0
    const pendapatanKotor = pendapatanBulanan
    const keuntunganBersih = pendapatanKotor - totalPengeluaran

    // 6. STOK RENDAH
    const products = await payload.find({
      collection: 'products',
      where: { stok: { less_than_equal: 5 } },
      limit: 5,
      sort: 'stok',
    })

    const stokProduk = products.docs.map((p: any) => ({
      id: p.id,
      nama: p.nama,
      stok: p.stok,
    }))

    // 7. RESPONSE
    return NextResponse.json({
      stat: {
        penjualanHariIni,
        pendapatanBulanan,
        jumlahTransaksi: totalTransaksi,
        waktuTerakhir,
        pendapatanKotor,
        totalPengeluaran,
        keuntunganBersih,
        tanggalHariIni: now.toLocaleDateString('id-ID'),
      },
      grafikBulanan,
      grafikHarian,
      metodePembayaran,
      stokProduk,
    })
  } catch (err: any) {
    console.error('ERROR API REPORT:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
