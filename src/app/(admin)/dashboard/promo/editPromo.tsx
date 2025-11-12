'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface EditPromoProps {
  id: number
  onClose: () => void
  onUpdate: (updatedPromo: any) => void // callback ke parent
  promoData: any[] // data dari parent
}

export default function EditPromo({ id, onClose, onUpdate, promoData }: EditPromoProps) {
  const promo = promoData.find((p) => p.id === id)
  const [form, setForm] = useState({
    nama: '',
    kode: '',
    mulai: '',
    akhir: '',
    diskon: '',
    kuota: '',
    status: 'Aktif',
  })

  // Inisialisasi form
  useEffect(() => {
    if (!promo) return
    setForm({
      nama: promo.nama,
      kode: promo.kode,
      mulai: new Date(promo.mulai).toISOString().slice(0, 16),
      akhir: new Date(promo.akhir).toISOString().slice(0, 16),
      diskon: promo.diskon,
      kuota: String(promo.kuota),
      status: promo.status,
    })
  }, [promo])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promo) return
    const updated = {
      id,
      nama: form.nama,
      kode: form.kode,
      mulai: new Date(form.mulai).toISOString(),
      akhir: new Date(form.akhir).toISOString(),
      diskon: form.diskon,
      kuota: Number(form.kuota),
      status: form.status,
    }
    onUpdate(updated) // kirim ke parent
    onClose()
  }

  if (!promo) return null

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex justify-end z-50">
      <div className="bg-[#52bfbe] w-full max-w-[420px] h-full overflow-y-auto rounded-l-2xl shadow-xl animate-slide-in-right p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/30">
          <h2 className="text-xl font-semibold text-white">Edit Promo</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-white block mb-2">Nama Promo</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="bg-white rounded-lg w-full p-3 focus:ring-2 focus:ring-[#44a9a9] outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white block mb-2">Kode Promo</label>
            <input
              name="kode"
              value={form.kode}
              onChange={handleChange}
              className="bg-white rounded-lg w-full p-3 focus:ring-2 focus:ring-[#44a9a9] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-white block mb-2">Tanggal Mulai</label>
              <input
                type="datetime-local"
                name="mulai"
                value={form.mulai}
                onChange={handleChange}
                className="bg-white rounded-lg w-full p-3 focus:ring-2 focus:ring-[#44a9a9] outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white block mb-2">Tanggal Akhir</label>
              <input
                type="datetime-local"
                name="akhir"
                value={form.akhir}
                onChange={handleChange}
                className="bg-white rounded-lg w-full p-3 focus:ring-2 focus:ring-[#44a9a9] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white block mb-2">Diskon</label>
            <input
              name="diskon"
              value={form.diskon}
              onChange={handleChange}
              className="bg-white rounded-lg w-full p-3 focus:ring-2 focus:ring-[#44a9a9] outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white block mb-2">Kuota</label>
            <input
              name="kuota"
              type="number"
              value={form.kuota}
              onChange={handleChange}
              className="bg-white rounded-lg w-full p-3 focus:ring-2 focus:ring-[#44a9a9] outline-none"
            />
          </div>

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

          <div className="flex justify-between items-center pt-15 gap-3">
            <button
              type="submit"
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
