import { CollectionConfig } from 'payload'

const Promos: CollectionConfig = {
  slug: 'promos',

  access: {
    read: () => true,
  },

  fields: [
    // Tenant
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      index: true,
    },

    { name: 'nama', type: 'text', required: true },

    {
      name: 'kode',
      type: 'text',
      required: true,
      unique: false, // unique per tenant, bukan global
    },

    { name: 'mulai', type: 'date', required: true },
    { name: 'akhir', type: 'date', required: true },

    {
      name: 'kategori',
      type: 'select',
      defaultValue: 'all',
      required: true,
      options: [
        { label: 'Semua Item', value: 'all' },
        { label: 'Produk Tertentu', value: 'product' },
        { label: 'Minimum Pembelian', value: 'min_purchase' },
      ],
    },

    {
      name: 'produk',
      type: 'relationship',
      relationTo: 'products',
      admin: {
        condition: (data) => data?.kategori === 'product',
      },
    },

    {
      name: 'minPembelian',
      type: 'number',
      admin: {
        condition: (data) => data?.kategori === 'min_purchase',
      },
    },

    {
      name: 'tipeDiskon',
      type: 'select',
      required: true,
      defaultValue: 'percent',
      options: [
        { label: 'Persentase', value: 'percent' },
        { label: 'Nominal', value: 'nominal' },
      ],
    },

    { name: 'nilaiDiskon', type: 'number', required: true },
    { name: 'kuota', type: 'number', required: true },

    {
      name: 'stacking',
      type: 'select',
      defaultValue: 'no',
      options: [
        { label: 'Tidak Bisa Digabung', value: 'no' },
        { label: 'Boleh Digabung', value: 'yes' },
        { label: 'Hanya 1 Promo Aktif', value: 'single' },
      ],
    },

    {
      name: 'orderType',
      type: 'select',
      hasMany: true,
      defaultValue: ['dinein', 'takeaway'],
      options: [
        { label: 'Dine In', value: 'dinein' },
        { label: 'Take Away', value: 'takeaway' },
        { label: 'Delivery', value: 'delivery' },
      ],
    },

    {
      name: 'limitCustomer',
      type: 'select',
      defaultValue: 'unlimited',
      options: [
        { label: 'Unlimited', value: 'unlimited' },
        { label: 'Per Customer 1x', value: 'one' },
        { label: 'Per Customer N kali', value: 'multiple' },
      ],
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'Aktif',
      options: [
        { label: 'Aktif', value: 'Aktif' },
        { label: 'Nonaktif', value: 'Nonaktif' },
      ],
    },
  ],
}

export default Promos
