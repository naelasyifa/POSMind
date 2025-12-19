'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LupaPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    // UX aman → selalu redirect walaupun email tidak ada
    setLoading(false)
    router.push('/lupaPassword/success')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9e9e9] px-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="text-center mb-6">
          <img src="/logo-posmind.png" className="w-20 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-[#4DB8C4]">POSMind</h1>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Lupa Password</h2>
          <p className="text-center text-gray-600 text-sm mb-8">
            Masukkan email untuk menerima link reset password
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl
             focus:outline-none focus:ring-2 focus:ring-[#4DB8C4] focus:border-[#4DB8C4]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#4DB8C4] text-white font-semibold disabled:opacity-60"
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
