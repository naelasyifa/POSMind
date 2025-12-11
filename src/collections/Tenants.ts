import { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',

  admin: {
    useAsTitle: 'businessName',
  },

  access: {
    read: ({ req }) => {
      if (req.user?.role === 'superadmin') return true

      return {
        owner: { equals: req.user?.id },
      }
    },

    create: ({ req }) => {
      // Only logged-in users can create a tenant
      return !!req.user
    },

    update: ({ req }) => {
      if (req.user?.role === 'superadmin') return true

      // Only tenant owner can update their tenant
      return {
        owner: { equals: req.user?.id },
      }
    },

    delete: ({ req }) => req.user?.role === 'superadmin',
  },

  fields: [
    {
      name: 'businessName',
      type: 'text',
      required: true,
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
      name: 'domain',
      type: 'text',
      required: false,
      unique: false,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { readOnly: true }, // prevent tampering
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: { readOnly: true },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        if (operation === 'create') {
          data.owner = req.user!.id
          data.createdBy = req.user!.id
        }
      },
    ],

    afterChange: [
      async ({ req, operation, doc }) => {
        if (operation === 'create') {
          await req.payload.update({
            collection: 'users',
            id: doc.owner,
            data: {
              tenant: doc.id,
            },
          })
        }
      },
    ],
  },
}
