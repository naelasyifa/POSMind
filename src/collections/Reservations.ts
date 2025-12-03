import { CollectionConfig } from 'payload'

const Reservations: CollectionConfig = {
  slug: 'reservations',

  access: {
    read: () => true,
  },

  fields: [
    // Tenant
  ],
}

export default Reservations
