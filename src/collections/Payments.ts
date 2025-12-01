import { CollectionConfig } from 'payload'

const Payments: CollectionConfig = {
  slug: 'payments',

  access: {
    read: () => true,
  },

  fields: [
    // Tenant
  ],
}

export default Payments
