'use client'

import { useState, useRef, ChangeEvent } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import BerhasilSimpan from './components/BerhasilSimpan'
import { Eye, EyeOff, Camera } from 'lucide-react'

export default function ProfileAdmin() {
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('johndoe123@gmail.com')
  const [alamat, setAlamat] = useState('123 Street USA, Chicago')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/100')
  const [showPopup, setShowPopup] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleSave = () => {
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 2000)
  }

  const handleCancel = () => {
    setPassword('')
    setConfirmPassword('')
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList && fileList[0]) {
      const file = fileList[0]
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Profile" showBack={true} />

        {/* Kontainer Tengah - Sudah Dinaikkan */}
        <div className="flex justify-center items-start py-0 -mt-2">

          <div className="bg-white rounded-lg shadow-md p-10 w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Informasi Pribadi
            </h2>

            {/* Foto & Role */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-28 h-28 rounded-full border border-gray-300 object-cover"
                />
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="absolute bottom-0 right-0 bg-[#52BFBE] text-white p-1.5 rounded-full hover:bg-[#46a8a8] transition"
                >
                  <Camera size={16} />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-lg font-semibold text-gray-700">Admin</p>
            </div>

            {/* Form Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-[#52BFBE] bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-[#52BFBE] bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full border rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-[#52BFBE] bg-white"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-[#52BFBE] bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border rounded-md p-2 text-gray-800 focus:ring-2 focus:ring-[#52BFBE] bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#52BFBE] text-white rounded-md hover:bg-[#46a8a8] transition"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup berhasil simpan */}
      {showPopup && (
        <BerhasilSimpan isOpen={showPopup} onClose={() => setShowPopup(false)} />
      )}
    </div>
  )
}
