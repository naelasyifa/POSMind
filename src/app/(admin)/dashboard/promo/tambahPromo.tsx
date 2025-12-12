'use client'

import { useState, useEffect } from 'react'
import { X, ChevronDown, Camera, Plus } from 'lucide-react'

interface TambahPromoProps {
  onClose: () => void
  onSave: (promo: any) => void
  produkList?: { id: string; nama: string }[]
}

/* ------------------------- */
/*      CUSTOM SELECT        */
/* ------------------------- */
function CustomSelect({ label, value, options, onChange, multiple = false }: any) {
  const [open, setOpen] = useState(false)

  const handleSelect = (val: any) => {
    if (multiple) {
      if (Array.isArray(value)) {
        if (value.includes(val)) onChange(value.filter((v: any) => v !== val))
        else onChange([...value, val])
      } else onChange([val])
    } else {
      onChange(val)
      setOpen(false)
    }
  }

  const displayLabel = () => {
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return 'Pilih'
      return options
        .filter((o: any) => value.includes(o.value))
        .map((o: any) => o.label)
        .join(', ')
    }
    return options.find((o: any) => o.value === value)?.label || 'Pilih Produk'
  }

  return (
    <div className="relative">
      {label && <label className="text-sm font-medium text-white block mb-2">{label}</label>}

      {/* Selected */}
      <div
        onClick={() => setOpen(!open)}
        className="bg-white rounded-xl py-3 px-4 text-gray-700 cursor-pointer flex justify-between items-center"
      >
        <span>{displayLabel()}</span>
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
          {options.map((o: any) => (
            <div
              key={o.value}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => handleSelect(o.value)}
            >
              {multiple && (
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(o.value)}
                  readOnly
                />
              )}
              <span>{o.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TambahPromo({ onClose, onSave }: TambahPromoProps) {
  const [closing, setClosing] = useState(false)

  const [produkList, setProdukList] = useState<{ id: string; nama: string }[]>([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/frontend/products')
        if (!res.ok) throw new Error('Failed to fetch products')

        const data = await res.json()
        console.log('RESPON PRODUK:', data)

        const produkList = Array.isArray(data) ? data : Array.isArray(data?.docs) ? data.docs : []

        setProdukList(produkList)
      } catch (err) {
        console.error(err)
        setProdukList([])
      }
    }

    fetchProducts()
  }, [])

  const [form, setForm] = useState<{
    nama: string
    kode: string
    mulai: string
    akhir: string
    startTime: string
    endTime: string
    availableDays: string[]
    kategori: string
    produkId: string | null
    minPembelian: string
    promoType: string
    tipeDiskon: string
    nilaiDiskon: string
    buyQuantity: string
    freeQuantity: string
    applicableProducts: string[]
    useQuota: boolean
    kuota: string
    stacking: string
    orderType: string[]
    limitCustomer: string
    isMultiple: boolean
    showOnDashboard: boolean
    bannerImage: string | File | null
    status: string
  }>({
    nama: '',
    kode: '',
    mulai: '',
    akhir: '',
    startTime: '',
    endTime: '',
    availableDays: [],
    kategori: 'all',
    produkId: '',
    minPembelian: '',
    promoType: 'discount',
    tipeDiskon: 'percent',
    nilaiDiskon: '',
    buyQuantity: '',
    freeQuantity: '',
    applicableProducts: [],
    isMultiple: true,
    useQuota: false,
    kuota: '',
    stacking: 'no',
    orderType: ['dinein', 'takeaway'],
    limitCustomer: 'unlimited',
    showOnDashboard: false,
    bannerImage: null,
    status: 'Aktif',
  })

  const updateField = (name: string, val: any) => {
    setForm((prev) => ({ ...prev, [name]: val }))
  }

  async function uploadFile(file: File) {
    const formData = new FormData()
    formData.append('banner', file)

    const res = await fetch('/api/frontend/upload-media', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error('Upload gagal')
    }

    const data = await res.json()

    if (!data?.url) {
      throw new Error('URL upload tidak ditemukan')
    }

    return data
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null
    const [year, month, day] = dateStr.split('-').map(Number)
    // month - 1 karena JS month = 0..11
    const date = new Date(year, month - 1, day)
    if (isNaN(date.getTime())) return null // cek validitas
    return date.toISOString()
  }

  const formatTime = (timeStr: string) => (timeStr ? timeStr + ':00' : null)

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Upload banner
    let bannerId: string | null = null
    if (form.bannerImage instanceof File) {
      const uploaded = await uploadFile(form.bannerImage)
      bannerId = uploaded.id
    } else if (typeof form.bannerImage === 'string') {
      bannerId = form.bannerImage
    }

    // Validasi wajib
    if (!form.nama || !form.kode || !form.mulai || !form.akhir) {
      alert('Nama, kode, dan tanggal promo wajib diisi')
      return
    }

    // Validasi BXGY
    if (form.promoType === 'bxgy') {
      const buy = Number(form.buyQuantity || 0)
      const free = Number(form.freeQuantity || 0)
      const products = Array.isArray(form.applicableProducts) ? form.applicableProducts : []

      if (buy <= 0 || free <= 0 || products.length === 0) {
        alert('Isi Beli X, Gratis Y, dan pilih Produk Gratis minimal 1')
        return
      }
    }

    // Payload
    const tenantId = 1
    const newPromo = {
      tenant: tenantId,
      ...form,
      banner: bannerId,
      mulai: formatDate(form.mulai),
      akhir: formatDate(form.akhir),
      startTime: form.startTime ? form.startTime + ':00' : null,
      endTime: form.endTime ? form.endTime + ':00' : null,
      kuota: Number(form.kuota || 0),
      minPembelian: Number(form.minPembelian || 0),
      nilaiDiskon: Number(form.nilaiDiskon || 0),
      buyQuantity: Number(form.buyQuantity || 0),
      freeQuantity: Number(form.freeQuantity || 0),
      limitCustomer: form.limitCustomer || 'unlimited', // ✅ default valid
      produk: form.produkId || null,
      availableDays: Array.isArray(form.availableDays) ? form.availableDays : [],
    }

    const res = await fetch('/api/frontend/promos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPromo),
    })

    const saved = await res.json()
    onSave(saved)
    onClose()
  }

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => onClose(), 250)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
        ${closing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        onClick={handleClose}
      />

      {/* Slide Panel */}
      <div
        className={`fixed top-0 right-0 bg-[#52bfbe] w-full max-w-[420px] h-full 
        rounded-l-2xl shadow-xl p-6 overflow-y-auto z-[60]
        ${closing ? 'animate-slideOutRight' : 'animate-slideInRight'}`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/30">
          <h2 className="text-xl font-semibold text-white">Tambah Promo</h2>
          <button onClick={handleClose} className="text-white hover:bg-white/20 rounded-full p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-5">
          {/* Banner Promo */}
          <div>
            <label className="text-sm font-medium text-white block mb-2">Banner Promo</label>

            <div className="relative w-40 h-40">
              {/* Preview Circle */}
              <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center overflow-hidden">
                {form.bannerImage ? (
                  typeof form.bannerImage === 'string' ? (
                    <img
                      src={form.bannerImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(form.bannerImage)}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="text-gray-400 flex items-center justify-center">
                    <Camera className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Label + Input file tersembunyi */}
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <div className="bg-teal-500 p-2 rounded-full flex items-center justify-center relative">
                  <Camera className="w-5 h-5 text-white" />
                  <Plus className="w-3 h-3 text-white absolute bottom-3.5 left-2.5" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    // Update preview langsung
                    setForm((prev) => ({ ...prev, bannerImage: file }))

                    try {
                      const uploaded = await uploadFile(file) // simpan ke 'uploaded'
                      setForm((prev) => ({
                        ...prev,
                        banner: uploaded.id, // ID untuk Payload
                        bannerImage: file, // tetap untuk preview
                      }))
                    } catch (err) {
                      console.error(err)
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Nama Promo */}
          <div>
            <label className="text-sm font-medium text-white block mb-2">Nama Promo</label>
            <input
              className="bg-white rounded-lg w-full p-3"
              value={form.nama}
              onChange={(e) => updateField('nama', e.target.value)}
              placeholder="Masukkan Nama Promo"
            />
          </div>

          {/* Kode Promo */}
          <div>
            <label className="text-sm font-medium text-white block mb-2">Kode Promo</label>
            <input
              className="bg-white rounded-lg w-full p-3"
              value={form.kode}
              onChange={(e) => updateField('kode', e.target.value)}
              placeholder="Masukkan Kode Promo"
            />
          </div>

          {/* Tanggal & Jam */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-white block mb-2">Tanggal Mulai</label>
              <input
                type="date"
                value={form.mulai}
                onChange={(e) => updateField('mulai', e.target.value)}
                className="bg-white rounded-lg w-full p-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white block mb-2">Tanggal Akhir</label>
              <input
                type="date"
                value={form.akhir}
                onChange={(e) => updateField('akhir', e.target.value)}
                className="bg-white rounded-lg w-full p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-white block mb-2">Jam Mulai (HH:mm)</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => updateField('startTime', e.target.value)}
                className="bg-white rounded-lg w-full p-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white block mb-2">Jam Akhir (HH:mm)</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => updateField('endTime', e.target.value)}
                className="bg-white rounded-lg w-full p-3"
              />
            </div>
          </div>

          {/* Hari Berlaku */}
          <CustomSelect
            label="Hari Berlaku"
            value={form.availableDays}
            onChange={(v: any) => updateField('availableDays', v)}
            options={[
              { label: 'Senin', value: 'monday' },
              { label: 'Selasa', value: 'tuesday' },
              { label: 'Rabu', value: 'wednesday' },
              { label: 'Kamis', value: 'thursday' },
              { label: 'Jumat', value: 'friday' },
              { label: 'Sabtu', value: 'saturday' },
              { label: 'Minggu', value: 'sunday' },
            ]}
            multiple
          />

          {/* Kategori */}
          <CustomSelect
            label="Kategori Promo"
            value={form.kategori}
            onChange={(v: any) => updateField('kategori', v)}
            options={[
              { value: 'all', label: 'Semua Item' },
              { value: 'product', label: 'Produk Tertentu' },
              { value: 'min_purchase', label: 'Minimum Pembelian' },
            ]}
          />

          {/* Produk Tertentu */}
          {form.kategori === 'product' && (
            <CustomSelect
              label="Pilih Produk"
              value={form.produkId}
              onChange={(v: any) => updateField('produkId', v)}
              options={produkList.map((p) => ({ value: p.id, label: p.nama }))}
            />
          )}

          {/* Minimum Pembelian */}
          {form.kategori === 'min_purchase' && (
            <div>
              <label className="text-sm font-medium text-white block mb-2">Minimum Pembelian</label>
              <input
                type="number"
                value={form.minPembelian}
                onChange={(e) => updateField('minPembelian', e.target.value)}
                className="bg-white rounded-lg w-full p-3"
                placeholder="Contoh: 200000"
              />
            </div>
          )}

          {/* Promo Type */}
          <CustomSelect
            label="Tipe Promo"
            value={form.promoType}
            onChange={(v: any) => updateField('promoType', v)}
            options={[
              { value: 'discount', label: 'Diskon' },
              { value: 'bxgy', label: 'Beli X Gratis Y' },
            ]}
          />

          {/* Diskon */}
          {form.promoType === 'discount' && (
            <div>
              <label className="text-sm font-medium text-white block mb-2">Tipe Diskon</label>

              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => updateField('tipeDiskon', 'percent')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    form.tipeDiskon === 'percent'
                      ? 'bg-gray-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  %
                </button>

                <button
                  type="button"
                  onClick={() => updateField('tipeDiskon', 'nominal')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    form.tipeDiskon === 'nominal'
                      ? 'bg-gray-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Rp
                </button>
              </div>

              <input
                type="number"
                value={form.nilaiDiskon}
                onChange={(e) => updateField('nilaiDiskon', e.target.value)}
                placeholder={
                  form.tipeDiskon === 'percent'
                    ? 'Masukkan persentase (contoh: 20)'
                    : 'Masukkan nominal (contoh: 5000)'
                }
                className="bg-white rounded-lg w-full p-3"
              />
            </div>
          )}

          {/* Beli X Gratis Y */}
          {form.promoType === 'bxgy' && (
            <>
              <div>
                <label className="text-sm font-medium text-white block mb-2">Beli X</label>
                <input
                  type="number"
                  value={form.buyQuantity || ''}
                  onChange={(e) => updateField('buyQuantity', e.target.value)}
                  className="bg-white rounded-lg w-full p-3"
                  placeholder="Jumlah beli"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white block mb-2">Gratis Y</label>
                <input
                  type="number"
                  value={form.freeQuantity || ''}
                  onChange={(e) => updateField('freeQuantity', e.target.value)}
                  className="bg-white rounded-lg w-full p-3"
                  placeholder="Jumlah gratis"
                />
              </div>
              <CustomSelect
                label="Produk Gratis"
                value={form.applicableProducts || []}
                onChange={(v: any) => updateField('applicableProducts', v)}
                options={produkList.map((p) => ({ value: p.id, label: p.nama }))}
                multiple
              />

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={form.isMultiple}
                  onChange={(e) => updateField('isMultiple', e.target.checked)}
                />
                <label className="text-white">Berlaku Kelipatan</label>
              </div>
            </>
          )}

          {/* Kuota Opsional*/}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.useQuota || false}
              onChange={(e) => updateField('useQuota', e.target.checked)}
            />
            <label className="text-white">Gunakan Kuota</label>
          </div>
          {form.useQuota && (
            <input
              type="number"
              value={form.kuota || ''}
              onChange={(e) => updateField('kuota', e.target.value)}
              className="bg-white rounded-lg w-full p-3 mt-2"
              placeholder="Jumlah kuota"
            />
          )}

          {/* Stacking */}
          <CustomSelect
            label="Aturan Penggabungan Promo"
            value={form.stacking}
            onChange={(v: any) => updateField('stacking', v)}
            options={[
              { value: 'no', label: 'Tidak Bisa Digabung' },
              { value: 'yes', label: 'Boleh Digabung' },
              { value: 'single', label: 'Hanya 1 Promo Aktif' },
            ]}
          />

          {/* Jenis Order */}
          <div>
            <label className="text-sm font-medium text-white block mb-2">Berlaku Untuk</label>

            <div className="bg-white rounded-lg p-3 space-y-2">
              {['dinein', 'takeaway'].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.orderType.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateField('orderType', [...form.orderType, type])
                      } else {
                        updateField(
                          'orderType',
                          form.orderType.filter((i) => i !== type),
                        )
                      }
                    }}
                  />
                  <span className="text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Limit Per Pelanggan */}
          <CustomSelect
            label="Limit Per Pelanggan"
            value={form.limitCustomer}
            onChange={(v: any) => updateField('limitCustomer', v)}
            options={[
              { value: 'unlimited', label: 'Tidak dibatasi' },
              { value: 'once_per_day', label: '1x per hari' },
              { value: 'once_per_order', label: '1x per transaksi' },
              { value: 'new_customer', label: 'Khusus pelanggan baru' },
            ]}
          />

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-white block mb-2">Status</label>
            <div className="flex rounded-lg overflow-hidden">
              {['Aktif', 'Nonaktif'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`flex-1 py-3 text-sm font-medium transition ${
                    form.status === s
                      ? 'bg-gray-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setForm({ ...form, status: s })}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tampil di Dashboard */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.showOnDashboard}
              onChange={(e) => updateField('showOnDashboard', e.target.checked)}
            />
            <label className="text-white">Tampil di Dashboard</label>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-between items-center pt-15 gap-3">
            <button
              type="submit"
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>

      {/* Animasi */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0.3;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fadeOut {
          animation: fadeOut 0.45s ease-in forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        .animate-slideOutRight {
          animation: slideOutRight 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
      `}</style>
    </>
  )
}
