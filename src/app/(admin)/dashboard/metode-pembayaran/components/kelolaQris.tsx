'use client'

import { useEffect, useState } from 'react'
import { X, Edit } from 'lucide-react'
import EditQris from './editQris'

interface KelolaProps {
  isOpen: boolean
  onClose: () => void
}

export default function KelolaQris({ isOpen, onClose }: KelolaProps) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedQris, setSelectedQris] = useState<any>(null)

  const [data, setData] = useState([
    {
      id: 1,
      nama: 'Qris umum',
      tipe: 'Static',
      status: true,
      limit: 'Min 10k',
      integrasi: 'Connected',
    },
    {
      id: 2,
      nama: 'Dana',
      tipe: 'Dynamic',
      status: true,
      limit: 'Min 5k',
      integrasi: 'Connected',
    },
    {
      id: 3,
      nama: 'ShopeePay',
      tipe: 'Dynamic',
      status: true,
      limit: 'Min 10k',
      integrasi: 'Connected',
    },
    {
      id: 4,
      nama: 'Ovo',
      tipe: 'Dynamic',
      status: true,
      limit: '-',
      integrasi: 'Connected',
    },
    {
      id: 5,
      nama: 'Gopay',
      tipe: 'Dynamic',
      status: true,
      limit: '-',
      integrasi: 'Connected',
    },
  ])

  // HANDLE OPEN & CLOSE ANIMATION
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      setTimeout(() => setShow(true), 20)
    } else {
      setShow(false)
      setTimeout(() => setMounted(false), 300)
    }
  }, [isOpen])

  if (!mounted) return null

  const handleEdit = (item: any) => {
    setSelectedQris(item)
    setIsEditOpen(true)
  }

  const handleSaveEdit = (updatedQris: any) => {
    setData((prev) =>
      prev.map((item) => (item.id === selectedQris.id ? { ...item, ...updatedQris } : item)),
    )
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-[999]">
        {/* OVERLAY */}
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm
            transition-opacity duration-300
            ${show ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* PANEL POPUP */}
        <div
          className={`
            relative bg-white w-[800px] max-h-[90vh]
            rounded-2xl shadow-xl overflow-hidden
            transition-all duration-500 transform

            ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}
          `}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 pt-6 pb-6">
            <h2 className="text-xl font-semibold">Kelola Metode Pembayaran Qris</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-all">
              <X size={24} className="transition-all" />
            </button>
          </div>

          {/* TABLE */}
          <div className="px-6 pb-6 overflow-y-auto max-h-[70vh]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-sm text-black">
                  <th className="py-2">Nama</th>
                  <th className="py-2">Tipe</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Limit</th>
                  <th className="py-2">Integrasi</th>
                  <th className="py-2">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b text-center text-sm">
                    <td className="py-3">{item.nama}</td>
                    <td className="py-3">{item.tipe}</td>

                    {/* SWITCH */}
                    <td className="py-3">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.status}
                            onChange={() => {
                              setData((prev) =>
                                prev.map((i) =>
                                  i.id === item.id ? { ...i, status: !i.status } : i,
                                ),
                              )
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#52bfbe] transition-all"></div>
                          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-all"></div>
                        </label>
                      </div>
                    </td>

                    <td className="py-3">{item.limit}</td>
                    <td className="py-3">{item.integrasi}</td>

                    {/* EDIT */}
                    <td className="py-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-[#52bfbe] hover:text-white transition"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EDIT PANEL */}
      <EditQris
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        qrisData={selectedQris}
        onSave={handleSaveEdit}
      />
    </>
  )
}
