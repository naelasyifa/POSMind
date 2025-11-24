// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get('token')?.value || req.headers.get('Authorization')?.replace('Bearer ', '')

  const url = req.nextUrl.pathname

  // Allow public pages and PayloadCMS admin
  if (
    url.startsWith('/masuk') ||
    url.startsWith('/daftar') ||
    url === '/' ||
    url.startsWith('/admin') // superadmin PayloadCMS
  ) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/masuk', req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'SECRET_KEY_POSMIND')
    const { payload }: any = await jwtVerify(token, secret)

    // Admin toko frontend hanya bisa akses /dashboard
    if (url.startsWith('/dashboard') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboardKasir', req.url))
    }

    // Kasir hanya bisa akses /dashboardKasir
    if (url.startsWith('/dashboardKasir') && payload.role !== 'kasir') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL('/masuk', req.url))
  }
}

// Middleware hanya untuk dashboard frontend, tidak untuk /admin PayloadCMS
export const config = {
  matcher: ['/dashboard/:path*', '/dashboardKasir/:path*'],
}
