'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

interface LoginParams {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  redirect?: string
  error?: string
}

export async function login({ email, password }: LoginParams): Promise<LoginResponse> {
  try {
    const payload = await getPayload({ config })

    // login server side
    const result: any = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (!result?.token || !result?.user) {
      return { success: false, error: 'Email atau password salah' }
    }

    ;(cookies() as any).set({
      name: 'payload-token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })

    const role = result.user.role
    const redirect =
      role === 'superadmin' || role === 'admin_toko'
        ? '/admin'
        : role === 'kasir'
          ? '/dashboard'
          : '/'

    return { success: true, redirect }
  } catch (error: any) {
    console.error('Login error:', error.message || error)
    return { success: false, error: 'Terjadi kesalahan saat login' }
  }
}
