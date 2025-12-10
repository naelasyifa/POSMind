'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SidebarKasir from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import PesananList from './components/pesananList'
import DetailPesanan from './components/DetailPesanan'
import ProdukModal from './components/ProdukModal'
import PelangganModal from './components/PelangganModal' // ✅ import modal

export default function PesananPage() {
  const router = useRouter()

  const [products, setProducts] = useState<any[]>([])
  const [promos, setPromos] = useState<any[]>([])
  const [keranjang, setKeranjang] = useState<any[]>([])
  const [customerName, setCustomerName] = useState<string>('')

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [showPelangganModal, setShowPelangganModal] = useState(false) // ✅ state modal
  const [alertStok, setAlertStok] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  })

  // ============================================================
  // =============== FETCH PRODUK & PROMO =======================
  // ============================================================
  useEffect(() => {
    async function load() {
      const productRes = await fetch(`/api/frontend/products`)
      const productData = await productRes.json()
      setProducts(Array.isArray(productData) ? productData : [])

      const promoRes = await fetch(`/api/frontend/promos`)
      const promoData = await promoRes.json()
      setPromos(Array.isArray(promoData) ? promoData : [])
    }
    load()
  }, [])

  // ============================================================
  // =============== MODAL PRODUK ==============================
  // ============================================================
  const openModal = (product: any) => {
    if (!product.stok || product.stok <= 0) {
      setAlertStok({
        show: true,
        message: `Produk "${product.nama}" tidak dapat ditambahkan karena stok sudah habis.`,
      })
      return
    }

    setSelectedProduct(product)
  }
  const closeModal = () => setSelectedProduct(null)

  // ============================================================
  // =============== TAMBAH KE KERANJANG =======================
  // ============================================================
  const tambahKeKeranjang = (product: any, qty: number, note: string) => {
    // cek stok total termasuk gratis
    const promo = promos.find(
      (p) =>
        p.promoType === 'bxgy' && p.applicableProducts?.some((prod: any) => prod.id === product.id),
    )

    let freeQty = 0
    if (promo && promo.buyQuantity && promo.freeQuantity) {
      freeQty = Math.floor(qty / promo.buyQuantity) * promo.freeQuantity
    }

    const totalDeduct = qty + freeQty
    if ((product.stok || 0) < totalDeduct) {
      setAlertStok({
        show: true,
        message: `Stok "${product.nama}" tidak cukup untuk promo BXGY`,
      })
      return
    }

    // kurangi stok produk
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stok: (p.stok || 0) - totalDeduct } : p)),
    )

    setKeranjang((prev) => {
      const exist = prev.find((p) => p.id === product.id && (p.note || '') === (note || ''))
      let newCart
      if (exist) {
        newCart = prev.map((p) =>
          p.id === product.id && (p.note || '') === (note || '') ? { ...p, qty: p.qty + qty } : p,
        )
      } else {
        newCart = [...prev, { ...product, qty, note }]
      }

      // tambahkan item gratis
      if (freeQty > 0) {
        newCart.push({
          ...product,
          qty: freeQty,
          harga: 0,
          isGratis: true,
          parentId: product.id,
          note,
        })
      }

      return newCart
    })

    closeModal()
  }

  // ============================================================
  // =============== HAPUS ITEM & KEMBALIKAN STOK ==============
  // ============================================================
  const hapusItem = (idx: number) => {
    const removed = keranjang[idx]
    if (!removed) return

    setKeranjang((prev) => prev.filter((p) => p.id !== removed.id && p.parentId !== removed.id))

    // kembalikan stok hanya untuk item asli + item gratis terkait
    if (!removed.isGratis) {
      const totalQty = removed.qty
      const relatedGratis = keranjang
        .filter((p) => p.parentId === removed.id)
        .reduce((s, p) => s + p.qty, 0)

      setProducts((prev) =>
        prev.map((p) =>
          p.id === removed.id ? { ...p, stok: (p.stok || 0) + totalQty + relatedGratis } : p,
        ),
      )
    }
  }

  // ============================================================
  // =============== HITUNGAN HARGA ============================
  // ============================================================

  const subtotal = keranjang.reduce((s, it) => s + it.harga * it.qty, 0)

  const itemDiscount = keranjang.reduce((s, it) => {
    const promo = promos.find((p) => p.kategori === 'product' && p.produk?.id === it.id)
    if (promo) {
      let diskon = 0
      if (promo.tipeDiskon === 'percent') {
        diskon = (promo.nilaiDiskon / 100) * (it.harga * it.qty)
      } else if (promo.tipeDiskon === 'nominal') {
        diskon = promo.nilaiDiskon * it.qty
      }
      return s + diskon
    }
    return s
  }, 0)

  const promoOrder = promos.find((p) => p.kategori === 'min_purchase')
  let orderDiscount = 0
  if (promoOrder && subtotal >= (promoOrder.minPembelian || 0)) {
    if (promoOrder.tipeDiskon === 'percent') {
      orderDiscount = (promoOrder.nilaiDiskon / 100) * (subtotal - itemDiscount)
    } else if (promoOrder.tipeDiskon === 'nominal') {
      orderDiscount = promoOrder.nilaiDiskon
    }
  }

  const pajak = (subtotal - itemDiscount - orderDiscount) * 0.1
  const total = Math.max(0, subtotal - itemDiscount - orderDiscount + pajak)

  function applyBxGyPromo(item: any, X: number, Y: number) {
    const totalQty = item.qty
    const freeQty = Math.floor(totalQty / X) * Y

    const items = [
      { ...item, qty: totalQty, harga: item.harga }, // item asli
    ]

    if (freeQty > 0) {
      items.push({
        ...item,
        qty: freeQty,
        harga: 0,
        isGratis: true,
        parentId: item.id, // tanda ini item gratis terkait item asli
      })
    }

    return items
  }

  function applyBxGyToKeranjang(keranjang: any[], promos: any[]) {
    const newCart: any[] = []

    keranjang.forEach((it) => {
      // cari promo BXGY untuk produk ini
      const promo = promos.find(
        (p) =>
          p.promoType === 'bxgy' && p.applicableProducts?.some((prod: any) => prod.id === it.id),
      )

      if (promo && promo.buyQuantity && promo.freeQuantity) {
        const newItems = applyBxGyPromo(it, promo.buyQuantity, promo.freeQuantity)
        newCart.push(...newItems)
      } else {
        newCart.push(it)
      }
    })

    return newCart
  }

  const promoBreakdown: any[] = []

  keranjang.forEach((it) => {
    const promo = promos.find((p) => p.produk?.id === it.id)

    if (promo) {
      if (promo.tipeDiskon === 'bxgy') {
        promoBreakdown.push({
          label: promo.nama,
          type: 'bxgy',
          value: 0, // diskon BXGY sudah diterapkan di keranjang, tidak dihitung di subtotal
          X: promo.X,
          Y: promo.Y,
        })
      } else {
        // promo diskon percent / nominal
        const diskon =
          promo.tipeDiskon === 'percent'
            ? (promo.nilaiDiskon / 100) * (it.harga * it.qty)
            : promo.nilaiDiskon * it.qty

        promoBreakdown.push({
          label:
            promo.tipeDiskon === 'percent'
              ? `${promo.nama} (${promo.nilaiDiskon}%)`
              : `${promo.nama} (Rp${promo.nilaiDiskon.toLocaleString()})`,
          type: promo.tipeDiskon,
          value: diskon,
        })
      }
    }
  })

  // Promo order (min purchase)
  if (promoOrder && subtotal >= (promoOrder.minPembelian || 0)) {
    const diskon =
      promoOrder.tipeDiskon === 'percent'
        ? (promoOrder.nilaiDiskon / 100) * (subtotal - itemDiscount)
        : promoOrder.nilaiDiskon

    promoBreakdown.push({
      label:
        promoOrder.tipeDiskon === 'percent'
          ? `${promoOrder.nama} (${promoOrder.nilaiDiskon}%)`
          : `${promoOrder.nama} (Rp${promoOrder.nilaiDiskon.toLocaleString()})`,
      value: diskon,
    })
  }

  return (
    <div className="flex min-h-screen bg-[#52bfbe] text-gray-800">
      <SidebarKasir />
      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderKasir title="Transaksi" showBack={true} />

        <div className="flex flex-1 p-4 gap-4">
          {/* LIST PRODUK */}
          <div className="w-3/5 bg-white rounded-xl p-4 shadow flex flex-col">
            <PesananList products={products} onSelect={openModal} />
          </div>

          {/* DETAIL PESANAN */}
          <div className="w-2/5">
            <DetailPesanan
              keranjang={keranjang}
              subtotal={subtotal}
              total={total}
              customerName={customerName}
              promoBreakdown={promoBreakdown}
              onRemoveItem={hapusItem}
              onOpenCustomer={() => setShowPelangganModal(true)} // ✅ tombol pencil
            />
          </div>
        </div>
      </div>

      {/* MODAL PRODUK */}
      {selectedProduct && (
        <ProdukModal product={selectedProduct} onClose={closeModal} onAdd={tambahKeKeranjang} />
      )}

      {/* MODAL PELANGGAN */}
      {showPelangganModal && (
        <PelangganModal
          initialName={customerName}
          onClose={() => setShowPelangganModal(false)}
          onSave={(name: string) => {
            setCustomerName(name)
            setShowPelangganModal(false)
          }}
        />
      )}
      {alertStok.show && (
        <div
          className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center"
          onClick={() => setAlertStok({ show: false, message: '' })}
        >
          <div
            className="bg-white p-5 rounded-lg shadow-lg w-[320px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-2">Stok Tidak Cukup</h3>
            <p className="text-gray-600 mb-4">{alertStok.message}</p>

            <button
              onClick={() => setAlertStok({ show: false, message: '' })}
              className="w-full py-2 bg-[#52bfbe] text-white rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
