import { CollectionConfig } from 'payload'

const Tables: CollectionConfig = {
  slug: 'tables',

  admin: {
    useAsTitle: 'namaMeja',
    defaultColumns: ['namaMeja', 'lantai', 'area', 'kapasitas'],
  },

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  timestamps: true,

  fields: [
    /* =========================
       IDENTITAS MEJA
    ==========================*/
    {
      name: 'namaMeja',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'kapasitas',
      type: 'number',
      required: true,
    },

    /* =========================
       KATEGORI
    ==========================*/
    {
      name: 'lantai',
      type: 'select',
      required: true,
      options: [
        { label: 'Lantai 1', value: 'lantai_1' },
        { label: 'Lantai 2', value: 'lantai_2' },
        { label: 'Lantai 3', value: 'lantai_3' },
        { label: 'Rooftop', value: 'rooftop' },
      ],
    },
    {
      name: 'area',
      type: 'select',
      options: [
        { label: 'VIP', value: 'vip' },
        { label: 'Indoor', value: 'indoor' },
        { label: 'Outdoor', value: 'outdoor' },
        { label: 'Smoking', value: 'smoking' },
      ],
    },

    /* =========================
       BENTUK & POSISI (LAYOUT)
    ==========================*/
    {
      name: 'bentuk',
      type: 'select',
      defaultValue: 'kotak',
      options: [
        { label: 'Kotak', value: 'kotak' },
        { label: 'Bulat', value: 'bulat' },
      ],
    },
    {
      name: 'posisi',
      type: 'group',
      label: 'Posisi Layout',
      fields: [
        {
          name: 'x',
          type: 'number',
          required: true,
        },
        {
          name: 'y',
          type: 'number',
          required: true,
        },
      ],
    },

    /* =========================
       BISNIS RULE
    ==========================*/
    {
      name: 'dpMeja',
      label: 'DP Meja (Rp)',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },

    /* =========================
       OPSIONAL (UI SUPPORT)
    ==========================*/
    {
      name: 'catatan',
      type: 'textarea',
    },

    /* =========================
       TENANT (AUTO DONATELL)
    ==========================*/
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        hidden: true, // 👈 admin gak bisa lihat / pilih
      },
      hooks: {
        beforeChange: [
          ({ value }) => value ?? 3, // 👈 selalu Donatell
        ],
      },
    },
  ],
}

export default Tables
