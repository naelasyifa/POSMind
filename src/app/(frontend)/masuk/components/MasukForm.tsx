'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login data:', formData)
    alert('Login berhasil (contoh simulasi)!')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#e0e0e0]">
      <div className="w-full max-w-md px-6">
        {/* Logo POSMind */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img src="/logo-posmind.png" alt="POSMind Logo" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-[#4DB8C4]">POSMind</h1>
        </div>

        {/* Kartu Form Login */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Masuk</h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Silakan login untuk melanjutkan ke dashboard Anda
          </p>

          <form onSubmit={handleSubmit}>
            {/* Input Email */}
            <div className="mb-5">
              <label className="block text-gray-800 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan Email"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                required
              />
            </div>

            {/* Input Password */}
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
                  required
                />
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 bg-[#4DB8C4]"
            >
              Login
            </button>
          </form>

          {/* Link ke halaman daftar */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Belum punya akun?{' '}
            <Link href="/daftar" className="text-teal-500 hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Hilangkan ikon bawaan password browser */}
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
  )
}
