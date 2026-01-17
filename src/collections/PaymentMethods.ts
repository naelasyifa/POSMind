// src/collections/PaymentMethods.ts
import type { CollectionConfig } from 'payload'

const PaymentMethods: CollectionConfig = {
  slug: 'payment-methods',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'code', 'isActive'],
  },
  access: {
    read: () => true, // Sesuaikan dengan kebutuhan akses project kamu
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Tunai', value: 'cash' },
        { label: 'Virtual Account', value: 'bank_transfer' },
        { label: 'QRIS', value: 'qris' },
        { label: 'E-Wallet', value: 'ewallet' },
      ],
    },
    {
      name: 'externalId',
      type: 'number',
      admin: {
        description: 'ID asli dari API Sandbox (untuk sinkronisasi)',
        position: 'sidebar',
      },
    },
    {
      name: 'code',
      type: 'text',
      admin: {
        description: 'Kode bank/provider (contoh: 07 untuk BNI, 16 untuk QRIS)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Aktifkan untuk menampilkan di kasir',
      },
    },
  ],
}

export default PaymentMethods
