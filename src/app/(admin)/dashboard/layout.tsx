'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const res = await fetch('/api/users/me', {
        credentials: 'include',
      })

      if (!res.ok) router.replace('/')
    }

    check()
  }, [])

  return <div>{children}</div>
}
