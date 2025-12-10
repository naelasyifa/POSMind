import jsPDF from 'jspdf'

export const cetakDapurPdf = ({ storeName, tenantName, options, items, paperSize }) => {
  const width = paperSize === 58 ? 58 : 80
  const doc = new jsPDF({ unit: 'mm', format: [width, 200] })
  let y = 10
  const lineHeight = 6
  const gap = 4 // jarak antar blok
  const padding = 9 // padding kiri/kanan

  doc.setFontSize(8)

  const drawLine = (text, bold = false) => {
    doc.setFont(undefined, bold ? 'bold' : 'normal')
    doc.text(text, padding, y)
    y += lineHeight
  }

  // ===== HEADER =====
  if (options.noTransaksi) drawLine('#ES421')
  if (options.tanggalTransaksi) drawLine('17-06-2021')
  if (options.jamTransaksi) drawLine('10:22')
  if (options.namaMeja) drawLine('No. Meja : Indoor / A1')

  y += gap

  if (options.modePenjualan) drawLine('DINE IN', true)

  if (options.namaWaiter) drawLine('Waiter    : Gisell')
  if (options.namaWaiter2) drawLine('Waiter 2  : Rafi')
  if (options.namaSender) drawLine('Sender    : Rafaela')
  if (options.infoTambahan) drawLine('Info      : Andi')

  y += 3

  // ===== GARIS PEMISAH ABU =====
  doc.setDrawColor(150) // abu-abu
  doc.setLineWidth(0.3) // tipis
  doc.line(padding, y, width - padding, y)
  y += lineHeight

  // ===== JUDUL DAPUR CENTER =====
  doc.setFont(undefined, 'bold')
  doc.text('Dapur', width / 2, y, { align: 'center' })
  doc.setFont(undefined, 'normal')
  y += lineHeight

  y += gap

  // ===== ITEMS =====
  items.forEach((item) => {
    drawLine(item)
  })

  return doc
}
