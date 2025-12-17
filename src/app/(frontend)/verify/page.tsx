'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifikasiPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  // ==========================
  // VERIFY OTP
  // ==========================
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      alert('Email tidak ditemukan')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push(`/daftarBisnis?email=${email}`)
      } else {
        alert(data.message || 'OTP salah atau sudah kedaluwarsa')
      }
    } catch (err) {
      alert('Terjadi kesalahan saat verifikasi')
    } finally {
      setLoading(false)
    }
  }

  // ==========================
  // RESEND OTP
  // ==========================
  const handleResendOtp = async () => {
    if (!email) {
      alert('Email tidak ditemukan')
      return
    }

    setResendLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'OTP masih aktif, silakan cek email')
        return
      }

      alert('Kode OTP berhasil dikirim ulang')
    } catch (err) {
      alert('Gagal mengirim ulang OTP')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9e9e9] px-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img src="/logo-posmind.png" alt="POSMind" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-[#4Db8C4]">POSMind</h1>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Verifikasi Email</h2>

          <p className="text-center text-gray-600 text-sm mb-8">
            Kode verifikasi telah dikirim ke
            <br />
            <span className="font-semibold">{email}</span>
          </p>

          <form onSubmit={handleVerify}>
            {/* OTP INPUT */}
            <div className="mb-6">
              <label className="block text-gray-800 text-sm font-semibold mb-2">
                Kode Verifikasi
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const onlyNumber = e.target.value.replace(/\D/g, '')
                  setOtp(onlyNumber)
                }}
                placeholder="Masukkan 6 digit kode"
                className="w-full text-center tracking-widest text-lg px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4DB8C4]"
                required
              />
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold bg-[#4DB8C4] hover:bg-[#43aab5] transition disabled:opacity-60"
            >
              {loading ? 'Memverifikasi...' : 'Verifikasi'}
            </button>
          </form>

          {/* RESEND */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="w-full mt-4 text-sm text-[#4DB8C4] hover:underline disabled:opacity-60"
          >
            {resendLoading ? 'Mengirim ulang kode...' : 'Kirim ulang kode'}
          </button>
        </div>
      </div>
    </div>
  )
}
