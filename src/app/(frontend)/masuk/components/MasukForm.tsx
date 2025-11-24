'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

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
    localStorage.setItem('token', data.token)
    document.cookie = `token=${data.token}; path=/`

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

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Masuk</h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Silakan login untuk melanjutkan ke dashboard Anda
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-800 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Masukkan Email"
                className="w-full px-4 py-3 border rounded-xl"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-800 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={handleChange}
                  placeholder="Masukkan Kata Sandi"
                  className="w-full px-4 py-3 border rounded-xl pr-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  👁
                </button>
              </div>
            </div>

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
    </div>
  )
}
