import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const run = async () => {
  const payload = await getPayload({ config })

  // 1️⃣ Fetch an existing kasir user (FULL document)
  const kasir = await payload.findByID({
    collection: 'users',
    id: 30, // kasir user ID
  })

  // 2️⃣ Create action request AS that user
  const doc = await payload.create({
    collection: 'action-requests',
    data: {
      actionType: 'create',
      payload: { name: 'TEST PRODUCT' },
    } as any,
    user: kasir, // 👈 THIS is the missing piece
    overrideAccess: true, // 👈 optional but safe for scripts
  })

  console.log(doc)
}

run()
