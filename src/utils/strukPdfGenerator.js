import { jsPDF } from 'jspdf'

// Convert URL → Base64
async function toBase64(url) {
  const res = await fetch(url)
  const blob = await res.blob()

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

export async function generateStrukPDF({ header, footer, logoUrl, paperSize, options }) {
  const width = paperSize === 58 ? 58 : 80
  const doc = new jsPDF({ unit: 'mm', format: [width, 400] })

  let y = 8
  const center = width / 2
  const padding = 6 // padding kiri/kanan lebih besar agar rapi

  // ===== 1. LOGO =====
  if (options.infoToko && logoUrl) {
    try {
      const logoBase64 = await toBase64(logoUrl)
      if (logoBase64) {
        // otomatis kecilkan logo jika paperSize 58mm
        const logoSize = paperSize === 58 ? 12 : 16
        doc.addImage(logoBase64, 'PNG', center - logoSize / 2, y, logoSize, logoSize)
        y += logoSize + 8 // jarak bawah logo
      }
    } catch (err) {
      console.log('Gagal load logo:', err)
    }
  }

  // ===== 2. HEADER =====
  if (header) {
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text(header, center, y, { align: 'center' })
    y += 10 // jarak header → info transaksi
  }

  doc.setFontSize(8)
  doc.setFont(undefined, 'normal')

  // ===== 3. INFO TRANSAKSI =====
  const info = [
    options.noNota && `Nota: 280390283203`,
    options.noTransaksi && `Transaksi: INV-12892`,
    options.jamTransaksi && `Waktu: 20/05/2025 - 12:00`,
    options.jamBuka && `Jam Buka: 09:00`,
    options.namaMeja && `Meja: A-07`,
    options.modePenjualan && `Mode: Dine In`,
    options.pax && `Pax: 4 Orang`,
    options.namaKasir && `Kasir: Mira Alfariyah`,
    options.cetakKe && `Cetakan ke: 1`,
    options.posmindOrder && `Order ID: #POS12392`,
    options.wifi && `WiFi: POSMind-Guest`,
    options.infoTambahan && `Catatan: Jangan pedas`,
  ].filter(Boolean)

  info.forEach((txt) => {
    doc.text(txt, padding, y)
    y += 6 // jarak antar info
  })

  // ===== 4. SEPARATOR =====
  const char = '-'
  const maxWidth = width - padding * 2
  let line = ''
  while (doc.getTextWidth(line + char) <= maxWidth) {
    line += char
  }
  doc.text(line, padding, y)
  y += 6

  // ===== 5. LIST PRODUK =====
  const items = [
    { name: 'Nasi Goreng', qty: 2, price: 20000, total: 40000 },
    { name: 'Es Teh', qty: 1, price: 5000, total: 5000 },
  ]

  items.forEach((item) => {
    doc.setFont(undefined, 'bold')
    doc.text(item.name, padding, y)
    y += 5

    doc.setFont(undefined, 'normal')
    doc.setFontSize(7)
    doc.text(`${item.qty}x`, padding + 2, y)
    doc.text(`${item.price.toLocaleString()}`, padding + 12, y)
    doc.setFont(undefined, 'bold')
    doc.text(`${item.total.toLocaleString()}`, width - padding, y, { align: 'right' })
    y += 6

    doc.setFont(undefined, 'normal')
    doc.setFontSize(8)
  })

  // ... setelah list produk, separator lagi
  doc.text(line, padding, y)
  y += 6

  // ===== 6. PAJAK, SERVICE, PEMBULATAN =====
  const charges = [
    options.pajak && { label: 'Pajak 10%', value: 2500 },
    options.service && { label: 'Service 5%', value: 1250 },
    options.pembulatan && { label: 'Pembulatan', value: 0 },
  ].filter(Boolean)

  charges.forEach((c) => {
    doc.text(c.label, padding, y)
    doc.text(c.value.toLocaleString(), width - padding, y, { align: 'right' })
    y += 6
  })

  // TOTAL
  doc.setFont(undefined, 'bold')
  doc.setFontSize(9)
  doc.text('Total', padding, y)
  doc.text('28.750', width - padding, y, { align: 'right' })
  y += 10 // jarak total ke footer
  doc.setFont(undefined, 'normal')
  doc.setFontSize(8)

  // ===== 7. FOOTER =====
  if (footer) {
    const lines = footer.split('\n')
    lines.forEach((l) => {
      doc.text(l, center, y, { align: 'center' })
      y += 4
    })
  }

  // POWERED
  if (options.powered) {
    y += 2
    doc.setFontSize(7)
    doc.text('Powered by POSMind', center, y, { align: 'center' })
    y += 4
  }

  return doc
}
