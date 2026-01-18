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
import Shifts from './collections/Shifts'
// import { Admins } from './collections/Admins'
import { Cat } from 'lucide-react'
import Categories from './collections/Categories'
import StoreSettings from './collections/storeSettings'
import Tables from './collections/Tables'
import PaymentMethods from './collections/PaymentMethods'
import { getPaymentHeaders } from './utils/payment-api'

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
  PaymentMethods.slug,
  Shifts.slug,
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

  // Tambahkan fungsi onInit di sini (sejajar dengan collections)
  onInit: (payload) => {
    // Hapus async di sini
    payload.logger.info('Payload initialized...')

    // Jalankan proses async tanpa 'await' agar tidak menahan startup
    const syncPayments = async () => {
      try {
        const apiURL = `${process.env.PAYMENT_BASE_URL}/transfer/api/v1/method`
        const headers = await getPaymentHeaders('GET')

        const response = await fetch(apiURL, {
          method: 'GET',
          headers: headers as any,
          next: { revalidate: 0 },
        })

        const result = await response.json()

        if (result.status && Array.isArray(result.data)) {
          for (const item of result.data) {
            const existing = await payload.find({
              collection: 'payment-methods',
              where: { externalId: { equals: item.id } },
            })

            if (existing.docs.length === 0) {
              await payload.create({
                collection: 'payment-methods',
                data: {
                  name: item.name,
                  externalId: item.id,
                  code: item.code,
                  isActive: true,
                  category: item.category,
                },
              })
              payload.logger.info(`✅ Synced new payment method: ${item.name}`)
            }
          }
        }
        payload.logger.info('✅ Sinkronisasi selesai')
      } catch (error: any) {
        // Ganti ke 'error: any' di sini
        payload.logger.error(`❌ Gagal sinkronisasi payment: ${error.message}`)
      }
    }

    syncPayments() // Panggil tanpa await
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
    PaymentMethods,
    Shifts,
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
      tls: {
        rejectUnauthorized: false, // <== ini penting untuk self-signed / dev
      },
    },
  }),

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: true,
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
