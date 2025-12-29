import type { CollectionConfig } from 'payload'

const Transactions: CollectionConfig = {
  slug: 'transactions',
  timestamps: true, // <== penting agar bisa sort by createdAt
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: ({ req }) => {
      const u = req.user
      if (!u) return false
      if (u.role === 'kasir') return false // kasir tidak boleh delete
      if (u.role === 'admintoko') return false
      if (u.role === 'superadmin') return true

      // Jika role tidak cocok → default ditolak
      return false
    },
  },
  fields: [
    { name: 'noPesanan', type: 'text', required: false, unique: true },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true },
    { name: 'namaKasir', type: 'text', required: true },
    { name: 'namaPelanggan', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'nama', type: 'text', required: true },
        { name: 'harga', type: 'number', required: true },
        { name: 'qty', type: 'number', required: true },
      ],
    },
    { name: 'subtotal', type: 'number', required: true },
    { name: 'pajak', type: 'number', required: true },
    { name: 'discount', type: 'number', defaultValue: 0 },
    { name: 'total', type: 'number', required: true },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Proses', value: 'proses' },
        { label: 'Selesai', value: 'selesai' },
        { label: 'Batal', value: 'batal' },
      ],
      defaultValue: 'proses',
    },
    {
      name: 'caraBayar',
      type: 'select',
      required: true,
      defaultValue: 'cash',
      options: [
        { label: 'Tunai', value: 'cash' },
        { label: 'Non Tunai', value: 'non_cash' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'relationship',
      relationTo: 'payment-methods',
      admin: {
        condition: (_, data) => data?.caraBayar === 'non_cash',
      },
    },

    { name: 'bayar', type: 'number' },
    { name: 'kembalian', type: 'number' },
    { name: 'waktu', type: 'date', required: true },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && !data.noPesanan) {
          const date = new Date()
          const y = date.getFullYear()
          const m = String(date.getMonth() + 1).padStart(2, '0')
          const d = String(date.getDate()).padStart(2, '0')
          const today = `${y}${m}${d}`

          // Cari transaksi terbaru hari ini
          const latest = await req.payload.find({
            collection: 'transactions',
            limit: 1,
            sort: '-createdAt',
            where: {
              noPesanan: {
                contains: `PSN-${today}-`,
              },
            },
          })

          let seq = 1
          if (latest.docs.length > 0) {
            const lastNo = latest.docs[0]?.noPesanan ?? null
            if (lastNo) {
              const parts = lastNo.split('-')
              const lastSeq = parseInt(parts[2] ?? '0', 10)
              seq = isNaN(lastSeq) ? 1 : lastSeq + 1
            }
          }

          data.noPesanan = `PSN-${today}-${String(seq).padStart(4, '0')}`
        }

        return data
      },
    ],

    afterChange: [
      async ({ req, operation, doc }) => {
        const payload = req.payload

        // Notif transaksi berhasil
        if (operation === 'create' && doc.status !== 'batal') {
          await payload.create({
            collection: 'notifications',
            data: {
              type: 'transaksi',
              icon: 'berhasil',
              tipe: 'trx_success',
              title: 'Transaksi Berhasil',
              message: `Transaksi ${doc.noPesanan} sebesar Rp${doc.total} berhasil.`,
            },
          })
        }

        // Notif batal
        if ((operation === 'update' || operation === 'create') && doc.status === 'batal') {
          const existing = await payload.find({
            collection: 'notifications',
            limit: 1,
            where: {
              tipe: { equals: 'trx_success' },
              title: { contains: doc.noPesanan },
            },
          })

          if (existing.docs.length > 0) {
            await payload.update({
              collection: 'notifications',
              id: existing.docs[0].id,
              data: {
                icon: 'gagal',
                tipe: 'trx_cancel',
                title: 'Transaksi Dibatalkan',
                message: `Transaksi ${doc.noPesanan} telah dibatalkan.`,
              },
            })
          } else {
            await payload.create({
              collection: 'notifications',
              data: {
                type: 'transaksi',
                icon: 'gagal',
                tipe: 'trx_cancel',
                title: 'Transaksi Dibatalkan',
                message: `Transaksi ${doc.noPesanan} telah dibatalkan.`,
              },
            })
          }
        }
      },
    ],
  },
}

export default Transactions
