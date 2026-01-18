import { jsPDF } from 'jspdf'

// Helper untuk memproses logo menjadi format yang bisa dibaca PDF
async function toBase64(url) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch (e) {
    return null
  }
}

export async function generateKasirStrukPDF({ storeSettings, transaksiAsli }) {
  // 1. Buat pelindung agar data tidak undefined
  const strukConfig = storeSettings?.struk || {
    paperSize: 80,
    header: '',
    footer: '',
    options: {},
  }
  const dapurConfig = storeSettings?.dapur || {
    paperSize: 80,
    options: {},
  }

  const paperSize = strukConfig.paperSize || 80
  const width = paperSize === 58 ? 58 : 80
  const doc = new jsPDF({ unit: 'mm', format: [width, 400] })

  let y = 10
  const center = width / 2
  const padding = 6

  // 2. Gunakan strukConfig, BUKAN storeSettings.struk
  if (strukConfig.options?.infoToko && strukConfig.logo?.url) {
    const logoBase64 = await toBase64(strukConfig.logo.url)
    if (logoBase64) {
      const logoSize = paperSize === 58 ? 12 : 16
      doc.addImage(logoBase64, 'PNG', center - logoSize / 2, y, logoSize, logoSize)
      y += logoSize + 8
    }
  }

  if (strukConfig.header) {
    doc.setFontSize(10).setFont(undefined, 'bold')
    doc.text(strukConfig.header, center, y, { align: 'center' })
    y += 8
  }

  doc.setFontSize(8).setFont(undefined, 'normal')
  const info = [
    strukConfig.options?.noNota && `Nota: ${transaksiAsli.noPesanan}`,
    strukConfig.options?.noTransaksi && `Trx: INV-${transaksiAsli.noPesanan}`,
    strukConfig.options?.jamTransaksi && `Waktu: ${transaksiAsli.waktu}`,
    strukConfig.options?.namaMeja && `Meja: ${transaksiAsli.meja}`,
    strukConfig.options?.namaKasir && `Kasir: ${transaksiAsli.kasir}`,
    strukConfig.options?.modePenjualan && `Mode: ${transaksiAsli.modePenjualan}`,
  ].filter(Boolean)

  info.forEach((txt) => {
    doc.text(txt, padding, y)
    y += 5
  })

  doc.text('-'.repeat(width === 58 ? 38 : 50), padding, y)
  y += 6

  transaksiAsli.items.forEach((item) => {
    doc.setFont(undefined, 'bold').text(item.name, padding, y)
    y += 5
    doc.setFont(undefined, 'normal').setFontSize(7)
    doc.text(`${item.qty}x`, padding + 2, y)
    doc.text(item.price.toLocaleString(), padding + 10, y)
    doc.setFont(undefined, 'bold')
    doc.text((item.qty * item.price).toLocaleString(), width - padding, y, { align: 'right' })
    y += 6
    doc.setFontSize(8)
  })

  doc.setFont(undefined, 'normal').text('-'.repeat(width === 58 ? 38 : 50), padding, y)
  y += 6

  if (strukConfig.options?.pajak) {
    doc.text(`Pajak`, padding, y)
    doc.text(transaksiAsli.pajak.toLocaleString(), width - padding, y, { align: 'right' })
    y += 5
  }

  if (strukConfig.options?.service) {
    doc.text(`Service Charge`, padding, y)
    doc.text(transaksiAsli.service.toLocaleString(), width - padding, y, { align: 'right' })
    y += 5
  }

  doc.setFontSize(9).setFont(undefined, 'bold')
  doc.text('TOTAL', padding, y)
  doc.text(transaksiAsli.total.toLocaleString(), width - padding, y, { align: 'right' })
  y += 10

  if (strukConfig.footer) {
    doc.setFontSize(7).setFont(undefined, 'normal')
    const footerLines = doc.splitTextToSize(strukConfig.footer, width - 12)
    doc.text(footerLines, center, y, { align: 'center' })
    y += footerLines.length * 4
  }

  // --- HALAMAN 2: TIKET DAPUR ---
  const dapurWidth = dapurConfig.paperSize || 80
  doc.addPage([dapurWidth, 200])
  let yd = 10
  const padD = 8

  doc
    .setFontSize(12)
    .setFont(undefined, 'bold')
    .text('DAPUR', dapurWidth / 2, yd, { align: 'center' })
  yd += 10

  doc.setFontSize(9).setFont(undefined, 'normal')
  if (dapurConfig.options?.noTransaksi) doc.text(`Order: #${transaksiAsli.noPesanan}`, padD, yd)
  yd += 6
  if (dapurConfig.options?.namaMeja) doc.text(`Meja: ${transaksiAsli.meja}`, padD, yd)
  yd += 8

  doc.setDrawColor(150)
  doc.line(padD, yd, dapurWidth - padD, yd)
  yd += 8

  transaksiAsli.items.forEach((item) => {
    doc.setFont(undefined, 'bold').text(`${item.qty} x ${item.name}`, padD, yd)
    yd += 6
    if (item.note) {
      doc.setFontSize(8).setFont(undefined, 'italic').text(`   * Note: ${item.note}`, padD, yd)
      yd += 6
      doc.setFontSize(9).setFont(undefined, 'normal')
    }
  })

  return doc
}
