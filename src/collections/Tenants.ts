import { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',

  admin: {
    useAsTitle: 'name',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      required: false,
      unique: false, // Hapus unique → Supabase sering error jika sudah ada data
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
  ],
}