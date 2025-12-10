'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/frontend/notifications', { credentials: 'include' })
      const json = await res.json()
      if (json.success) {
        const count = (json.docs || []).filter((n: Notif) => !n.isRead).length
        setUnreadCount(count)
      }
    } catch (err) {
      console.error('Gagal fetch notifikasi', err)
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
