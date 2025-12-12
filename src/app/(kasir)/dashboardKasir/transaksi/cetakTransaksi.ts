import { generateStrukPDF } from '@/utils/strukPdfGenerator'
import { cetakDapurPdf } from '@/utils/cetakDapurPdf'

export interface TransaksiItem {
  name: string
  qty?: number
  price?: number
  total?: number
}

export interface Transaksi {
  id?: string
  meja: string
  modePenjualan: string
  pax?: number
  kasir?: string
  catatan?: string
  pajak?: number
  service?: number
  pembulatan?: number
  waiter?: string
  items: TransaksiItem[]
  createdAt?: string
}

export interface StoreSettings {
  paperSize?: 58 | 80
  headerStruk?: string
  footerStruk?: string
  logoUrl?: string
  storeName?: string
  tenantName?: string
}

export async function cetakTransaksiPDF({
  transaksi,
  storeSettings,
  isAdminPreview = false, // default false
}: {
  transaksi: Transaksi
  storeSettings: StoreSettings
  isAdminPreview?: boolean
}) {
  const paperSize = storeSettings.paperSize || 58

  // ===== 1. STRUK =====
  const strukDoc = await generateStrukPDF({
    header: storeSettings.headerStruk,
    footer: storeSettings.footerStruk,
    logoUrl: storeSettings.logoUrl,
    paperSize,
    options: {
      noNota: true,
      noTransaksi: true,
      jamTransaksi: true,
      namaMeja: transaksi.meja,
      modePenjualan: transaksi.modePenjualan,
      pax: transaksi.pax,
      namaKasir: transaksi.kasir,
      infoTambahan: transaksi.catatan,
      pajak: transaksi.pajak,
      service: transaksi.service,
      pembulatan: transaksi.pembulatan,
      powered: true,
      jamFreeze: transaksi.createdAt, // jam freeze
      items: transaksi.items, // untuk struk
      isAdminPreview, // flag admin preview
    },
  })

  // ===== 2. DAPUR =====
  const dapurDoc = cetakDapurPdf({
    storeName: storeSettings.storeName,
    tenantName: storeSettings.tenantName,
    options: {
      noTransaksi: true,
      tanggalTransaksi: true,
      jamTransaksi: true,
      namaMeja: transaksi.meja,
      modePenjualan: transaksi.modePenjualan,
      namaWaiter: transaksi.waiter,
      infoTambahan: transaksi.catatan,
      jamFreeze: transaksi.createdAt,
      isAdminPreview,
    },
    items: transaksi.items.map((i) => i.name),
    paperSize,
  })

  // ===== 3. Gabungkan PDF =====
  const pdf = strukDoc
  dapurDoc.internal.pages.forEach((_: any, i: number) => {
    if (i === 0) return
    pdf.addPage()
    pdf.internal.pages[pdf.internal.pages.length] = dapurDoc.internal.pages[i]
  })

  return pdf
}
