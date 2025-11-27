import { CollectionConfig } from 'payload'

const Transactions: CollectionConfig = {
  slug: 'transactions',
  access: {
    // read by tenant only or superadmin
    read: async ({ req: { user } }: any) => {
      if (!user) return false
      if (user.role === 'superadmin') return true
      // else must filter by tenant; use find with where on server endpoints
      return {
        tenant: { equals: user.tenant },
      }
    },
    create: ({ req: { user } }: any) => {
      // kasir/admin toko boleh create transaksi untuk tenantnya
      if (!user) return false
      if (['kasir', 'admin_toko', 'owner', 'superadmin'].includes(user.role)) return true
      return false
    },
  },
  fields: [
    { name: 'tenant', type: 'relationship', relationTo: 'tenants', required: true },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'qty', type: 'number', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'subtotal', type: 'number', required: true },
      ],
    },
    { name: 'total', type: 'number', required: true },
    { name: 'kasir', type: 'relationship', relationTo: 'users' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'paid',
      options: [
        { label: 'Paid', value: 'paid' },
        { label: 'Unpaid', value: 'unpaid' },
      ],
    },
  ],
}

export default Transactions
