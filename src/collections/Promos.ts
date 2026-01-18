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

    // Banner dan tampilkan/sembunyikan
    {
      name: 'showOnDashboard',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Jika dicentang, promo muncul di dashboard kasir' },
    },
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Jika kosong, gunakan gambar default di dashboard',
      },
    },

    // Rentang tanggal berlaku
    { name: 'mulai', type: 'date', required: true },
    { name: 'akhir', type: 'date', required: true },

    // Hari & Jam berlaku
    {
      name: 'availableDays',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Senin', value: 'monday' },
        { label: 'Selasa', value: 'tuesday' },
        { label: 'Rabu', value: 'wednesday' },
        { label: 'Kamis', value: 'thursday' },
        { label: 'Jumat', value: 'friday' },
        { label: 'Sabtu', value: 'saturday' },
        { label: 'Minggu', value: 'sunday' },
      ],
      admin: { description: 'Kosong = semua hari berlaku' },
    },
    { name: 'startTime', type: 'text', admin: { description: 'HH:mm, optional' } },
    { name: 'endTime', type: 'text', admin: { description: 'HH:mm, optional' } },

    //kategori promo
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

    // Tipe promo
    {
      name: 'promoType',
      type: 'select',
      required: true,
      defaultValue: 'discount',
      options: [
        { label: 'Diskon', value: 'discount' },
        { label: 'Beli X Gratis Y', value: 'bxgy' },
      ],
    },

    //diskon
    {
      name: 'tipeDiskon',
      type: 'select',
      required: true,
      defaultValue: 'percent',
      options: [
        { label: 'Persentase', value: 'percent' },
        { label: 'Nominal', value: 'nominal' },
      ],
      admin: { condition: (data) => data?.promoType === 'discount' },
    },

    {
      name: 'nilaiDiskon',
      type: 'number',
      required: true,
      admin: { condition: (data) => data?.promoType === 'discount' },
    },

    // Beli X Gratis Y
    {
      name: 'buyQuantity',
      type: 'number',
      required: false,
      admin: { condition: (data) => data?.promoType === 'bxgy' },
    },
    {
      name: 'freeQuantity',
      type: 'number',
      required: false,
      admin: { condition: (data) => data?.promoType === 'bxgy' },
    },
    {
      name: 'applicableProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: false,
      admin: { condition: (data) => data?.promoType === 'bxgy' },
    },
    {
      name: 'isMultiple',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Berlaku kelipatan? Contoh: beli 4 gratis 2. Jika dimatikan → hanya 1x: beli 4 gratis tetap 1.',
        condition: (data) => data?.promoType === 'bxgy',
      },
    },

    // Kuota opsional
    { name: 'useQuota', type: 'checkbox', defaultValue: false },
    {
      name: 'kuota',
      type: 'number',
      required: false,
      admin: { condition: (data) => data?.useQuota === true },
    },
    { name: 'kuotaUsed', type: 'number', defaultValue: 0, admin: { readOnly: true } },

    // Pengaturan lanjutan
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

  hooks: {
    afterChange: [
      async ({ req, doc, previousDoc }) => {
        const payload = req.payload

        // --- 1. NOTIFIKASI EXPIRED (KADALUWARSA) ---
        // Dipicu ketika status berubah menjadi Nonaktif (biasanya via API auto-deactivate)
        if (doc.status === 'Nonaktif' && previousDoc?.status === 'Aktif') {
          await payload.create({
            collection: 'notifications',
            data: {
              type: 'promo',
              icon: 'warning',
              tipe: 'promo_expired',
              isRead: false,
              title: 'Promo Berakhir',
              message: `Masa berlaku promo "${doc.nama}" telah habis.`,
              createdAt: new Date().toISOString(),
            },
          })
        }

        // --- 2. NOTIFIKASI KUOTA ---
        if (doc.useQuota) {
          const sisa = doc.kuota - (doc.kuotaUsed || 0)
          // Jika previousDoc tidak ada (data baru), kita kasih default tinggi supaya trigger sisa <= 10 jalan
          const sisaLama = previousDoc ? previousDoc.kuota - (previousDoc.kuotaUsed || 0) : 999

          // 🔔 Kuota hampir habis (Trigger hanya saat melewati angka 10)
          if (sisa <= 10 && sisa > 0 && sisaLama > 10) {
            await payload.create({
              collection: 'notifications',
              data: {
                type: 'promo',
                icon: 'warning',
                tipe: 'promo_low_quota',
                isRead: false,
                title: 'Kuota Promo Hampir Habis',
                message: `Promo "${doc.nama}" tersisa ${sisa} kuota.`,
                createdAt: new Date().toISOString(),
              },
            })
          }

          // 🔔 Kuota habis (Trigger hanya saat melewati angka 0)
          if (sisa <= 0 && sisaLama > 0) {
            await payload.create({
              collection: 'notifications',
              data: {
                type: 'promo',
                icon: 'warning',
                tipe: 'promo_out_quota',
                isRead: false,
                title: 'Kuota Promo Habis',
                message: `Promo "${doc.nama}" telah habis kuota.`,
                createdAt: new Date().toISOString(),
              },
            })
          }
        }
      },
    ],
  },
}

export default Promos
