'use client'

import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'

interface TambahPromoProps {
  onClose: () => void
  onSave: (promo: any) => void
  produkList?: { id: string; nama: string }[]
}

/* ------------------------- */
/*      CUSTOM SELECT        */
/* ------------------------- */
function CustomSelect({ label, value, options, onChange }: any) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      {label && <label className="text-sm font-medium text-white block mb-2">{label}</label>}

      {/* Selected */}
      <div
        onClick={() => setOpen(!open)}
        className="bg-white rounded-xl py-3 px-4 text-gray-700 cursor-pointer flex justify-between items-center"
      >
        <span>{options.find((o: any) => o.value === value)?.label || 'Pilih...'}</span>
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
          {options.map((o: any) => (
            <div
              key={o.value}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TambahPromo({ onClose, onSave, produkList = [] }: TambahPromoProps) {
  const [closing, setClosing] = useState(false)

  const [form, setForm] = useState({
    nama: '',
    kode: '',
    mulai: '',
    akhir: '',
    kuota: '',
    status: 'Aktif',

    kategori: 'all',
    produkId: '',
    minPembelian: '',

    tipeDiskon: 'percent',
    nilaiDiskon: '',

    stacking: 'no',
    orderType: ['dinein', 'takeaway'],
    limitCustomer: 'unlimited',
  })

  const updateField = (name: string, val: any) => {
    setForm((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const newPromo = {
      id: Date.now(),
      ...form,
      kuota: Number(form.kuota),
      minPembelian: Number(form.minPembelian || 0),
      nilaiDiskon: Number(form.nilaiDiskon),
    }

    setClosing(true)
    setTimeout(() => onSave(newPromo), 250)
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

          {/* Tanggal Mulai / Akhir */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-white block mb-2">Tanggal Mulai</label>
              <input
                type="datetime-local"
                value={form.mulai}
                onChange={(e) => updateField('mulai', e.target.value)}
                className="bg-white rounded-lg w-full p-3"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white block mb-2">Tanggal Akhir</label>
              <input
                type="datetime-local"
                value={form.akhir}
                onChange={(e) => updateField('akhir', e.target.value)}
                className="bg-white rounded-lg w-full p-3"
              />
            </div>
          </div>

          {/* Diskon */}
          <div>
            <label className="text-sm font-medium text-white block mb-2">Diskon</label>

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

          {/* Kuota */}
          <div>
            <label className="text-sm font-medium text-white block mb-2">Kuota</label>
            <input
              type="number"
              value={form.kuota}
              onChange={(e) => updateField('kuota', e.target.value)}
              className="bg-white rounded-lg w-full p-3"
              placeholder="Masukkan jumlah kuota"
            />
          </div>

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
