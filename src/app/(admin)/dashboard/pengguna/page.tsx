'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import { Edit, Trash2 } from 'lucide-react'
import AddUser from './adduser'
import EditUser from './edituser'
import HapusUser from './hapus'

interface User {
  nama: string
  email?: string
  role: string
  akses: boolean[]
}

export default function PenggunaPage() {
  const [data, setData] = useState<User[]>([
    {
      nama: 'Abubakar Sherazi',
      email: 'abubakar@email.com',
      role: 'Admin',
      akses: [true, true, true, true, true],
    },
    {
      nama: 'Anees Ansari',
      email: 'anees@email.com',
      role: 'Sub admin',
      akses: [true, true, true, false, false],
    },
    {
      nama: 'Lorem Ipsum',
      email: 'lorem1@email.com',
      role: 'Sub admin',
      akses: [true, true, true, false, false],
    },
    {
      nama: 'Lorem Ipsum',
      email: 'lorem2@email.com',
      role: 'Sub admin',
      akses: [true, true, true, false, false],
    },
    {
      nama: 'Lorem Ipsum',
      email: 'lorem3@email.com',
      role: 'Sub admin',
      akses: [true, true, true, false, false],
    },
    {
      nama: 'Lorem Ipsum',
      email: 'lorem4@email.com',
      role: 'Sub admin',
      akses: [true, true, true, false, false],
    },
    {
      nama: 'Lorem Ipsum',
      email: 'lorem5@email.com',
      role: 'Sub admin',
      akses: [true, true, true, false, false],
    },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null)

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

  const handleDeleteClick = (user: User, index: number) => {
    setSelectedUser(user)
    setSelectedUserIndex(index)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedUserIndex !== null) {
      setData((prevData) => prevData.filter((_, i) => i !== selectedUserIndex))
      setSelectedUser(null)
      setSelectedUserIndex(null)
    }
  }

  const handleEditClick = (user: User, index: number) => {
    setSelectedUser(user)
    setSelectedUserIndex(index)
    setIsEditModalOpen(true)
  }

  const handleAddUser = (newUser: User) => {
    setData((prevData) => [...prevData, newUser])
  }

  const handleSaveEdit = (updatedUser: User) => {
    if (selectedUserIndex !== null) {
      setData((prevData) =>
        prevData.map((user, i) => (i === selectedUserIndex ? updatedUser : user)),
      )
    }
    setSelectedUser(null)
    setSelectedUserIndex(null)
  }

  return (
    <div className="flex min-h-screen bg-[#52BFBE] relative overflow-hidden">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col ${isAddModalOpen || isEditModalOpen ? 'blur-sm' : ''}`}
        style={{ marginLeft: '7rem' }}
      >
        <HeaderAdmin title="Pengguna" />

        <div className="flex-1 p-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-800">Daftar Pengguna</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#3ABAB4] hover:bg-[#32A9A4] text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Tambah Pengguna
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 text-left text-gray-600">
                    <th className="pb-3 pt-2">Nama</th>
                    <th className="pb-3 pt-2">Role</th>
                    {columns.map((col) => (
                      <th key={col} className="pb-3 pt-2 text-center">
                        {col}
                      </th>
                    ))}
                    <th className="pb-3 pt-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, userIndex) => (
                    <tr
                      key={userIndex}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 text-gray-800">{user.nama}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-md text-white text-sm font-medium ${
                            user.role === 'Admin' ? 'bg-[#3ABAB4]' : 'bg-[#66C7C2]'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {user.akses.map((val, aksesIndex) => (
                        <td key={aksesIndex} className="text-center py-4">
                          <button
                            onClick={() => toggleAkses(userIndex, aksesIndex)}
                            className={`w-5 h-5 rounded-full border-2 transition-all ${
                              val ? 'border-[#3ABAB4] bg-[#3ABAB4]' : 'border-gray-400 bg-gray-200'
                            }`}
                          ></button>
                        </td>
                      ))}

                      <td className="py-4">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => handleEditClick(user, userIndex)}
                            className="p-2 bg-gray-100 hover:bg-[#3ABAB4] hover:text-white text-gray-700 rounded transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user, userIndex)}
                            className="p-2 bg-gray-100 hover:bg-red-500 hover:text-white text-red-500 rounded transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Blur ketika modal open */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
      )}

      {/* Popup Add User */}
      <AddUser
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />

      {/* Popup Edit User */}
      <EditUser
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
          setSelectedUserIndex(null)
        }}
        userData={selectedUser}
        onSave={handleSaveEdit}
      />

      {/* Popup Hapus User */}
      <HapusUser
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedUser(null)
          setSelectedUserIndex(null)
        }}
        userName={selectedUser?.nama || ''}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
