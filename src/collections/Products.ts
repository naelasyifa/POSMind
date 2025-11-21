import { CollectionConfig } from 'payload'

const Products: CollectionConfig = {
  slug: 'products',

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
      name: 'sku',
      type: 'text',
      unique: false, // jangan unique untuk semua tenant
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'kategori',
      type: 'select',
      required: true,
      defaultValue: 'other',
      options: [
        { label: 'Makanan', value: 'makanan' },
        { label: 'Minuman', value: 'minuman' },
        { label: 'Snack', value: 'snack' },
        { label: 'Lainnya', value: 'other' },
      ],
    },

    { name: 'harga', type: 'number', required: true },

    {
      name: 'stok',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },

    { name: 'gambar', type: 'upload', relationTo: 'media' },
    { name: 'deskripsi', type: 'textarea' },

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'aktif',
      options: [
        { label: 'Aktif', value: 'aktif' },
        { label: 'Nonaktif', value: 'nonaktif' },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          const name = data.nama || ''

          const base = name
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

          const existing = await req.payload.find({
            collection: 'products',
            where: {
              tenant: { equals: data.tenant }, // SKU per tenant
              sku: { like: `${base}` },
            },
          })

          const next = (existing.totalDocs + 1).toString().padStart(3, '0')

          data.sku = `${base}-${next}`
        }

        return data
      },
    ],
  },
}

export default Products
