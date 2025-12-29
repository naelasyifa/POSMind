import type { CollectionConfig } from 'payload'

const PaymentMethods: CollectionConfig = {
  slug: 'payment-methods',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Tunai', value: 'cash' },
        { label: 'Transfer Bank', value: 'bank_transfer' },
        { label: 'QRIS', value: 'qris' },
      ],
    },
    {
      name: 'bankCode',
      type: 'text',
      admin: {
        condition: (_, data) => data?.type === 'bank_transfer',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export default PaymentMethods
