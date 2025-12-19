'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface EditUserProps {
  isOpen: boolean
  onClose: () => void
  userData: {
    id: string
    nama: string
    email?: string
    role: string
    akses: boolean[]
  } | null
  onSave: (updatedUser: any) => void
}

export default function EditUser({ isOpen, onClose, userData, onSave }: EditUserProps) {
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [akses, setAkses] = useState<boolean[]>([false])
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)

  useEffect(() => {
    if (userData) {
      setNama(userData.nama)
      setEmail(userData.email || '')
      setRole(userData.role)
      setAkses(userData.akses)
      setPassword('')
    }
  }, [userData])

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole)
    setIsRoleDropdownOpen(false)
  }

  const getRoleLabel = () => {
    if (role.toLowerCase() === 'admintoko') return 'Admin Toko'
    if (role.toLowerCase() === 'kasir') return 'Kasir'
    return role || 'Pilih Role'
  }

  const handleSubmit = () => {
    if (!nama || !email || !role) return

    const updatedUser: any = {
      adminName: nama,
      email,
      role,
      akses,
    }

    if (password) {
      updatedUser.password = password
    }

    onSave(updatedUser)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => {
          onClose()
          setIsRoleDropdownOpen(false)
        }}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[430px] bg-white shadow-2xl rounded-l-2xl z-50 p-8 transition-transform duration-500 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit Pengguna</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-all text-lg font-bold"
          >
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#52bfbe]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#52bfbe]"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 bg-white text-left focus:ring-2 focus:ring-[#52bfbe]"
              >
                {getRoleLabel()}
              </button>

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

              {isRoleDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('admintoko')}
                    className="w-full px-3 py-2 text-left hover:bg-[#E0F7F6]"
                  >
                    Admin Toko
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('kasir')}
                    className="w-full px-3 py-2 text-left hover:bg-[#E0F7F6]"
                  >
                    Kasir
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Baru (opsional)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan jika tidak diubah"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-[#52bfbe]"
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

          {/* Status */}
          <div className="pt-4">
            <h3 className="text-base font-semibold mb-3">Status Akses</h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAkses([true])}
                className={`px-4 py-2 rounded-lg border ${
                  akses[0]
                    ? 'bg-[#52bfbe] text-white border-[#52bfbe]'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                Aktif
              </button>
              <button
                type="button"
                onClick={() => setAkses([false])}
                className={`px-4 py-2 rounded-lg border ${
                  !akses[0] ? 'bg-red-500 text-white border-red-500' : 'bg-white border-gray-300'
                }`}
              >
                Tidak Aktif
              </button>
            </div>
          </div>

          {/* Save */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#52bfbe] hover:bg-[#32A9A4] text-white py-2 rounded-lg font-medium"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      {/* FIX BORDER HITAM */}
      <style jsx>{`
        input:focus,
        button:focus {
          outline: none;
          border-color: #d1d5db;
        }

        input[type='password']::-ms-reveal,
        input[type='password']::-ms-clear {
          display: none;
        }
        input[type='password']::-webkit-credentials-auto-fill-button,
        input[type='password']::-webkit-password-toggle {
          display: none !important;
        }
      `}</style>
    </>
  )
}
