import { getPayload } from 'payload'
import config from '@/payload.config'

let client: any

export const getPayloadClient = async () => {
  if (!client) client = await getPayload({ config })
  return client
}
