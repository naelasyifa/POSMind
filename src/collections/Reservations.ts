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
    },

    {
      name: 'nama_pelanggan',
      type: 'text',
      required: true,
    },

    {
      name: 'tanggal',
      type: 'date',
      required: true,
    },

    {
  name: 'status',
  type: 'select',
  required: false,
  options: [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Check In', value: 'checkin' },
  ],
  defaultValue: 'pending',
},


    {
      name: 'pax',
      type: 'number',
      required: true,
    },

    {
      name: 'deposit',
      type: 'number',
      required: false,
    },

    {
      name: 'kode_reservasi',
      type: 'text',
      required: false,
    },

    {
      name: 'no_telepon',
      type: 'text',
      required: false,
    },

    {
      name: 'email',
      type: 'email',
      required: false,
    },

    {
      name: 'jam_mulai',
      type: 'text',
      required: true,
    },

    {
      name: 'jam_selesai',
      type: 'text',
      required: true,
    },

    {
      name: 'durasi_menit',
      type: 'number',
      required: false,
    },

    {
      name: 'total_tagihan',
      type: 'number',
      required: false,
    },

    {
      name: 'status_pembayaran',
      type: 'select',
      required: false,
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },

    {
      name: 'kasir',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },

    {
      name: 'check_in_at',
      type: 'date',
      required: false,
    },

    {
      name: 'check_out_at',
      type: 'date',
      required: false,
    },

    {
      name: 'catatan',
      type: 'textarea',
      required: false,
    },

    {
      name: 'meja',
      type: 'relationship',
      relationTo: 'tables',
      required: false,
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
