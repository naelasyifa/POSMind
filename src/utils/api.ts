// utils/api.ts
export const fetchProducts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/products?depth=1`)
  if (!res.ok) throw new Error('Failed to fetch products')
  const data = await res.json()
  return data.docs
}

export const fetchPromos = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/promos?depth=1`)
  if (!res.ok) throw new Error('Failed to fetch promos')
  const data = await res.json()
  return data.docs
}
