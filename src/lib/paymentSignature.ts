import crypto from 'crypto'

export function generateSignature(
  method: string,
  body: Record<string, any>,
): Record<string, string> {
  const orderedBody = Object.keys(body)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = body[key]
      return acc
    }, {})

  const timestamp = Math.floor(Date.now() / 1000)

  const bodyHash = crypto.createHash('sha256').update(JSON.stringify(orderedBody)).digest('hex')

  const stringToSign =
    `${method}:${process.env.PAYMENT_API_KEY}:${bodyHash}:${timestamp}`.toLowerCase()

  const signature = crypto
    .createHmac('sha256', process.env.PAYMENT_API_SECRET!)
    .update(stringToSign)
    .digest('hex')

  return {
    'api-key': process.env.PAYMENT_API_KEY!,
    timestamp: timestamp.toString(),
    signature: signature.toString(),
  }
}
