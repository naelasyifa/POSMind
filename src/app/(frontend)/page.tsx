'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans">
      {/* ===== HEADER ===== */}
      <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="flex flex-row items-center justify-between px-8 py-4 max-w-[1400px] mx-auto">
          {/* Logo + Nama */}
          <div className="flex items-center gap-3">
            <Image src="/logo-posmind.png" alt="POSMind Logo" width={40} height={40} />
            <span className="text-2xl font-bold" style={{ color: '#52bfbe' }}>
              POSMind
            </span>
          </div>

          {/* Navigasi */}
          <nav className="flex items-center gap-6">
            <Link
              href="#fitur"
              className="text-gray-700 font-medium hover:text-emerald-600 transition"
            >
              Fitur
            </Link>
            <Link
              href="#kontak"
              className="text-gray-700 font-medium hover:text-emerald-600 transition"
            >
              Kontak
            </Link>
            <Link
              href="/login"
              className="border-2 border-emerald-600 text-emerald-600 px-5 py-2 rounded-lg hover:bg-emerald-50 transition font-semibold"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition font-semibold"
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      {/* Spacer agar konten tidak tertutup header */}
      <div className="h-[90px]" />

      {/* ===== HERO SECTION ===== */}
      <section className="w-full" style={{ backgroundColor: '#d9d9d9' }}>
        <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-20 max-w-[1400px] mx-auto">
          {/* Teks di kiri */}
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 leading-snug">
              Kelola Bisnis Lebih Mudah dengan <span style={{ color: '#52bfbe' }}>POSMind</span>
            </h1>
            <p className="text-gray-700 mb-6 text-lg">
              Aplikasi Point of Sale Modern untuk membantu Anda mengelola penjualan, stok, dan
              laporan keuangan secara efisien.
            </p>
            <Link
              href="/daftar"
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-emerald-700 transition font-semibold"
            >
              Coba Sekarang
            </Link>
          </div>

          {/* Gambar di kanan */}
          <div className="mt-10 md:mt-0">
            <Image
              src="/images/dashboard-preview.png"
              alt="POSMind Dashboard"
              width={500}
              height={350}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ===== FITUR SECTION ===== */}
      <section id="fitur" className="w-full text-white" style={{ backgroundColor: '#52bfbe' }}>
        <div className="max-w-[1300px] mx-auto py-20 px-8 flex flex-col md:flex-row items-center gap-12">
          {/* Gambar fitur di kiri */}
          <div className="flex-shrink-0">
            <Image
              src="/images/fitur-preview.png"
              alt="Fitur POSMind"
              width={500}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>

          {/* Daftar fitur di kanan */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-10 text-white">Fitur Unggulan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: '⚡', title: 'Transaksi Cepat & Akurat' },
                { icon: '📦', title: 'Manajemen Stok Otomatis' },
                { icon: '📊', title: 'Laporan Penjualan Real-time' },
                { icon: '👥', title: 'Multi Pengguna (Admin & Kasir)' },
                { icon: '💳', title: 'Pembayaran Digital (QRIS, dll)' },
                { icon: '🔔', title: 'Notifikasi Stok Rendah' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center md:items-start bg-white/20 p-6 rounded-2xl hover:bg-white/30 transition"
                >
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <p className="text-lg font-medium text-center md:text-left leading-snug">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="kontak" className="w-full text-gray-100" style={{ backgroundColor: '#737373' }}>
        <div className="max-w-[1300px] mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Kiri - Logo & Nama */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-3">
              <Image src="/logo-posmind.png" alt="Logo" width={45} height={45} />
              <span className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                POSMind
              </span>
            </div>
          </div>

          {/* Tengah - 3 Kolom Info */}
          <div
            className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm"
            style={{ color: '#ffffff' }}
          >
            {/* Kolom 1 */}
            <div>
              <h3 className="font-semibold text-white text-base mb-3">POSMind</h3>
              <p className="hover:underline cursor-pointer">Tentang Kami</p>
              <p className="hover:underline cursor-pointer">Fitur</p>
            </div>

            {/* Kolom 2 */}
            <div>
              <h3 className="font-semibold text-white text-base mb-3">Location</h3>
              <p>📍 Semarang, Indonesia</p>
            </div>

            {/* Kolom 3 */}
            <div>
              <h3 className="font-semibold text-white text-base mb-3">Contact</h3>
              <p>📧 POSMind@gmail.com</p>
            </div>
          </div>

          {/* Kanan - Ikon Sosial Media */}
          <div className="flex gap-4 text-2xl">
            <a href="#" className="hover:text-white">
              📘
            </a>
            <a href="#" className="hover:text-white">
              📸
            </a>
            <a href="#" className="hover:text-white">
              ❌
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
