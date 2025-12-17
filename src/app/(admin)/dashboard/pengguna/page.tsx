'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import { Edit, Trash2, UserPlus } from 'lucide-react'
import AddUser from './components/adduser'
import EditUser from './components/edituser'
import HapusUser from './components/hapus'

interface User {
  id: string
  nama: string
  email?: string
  role: string
  akses: boolean[]
  status: 'aktif' | 'nonaktif'
}

export default function PenggunaPage() {
  /* =========================
     STATE UTAMA
  ========================== */
  const [data, setData] = useState<User[]>([])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null)

  /* =========================
     FETCH DATA USER
  ========================== */
  const fetchUsers = async () => {
    const res = await fetch('/api/pengguna')
    const users = await res.json() // hasilnya array

    setData(
      users.map((u: any) => ({
        id: u.id,
        nama: u.adminName || u.email,
        email: u.email,
        role: u.role,
        akses: [true],
        status: 'aktif',
      })),
    )
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  /* =========================
     HELPER
  ========================== */
  const formatRole = (role: string) => {
    if (!role) return role

    const r = role.toLowerCase()

    if (r === 'admintoko' || r === 'admin_toko' || r === 'admin toko') {
      return 'Admin Toko'
    }

    if (r === 'kasir') return 'Kasir'
    if (r === 'superadmin') return 'Super Admin'

    return role
  }

  /* =========================
     HANDLER
  ========================== */
  const handleAddUser = async (newUser: {
    nama: string
    email: string
    password: string
    role: string
    akses: boolean[]
  }) => {
    try {
      const res = await fetch('/api/pengguna', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      if (!res.ok) throw new Error('Gagal menambah pengguna')

      await fetchUsers() // 🔥 refresh dari backend
      setIsAddModalOpen(false)
    } catch (err) {
      console.error(err)
      alert('Gagal menambah pengguna')
    }
  }

  const handleEditClick = (user: User, index: number) => {
    setSelectedUser(user)
    setSelectedUserIndex(index)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (updatedUser: {
    nama: string
    email?: string
    role: string
    akses: boolean[]
    password?: string
  }) => {
    if (!selectedUser) return

    try {
      const res = await fetch(`/api/pengguna/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      })

      if (!res.ok) throw new Error('Gagal update pengguna')

      await fetchUsers()
      setIsEditModalOpen(false)
      setSelectedUser(null)
      setSelectedUserIndex(null)
    } catch (err) {
      console.error(err)
      alert('Gagal update pengguna')
    }
  }

  const handleDeleteClick = (user: User, index: number) => {
    setSelectedUser(user)
    setSelectedUserIndex(index)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    try {
      const res = await fetch(`/api/pengguna/${selectedUser.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Gagal hapus pengguna')

      await fetchUsers()
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
      setSelectedUserIndex(null)
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus pengguna')
    }
  }

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="flex min-h-screen bg-[#52BFBE] relative overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        <HeaderAdmin title="Pengguna" />

        <div className="flex-1 p-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-sm">Daftar Pengguna</h2>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#52bfbe] hover:bg-[#32A9A4] text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <UserPlus size={18} />
                Tambah Pengguna
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 text-sm text-gray-700">
                    <th className="pb-3 pt-2 w-[50px] text-center">No</th>
                    <th className="pb-3 pt-2 text-left pl-6 w-[260px]">Nama</th>
                    <th className="pb-3 pt-2 text-left pl-6">Role</th>
                    <th className="pb-3 pt-2 text-left pl-6 w-[240px]">Email</th>
                    <th className="pb-3 pt-2 text-center">Status</th>
                    <th className="pb-3 pt-2 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 text-center">{index + 1}</td>
                      <td className="py-4 pl-6 font-medium">{user.nama}</td>
                      <td className="py-4 pl-6">
                        <span className="px-3 py-1 rounded-md text-white text-sm bg-[#52bfbe]">
                          {formatRole(user.role)}
                        </span>
                      </td>
                      <td className="py-4 pl-6">{user.email}</td>
                      <td className="py-4 text-center">
                        <span className="px-4 py-1 rounded-full text-xs bg-green-100 text-green-600">
                          Aktif
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(user, index)}
                            className="p-2 bg-white border-2 border-gray-300 hover:border-[#52bfbe] hover:bg-[#52bfbe] hover:text-white text-gray-700 rounded-lg transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user, index)}
                            className="p-2 bg-white border-2 border-gray-300 hover:border-red-500 hover:bg-red-500 hover:text-white text-red-500 rounded-lg transition-all"
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

      {/* MODALS */}
      <AddUser
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />
      <EditUser
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={selectedUser}
        onSave={handleSaveEdit}
      />
      <HapusUser
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userName={selectedUser?.nama || ''}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
