// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl

//   // 🔒 Route yang perlu login
//   const protectedRoutes = ['/dashboard']

//   const isProtected = protectedRoutes.some((route) =>
//     pathname.startsWith(route),
//   )

//   if (!isProtected) {
//     return NextResponse.next()
//   }

//   // 🔑 Ambil token auth Payload
//   const token =
//     req.cookies.get('payload-token') ||
//     req.cookies.get('payload-auth-token')

//   // ❌ Belum login
//   if (!token) {
//     return NextResponse.redirect(new URL('/masuk', req.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/dashboard/:path*'],
// }
