'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function DaftarBisnisForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const emailFromQuery = searchParams.get('email') || ''
  const phoneFromQuery = searchParams.get('phone') || ''
  const businessNameFromQuery = searchParams.get('businessName') || ''

  const [formData, setFormData] = useState({
    businessField: '',
    businessType: '',
    adminName: '',
    address: '',
    email: emailFromQuery,
    phone: phoneFromQuery,
    businessName: businessNameFromQuery,
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: emailFromQuery,
      phone: phoneFromQuery,
      businessName: businessNameFromQuery,
    }))
  }, [emailFromQuery, phoneFromQuery, businessNameFromQuery])

  const handleSubmit = async () => {
    if (!formData.email || !formData.adminName) {
      alert('Lengkapi data terlebih dahulu.')
      return
    }

    try {
      const res = await fetch('/api/auth/complete-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data?.success) {
        router.push('/dashboard')
      } else {
        alert(data?.message || 'Gagal menyimpan data bisnis')
      }
    } catch (error) {
      console.error('Error saat submit:', error)
      alert('Terjadi kesalahan saat menyimpan data')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4DB8C4] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* <button
            onClick={() => router.push('/daftar')}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button> */}

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Daftar sebagai bisnis
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Bidang Bisnis</label>
              <input
                type="text"
                name="businessField"
                value={formData.businessField}
                onChange={handleChange}
                placeholder="contoh: F&B, elektronik, dll."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Tipe Bisnis</label>
              <input
                type="text"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                placeholder="contoh: UMKM, Restoran, dll."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Alamat</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Masukan alamat bisnis"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Nama Penanggung Jawab/Admin
              </label>
              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                placeholder="Masukan nama anda"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#4DB8C4' }}
            >
              Daftar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
