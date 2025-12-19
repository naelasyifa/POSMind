import { CollectionConfig } from 'payload'

export const Tables: CollectionConfig = {
  slug: 'tables',

  timestamps: true, // created_at, updated_at

  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },

    {
      name: 'nama_meja',
      type: 'text',
      required: true,
    },

    {
      name: 'kapasitas',
      type: 'number',
      required: true,
    },

    {
      name: 'lantai',
      type: 'select',
      required: true,
      options: [
        { label: 'Lantai 1', value: 'lantai_1' },
        { label: 'Lantai 2', value: 'lantai_2' },
        { label: 'Lantai 3', value: 'lantai_3' },
      ],
    },

    {
      name: 'area',
      type: 'select',
      required: false,
      options: [
        { label: 'Indoor', value: 'indoor' },
        { label: 'Outdoor', value: 'outdoor' },
        { label: 'VIP', value: 'vip' },
        { label: 'Smoking', value: 'smoking' },
      ],
    },

    {
      name: 'bentuk',
      type: 'select',
      required: false,
      options: [
        { label: 'Kotak', value: 'kotak' },
        { label: 'Bulat', value: 'bulat' },
      ],
    },

    {
      name: 'posisi_x',
      type: 'number',
      required: true,
    },

    {
      name: 'posisi_y',
      type: 'number',
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      required: false,
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Reserved', value: 'reserved' },
        { label: 'Disabled', value: 'disabled' },
      ],
    },

    {
      name: 'catatan',
      type: 'textarea',
      required: false,
    },

    {
      name: 'dp_meja',
      type: 'number',
      required: false,
    },

    {
      name: 'is_highlight',
      type: 'checkbox',
      required: false,
    },
  ],
}

export default Tables