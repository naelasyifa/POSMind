import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,
  },

  upload: {
    mimeTypes: ['image/*'],
    
    adminThumbnail: ({ doc }) => {
      return typeof doc.url === 'string' ? doc.url : '';
    },
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
