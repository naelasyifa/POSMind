'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface TambahPromoProps {
  onClose: () => void
  onSave: (promo: any) => void
}

export default function TambahPromo({ onClose, onSave }: TambahPromoProps) {
  const [form, setForm] = useState({
    nama: '',
    kode: '',
    mulai: '',
    akhir: '',
    diskon: '',
    kuota: '',
    status: 'Aktif',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPromo = {
      id: Date.now(),
      nama: form.nama,
      kode: form.kode,
      mulai: form.mulai,
      akhir: form.akhir,
      diskon: form.diskon,
      kuota: Number(form.kuota),
      status: form.status,
    }
    onSave(newPromo)
  }

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex justify-end z-50">
      <div className="bg-[#52bfbe] w-full max-w-[420px] h-full overflow-y-auto rounded-l-2xl shadow-xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/30">
          <h2 className="text-xl font-semibold text-white">Tambah Promo</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-white block mb-2">Nama Promo</label>
            <input
              name="nama"
              placeholder="Masukkan Nama Promo"
              value={form.nama}
              onChange={handleChange}
              className="bg-white rounded-lg w-full p-3 focus:ring-2 focus:ring-[#44a9a9] outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white block mb-2">Kode Promo</label>
            <input
              name="kode"
              placeholder="Masukkan Kode Promo"
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
              placeholder="Masukkan nilai diskon (misal 20%)"
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
              placeholder="Masukkan jumlah kuota"
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
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
