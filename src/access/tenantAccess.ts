// import { Access } from 'payload'

// export const tenantAccess: Access = ({ req }) => {
//   if (!req.user) return false

//   // Superadmin boleh lihat semua
//   if (req.user.role === 'superadmin') return true

//   // User WAJIB punya tenant
//   if (!req.user.tenant) return false

//   return {
//     tenant: {
//       equals: req.user.tenant,
//     },
//   }
// }
