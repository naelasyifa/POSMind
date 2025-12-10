import { CollectionConfig } from 'payload'

const StoreSettings: CollectionConfig = {
  slug: 'storeSettings',
  admin: {
    useAsTitle: 'storeName',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      unique: true, // supaya tiap tenant cuma punya 1 pengaturan
    },
    {
      name: 'storeName',
      type: 'text',
      required: true,
    },
    // --- Pajak & Service Charge ---
    {
      name: 'serviceCharge',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'serviceChargePercentage',
      type: 'number',
      defaultValue: 10,
    },
    {
      name: 'pajak',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'pajakPercentage',
      type: 'number',
      defaultValue: 10,
    },
    // --- Jam Buka ---
    {
      name: 'jamBuka',
      type: 'array',
      fields: [
        { name: 'hari', type: 'text' },
        { name: 'buka', type: 'checkbox' },
        { name: 'fullDay', type: 'checkbox' },
        { name: 'jamBuka', type: 'text' },
        { name: 'jamTutup', type: 'text' },
      ],
    },
    // --- Struk ---
    {
      name: 'struk',
      type: 'group',
      fields: [
        { name: 'header', type: 'text' },
        { name: 'footer', type: 'textarea' },
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'paperSize', type: 'number', defaultValue: 80 },
        {
          name: 'options',
          type: 'group',
          fields: Object.keys({
            infoToko: true,
            noNota: true,
            noTransaksi: true,
            jamTransaksi: true,
            jamBuka: false,
            infoTambahan: false,
            namaMeja: false,
            modePenjualan: false,
            pax: false,
            namaKasir: true,
            posmindOrder: false,
            cetakKe: false,
            promoMenu: false,
            pembulatan: false,
            pajak: true,
            service: true,
            wifi: false,
            powered: true,
          }).map((key) => ({ name: key, type: 'checkbox' })),
        },
      ],
    },
    // --- Cetakan Dapur ---
    {
      name: 'dapur',
      type: 'group',
      fields: [
        { name: 'paperSize', type: 'number', defaultValue: 80 },
        {
          name: 'options',
          type: 'group',
          fields: Object.keys({
            noTransaksi: true,
            tanggalTransaksi: true,
            jamTransaksi: true,
            modePenjualan: true,
            namaWaiter: true,
            namaWaiter2: false,
            namaSender: true,
            infoTambahan: true,
            namaMeja: true,
          }).map((key) => ({ name: key, type: 'checkbox' })),
        },
      ],
    },
  ],
}

export default StoreSettings
