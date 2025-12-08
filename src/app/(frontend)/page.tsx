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
  ShoppingCart,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden">
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-fade-scale {
          animation: fadeInScale 0.8s ease-out forwards;
        }
        .stagger-1 {
          animation-delay: 0.1s;
        }
        .stagger-2 {
          animation-delay: 0.2s;
        }
        .stagger-3 {
          animation-delay: 0.3s;
        }
        .stagger-4 {
          animation-delay: 0.4s;
        }
        .stagger-5 {
          animation-delay: 0.5s;
        }
        .stagger-6 {
          animation-delay: 0.6s;
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>
      {/* <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style> */}

      {/* ===== HEADER ===== */}
      <header className="w-full fixed top-0 left-0 z-50 bg-[#ffffff] shadow-md">
        <div className="flex items-center justify-between px-8 py-3 w-full">
          {/* Logo + Nama */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white border border-[#52bfbe] rounded-full flex items-center justify-center p-2 shadow-sm">
              <Image
                src="/logo-posmind.png"
                alt="POSMind Logo"
                width={28}
                height={28}
                quality={100}
                priority
              />
            </div>
            <span className="text-xl font-bold text-[#52bfbe]">POSMind</span>
          </div>

          {/* Navigasi */}
          <nav className="flex items-center gap-2">
            <Link
              href="#fitur"
              className="relative px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:text-[#52bfbe] transition-all duration-300 group"
            >
              <span className="relative z-10">Fitur</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#52bfbe]/10 to-[#44a9a9]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#52bfbe] to-[#44a9a9] rounded-full group-hover:w-8 transition-all duration-300"></span>
            </Link>
            <Link
              href="#kontak"
              className="relative px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:text-[#52bfbe] transition-all duration-300 group"
            >
              <span className="relative z-10">Kontak</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#52bfbe]/10 to-[#44a9a9]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-[#52bfbe] to-[#44a9a9] rounded-full group-hover:w-8 transition-all duration-300"></span>
            </Link>
            <div className="w-px h-8 bg-gray-300 mx-2"></div>
            <Link
              href="/masuk"
              className="relative group px-6 py-2.5 rounded-xl font-semibold text-gray-700 border-2 border-gray-200 hover:border-[#52bfbe] transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 group-hover:text-[#52bfbe] transition-colors duration-300">
                Masuk
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#52bfbe]/5 to-[#44a9a9]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Link>
            <Link
              href="/daftar"
              className="relative group bg-gradient-to-r from-[#52bfbe] to-[#44a9a9] text-white px-7 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Daftar Sekarang</span>
                <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#44a9a9] to-[#3d9999] translate-y-0 transition-transform duration-300"></span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Spacer kecil untuk fixed header */}
      <div className="h-[50px]" />

      {/* ===== HERO SECTION ===== */}
      <section className="w-full bg-gradient-to-br from-[#52bfbe] via-[#44a9a9] to-[#3d9999] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-20 max-w-[1300px] mx-auto relative z-10">
          <div className="md:w-1/2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-bounce">
              <span className="flex items-center justify-center w-6 h-6 bg-yellow-400 rounded-full">
                <Zap className="w-4 h-4 text-white-800" />
              </span>
              Solusi POS Terpercaya #1 di Indonesia
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Kelola Bisnis Lebih Mudah dengan{' '}
              <span className="text-yellow-300 drop-shadow-lg">POSMind</span>
            </h1>
            <p className="text-white/90 mb-8 text-lg leading-relaxed">
              Aplikasi Point of Sale Modern yang membantu Anda mengelola penjualan, stok, dan
              laporan keuangan dengan mudah dan efisien. Tingkatkan produktivitas bisnis Anda hari
              ini!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#52bfbe] px-8 py-3.5 rounded-lg text-base hover:bg-gray-100 transition font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
              >
                <span>Coba Sekarang</span>
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </Link>
              <Link
                href="#fitur"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-lg text-base hover:bg-white hover:text-[#52bfbe] transition font-semibold"
              >
                Lihat Fitur
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center md:justify-start">
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-white/80 text-sm">Pengguna Aktif</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-white/80 text-sm">Transaksi/Hari</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-white/80 text-sm">Uptime</div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-cyan-400/10 rounded-full blur-3xl scale-110"></div>
              <div className="w-[400px] h-[280px] flex items-center justify-center relative z-10">
                <img
                  src="/Creditcard-amico.svg"
                  alt="POSMind Hero"
                  className="w-[500px] h-[380px] object-contain"
                />
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white px-3 py-2 rounded-2xl shadow-2xl border border-gray-100 group hover:shadow-3xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xs">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <div className="border-l-2 border-gray-200 pl-3">
                    <div className="text-base font-bold text-gray-800">4.9</div>
                    <div className="text-xs text-gray-500 -mt-1">1000+ ulasan</div>
                  </div>
                </div>
              </div>

              {/* Trust badge - Repositioned */}
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-3 rounded-xl font-semibold shadow-xl flex items-center gap-2 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <div className="w-3 h-3 bg-white rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-sm font-bold">Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FITUR SECTION ===== */}
      <section id="fitur" className="w-full bg-white relative overflow-hidden">
        {/* Animated Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left Gradient Blob */}
          <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#52bfbe]/10 to-[#44a9a9]/5 rounded-full blur-3xl animate-pulse"></div>

          {/* Bottom Right Gradient Blob */}
          <div
            className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-tl from-[#52bfbe]/10 to-[#3d9999]/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>

          {/* Floating Shapes */}
          <div
            className="absolute top-40 right-1/4 w-20 h-20 border-4 border-[#52bfbe]/20 rounded-lg rotate-45 animate-float"
            style={{ animationDelay: '0.5s' }}
          ></div>
          <div
            className="absolute bottom-40 left-1/4 w-16 h-16 border-4 border-[#44a9a9]/20 rounded-full animate-float"
            style={{ animationDelay: '1.5s' }}
          ></div>

          {/* Gradient Lines */}
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#52bfbe]/20 to-transparent"></div>
          <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-r from-transparent via-[#44a9a9]/20 to-transparent"></div>
        </div>

        <div className="max-w-[1300px] mx-auto py-24 px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-scale">
            <div className="inline-block bg-gradient-to-r from-[#52bfbe]/10 to-[#44a9a9]/10 text-[#52bfbe] px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-[#52bfbe]/20">
              ✨ FITUR UNGGULAN
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Semua yang Anda Butuhkan dalam Satu Platform
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Kelola bisnis Anda dengan lebih efisien menggunakan fitur-fitur canggih yang kami
              sediakan
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-16 w-full">
            <div className="md:w-2/5 flex justify-center animate-slide-up">
              <div className="relative group">
                {/* Glow effect behind illustration */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#52bfbe]/20 to-[#44a9a9]/20 rounded-full blur-3xl scale-75 group-hover:scale-90 transition-transform duration-700"></div>

                <div className="w-[400px] h-[280px] flex items-center justify-center relative z-10">
                  <img
                    src="/Creditcard-cuate.svg"
                    alt="POSMind Features"
                    className="w-full h-full object-contain animate-float group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                  />
                </div>

                {/* Decorative elements around illustration */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#52bfbe] to-[#44a9a9] rounded-lg opacity-20 animate-pulse"></div>
                <div
                  className="absolute -bottom-4 -left-4 w-16 h-16 border-4 border-[#52bfbe]/30 rounded-full animate-float"
                  style={{ animationDelay: '0.5s' }}
                ></div>
              </div>
            </div>

            <div className="md:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Zap,
                  title: 'Transaksi Cepat & Akurat',
                  desc: 'Proses transaksi dalam hitungan detik dengan sistem yang handal',
                  gradient: 'from-amber-500 to-orange-500',
                },
                {
                  icon: Package,
                  title: 'Manajemen Stok Otomatis',
                  desc: 'Pantau stok barang secara real-time dan otomatis',
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: BarChart2,
                  title: 'Laporan Penjualan Real-time',
                  desc: 'Analisis penjualan dengan grafik yang mudah dipahami',
                  gradient: 'from-purple-500 to-pink-500',
                },
                {
                  icon: Users,
                  title: 'Multi Pengguna',
                  desc: 'Atur akses untuk admin dan kasir dengan mudah',
                  gradient: 'from-green-500 to-emerald-500',
                },
                {
                  icon: CreditCard,
                  title: 'Pembayaran Digital',
                  desc: 'Terima pembayaran QRIS, e-wallet, dan transfer',
                  gradient: 'from-indigo-500 to-blue-500',
                },
                {
                  icon: Bell,
                  title: 'Notifikasi Stok Rendah',
                  desc: 'Dapatkan pemberitahuan otomatis saat stok menipis',
                  gradient: 'from-red-500 to-rose-500',
                },
              ].map((item, i) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={i}
                    className={`group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-[#52bfbe] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 cursor-pointer opacity-0 animate-slide-up stagger-${i + 1} relative overflow-hidden`}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#52bfbe]/0 to-[#44a9a9]/0 group-hover:from-[#52bfbe]/5 group-hover:to-[#44a9a9]/5 transition-all duration-500 rounded-2xl"></div>

                    <div
                      className={`bg-gradient-to-br ${item.gradient} p-0.5 rounded-2xl w-16 h-16 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative`}
                    >
                      <div className="bg-white rounded-2xl w-full h-full flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#52bfbe] group-hover:to-[#44a9a9] transition-all duration-500">
                        <IconComponent className="w-8 h-8 text-[#52bfbe] group-hover:text-white transition-all duration-500" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#52bfbe] transition-colors duration-300 relative z-10">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                      {item.desc}
                    </p>

                    {/* Corner decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#52bfbe]/0 to-[#44a9a9]/0 group-hover:from-[#52bfbe]/10 group-hover:to-[#44a9a9]/10 rounded-bl-full transition-all duration-500"></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="kontak" className="w-full text-white bg-[#737373] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1300px] mx-auto px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* 1️⃣ Logo & Description */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2 shadow-lg">
                  {/* ✅ Logo dibungkus dengan circle putih */}
                  <Image
                    src="/logo-posmind.png"
                    alt="POSMind Logo"
                    width={40}
                    height={40}
                    quality={100} // ✅ Tambah: kualitas maksimal
                    priority // ✅ Tambah: prioritas loading
                  />
                </div>
                <span className="font-bold text-2xl text-white">POSMind</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Solusi POS modern untuk bisnis Indonesia yang lebih efisien dan menguntungkan.
              </p>

              {/* Social icons */}
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-white/10 hover:bg-[#52bfbe] p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="bg-white/10 hover:bg-[#52bfbe] p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="bg-white/10 hover:bg-[#52bfbe] p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* 2️⃣ POSMind info */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">POSMind</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/75 hover:text-[#52bfbe] transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#fitur" className="text-white/75 hover:text-[#52bfbe] transition-colors">
                    Fitur
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/75 hover:text-[#52bfbe] transition-colors">
                    Harga
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/75 hover:text-[#52bfbe] transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* 3️⃣ Support */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/75 hover:text-[#52bfbe] transition-colors">
                    Pusat Bantuan
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/75 hover:text-[#52bfbe] transition-colors"></a>
                </li>
                <li>
                  <a href="#" className="text-white/75 hover:text-[#52bfbe] transition-colors">
                    Tutorial
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/75 hover:text-[#52bfbe] transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>

            {/* 4️⃣ Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Hubungi Kami</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-white/85 hover:text-white transition-colors group cursor-pointer">
                  <div className="bg-[#52bfbe]/20 p-2 rounded-lg group-hover:bg-[#52bfbe] transition-all duration-300">
                    <MapPin className="w-5 h-5 text-[#52bfbe] group-hover:text-white flex-shrink-0" />
                  </div>
                  <p className="text-sm">
                    Jl. Pandanaran No. 123
                    <br />
                    Semarang, Jawa Tengah 50134
                  </p>
                </div>
                <div className="flex items-center gap-3 text-white/100 hover:text-white transition-colors group">
                  <div className="bg-[#52bfbe]/20 p-2 rounded-lg group-hover:bg-[#52bfbe] transition-all duration-300">
                    <Mail className="w-5 h-5 text-[#52bfbe] group-hover:text-white flex-shrink-0" />
                  </div>
                  <a
                    href="mailto:posmind02@gmail.com"
                    className="hover:text-[#52bfbe] transition-colors text-sm"
                  >
                    posmind02@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white-100 text-sm">© 2025 POSMind. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white-100 hover:text-[#52bfbe] transition-colors">
                Syarat & Ketentuan
              </a>
              <a href="#" className="text-white-100 hover:text-[#52bfbe] transition-colors">
                Kebijakan Cookie
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
