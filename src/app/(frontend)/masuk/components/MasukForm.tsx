'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation' //tambahan simulasi
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter() //tambahan simulasi
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false) //tambahan simulasi
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)

  // =============== HANDLE LOGIN ===============
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      setLoading(false)
      return
    }

    // Simpan JWT token (localStorage / cookie)
    if (rememberMe) {
      // Ingat saya → simpan lama
      localStorage.setItem('token', data.token)
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 hari
    } else {
      // Tidak ingat → session saja
      sessionStorage.setItem('token', data.token)
      document.cookie = `token=${data.token}; path=/`
    }

    // Redirect sesuai role
    if (data.role === 'kasir') router.push('/dashboardKasir')
    else router.push('/dashboard')

    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#e0e0e0]">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img src="/logo-posmind.png" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-[#4DB8C4]">POSMind</h1>
        </div>

        {/* ================= FORM LOGIN ================= */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Masuk</h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Silakan login untuk melanjutkan ke dashboard Anda
          </p>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-gray-800 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Masukkan Email"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-8">
              <label className="block text-gray-800 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={handleChange}
                  placeholder="Masukkan Kata Sandi"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
              </div>
            </div>

            {/* INGAT SAYA & LUPA PASSWORD */}
            <div className="flex justify-between items-center text-sm mb-8">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#4DB8C4]"
                />
                Ingat Saya
              </label>

              <Link href="/lupaPassword" className="text-[#4DB8C4] hover:underline font-medium">
                Lupa Password?
              </Link>
            </div>

            {/* BUTTON LOGIN */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white bg-[#4DB8C4]"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

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
