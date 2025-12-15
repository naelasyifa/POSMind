import { CollectionConfig } from 'payload'

const Categories: CollectionConfig = {
  slug: 'categories',

  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    { name: 'nama', type: 'text', required: true },
    { name: 'ikon', type: 'upload', relationTo: 'media' }, // ikon kategori
  ],
}

export default Categories
