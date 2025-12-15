import { CollectionConfig } from 'payload'

const Reservations: CollectionConfig = {
  slug: 'reservations',
  timestamps: true,

  access: {
    read: () => true,
    create: () => true,
  },

  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
    },

    { name: 'namaPelanggan', type: 'text', required: true },
    { name: 'nomorMeja', type: 'text' },
    { name: 'tanggal', type: 'date', required: true },

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Dikonfirmasi', value: 'confirmed' },
        { label: 'Dibatalkan', value: 'cancelled' },
      ],
    },
  ],

  hooks: {
    afterChange: [
      async ({ req, operation, doc, previousDoc }) => {
        const payload = req.payload

        // → Reservasi Baru
        if (operation === 'create') {
          await payload.create({
            collection: 'notifications',
            data: {
              type: 'reservasi',
              icon: 'baru',
              tipe: 'reservation_new',
              title: 'Reservasi Baru',
              message: `Pelanggan "${doc.namaPelanggan}" membuat reservasi untuk tanggal ${doc.tanggal}.`,
            },
          })
          return
        }

        // → Status berubah
        if (previousDoc && previousDoc.status !== doc.status) {
          // KONFIRMASI
          if (doc.status === 'confirmed') {
            await payload.create({
              collection: 'notifications',
              data: {
                type: 'reservasi',
                icon: 'berhasil',
                tipe: 'reservation_confirm',
                title: 'Reservasi Dikonfirmasi',
                message: `Reservasi milik ${doc.namaPelanggan} telah dikonfirmasi.`,
              },
            })
          }

          // BATAL
          if (doc.status === 'cancelled') {
            await payload.create({
              collection: 'notifications',
              data: {
                type: 'reservasi',
                icon: 'gagal',
                tipe: 'reservation_cancel',
                title: 'Reservasi Dibatalkan',
                message: `Pelanggan "${doc.namaPelanggan}" membatalkan reservasi.`,
              },
            })
          }
        }
      },
    ],
  },
}

export default Reservations
