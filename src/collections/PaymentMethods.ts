// src/collections/PaymentMethods.ts
import type { CollectionConfig } from 'payload'

const PaymentMethods: CollectionConfig = {
  slug: 'payment-methods',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'code', 'isActive'],
    // Sembunyikan tombol 'Add New' karena data datang dari API
    hideAPIURL: false,
  },
  access: {
    read: () => true,
    create: () => false, // Admin tidak boleh buat manual
    delete: () => false, // Admin tidak boleh hapus
    update: () => true, // Admin hanya boleh update 'isActive'
  },
  fields: [
    { name: 'name', type: 'text', admin: { readOnly: true } },
    { name: 'category', type: 'text', admin: { readOnly: true } },
    { name: 'code', type: 'text', admin: { readOnly: true } },
    {
      name: 'externalId',
      type: 'number',
      unique: true, // Sangat penting agar tidak duplikat
      admin: { position: 'sidebar' },
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'fee', type: 'number', admin: { readOnly: true } },
  ],
}

export default PaymentMethods
