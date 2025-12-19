'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirm) {
      alert('Password tidak sama')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Gagal reset password')
      setLoading(false)
      return
    }

    alert('Password berhasil diubah')
    router.push('/masuk')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9e9e9] px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2">Password Baru</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
             focus:outline-none focus:ring-2 focus:ring-[#4DB8C4] focus:border-[#4DB8C4]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Konfirmasi Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
             focus:outline-none focus:ring-2 focus:ring-[#4DB8C4] focus:border-[#4DB8C4]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#4DB8C4] text-white font-semibold"
          >
            {loading ? 'Menyimpan...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
