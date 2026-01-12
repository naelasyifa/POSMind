'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    // Jika tidak ada token -> redirect ke halaman login
    if (!token) {
      router.replace('/') // Ganti sesuai nama halaman login kamu
    }
  }, [router])

  return <div>{children}</div>
}