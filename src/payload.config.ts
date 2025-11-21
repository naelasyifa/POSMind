// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Promos from './collections/Promos'
import Products from './collections/Products'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Tenants, Users, Media, Promos, Products],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        region: 'us-east-1',
        endpoint: process.env.S3_ENDPOINT || '',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
      },
    }),
  ],
})
