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
  ],
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'superadmin') return true
      return {
        tenant: { equals: req.user?.tenant },
      }
    },
  },
}
