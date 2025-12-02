'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '')
      setFormData({ ...formData, [name]: onlyNums })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleNext = async () => {
    if (!formData.businessName || !formData.email) {
      alert('Nama Bisnis dan Email wajib diisi')
      return
    }

    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email }),
    })

    const data = await res.json()
    if (data?.success) {
      router.push(
        `/daftarBisnis?businessName=${encodeURIComponent(formData.businessName)}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.phone)}`,
      )
    } else {
      alert(data?.message || 'Gagal mengirim OTP')
    }
  }
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#e9e9e9' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img src="/logo-posmind.png" alt="POSMind Logo" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#4DB8C4' }}>
            POSMind
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Daftar</h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Silakan masukkan data Anda untuk melanjutkan
          </p>

          {/* Nama Bisnis */}
          <div className="mb-5">
            <label className="block text-gray-800 text-sm font-semibold mb-2">Nama Bisnis</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Masukkan Nama Bisnis"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-gray-800 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan Email"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
            />
          </div>

          {/* No. Telepon */}
          <div className="mb-5">
            <label className="block text-gray-800 text-sm font-semibold mb-2">No. Telepon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Masukkan Nomor Telepon"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={15}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="block text-gray-800 text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan Kata Sandi"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm pr-12"
              />
              {formData.password && (
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
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#4DB8C4' }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="inline-block"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* CSS untuk hilangkan ikon bawaan browser */}
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
    </div>
  )
}
