import { CollectionConfig } from 'payload'

const Reservations: CollectionConfig = {
  slug: 'reservations',
  timestamps: true,

  access: {
    read: () => true,
    create: () => true,
  },

  admin: {
    useAsTitle: 'kode_reservasi',
    defaultColumns: ['kode_reservasi', 'nama_pelanggan', 'tanggal', 'status'],
  },

  fields: [
    // ===== RELATIONS (keep column names) =====
    {
      name: 'kasir_id',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'meja_id',
      type: 'relationship',
      relationTo: 'tables',
      required: true,
    },

    // ===== CORE DATA =====
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

    // ===== ENUMS (MATCH DB EXACTLY) =====
    {
      name: 'status',
      type: 'select',
      required: false,
      defaultValue: 'menunggu',
      options: [
        { label: 'Menunggu', value: 'menunggu' },
        { label: 'Dikonfirmasi', value: 'dikonfirmasi' },
        { label: 'Check In', value: 'checkin' },
        { label: 'Selesai', value: 'selesai' },
        { label: 'No Show', value: 'noshow' },
      ],
    },
    {
      name: 'status_pembayaran',
      type: 'select',
      required: false,
      defaultValue: 'unpaid',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Partial', value: 'partial' },
        { label: 'Paid', value: 'paid' },
      ],
    },
    {
      name: 'jenis_kelamin',
      type: 'select',
      required: true,
      options: [
        { label: 'Laki-laki', value: 'laki-laki' },
        { label: 'Perempuan', value: 'perempuan' },
      ],
    },
    {
      name: 'metode_pembayaran',
      type: 'select',
      required: false,
      options: [
        { label: 'Tunai', value: 'tunai' },
        { label: 'E-Wallet', value: 'ewallet' },
        { label: 'QRIS', value: 'qris' },
        { label: 'VA', value: 'va' },
      ],
    },

    // ===== NUMBERS =====
    {
      name: 'pax',
      type: 'number',
      required: true,
    },
    {
      name: 'deposit',
      type: 'number',
      required: false,
      defaultValue: 0,
    },
    {
      name: 'total_tagihan',
      type: 'number',
      required: false,
    },
    {
      name: 'durasi_menit',
      type: 'number',
      required: false,
    },

    // ===== TIME =====
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
      name: 'waktu_reservasi',
      type: 'date',
      required: false,
    },

    // ===== OPTIONAL =====
    {
      name: 'kode_reservasi',
      type: 'text',
      required: false,
    },
    {
      name: 'no_telepon',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: false,
    },
    {
      name: 'catatan',
      type: 'textarea',
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
