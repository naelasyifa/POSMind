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

    create: ({ req }) => !!req.user && req.user.role === 'kasir',

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
    async ({ data, req, operation, originalDoc }) => {
      if (!req.user) throw new Error('Unauthorized')

      if (operation === 'create') {
        data.createdBy = req.user.id
        data.tenant = req.user.tenant
        data.status = 'pending'
        delete data.approvedBy
      }

      if (operation === 'update') {
        data.createdBy = originalDoc.createdBy
        data.tenant = originalDoc.tenant
      }

      return data
    },
  ],
},
}

export default ActionRequests
