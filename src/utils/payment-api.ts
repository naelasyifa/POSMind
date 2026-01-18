// utils/payment-api.ts
import crypto from 'crypto'

export async function getPaymentHeaders(method: string, body: any = null) {
  const apiKey = process.env.PAYMENT_API_KEY!
  const apiSecret = process.env.PAYMENT_API_SECRET!
  const timestamp = Math.floor(Date.now() / 1000)

  // Jika GET, biasanya body null atau kosong. Pastikan jadi string kosong untuk hashing.
  let minifyBody = ''
  if (body && Object.keys(body).length > 0) {
    const orderedBody = Object.keys(body)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = body[key]
        return acc
      }, {})
    minifyBody = JSON.stringify(orderedBody).replace(/\s+/g, '')
  }

  const hash = crypto.createHash('sha256').update(minifyBody).digest('hex')
  const stringToSign = [method.toUpperCase(), apiKey, hash, timestamp].join(':').toLowerCase()
  const signature = crypto.createHmac('sha256', apiSecret).update(stringToSign).digest('hex')

  return {
    'Content-Type': 'application/json',
    'api-key': apiKey,
    timestamp: timestamp.toString(),
    signature: signature,
  }
}
