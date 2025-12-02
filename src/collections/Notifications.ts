import { CollectionConfig } from 'payload'

const Notifications: CollectionConfig = {
  slug: 'notifications',

  access: {
    read: () => true,
  },

  fields: [
    // Tenant
  ],
}

export default Notifications
