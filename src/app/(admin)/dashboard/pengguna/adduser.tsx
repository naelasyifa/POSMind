'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface AddUserProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (newUser: { nama: string; email?: string; role: string; akses: boolean[] }) => void
}

export default function AddUser({ isOpen, onClose, onAdd }: AddUserProps) {
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [akses, setAkses] = useState([false, false, false, false, false])

  const columns = ['Dashboard', 'Laporan', 'Inventory', 'Pengguna', 'Settings']

  const toggleAkses = (index: number) => {
    setAkses((prev) => prev.map((val, i) => (i === index ? !val : val)))
  }

  const handleSubmit = () => {
    if (nama && email && role && password) {
      onAdd({ nama, email, role, akses })
      // Reset form
      setNama('')
      setEmail('')
      setRole('')
      setPassword('')
      setAkses([false, false, false, false, false])
      onClose()
    }
  }

  return (
    <>
      {/* Overlay transparan */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Panel kanan */}
      <div
        className={`fixed top-0 right-0 h-full w-[430px] bg-white shadow-2xl rounded-l-2xl z-50 p-8 transition-transform duration-500 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Tambah Pengguna</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-all text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Garis pemisah tipis */}
        <hr className="border-gray-300 mb-6" />

        <div className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Pengguna"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3ABAB4]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Pengguna"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3ABAB4]"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role Pengguna"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3ABAB4]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password login pengguna"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3ABAB4]"
              />
              {password !== '' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
          </div>

          {/* Kontrol Akses */}
          <div className="pt-4">
            <h3 className="text-base font-semibold mb-4">Kontrol Akses</h3>
            <div className="grid grid-cols-5 gap-3 text-center">
              {columns.map((col, index) => (
                <div key={col} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">{col}</span>
                  <button
                    type="button"
                    onClick={() => toggleAkses(index)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      akses[index] ? 'border-[#3ABAB4] bg-[#3ABAB4]' : 'border-gray-400 bg-gray-200'
                    }`}
                    title={col}
                  ></button>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Tambah */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#3ABAB4] hover:bg-[#32A9A4] text-white py-2 rounded-lg transition-all font-medium"
            >
              Tambah
            </button>
          </div>
        </div>

        {/* Hilangkan ikon mata bawaan browser */}
        <style jsx>{`
          input::-ms-reveal,
          input::-ms-clear {
            display: none;
          }
          input::-webkit-credentials-auto-fill-button {
            visibility: hidden;
            display: none !important;
          }
          input::-webkit-password-toggle {
            display: none !important;
          }
        `}</style>
      </div>
    </>
  )
}
