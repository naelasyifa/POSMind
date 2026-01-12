import { CollectionConfig } from 'payload'

const Shifts: CollectionConfig = {
  slug: 'shifts',

  admin: {
    useAsTitle: 'shiftCode',
    defaultColumns: [
      'shiftCode',
      'shiftName',
      'cashierEmail',
      'status',
      'openedAt',
    ],
  },

  access: {
    read: ({ req }) => {
      if (!req.user) return false

      // ADMIN PAYLOAD LIHAT SEMUA
      if (['superadmin', 'admintoko'].includes(req.user.role ?? '')) {
        return true
      }


      // KASIR HANYA SHIFT SENDIRI
      return { cashier: { equals: req.user.id } }
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
  },

  timestamps: true,

  hooks: {
    beforeChange: [
      ({ data, req, operation, originalDoc }) => {
        const userId = req.user?.id

        /* =========================
           OPEN SHIFT (CREATE)
        ========================= */
      if (operation === 'create') {
        const date = new Date()
        const ymd = date.toISOString().slice(0, 10).replace(/-/g, '')
        const random = Math.floor(1000 + Math.random() * 9000)

        // Gunakan ID user dari data yang dikirim jika req.user kosong
        const userId = data.cashier || req.user?.id
        data.shiftCode = `SH-${ymd}-${userId}-${random}`
        data.cashier = userId
        data.cashierEmail =
        data.cashierEmail ||
        req.user?.email ||
        'email.tidak.terdeteksi@test.com'
        data.openedAt = new Date()
        data.status = 'open'

        return data
      }

        /* =========================
           GUARD UPDATE NON-CLOSE
        ========================= */
        if (operation === 'update' && data.closingAction !== true) {
          delete data.status
          delete data.closedAt
          return data
        }

        /* =========================
           CLOSE SHIFT (EXPLICIT)
        ========================= */
        if (
          operation === 'update' &&
          data.closingAction === true &&
          originalDoc?.status === 'open'
        ) {
          data.closedAt = new Date()
          data.status = 'closed'

          const expectedCash = originalDoc?.expectedCash ?? 0
          const actualCash = data.actualCash ?? 0

          const expectedNonCash = originalDoc?.expectedNonCash ?? 0
          const actualNonCash = data.actualNonCash ?? 0

          data.differenceCash = actualCash - expectedCash
          data.differenceNonCash = actualNonCash - expectedNonCash

          data.isCashMatched = data.differenceCash === 0
          data.isNonCashMatched = data.differenceNonCash === 0
        }

        return data
      },
    ],
  },

  fields: [
    {
      name: 'shiftCode',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
    },

    {
      name: 'shiftName',
      type: 'select',
      required: true,
      options: ['Pagi', 'Siang', 'Malam'],
    },

    {
      name: 'status',
      type: 'select',
      options: ['open', 'closed'],
      defaultValue: 'open',
      admin: { readOnly: true },
    },

    {
      name: 'cashier',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },

    {
      name: 'cashierEmail',
      type: 'text',
      admin: { readOnly: true },
    },

    { name: 'openedAt', type: 'date', admin: { readOnly: true } },
    { name: 'closedAt', type: 'date', admin: { readOnly: true } },

    { name: 'openingCash', type: 'number', required: true },

    { name: 'expectedCash', type: 'number', defaultValue: 0 },
    { name: 'expectedNonCash', type: 'number', defaultValue: 0 },

    { name: 'actualCash', type: 'number', defaultValue: 0 },
    { name: 'actualNonCash', type: 'number', defaultValue: 0 },

    { name: 'differenceCash', type: 'number', admin: { readOnly: true } },
    { name: 'differenceNonCash', type: 'number', admin: { readOnly: true } },

    { name: 'closingNote', type: 'textarea' },

    { name: 'isCashMatched', type: 'checkbox', admin: { readOnly: true } },
    { name: 'isNonCashMatched', type: 'checkbox', admin: { readOnly: true } },

    {
      name: 'closingAction',
      type: 'checkbox',
      admin: { hidden: true },
    },
  ],
}

export default Shifts
