// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl

//   // 🔐 Cek token login
//   const token = req.cookies.get('token')?.value

//   // Jika akses dashboard tapi tidak ada token → redirect ke /masuk
//   if (pathname.startsWith('/dashboard') && !token) {
//     return NextResponse.redirect(new URL('/masuk', req.url))
//   }

//   // 🏷️ Tenant slug detection
//   const segments = pathname.split('/').filter(Boolean)
//   const tenantSlug = segments[1] // setelah 'dashboard' (optional sesuai struktur URL kamu)

//   const res = NextResponse.next()
//   if (tenantSlug) {
//     res.headers.set('x-tenant-slug', tenantSlug)
//   }

//   return res
// }

// // Matcher harus berada di luar function!
// export const config = {
//   matcher: ['/dashboard/:path*'],
// }
