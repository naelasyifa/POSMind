import { NextResponse } from 'next/server'
import { getPayloadClient } from '../../../payloadClient'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const payload = await getPayloadClient()

    const now = new Date()
    const startToday = new Date(new Date().setHours(0, 0, 0, 0))
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // 1. AMBIL TRANSAKSI (Filter status selesai)
    const transactions = await payload.find({
      collection: 'transactions',
      where: { 
        status: { equals: 'selesai' } 
      },
      limit: 1000,
      sort: '-createdAt', // Pastikan yang terbaru ada di index 0
    })

    let penjualanHariIni = 0
    let pendapatanBulanan = 0
    let transaksiHariIni = 0
    
    // Ambil waktu transaksi terakhir untuk kartu "Waktu Terakhir"
    const waktuTerakhir = transactions.docs.length > 0 ? transactions.docs[0].createdAt : null

    // 2. PROSES STATISTIK & METODE PEMBAYARAN
    const metodeMap: Record<string, number> = {}

    transactions.docs.forEach((trx: any) => {
      const trxDate = new Date(trx.createdAt)

      // Hitung Statistik Utama
      if (trxDate >= startToday) {
        penjualanHariIni += (trx.total || 0)
        transaksiHariIni++
      }
      if (trxDate >= startMonth) {
        pendapatanBulanan += (trx.total || 0)
      }

      // Perbaikan Metode Pembayaran
      const rawMetode = trx.metode || 'Lainnya'
      const cleanMetode = rawMetode.trim()
      metodeMap[cleanMetode] = (metodeMap[cleanMetode] || 0) + 1
    })

    const metodePembayaran = Object.entries(metodeMap).map(([name, value]) => ({
      name,
      value,
    }))

    // 3. GRAFIK BULANAN (Jan - Des)
    const grafikBulananMap: Record<number, number> = {}
    transactions.docs.forEach((trx: any) => {
      const d = new Date(trx.createdAt)
      // Hanya masukkan transaksi tahun berjalan ke grafik bulanan
      if (d.getFullYear() === now.getFullYear()) {
        const month = d.getMonth()
        grafikBulananMap[month] = (grafikBulananMap[month] || 0) + (trx.total || 0)
      }
    })

    const grafikBulanan = Array.from({ length: 12 }).map((_, i) => ({
      label: new Date(0, i).toLocaleString('id-ID', { month: 'short' }),
      total: grafikBulananMap[i] || 0,
    }))

    // 4. GRAFIK HARIAN (7 Hari Terakhir)
    const grafikHarianMap = new Map()
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString('id-ID', { weekday: 'short' })
      grafikHarianMap.set(label, 0)
    }

    transactions.docs.forEach((trx: any) => {
      const trxDate = new Date(trx.createdAt)
      const dayLabel = trxDate.toLocaleDateString('id-ID', { weekday: 'short' })
      
      // Hanya masukkan jika transaksi masuk dalam rentang 7 hari terakhir
      if (grafikHarianMap.has(dayLabel)) {
        grafikHarianMap.set(dayLabel, grafikHarianMap.get(dayLabel) + (trx.total || 0))
      }
    })

    const grafikHarian = Array.from(grafikHarianMap.entries()).map(([label, total]) => ({
      label,
      total,
    }))

    // 5. RINGKASAN KEUANGAN (Profit/Loss)
    // Jika Anda memiliki koleksi 'expenses' (pengeluaran), panggil di sini.
    // Sementara kita set 0 atau ambil dari data statis.
    const totalPengeluaran = 0 
    const pendapatanKotor = pendapatanBulanan
    const keuntunganBersih = pendapatanKotor - totalPengeluaran

    // 6. STOK PRODUK RENDAH (Untuk alert di laporan)
    const products = await payload.find({
      collection: 'products',
      limit: 5,
      sort: 'stok', // Stok paling sedikit dulu
    })

    const stokProduk = products.docs.map((p: any) => ({
      id: p.id,
      nama: p.nama,
      stok: p.stok,
    }))

    // 7. RESPONSE FINAL
    return NextResponse.json({
      stat: {
        penjualanHariIni,
        pendapatanBulanan,
        jumlahTransaksi: transaksiHariIni,
        waktuTerakhir, // Field krusial untuk frontend
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