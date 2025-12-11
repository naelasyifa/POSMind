import { CollectionConfig } from 'payload'

const ActionRequests: CollectionConfig = {
  slug: 'action-requests',

  access: {
    read: ({ req }) => {
      if (!req.user) return false

      if (req.user.role === 'admintoko' || req.user.role === 'superadmin') {
        return {
          and: [{ tenant: { equals: req.user.tenant } }],
        }
      }

      if (req.user.role === 'kasir') {
        return {
          and: [{ createdBy: { equals: req.user.id } }],
        }
      }

      return false
    },

    create: ({ req }) => !!req.user,

    update: ({ req }) => req.user?.role === 'admintoko' || req.user?.role === 'superadmin',

    delete: ({ req }) => req.user?.role === 'admintoko' || req.user?.role === 'superadmin',
  },

  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },

    {
      name: 'actionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Create Product', value: 'create' },
        { label: 'Update Product', value: 'update' },
        { label: 'Delete Product', value: 'delete' },
      ],
    },

    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: false,
      hasMany: false,
    },

    {
      name: 'payload',
      type: 'json',
    },

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },

    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (!req.user) throw new Error('Unauthorized')

        if (operation === 'create') {
          data.createdBy = req.user.id
          data.tenant = req.user.tenant
        }

        return data
      },
    ],

    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation !== 'update') return
        if (!req.user) throw new Error('Unauthorized')
        if (doc.status !== 'approved') return

        const action = doc.actionType

        // CREATE PRODUCT
        if (action === 'create') {
          await req.payload.create({
            collection: 'products',
            data: doc.payload,
            overrideAccess: true,
          })
        }

        // UPDATE PRODUCT
        if (action === 'update') {
          if (!doc.product) throw new Error('Missing product ID for update')

          await req.payload.update({
            collection: 'products',
            id: doc.product,
            data: doc.payload,
            overrideAccess: true,
          })
        }

        // DELETE PRODUCT
        if (action === 'delete') {
          if (!doc.product) throw new Error('Missing product ID for delete')

          await req.payload.delete({
            collection: 'products',
            id: doc.product,
            overrideAccess: true,
          })
        }

        // Mark who approved it
        await req.payload.update({
          collection: 'action-requests',
          id: doc.id,
          data: {
            approvedBy: req.user.id,
          },
          overrideAccess: true,
        })
      },
    ],
  },
}

export default ActionRequests
