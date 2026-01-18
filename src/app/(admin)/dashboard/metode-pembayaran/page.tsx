'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import { RefreshCw } from 'lucide-react'

export default function MetodePembayaranPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    fetchMethods()
  }, [])

  const fetchMethods = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/payment-methods?limit=100&sort=name')
      const json = await res.json()
      setData(json.docs || [])
    } catch (err) {
      console.error('Gagal load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      setIsSyncing(true)
      const res = await fetch('/api/payments/sync-methods', { method: 'POST' })
      if (res.ok) {
        alert('Sinkronisasi Berhasil!')
        fetchMethods()
      }
    } catch (err) {
      alert('Gagal menyambung ke API')
    } finally {
      setIsSyncing(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/payment-methods/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (res.ok) {
        setData((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isActive: !currentStatus } : item)),
        )
      }
    } catch (err) {
      alert('Gagal update status')
    }
  }

  if (loading) return <div className="p-10 text-white">Memuat Metode Pembayaran...</div>

  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderAdmin title="Metode Pembayaran" showBack={true} />
        <div className="flex-1 p-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Metode Pembayaran</h2>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 bg-[#52bfbe] text-white px-4 py-2 rounded-lg hover:bg-[#3ea09f] disabled:opacity-50"
              >
                <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Sinkron...' : 'Sinkronkan dari API'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-y border-gray-300 text-gray-700 text-sm">
                    <th className="py-3 text-left">Nama</th>
                    <th className="py-3 text-center">Kategori</th>
                    <th className="py-3 text-center">Status Aktif</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((m) => (
                    <tr key={m.id} className="border-b border-gray-200 text-gray-800">
                      <td className="py-4 text-left font-medium">{m.name}</td>
                      <td className="py-4 text-center capitalize">{m.category || '-'}</td>
                      <td className="py-4 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={m.isActive}
                            onChange={() => toggleStatus(m.id, m.isActive)}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#52bfbe] transition-all"></div>
                          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-all"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
