'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'

interface Notif {
  id: string
  isRead: boolean
  // bisa tambahkan field lain jika perlu
}

interface NotifContextType {
  unreadCount: number
  refresh: () => void
}

const NotifContext = createContext<NotifContextType>({
  unreadCount: 0,
  refresh: () => {},
})

export const useNotif = () => useContext(NotifContext)

export const NotifProvider = ({ children }: { children: ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0)

  // Anti-spam (tunggu 3 detik sebelum boleh refresh lagi)
  const lastFetchRef = useRef(0)

  const fetchNotifs = async () => {
    const now = Date.now()
    if (now - lastFetchRef.current < 3000) return
    lastFetchRef.current = now

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 7000) // timeout 7 detik

      const res = await fetch('/api/frontend/notifications', {
        credentials: 'include',
        signal: controller.signal,
      })

      clearTimeout(timeout)

      const json = await res.json()

      if (json.success && Array.isArray(json.docs)) {
        const count = json.docs.filter((n: Notif) => !n.isRead).length
        setUnreadCount(count)
      }
    } catch (err) {
      console.warn('Gagal fetch notifikasi:', err)
    }
  }

  useEffect(() => {
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 60000) // refresh tiap 1 menit
    return () => clearInterval(interval)
  }, [])

  return (
    <NotifContext.Provider value={{ unreadCount, refresh: fetchNotifs }}>
      {children}
    </NotifContext.Provider>
  )
}
