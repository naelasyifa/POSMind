'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import { Settings } from 'lucide-react'

// IMPORT POPUP
import KelolaTunai from './kelolaTunai'
import KelolaQris from './kelolaQris'
import KelolaEWallet from './kelolaE-wallet'
import KelolaTransfer from './kelolaTransfer'

type Metode = {
  id: number
  nama: string
  kategori: string
  status: boolean
}

export default function MetodePembayaranPage() {
  const [data, setData] = useState<Metode[]>([
    { id: 1, nama: 'Tunai', kategori: 'Offline', status: true },
    { id: 2, nama: 'Qris', kategori: 'Pembayaran Digital', status: true },
    { id: 3, nama: 'E Wallet', kategori: 'Pembayaran Digital', status: true },
    { id: 4, nama: 'Transfer Bank', kategori: 'Pembayaran Digital', status: true },
  ])

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  const toggleStatus = (id: number) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: !item.status } : item)),
    )
  }

  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />

      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderAdmin title="Metode Pembayaran" showBack={true} />

        <div className="flex-1 p-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Metode Pembayaran</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-y border-gray-300 text-gray-700 text-sm">
                    <th className="text-black font-semibold pb-3 pt-2">Nama</th>
                    <th className="text-black font-semibold pb-3 pt-2">Kategori</th>
                    <th className="text-black font-semibold pb-3 pt-2">Status</th>
                    <th className="text-black font-semibold pb-3 pt-2">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((m) => (
                    <tr key={m.id} className="border-b border-gray-200 text-gray-800">
                      <td className="py-4 text-center">{m.nama}</td>

                      <td className="py-4 text-center">{m.kategori}</td>

                      <td className="py-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={m.status}
                            onChange={() => toggleStatus(m.id)}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#3ABAB4] transition-all"></div>
                          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-all"></div>
                        </label>
                      </td>

                      <td className="py-4 text-center">
                        <button
                          onClick={() => setSelectedMethod(m.nama)}
                          className="flex items-center gap-2 mx-auto bg-white border border-gray-400 px-4 py-2 rounded-lg
                                     hover:bg-[#3ABAB4] hover:text-white transition-all text-sm"
                        >
                          <Settings size={16} />
                          Kelola
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP CONDITIONAL RENDERING */}
      <KelolaTunai isOpen={selectedMethod === 'Tunai'} onClose={() => setSelectedMethod(null)} />
      <KelolaQris isOpen={selectedMethod === 'Qris'} onClose={() => setSelectedMethod(null)} />
      <KelolaEWallet
        isOpen={selectedMethod === 'E Wallet'}
        onClose={() => setSelectedMethod(null)}
      />
      <KelolaTransfer
        isOpen={selectedMethod === 'Transfer Bank'}
        onClose={() => setSelectedMethod(null)}
      />
    </div>
  )
}
