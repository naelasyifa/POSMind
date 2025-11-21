// Updated Dashboard Kasir UI (Next.js + Tailwind)

'use client'

import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'
import Image from 'next/image'
import Link from 'next/link'

export default function DashboardKasir() {
  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-28">
        <HeaderKasir title="Dashboard Kasir" />

        <div className="p-6 space-y-6">

          {/* === PRODUK TERLARIS & POPULER === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Produk Terlaris */}
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#3FA3A2]">Produk Terlaris</h3>
                <Link href="#" className="text-[#52BFBE] text-sm font-medium hover:underline">
                  Lihat Semua →
                </Link>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border rounded-lg p-3 hover:bg-[#E8F9F9] transition"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src="/images/chicken_parmesan.jpg"
                        alt="Produk"
                        width={45}
                        height={45}
                      />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">Chicken Parmesan</p>
                        <p className="text-xs text-gray-500">Dalam Proses: 01 orang</p>
                      </div>
                    </div>

                    <span
                      className={`text-sm font-semibold ${
                        i === 3 ? 'text-red-500' : 'text-[#52BFBE]'
                      }`}
                    >
                      {i === 3 ? 'Habis' : 'Tersedia'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Produk Populer */}
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#3FA3A2]">Produk Populer</h3>
                <Link href="#" className="text-[#52BFBE] text-sm font-medium hover:underline">
                  Lihat Semua →
                </Link>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border rounded-lg p-3 hover:bg-[#E8F9F9] transition"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src="/images/chicken_parmesan.jpg"
                        alt="Produk"
                        width={45}
                        height={45}
                      />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">Chicken Parmesan</p>
                        <p className="text-xs text-gray-500">Pesan {i} kali</p>
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-[#52BFBE]">
                      Tersedia
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === PROMO === */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-[#3FA3A2] mb-4">Promo Berlangsung</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Promo 1 */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden shadow">
                <Image
                  src="/images/promo.jpg"
                  alt="Promo"
                  fill
                  className="object-cover"
                />

                {/* TEXT sesuai UI */}
                <div className="absolute top-3 left-3 bg-black/50 px-3 py-1 rounded-md">
                  <p className="text-white text-sm leading-tight font-semibold">
                    Diskon <br />hingga 20%
                  </p>
                </div>
              </div>

              {/* Promo 2 */}
              
              <div className="relative w-full h-40 rounded-xl overflow-hidden shadow">
                <Image
                  src="/images/promo.jpg"
                  alt="Promo"
                  fill
                  className="object-cover"
                />

                <div className="absolute top-3 left-3 bg-black/50 px-3 py-1 rounded-md">
                  <p className="text-white text-sm leading-tight font-semibold">
                    Diskon <br />hingga 30%
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
