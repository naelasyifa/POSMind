import { CollectionConfig } from 'payload'

const Reservations: CollectionConfig = {
  slug: 'reservations',
  timestamps: true,

  admin: {
    useAsTitle: 'namaPelanggan',
    defaultColumns: [
      'kodeReservasi',
      'namaPelanggan',
      'tanggal',
      'jamMulai',
      'jamSelesai',
      'status',
      'meja',
      'kasir',
    ],
  },

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    {
      name: 'kodeReservasi',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
    },

    {
      name: 'waktuReservasi',
      type: 'date',
      admin: { readOnly: true },
    },

    { name: 'namaPelanggan', type: 'text', required: true },
    {
      name: 'jenis_kelamin',
      type: 'text',
      required: true,
      admin: {
        description: 'enum_reservations_jenis_kelamin',
      },
    },
    { name: 'noTelepon', type: 'text', required: true },
    { name: 'email', type: 'email' },

    {
      name: 'tanggal',
      type: 'date',
      required: true,
    },

    { name: 'jamMulai', type: 'text', required: true },
    { name: 'jamSelesai', type: 'text', required: true },

    {
      name: 'durasiMenit',
      type: 'number',
      admin: { readOnly: true },
    },

    { name: 'pax', type: 'number', required: true },
    { name: 'deposit', type: 'number', defaultValue: 0 },
    { name: 'totalTagihan', type: 'number' },

    {
      name: 'statusPembayaran',
      type: 'select',
      defaultValue: 'unpaid',
      options: [
        { label: 'Belum Dibayar', value: 'unpaid' },
        { label: 'DP', value: 'partial' },
        { label: 'Lunas', value: 'paid' },
      ],
    },
    {
      name: 'metodePembayaran',
      type: 'select',
      required: false,
      admin: {
        condition: (_, siblingData) => siblingData?.statusPembayaran !== 'unpaid',
      },
      options: [
        { label: 'Tunai', value: 'tunai' },
        { label: 'E-Wallet', value: 'ewallet' },
        { label: 'QRIS', value: 'qris' },
        { label: 'Virtual Account', value: 'va' },
      ],
    },

    {
      name: 'meja',
      type: 'relationship',
      relationTo: 'tables',
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'menunggu',
      options: [
        { label: 'Menunggu', value: 'menunggu' },
        { label: 'Dikonfirmasi', value: 'dikonfirmasi' },
        { label: 'Checked In', value: 'checkin' },
        { label: 'Selesai', value: 'selesai' },
        { label: 'Tidak Hadir', value: 'noshow' },
      ],
    },

    {
      name: 'kasir',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },

    { name: 'checkInAt', type: 'date', admin: { readOnly: true } },
    { name: 'checkOutAt', type: 'date', admin: { readOnly: true } },
    { name: 'catatan', type: 'textarea' },
  ],

  hooks: {
    beforeChange: [
      async ({ req, operation, data, originalDoc }) => {
        /* ===============================
           1️⃣ AUTO KODE RESERVASI
        =============================== */
        if (operation === 'create' && !data.waktuReservasi) {
          data.waktuReservasi = new Date().toISOString()
        }
        if (operation === 'create' && !data.kodeReservasi) {
          const { totalDocs } = await req.payload.count({
            collection: 'reservations',
          })
          data.kodeReservasi = `R${String(totalDocs + 1).padStart(4, '0')}`
        }

        /* ===============================
           2️⃣ HITUNG DURASI
        =============================== */
        if (data.jamMulai && data.jamSelesai) {
          const [h1, m1] = data.jamMulai.split(':').map(Number)
          const [h2, m2] = data.jamSelesai.split(':').map(Number)

          const durasi = h2 * 60 + m2 - (h1 * 60 + m1)
          if (durasi <= 0) {
            throw new Error('Jam selesai harus lebih besar dari jam mulai')
          }

          data.durasiMenit = durasi
        }

        /* ===============================
           3️⃣ CEK BENTROK MEJA
        =============================== */
        if (data.meja && data.tanggal && data.jamMulai && data.jamSelesai) {
          const konflik = await req.payload.find({
            collection: 'reservations',
            where: {
              meja: { equals: data.meja },
              tanggal: { equals: data.tanggal },
              status: { not_in: ['selesai', 'noshow'] },
            },
          })

          konflik.docs.forEach((r) => {
            if (r.id === originalDoc?.id) return

            const bentrok = data.jamMulai < r.jamSelesai && data.jamSelesai > r.jamMulai

            if (bentrok) {
              throw new Error('Meja sudah dibooking di jam tersebut')
            }
          })
        }

        /* ===============================
           4️⃣ CHECK-IN
        =============================== */
        if (data.status === 'checkin' && !originalDoc?.checkInAt) {
          data.checkInAt = new Date().toISOString()
          if (req.user) data.kasir = req.user.id
        }

        /* ===============================
           5️⃣ CHECK-OUT
        =============================== */
        if (data.status === 'selesai' && !originalDoc?.checkOutAt) {
          data.checkOutAt = new Date().toISOString()
        }

        /* ===============================
           6️⃣ AUTO NO-SHOW
        =============================== */
        if (data.status === 'menunggu') {
          const now = new Date()
          const tgl = new Date(data.tanggal)
          const [h, m] = data.jamMulai.split(':')
          tgl.setHours(+h, +m)

          if (now > tgl) {
            data.status = 'noshow'
            if (req.user) data.kasir = req.user.id
          }
        }

        return data
      },
    ],
  },
}

export default Reservations
