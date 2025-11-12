'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import { Pencil, Trash2 } from 'lucide-react'

export default function PenggunaPage() {
  const [data, setData] = useState([
    { nama: 'Abubakar Sherazi', role: 'Admin', akses: [true, true, true, true, true] },
    { nama: 'Anees Ansari', role: 'Sub admin', akses: [true, true, true, false, false] },
    { nama: 'Lorem Ipsum', role: 'Sub admin', akses: [true, true, true, false, false] },
    { nama: 'Lorem Ipsum', role: 'Sub admin', akses: [true, true, true, false, false] },
    { nama: 'Lorem Ipsum', role: 'Sub admin', akses: [true, true, true, false, false] },
    { nama: 'Lorem Ipsum', role: 'Sub admin', akses: [true, true, true, false, false] },
    { nama: 'Lorem Ipsum', role: 'Sub admin', akses: [true, true, true, false, false] },
  ])

  const columns = ['Dashboard', 'Laporan', 'Inventory', 'Pengguna', 'Settings']

  const toggleAkses = (userIndex: number, aksesIndex: number) => {
    setData((prevData) =>
      prevData.map((user, i) => {
        if (i === userIndex) {
          const newAkses = user.akses.map((val, j) => (j === aksesIndex ? !val : val))
          return { ...user, akses: newAkses }
        }
        return user
      }),
    )
  }

  return (
    <div className="flex min-h-screen bg-[#52BFBE] overflow-hidden">
      <Sidebar />

      {/* Bagian utama */}
      <div className="flex-1 flex flex-col ml-28 bg-[#52BFBE]">
        <HeaderAdmin title="Pengguna" />

        {/* Konten utama */}
        <div className="flex flex-col p-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header tabel */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-800">Daftar Pengguna</h2>
              <button className="bg-[#3ABAB4] hover:bg-[#32A9A4] text-white px-4 py-2 rounded-lg font-medium transition-all">
                Tambah Pengguna
              </button>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="border-b border-gray-300 text-left text-gray-600">
                    <th className="pb-2">Nama</th>
                    <th className="pb-2">Role</th>
                    {columns.map((col) => (
                      <th key={col} className="pb-2 text-center">
                        {col}
                      </th>
                    ))}
                    <th className="pb-2 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((user, userIndex) => (
                    <tr
                      key={userIndex}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 text-gray-800">{user.nama}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-md text-white text-sm font-medium ${
                            user.role === 'Admin' ? 'bg-[#3ABAB4]' : 'bg-[#66C7C2]'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Kolom akses */}
                      {user.akses.map((val, aksesIndex) => (
                        <td key={aksesIndex} className="text-center py-3">
                          <button
                            onClick={() => toggleAkses(userIndex, aksesIndex)}
                            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                              val
                                ? 'border-[#3ABAB4] bg-[#3ABAB4] hover:bg-[#34a7a2]'
                                : 'border-gray-400 bg-gray-200 hover:bg-gray-300'
                            }`}
                          ></button>
                        </td>
                      ))}

                      {/* Kolom aksi */}
                      <td className="flex justify-center items-center space-x-3 py-3">
                        <button className="text-gray-700 hover:text-[#3ABAB4] transition">
                          <Pencil size={18} />
                        </button>
                        <button className="text-red-500 hover:text-red-700 transition">
                          <Trash2 size={18} />
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
    </div>
  )
}
