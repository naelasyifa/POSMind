'use client'

import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Download } from "lucide-react"

// UNTUK DOWNLOAD CHART
import { downloadPDF } from "@/utils/downloadPDF";

// UNTUK DOWNLOAD DATA (TABEL)
import { downloadDataPDF } from "@/utils/downloadDataPDF";


const data = [
  { name: 'JAN', penjualan: 4000, pendapatan: 2400 },
  { name: 'FEB', penjualan: 3000, pendapatan: 1398 },
  { name: 'MAR', penjualan: 2000, pendapatan: 9800 },
  { name: 'APR', penjualan: 2780, pendapatan: 3908 },
  { name: 'MAY', penjualan: 1890, pendapatan: 4800 },
  { name: 'JUN', penjualan: 2390, pendapatan: 3800 },
  { name: 'JUL', penjualan: 3490, pendapatan: 4300 },
  { name: 'AUG', penjualan: 4000, pendapatan: 3500 },
  { name: 'SEP', penjualan: 3200, pendapatan: 2800 },
  { name: 'OCT', penjualan: 2900, pendapatan: 3100 },
  { name: 'NOV', penjualan: 3500, pendapatan: 3700 },
  { name: 'DEC', penjualan: 4800, pendapatan: 4600 },
]

const dataMingguan = [
  { name: 'Senin', penjualan: 120, pendapatan: 80 },
  { name: 'Selasa', penjualan: 150, pendapatan: 110 },
  { name: 'Rabu', penjualan: 180, pendapatan: 130 },
  { name: 'Kamis', penjualan: 200, pendapatan: 160 },
  { name: 'Jumat', penjualan: 260, pendapatan: 190 },
  { name: 'Sabtu', penjualan: 300, pendapatan: 220 },
  { name: 'Minggu', penjualan: 240, pendapatan: 170 },
]

export default function DashboardPage() {
  const [mode, setMode] = useState<'bulanan' | 'mingguan'>('bulanan')

  const chartData = mode === 'bulanan' ? data : dataMingguan

  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Dashboard" showBack={false} />

        <div className="p-6 space-y-6">

          {/* === STAT CARDS === */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white text-gray-800 rounded-xl shadow-lg p-5">
              <h3 className="text-sm mb-2 opacity-90">Penjualan Harian</h3>
              <p className="text-2xl font-bold">Rp500.000,00</p>
              <p className="text-xs mt-2 opacity-90">9 Februari 2024</p>
            </div>

            <div className="bg-white text-gray-800 rounded-xl shadow-lg p-5">
              <h3 className="text-sm mb-2 opacity-90">Pendapatan Bulanan</h3>
              <p className="text-2xl font-bold">Rp13.000.000,00</p>
              <p className="text-xs mt-2 opacity-90">1 Jan - 1 Feb</p>
            </div>

            <div className="bg-white text-gray-800 rounded-xl shadow-lg p-5">
              <h3 className="text-sm mb-2 opacity-90">Jumlah Transaksi</h3>
              <p className="text-2xl font-bold">25 Transaksi</p>
            </div>
          </div>

          {/* === PRODUK TERLARIS & POPULER === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Produk Terlaris */}
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#3FA3A2]">Produk Terlaris</h3>
                <Link href="/dashboard/produk-terlaris" className="text-[#52BFBE] text-sm font-medium hover:underline">
                  Lihat Semua →
                </Link>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between border rounded-lg p-3 hover:bg-[#E8F9F9] transition">
                    <div className="flex items-center gap-3">
                      <Image src="/images/chicken_parmesan.jpg" alt="Produk" width={45} height={45} />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">Chicken Parmesan</p>
                        <p className="text-xs text-gray-500">Dalam Proses: 01 person</p>
                      </div>
                    </div>

                    <span className={`text-sm font-semibold ${i === 3 ? 'text-red-500' : 'text-[#52BFBE]'}`}>
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
                <Link href="/dashboard/produk-populer" className="text-[#52BFBE] text-sm font-medium hover:underline">
                  Lihat Semua →
                </Link>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between border rounded-lg p-3 hover:bg-[#E8F9F9] transition">
                    <div className="flex items-center gap-3">
                      <Image src="/images/chicken_parmesan.jpg" alt="Produk" width={45} height={45} />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">Chicken Parmesan</p>
                        <p className="text-xs text-gray-500">Pesan {i} kali</p>
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-[#52BFBE]">Tersedia</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === OVERVIEW CHART === */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#3FA3A2]">Overview</h3>

              <div className="flex gap-2 items-center">

                {/* BULANAN */}
                <button
                  onClick={() => setMode('bulanan')}
                  className={`text-sm px-3 py-1 rounded-md ${
                    mode === 'bulanan'
                      ? 'bg-[#52BFBE] text-white'
                      : 'text-gray-600'
                  }`}
                >
                  Bulanan
                </button>

                {/* MINGGUAN */}
                <button
                  onClick={() => setMode('mingguan')}
                  className={`text-sm px-3 py-1 rounded-md ${
                    mode === 'mingguan'
                      ? 'bg-[#52BFBE] text-white'
                      : 'text-gray-600'
                  }`}
                >
                  Mingguan
                </button>

                {/* UNDUH CHART */}
                <button
                  onClick={() =>
                    downloadPDF(
                      "chart_overview",
                      mode === "bulanan" ? "laporan-bulanan" : "laporan-mingguan"
                    )
                  }
                  className="flex items-center gap-2 border border-[#52BFBE] text-[#52BFBE] text-sm px-3 py-1 rounded-md hover:bg-[#E8F9F9] transition"
                >
                  <Download size={18} />
                  Unduh Chart
                </button>

                {/* UNDUH DATA (TABEL) */}
                <button
                  onClick={() => downloadDataPDF(mode, chartData)}
                  className="flex items-center gap-2 border border-[#52BFBE] text-[#52BFBE] text-sm px-3 py-1 rounded-md hover:bg-[#E8F9F9] transition"
                >
                  <Download size={18} />
                  Unduh Data
                </button>

              </div>
            </div>

            {/* CHART WRAPPER */}
            <div id="chart_overview" className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="penjualan" stroke="#52BFBE" strokeWidth={3} />
                  <Line type="monotone" dataKey="pendapatan" stroke="#A0E3E3" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
