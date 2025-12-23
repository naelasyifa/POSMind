import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import type { Endpoint } from 'payload'

import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Promos from './collections/Promos'
import Products from './collections/Products'
import Transactions from './collections/Transactions'
import Notifications from './collections/Notifications'
import Payments from './collections/Payments'
import Reservations from './collections/Reservations'
// import { Admins } from './collections/Admins'
import { Cat } from 'lucide-react'
import Categories from './collections/Categories'
import StoreSettings from './collections/storeSettings'
import Tables from './collections/Tables'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
console.log('Collections Loaded:', [
  Tenants.slug,
  Users.slug,
  Media.slug,
  Promos.slug,
  Products.slug,
  Transactions.slug,
  Categories.slug,
  Payments.slug,
  Notifications.slug,
  Reservations.slug,
  StoreSettings.slug,
  Tables.slug,
])

// const sendOtpEndpoint: any = {
//   path: '/auth/send-otp',
//   method: 'post',
//   handler: async (context: any) => {
//     const { req, payload, data } = context
//     const email = req.body.email
//     if (!email) return Response.json({ error: 'Email kosong' }, { status: 400 })

//     const existing = await req.payload.find({
//       collection: 'users',
//       where: { email: { equals: email } },
//       limit: 1,
//     })

//     const otp = Math.floor(100000 + Math.random() * 900000).toString()

//     if (existing.totalDocs === 0) {
//       await req.payload.create({
//         collection: 'users',
//         data: {
//           email,
//           otp,
//           otpExpiration: new Date(Date.now() + 5 * 60 * 1000),
//           isBusinessUser: true,
//         },
//       })
//     } else {
//       await req.payload.update({
//         collection: 'users',
//         id: existing.docs[0].id,
//         data: { otp, otpExpiration: new Date(Date.now() + 5 * 60 * 1000) },
//       })
//     }

//     await req.payload.sendEmail({
//       to: email,
//       subject: 'Kode OTP POS Mind',
//       html: `<p>Kode OTP kamu adalah: <strong>${otp}</strong></p>`,
//     })

//     return Response.json({ success: true })
//   },
// }

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [
    Tenants,
    Users,
    Media,
    // Admins,
    Promos,
    Products,
    Transactions,
    Payments,
    Notifications,
    Reservations,
    Categories,
    StoreSettings,
    Tables,
    
  ],

  email: nodemailerAdapter({
    defaultFromAddress: 'no-reply@pos-mind.com',
    defaultFromName: 'POS Mind',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // kalau pakai TLS ubah jadi true
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  sharp,

  plugins: [
    // ❌ HAPUS kalau tidak hosting di Payload Cloud
    // payloadCloudPlugin(),

    s3Storage({
      enabled: true, // <--- INI WAJIB
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        region: process.env.S3_REGION!,
        endpoint: process.env.S3_ENDPOINT!,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        },
      },
    }),
  ],
})
