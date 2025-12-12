import { CollectionConfig } from 'payload'

const Notifications: CollectionConfig = {
  slug: 'notifications',
  timestamps: true,

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    // 1️⃣ KATEGORI NOTIFIKASI (Untuk TAB di UI Admin/Kasir)
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Transaksi', value: 'transaksi' },
        { label: 'Produk', value: 'produk' },
        { label: 'Promo', value: 'promo' },
        { label: 'Reservasi', value: 'reservasi' },
        { label: 'Peringatan', value: 'peringatan' },
      ],
    },

    // 2️⃣ IKON (untuk tampilan UI)
    {
      name: 'icon',
      type: 'select',
      required: true,
      options: [
        { label: 'Berhasil', value: 'berhasil' },
        { label: 'Gagal', value: 'gagal' },
        { label: 'Warning', value: 'warning' },
        { label: 'Baru', value: 'baru' },
      ],
    },

    // 3️⃣ TIPE DETAIL (event notifikasi yang sebenarnya)
    {
      name: 'tipe',
      type: 'select',
      required: true,
      options: [
        { label: 'Stok Hampir Habis', value: 'low_stock' },
        { label: 'Stok Habis', value: 'out_of_stock' },
        { label: 'Promo Hampir Habis', value: 'promo_low_quota' },
        { label: 'Promo Habis', value: 'promo_out_quota' },
        { label: 'Transaksi Berhasil', value: 'trx_success' },
        { label: 'Transaksi Dibatalkan', value: 'trx_cancel' },
        { label: 'Reservasi Baru', value: 'reservation_new' },
        { label: 'Reservasi Dikonfirmasi', value: 'reservation_confirm' },
        { label: 'Reservasi Dibatalkan', value: 'reservation_cancel' },
        { label: 'Produk Baru', value: 'product_new' },
      ],
    },

    // 4️⃣ TEXT
    { name: 'title', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },

    // 5️⃣ STATUS
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

export default Notifications
