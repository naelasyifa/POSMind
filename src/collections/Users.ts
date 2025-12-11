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
      required: false,
    },

    // OTP fields
    { name: 'emailVerified', type: 'checkbox', defaultValue: false },
    { name: 'otp', type: 'text', admin: { hidden: true } },
    { name: 'otpExpiration', type: 'date', admin: { hidden: true } },

    // Business registration fields
    { name: 'adminName', type: 'text' },
    { name: 'businessName', type: 'text' },
    { name: 'businessField', type: 'text' },
    { name: 'businessType', type: 'text' },
    { name: 'address', type: 'text' },
    { name: 'phone', type: 'text' },

    // Mark user from OTP flow
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
  },

  // 🔴 REMOVED OTP AUTO-SEND to avoid double OTP
  hooks: {},
}