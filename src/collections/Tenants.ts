import { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',

  admin: {
    useAsTitle: 'name',
  },

  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'superadmin') return true
      return { id: { equals: req.user.tenant } }
    },
    create: ({ req }) => req.user?.role === 'superadmin',
    update: ({ req }) => req.user?.role === 'superadmin',
    delete: ({ req }) => req.user?.role === 'superadmin',
  },

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      required: false,
      unique: false,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
  ],
}
