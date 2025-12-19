import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: false,
    useAPIKey: false,

    forgotPassword: {
      generateEmailHTML: (args) => {
        const token = args?.token
        const user = args?.user

        if (!token || !user) {
          return `<p>Invalid reset password request</p>`
        }

        return `
      <div style="font-family: Arial, sans-serif">
        <h2>Reset Password POSMind</h2>

        <p>Halo ${user.email},</p>
        <p>Klik tombol di bawah untuk mengatur ulang password kamu:</p>

        <a
          href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#4DB8C4;
            color:#fff;
            text-decoration:none;
            border-radius:8px;
            margin-top:12px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top:20px;font-size:12px;color:#666">
          Link ini hanya berlaku satu kali.
        </p>
      </div>
    `
      },
    },
  },
  admin: {
    useAsTitle: 'email',
  },

  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      unique: true,
    },

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
      required: false,
    },

    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'otp',
      type: 'text',
      admin: { hidden: true },
    },

    {
      name: 'otpExpiration',
      type: 'date', // FIXED
      admin: { hidden: true },
    },

    {
      name: 'phone',
      type: 'text',
    },

    {
      name: 'businessName',
      type: 'text',
      required: false, //janlup di true lagi
    },

    {
      name: 'adminName',
      type: 'text',
    },
    {
      name: 'businessField',
      type: 'text',
    },
    {
      name: 'businessType',
      type: 'text',
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'isBusinessUser',
      type: 'checkbox',
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
    update: () => true,
  },

  // hooks: {
  //   beforeChange: [
  //     async ({ data, operation }) => {
  //       if (operation === 'create') {
  //         const code = Math.floor(100000 + Math.random() * 900000).toString()
  //         data.verificationCode = code
  //       }
  //       return data
  //     },
  //   ],

  //   afterChange: [
  //     async ({ doc, operation, req }) => {
  //       if (operation === 'create') {
  //         await req.payload.sendEmail({
  //           to: doc.email,
  //           subject: 'Verifikasi Email POS-Mind',
  //           html: `
  //             <h2>Kode Verifikasi</h2>
  //             <p>Kode verifikasi Anda:</p>
  //             <h3>${doc.verificationCode}</h3>
  //           `,
  //         })
  //       }
  //     },
  //   ],
  // },
}
