import { s3Storage } from '@payloadcms/storage-s3';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Tenants } from './collections/Tenants';
import { Users } from './collections/Users';
import { Media } from './collections/Media';
import Promos from './collections/Promos';
import Products from './collections/Products';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
});
