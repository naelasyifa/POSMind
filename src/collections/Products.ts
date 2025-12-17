import { CollectionConfig } from 'payload'

const Products: CollectionConfig = {
  slug: 'products',

  access: {
    // Everyone must filter by their own tenant
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'superadmin') return true

      return {
        tenant: { equals: req.user.tenant },
      }
    },

    // Only admintoko can create directly — kasir must use ActionRequests
    create: ({ req }) => {
      if (!req.user) return false
      return req.user.role === 'admintoko' || req.user.role === 'superadmin'
    },

    // Only admintoko can update directly — kasir must use ActionRequests
    update: ({ req }) => {
      if (!req.user) return false

      if (req.user.role === 'admintoko' || req.user.role === 'superadmin') {
        return {
          tenant: { equals: req.user.tenant },
        }
      }

      return false
    },

    // Only admintoko can delete directly
    delete: ({ req }) => {
      if (!req.user) return false

      if (req.user.role === 'admintoko' || req.user.role === 'superadmin') {
        return {
          tenant: { equals: req.user.tenant },
        }
      }

      return false
    },
  },

  fields: [
    // Tenant
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
    },

    { name: 'nama', type: 'text', required: true },

    {
      name: 'useAutoSku',
      type: 'checkbox',
      label: 'Generate SKU otomatis?',
      defaultValue: true,
    },

    {
      name: 'sku',
      type: 'text',
      admin: {
        readOnly: false,
        condition: (data) => data.useAutoSku === false, // hanya bisa diisi kalau manual
      },
    },

    {
      name: 'kategori',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
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
    if (!req.user) return data

    // 🔒 FORCE tenant on create (override client input)
    if (operation === 'create') {
      data.tenant = req.user.tenant
    }

    // 🔑 AUTO SKU
    if (operation === 'create' && data.useAutoSku !== false) {
      const name = data.nama || ''

      const base = name
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const existing = await req.payload.find({
        collection: 'products',
        where: {
          tenant: { equals: req.user.tenant },
          sku: { like: `${base}` },
        },
      })

      const next = String(existing.totalDocs + 1).padStart(3, '0')
      data.sku = `${base}-${next}`
    }

    return data
  },
],


    afterChange: [
      async ({ req, doc, previousDoc }) => {
        const payload = req.payload

        // 🔔 Produk baru
        if (!previousDoc) {
          await payload.create({
            collection: 'notifications',
            data: {
              type: 'produk',
              icon: 'baru',
              tipe: 'product_new',
              title: 'Produk Baru Ditambahkan',
              message: `Produk "${doc.nama}" telah ditambahkan.`,
            },
          })
          return
        }

        // 🔔 Stok hampir habis (<=3)
        if (doc.stok <= 3 && previousDoc.stok > 3) {
          await payload.create({
            collection: 'notifications',
            data: {
              type: 'produk',
              icon: 'warning',
              tipe: 'low_stock',
              title: 'Stok Hampir Habis',
              message: `Stok produk "${doc.nama}" tinggal ${doc.stok}.`,
            },
          })
        }

        // 🔔 Stok habis
        if (doc.stok === 0 && previousDoc.stok > 0) {
          await payload.create({
            collection: 'notifications',
            data: {
              type: 'produk',
              icon: 'warning',
              tipe: 'out_of_stock',
              title: 'Produk Habis',
              message: `Produk "${doc.nama}" telah HABIS.`,
            },
          })

          // Kasir juga butuh
          await payload.create({
            collection: 'notifications',
            data: {
              type: 'produk',
              icon: 'warning',
              tipe: 'out_of_stock',
              title: 'Produk Habis',
              message: `"${doc.nama}" sudah tidak tersedia.`,
            },
          })
        }
      },
    ],
  },
}

export default Products
