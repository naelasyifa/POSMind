'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifikasiPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [otp, setOtp] = useState('')

  const handleVerify = async () => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    })

    const data = await res.json()

    if (data.success) {
      router.push('/login')
    } else {
      alert('OTP salah atau sudah kedaluwarsa')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#4DB8C4]">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Verifikasi Email</h2>
        <p className="text-center text-gray-600 mb-4">
          Kode verifikasi sudah dikirim ke: <strong>{email}</strong>
        </p>
        <input
          type="text"
          placeholder="Masukkan kode OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg"
        />
        <button
          className="mt-6 w-full bg-[#4DB8C4] text-white p-3 rounded-lg font-medium"
          onClick={handleVerify}
        >
          Verifikasi
        </button>
      </div>
    </div>
  )
}
