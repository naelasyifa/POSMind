import { getPayload } from 'payload'
import config from '../src/payload.config'

const run = async () => {
  const payload = await getPayload({ config })

  const doc = await payload.create({
    collection: 'action-requests',
    data: {
      actionType: 'create',
      payload: { name: 'TEST PRODUCT' },
      tenant: 26,
      createdBy: 30,
      status: 'pending',
    },
  })

  console.log(doc)
}

run()
