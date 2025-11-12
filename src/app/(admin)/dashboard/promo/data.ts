export interface Promo {
  id: number
  nama: string
  kode: string
  mulai: string
  akhir: string
  diskon: string
  kuota: number
  status: string
}

// Simulasi data sementara (anggap seperti database lokal)
export let promoData: Promo[] = [
  {
    id: 1,
    nama: 'Diskon Gajian',
    kode: '123awalbulan',
    mulai: '01 Aug 2025 14:00:01',
    akhir: '03 Aug 2025 20:00:00',
    diskon: '20%',
    kuota: 25,
    status: 'Aktif',
  },
  {
    id: 2,
    nama: 'Merdeka Sale',
    kode: '17Agustus',
    mulai: '17 Aug 2025 10:00:01',
    akhir: '17 Aug 2025 14:00:00',
    diskon: '17%',
    kuota: 45,
    status: 'Aktif',
  },
]

// Fungsi simulasi CRUD
export const addPromo = (promo: Promo) => {
  promoData.push(promo)
}

export const updatePromo = (id: number, updated: Promo) => {
  promoData = promoData.map((p) => (p.id === id ? updated : p))
}

export const deletePromo = (id: number) => {
  promoData = promoData.filter((p) => p.id !== id)
}
