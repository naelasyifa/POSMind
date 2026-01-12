import payload from 'payload'
import config from '../payload.config'

let cached = (global as any).payloadClient

if (!cached) {
  cached = payload.init({
    config,
  })

  ;(global as any).payloadClient = cached
}

export const getPayloadClient = async () => cached