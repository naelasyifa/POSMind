import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },

  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'kasir',
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Admin Toko', value: 'admintoko' },
        { label: 'Kasir', value: 'kasir' },
      ],
    },

    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false, // WAJIB false untuk Supabase !!!
    },
    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'verificationCode',
      type: 'text',
      required: false,
      admin: { hidden: true },
    },
    {
      name: 'otp',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'otpExpiration',
      type: 'date',
      admin: { hidden: true },
    },
    {
      name: 'adminName',
      type: 'text',
      required: false,
    },
    {
      name: 'businessField',
      type: 'text',
      required: false,
    },
    {
      name: 'businessType',
      type: 'text',
      required: false,
    },
    {
      name: 'address',
      type: 'text',
      required: false,
    },
    {
      name: 'isBusinessUser',
      type: 'checkbox',
      required: false,
      defaultValue: true,
    },
  ],
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'superadmin') return true
      return {
        tenant: { equals: req.user?.tenant },
      }
    },
  },

  hooks: {
    afterChange: [
      async ({ req, operation, doc }) => {
        if (operation === 'create') {
          const code = Math.floor(100000 + Math.random() * 900000).toString() // kode 6 digit

          await req.payload.update({
            collection: 'users',
            id: doc.id,
            data: {
              verificationCode: code,
            },
          })

          await req.payload.sendEmail({
            to: doc.email,
            subject: 'Verifikasi Email POS-Mind',
            html: `
            <h2>Kode Verifikasi</h2>
            <p>Gunakan kode berikut untuk verifikasi email Anda:</p>
            <h3>${code}</h3>
          `,
          })

          console.log('Kode verifikasi dikirim:', code)
        }
      },
    ],
  },
}
