import { CollectionConfig } from 'payload'

const Payments: CollectionConfig = {
  slug: 'payments',
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    { name: 'orderId', type: 'text', required: true },
    {
      name: 'method',
      type: 'relationship',
      relationTo: 'payment-methods',
      required: false,
    },
    { name: 'amount', type: 'number', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'paid', 'expired', 'failed'],
    },
    { name: 'reference', type: 'text' },
  ],
}

export default Payments
