'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface AddUserProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (newUser: {
    nama: string
    email: string
    password: string
    role: string
    businessName: string
    akses: boolean[]
  }) => void
}

export default function AddUser({ isOpen, onClose, onAdd }: AddUserProps) {
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [akses, setAkses] = useState(true) // tetap boolean
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)
  const [businessName, setBusinessName] = useState('')

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole)
    setIsRoleDropdownOpen(false)
  }

  const getRoleLabel = () => {
    if (role === 'admintoko') return 'Admin Toko'
    if (role === 'kasir') return 'Kasir'
    return 'Pilih Role'
  }

  const handleSubmit = () => {
    if (nama && email && role && password) {
      onAdd({
        nama,
        email,
        password,
        role,
        businessName,
        akses: [akses],
      })

      setNama('')
      setEmail('')
      setRole('')
      setPassword('')
      setAkses(true)
      onClose()
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => onClose()}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[430px] bg-white shadow-2xl rounded-l-2xl z-50 p-8 transition-transform duration-500 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Tambah Pengguna</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-lg font-bold">
            ✕
          </button>
        </div>

        <hr className="border-gray-300 mb-6" />

        <div className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full border border-[#C8E8E7] rounded-lg px-3 py-2 
             focus:outline-none focus:border-[#52bfbe] 
             focus:ring-2 focus:ring-[#52bfbe]"
              placeholder="Nama Pengguna"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#C8E8E7] rounded-lg px-3 py-2 
             focus:outline-none focus:border-[#52bfbe] 
             focus:ring-2 focus:ring-[#52bfbe]"
              placeholder="Email Pengguna"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full border border-[#C8E8E7] rounded-lg px-3 py-2 pr-10 
                bg-white text-left 
                focus:outline-none focus:border-[#52bfbe] 
                focus:ring-2 focus:ring-[#52bfbe]"
              >
                {getRoleLabel()}
              </button>

              {/* Arrow */}
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Dropdown */}
              {isRoleDropdownOpen && (
                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleRoleSelect('admintoko')}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    Admin Toko
                  </button>
                  <button
                    onClick={() => handleRoleSelect('kasir')}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    Kasir
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#C8E8E7] rounded-lg px-3 py-2 
                focus:outline-none focus:border-[#52bfbe] 
                focus:ring-2 focus:ring-[#52bfbe]"
                placeholder="Password login pengguna"
              />

              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>

          {/* Akses */}
          <div className="pt-4">
            <h3 className="text-base font-semibold mb-2">Status Akses</h3>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setAkses(true)}
                className={`px-4 py-2 rounded-lg font-medium border ${
                  akses
                    ? 'bg-[#52bfbe] text-white border-[#52bfbe]'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                Aktif
              </button>

              <button
                type="button"
                onClick={() => setAkses(false)}
                className={`px-4 py-2 rounded-lg font-medium border ${
                  !akses
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                Tidak Aktif
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#52bfbe] hover:bg-[#32A9A4] text-white py-2 rounded-lg font-medium"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
