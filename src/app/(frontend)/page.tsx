'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Facebook,
  Instagram,
  Twitter,
  Zap,
  Package,
  BarChart2,
  Users,
  CreditCard,
  Bell,
  MapPin,
  Mail,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden">
      {/* ===== HEADER ===== */}
      <header className="w-full fixed top-0 left-0 z-50 bg-[#ffffff] shadow-md">
        <div className="flex items-center justify-between px-8 py-3 w-full">
          {/* Logo + Nama */}
          <div className="flex items-center gap-3">
            <Image src="/logo-posmind.png" alt="POSMind Logo" width={35} height={30} priority />
            <span className="text-xl font-bold text-[#52bfbe]">POSMind</span>
          </div>

          {/* Navigasi */}
          <nav className="flex items-center space-x-4">
            <Link
              href="#fitur"
              className="text-gray-700 font-medium hover:text-[#52bfbe] transition"
            >
              Fitur
            </Link>
            <Link
              href="#kontak"
              className="text-gray-700 font-medium hover:text-[#52bfbe] transition"
            >
              Kontak
            </Link>
            <Link
              href="/masuk"
              className="border-2 border-[#52bfbe] text-[#52bfbe] px-4 py-1.5 rounded-lg hover:bg-[#52bfbe]/10 transition font-semibold text-sm"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="bg-[#52bfbe] text-white px-4 py-1.5 rounded-lg hover:bg-[#44a9a9] transition font-semibold text-sm"
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      {/* Spacer kecil untuk fixed header */}
      <div className="h-[50px]" />

      {/* ===== HERO SECTION ===== */}
      <section className="w-full bg-[#d9d9d9]">
        <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-16 max-w-[1300px] mx-auto">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 leading-snug">
              Kelola Bisnis Lebih Mudah dengan <span className="text-[#52bfbe]">POSMind</span>
            </h1>
            <p className="text-gray-700 mb-6 text-lg">
              Aplikasi Point of Sale Modern untuk membantu Anda mengelola penjualan, stok, dan
              laporan keuangan secara efisien.
            </p>
            <Link
              href="/daftar"
              className="inline-block bg-[#52bfbe] text-white px-6 py-2.5 rounded-lg text-base hover:bg-[#44a9a9] transition font-semibold"
            >
              Coba Sekarang
            </Link>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <Image
              src="/images/dashboard-preview.png"
              alt="POSMind Dashboard"
              width={480}
              height={330}
              className="rounded-xl bg-transparent"
            />
          </div>
        </div>
      </section>

      {/* ===== FITUR SECTION ===== */}
      <section id="fitur" className="w-full text-white bg-[#52bfbe]">
        <div className="max-w-[1300px] mx-auto py-20 px-8 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-12 leading-snug">Fitur Unggulan</h1>

          <div className="flex flex-col md:flex-row items-center gap-12 w-full">
            <div className="md:w-1/3 flex justify-center">
              <Image
                src="/images/fitur-preview.png"
                alt="Fitur POSMind"
                width={350}
                height={200}
                className="rounded-xl bg-transparent"
              />
            </div>

            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { icon: <Zap className="text-white w-7 h-7" />, title: 'Transaksi Cepat & Akurat' },
                {
                  icon: <Package className="text-white w-7 h-7" />,
                  title: 'Manajemen Stok Otomatis',
                },
                {
                  icon: <BarChart2 className="text-white w-7 h-7" />,
                  title: 'Laporan Penjualan Real-time',
                },
                {
                  icon: <Users className="text-white w-7 h-7" />,
                  title: 'Multi Pengguna (Admin & Kasir)',
                },
                {
                  icon: <CreditCard className="text-white w-7 h-7" />,
                  title: 'Pembayaran Digital (QRIS, dll)',
                },
                { icon: <Bell className="text-white w-7 h-7" />, title: 'Notifikasi Stok Rendah' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <p className="text-center text-base font-medium">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="kontak" className="w-full text-gray-100 bg-[#737373]">
        <div className="max-w-[1300px] mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* 1️⃣ Logo */}
          <div className="flex flex-col items-center text-center space-y-2">
            <Image src="/logo-posmind.png" alt="Logo" width={55} height={45} />
            <span className="font-bold text-lg md:text-xl text-white">POSMind</span>
          </div>

          {/* 2️⃣ POSMind info */}
          <div className="text-left">
            <h3 className="font-semibold text-base mb-2">POSMind</h3>
            <p className="hover:underline cursor-pointer">Tentang Kami</p>
            <p className="hover:underline cursor-pointer">Fitur</p>
          </div>

          {/* 3️⃣ Location */}
          <div className="text-left">
            <h3 className="font-semibold text-base mb-2">Location</h3>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-white" />
              <p>Semarang, Indonesia</p>
            </div>
          </div>

          {/* 4️⃣ Contact */}
          <div className="text-left">
            <h3 className="font-semibold text-base mb-2">Contact</h3>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-white" />
              <p>POSMind@gmail.com</p>
            </div>
          </div>

          {/* 5️⃣ Social icons */}
          <div className="flex flex-col items-center justify-center text-center text-white text-xl space-y-3">
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#c0f0f0] transition">
                <Facebook />
              </a>
              <a href="#" className="hover:text-[#c0f0f0] transition">
                <Instagram />
              </a>
              <a href="#" className="hover:text-[#c0f0f0] transition">
                <Twitter />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
