'use client'

import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import {
  LineChart, Line,
  BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { Download, CalendarClock, AlertTriangle, Wallet, Users, ShoppingCart, BarChart2, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react'

import { downloadPDF } from "@/utils/downloadPDF";
import { downloadDataPDF } from "@/utils/downloadDataPDF";


type GranularityType = 'daily' | 'weekly' | 'monthly' | 'yearly';

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

const dataKinerjaKasir = [
  { name: 'Mila', transaksi: 150, total: 4500000, speed: 85, accuracy: 90, service: 88 },
  { name: 'Budi', transaksi: 120, total: 3800000, speed: 78, accuracy: 85, service: 80 },
  { name: 'Siti', transaksi: 90, total: 2900000, speed: 70, accuracy: 75, service: 72 },
  { name: 'Joko', transaksi: 85, total: 2100000, speed: 65, accuracy: 70, service: 68 },
]

const orderTypeShare = [
  { name: 'Dine In', value: 45 },
  { name: 'Take Away', value: 30 },
  { name: 'Delivery', value: 25 },
]

const productTop = [
  { product: 'Chicken Parmesan', jumlah: 150 },
  { product: 'Beef Steak', jumlah: 120 },
  { product: 'Spaghetti', jumlah: 95 },
  { product: 'Chocolate Cake', jumlah: 80 },
  { product: 'Iced Tea', jumlah: 200 },
]

const reservation30 = Array.from({ length: 30 }).map((_, i) => {
  const day = new Date()
  day.setDate(day.getDate() - (29 - i))
  const dateStr = day.toISOString().slice(0, 10)
  return { date: dateStr, reservations: Math.floor(20 + Math.random() * 60) }
})

const penjualanKategori = [
  { nama: 'Minuman', jumlah: 450 },
  { nama: 'Makanan Utama', jumlah: 380 },
  { nama: 'Dessert', jumlah: 150 },
  { nama: 'Appetizer', jumlah: 120 },
]

// tambahan dummy trend
const trenPenjualan = [
  { tanggal: '1 Feb', jumlah: 50 },
  { tanggal: '2 Feb', jumlah: 45 },
  { tanggal: '3 Feb', jumlah: 60 },
  { tanggal: '4 Feb', jumlah: 75 },
  { tanggal: '5 Feb', jumlah: 80 },
  { tanggal: '6 Feb', jumlah: 65 },
  { tanggal: '7 Feb', jumlah: 90 },
]

const THEME_PRIMARY = '#52BFBE' // Hijau Primer
const THEME_ACCENT = '#A0E3E3' // Variasi Hijau Muda
const PIE_COLORS = ['#52BFBE', '#A0E3E3', '#2C8E8D', '#7BE0E0'] // Variasi Hijau

function rupiah(val: number) {
  try {
    return `Rp ${val.toLocaleString('id-ID')}`
  } catch {
    return `Rp ${val}`
  }
}

/* Simple Card wrapper component */
function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default function DashboardPage() {
  const [mode, setMode] = useState<'bulanan' | 'mingguan'>('bulanan')
  const chartData = mode === 'bulanan' ? data : dataMingguan

  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [granularity, setGranularity] = useState<GranularityType>('daily')

  const [radarKasir, setRadarKasir] = useState<string>(dataKinerjaKasir[0].name)

  const filteredOrderType = useMemo(() => orderTypeShare, [startDate, endDate, granularity])
  const filteredProducts = useMemo(() => productTop, [startDate, endDate, granularity])
  const filteredReservations = useMemo(() => reservation30, [startDate, endDate, granularity])
  const filteredRadar = useMemo(() => {
    const found = dataKinerjaKasir.find(k => k.name === radarKasir) || dataKinerjaKasir[0]
    return [
      { subject: 'Speed', A: found.speed },
      { subject: 'Accuracy', A: found.accuracy },
      { subject: 'Service', A: found.service },
    ]
  }, [radarKasir])

  return (
    <div className="flex min-h-screen bg-[#52BFBE] z-50">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Dashboard" showBack={false} />

        <div className="p-6 space-y-6">

          {/* URGENT / SUMMARY CARDS (original kept) */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-[#5D3FD3] relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <CalendarClock size={18} className="text-blue-500" /> Reservasi
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Kapasitas Terisi: <span className="font-bold text-blue-600">85%</span></p>

                      <div className="mt-3">
                        <Link href="/dashboard/tables" className="flex items-center gap-2 text-sm font-semibold text-[#5D3FD3] hover:text-[#8A6BEE] transition">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="3" x2="21" y1="15" y2="15" /><line x1="9" x2="9" y1="9" y2="15" /><line x1="15" x2="15" y1="9" y2="15" /></svg>
                          Atur Tata Letak Meja
                        </Link>
                        <p className="text-xs text-gray-400 mt-1">Lihat status meja secara visual</p>
                      </div>

                      </div> {/* Penutup div konten */}

                      {/* PERUBAHAN DI SINI: Membungkus button dengan Link ke /dashboard/tables */}
                        <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-200 transition">
                          + Status Meja
                        </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-red-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <AlertTriangle size={18} className="text-red-500" /> Stok Kritis
                    </h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">5 <span className="text-sm text-gray-500 font-normal">Produk</span></p>
                    <p className="text-xs text-gray-500 mt-1">Perlu restock segera</p>
                  </div>
                  <Link href="/dashboard/stok" className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-red-200 transition">
                    Cek Stok
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <Wallet size={18} className="text-orange-500" /> Audit Kas
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Status Shift Pagi:</p>
                    <p className="text-lg font-bold text-orange-600">Selisih -Rp15.000</p>
                    <p className="text-xs text-gray-400 mt-1">Butuh persetujuan manajer</p>
                  </div>
                  <button className="bg-orange-100 text-orange-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-orange-200 transition">
                    Audit
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SUMMARY METRICS (Kuning / Ungu / Pink) */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* PENJUALAN HARIAN */}
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-yellow-500 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <ShoppingCart size={18} className="text-yellow-500" />
                      Penjualan Harian
                    </h3>

                    <div className="flex items-baseline gap-3 mt-2">
                      <p className="text-3xl font-bold text-yellow-600 leading-none">123</p>
                      <span className="inline-flex items-center text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                        <ArrowUpRight size={14} className="mr-1" />+4.1%
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">Total produk terjual hari ini</p>

                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <div>
                        <div className="text-[12px] font-semibold text-gray-700">Kemarin</div>
                        <div className="text-sm">118</div>
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-gray-700">Target Hari</div>
                        <div className="text-sm">150</div>
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-gray-700">Avg Trans</div>
                        <div className="text-sm">Rp 85.000</div>
                      </div>
                    </div>
                  </div>

                  <button className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-yellow-200 transition">
                    Detail
                  </button>
                </div>
              </div>

              {/* PENDAPATAN BULANAN */}
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-purple-500">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <BarChart2 size={18} className="text-purple-500" />
                      Pendapatan Bulanan
                    </h3>

                    <div className="flex items-baseline gap-3 mt-2">
                      <p className="text-2xl font-bold text-purple-600 leading-none">Rp 10.000</p>
                      <span className="inline-flex items-center text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-md">
                        <ArrowDownRight size={12} className="mr-1" />-2.3%
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">Total pendapatan bulan ini</p>

                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <div>
                        <div className="text-[12px] font-semibold text-gray-700">Periode</div>
                        <div className="text-sm">Nov 2025</div>
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-gray-700">Target Bulan</div>
                        <div className="text-sm">Rp 50.000.000</div>
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-gray-700">Avg Order</div>
                        <div className="text-sm">Rp 120.000</div>
                      </div>
                    </div>
                  </div>

                  <button className="bg-purple-100 text-purple-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-purple-200 transition">
                    Laporan
                  </button>
                </div>
              </div>

              {/* JUMLAH TRANSAKSI */}
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-pink-500">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <FileText size={18} className="text-pink-500" />
                      Jumlah Transaksi
                    </h3>

                    <div className="flex items-baseline gap-3 mt-2">
                      <p className="text-3xl font-bold text-pink-600 leading-none">354</p>
                      <span className="inline-flex items-center text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                        <ArrowUpRight size={14} className="mr-1" />+6.8%
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">Total transaksi hari ini</p>

                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <div>
                        <div className="text-[12px] font-semibold text-gray-700">Online</div>
                        <div className="text-sm">120</div>
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-gray-700">Offline</div>
                        <div className="text-sm">234</div>
                      </div>
                      <div>
                        <div className="text-[12px] font-semibold text-gray-700">Cancel</div>
                        <div className="text-sm">3</div>
                      </div>
                    </div>
                  </div>

                  <button className="bg-pink-100 text-pink-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-pink-200 transition">
                    Lihat
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Ringkasan Reservasi & Filter */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#3FA3A2]">Ringkasan Reservasi & Filter</h3>
                <p className="text-xs text-gray-500">Gunakan filter tanggal untuk menyesuaikan data chart</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="border p-1 rounded-md text-sm text-gray-700"
                  title="Tanggal Mulai"
                />

                <span className="text-sm text-gray-600 mx-1">s/d</span>

                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="border p-1 rounded-md text-sm text-gray-700"
                  title="Tanggal Akhir"
                />

                <select
                  value={granularity}
                  onChange={e => setGranularity(e.target.value as GranularityType)}
                  className="border p-1 rounded-md text-sm bg-white text-gray-700 font-semibold"
                >
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>

                <button
                  onClick={() => downloadDataPDF('reservasi', { start: startDate, end: endDate, granularity })}
                  className="flex items-center gap-2 border border-[#52BFBE] text-[#52BFBE] text-sm px-3 py-1 rounded-md hover:bg-[#E8F9F9] transition ml-2"
                >
                  <Download size={16} /> Unduh Snapshot
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-xl p-4 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-600">Reservasi Hari Ini</p>
                <p className="text-2xl font-bold mt-2">74</p>
                <p className="text-xs text-gray-500 mt-1">Terima dalam 24 jam</p>
              </div>

              <div className="border rounded-xl p-4 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-600">Meja Terisi (%)</p>
                <p className="text-2xl font-bold mt-2">68%</p>
                <p className="text-xs text-gray-500 mt-1">Kapasitas 30 meja</p>
              </div>

              <div className="border rounded-xl p-4 h-full flex flex-col justify-center">
                <p className="text-sm text-gray-600">Avg Waiting</p>
                <p className="text-2xl font-bold mt-2">10 mnt</p>
                <p className="text-xs text-gray-500 mt-1">Rata-rata layanan</p>
              </div>
            </div>
          </div>

          {/* Kinerja Kasir */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#3FA3A2] flex items-center gap-2">
                <Users size={18} /> Kinerja Kasir Terbaik (Bulan Ini)
              </h3>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={dataKinerjaKasir} 
                  layout="vertical" 
                  margin={{ top: -10, right: 30, left: -5, bottom: 5 }} /* Margin Top dinaikkan untuk sumbu atas */
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  
                  {/* Sumbu Y (Category/Nama Kasir) tetap sama */}
                  <YAxis dataKey="name" type="category" width={80} />
                  
                <Tooltip 
                  // Perbaikan: Pastikan 'name' adalah string sebelum menggunakan 'includes()'
                  formatter={(value, name) => {
                    // Memastikan name adalah string (atau konversi ke string)
                    const seriesName = String(name); 

                    if (seriesName.includes('Rp')) {
                      // Jika nama series mengandung 'Rp' (yaitu Total Penjualan), format sebagai Rupiah
                      return rupiah(value as number); 
                    }
                    // Jika tidak (yaitu Jumlah Transaksi), tampilkan nilai sebagai string biasa
                    return value?.toString();
                  }} 
                />
                  <Legend />

                  {/* 1. XAxis untuk Total Penjualan (Rp) - Skala Besar (Jutaan) */}
                  <XAxis 
                      type="number" 
                      hide={false} // Tampilkan sumbu agar user tahu skalanya
                      height={25} 
                      stroke={THEME_PRIMARY}
                      tickFormatter={(value) => `Rp ${(value as number / 1000000).toFixed(1)} Jt`} // Format agar ringkas (Rp 4.5 Jt)
                  /> 
                  
                  {/* 2. XAxis untuk Jumlah Transaksi - Skala Kecil (Ratusan) */}
                  <XAxis 
                      type="number" 
                      orientation="top" // Letakkan di atas chart
                      xAxisId="transaksiId" // ID unik untuk Bar Transaksi
                      hide={false} // Tampilkan sumbu agar user tahu skalanya
                      stroke={THEME_ACCENT}
                      // Opsional: Pastikan nilai tampil sebagai bilangan bulat
                      tickFormatter={(value) => `${Math.round(value as number)}`} 
                  /> 

                  {/* Bar Total Penjualan menggunakan XAxis default */}
                  <Bar dataKey="total" name="Total Penjualan (Rp)" fill={THEME_PRIMARY} radius={[0, 4, 4, 0]} barSize={15} />
                  
                  {/* Bar Jumlah Transaksi - Hubungkan ke sumbu X yang skalanya ratusan */}
                  <Bar 
                      dataKey="transaksi" 
                      name="Jumlah Transaksi" 
                      fill={THEME_ACCENT} 
                      radius={[0, 4, 4, 0]} 
                      barSize={15} 
                      xAxisId="transaksiId" // PENTING: Gunakan ID sumbu yang berbeda
                  /> 
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Produk Terlaris & Populer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#3FA3A2]">Produk Terlaris</h3>
                <Link href="/dashboard/produk-terlaris" className="text-[#52BFBE] text-sm font-medium hover:underline">
                  Lihat Semua →
                </Link>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {productTop.map((item, i) => (
                  <div key={item.product} className="flex items-center justify-between border rounded-lg p-3 hover:bg-[#E8F9F9] transition">
                    <div className="flex items-center gap-3">
                      <Image src="/images/chicken_parmesan.jpg" alt="Produk" width={45} height={45} className="rounded object-cover" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{item.product}</p>
                        <p className="text-xs text-gray-500">Terjual: {item.jumlah} Pcs</p>
                      </div>
                    </div>

                    <span className={`text-sm font-semibold ${i === 3 ? 'text-red-500' : 'text-[#52BFBE]'}`}>
                      {i === 3 ? 'Stok Rendah' : 'Tersedia'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#3FA3A2]">Produk Populer</h3>
                <Link href="/dashboard/produk-populer" className="text-[#52BFBE] text-sm font-medium hover:underline">
                  Lihat Semua →
                </Link>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {productTop.map((item, i) => (
                  <div key={item.product} className="flex items-center justify-between border rounded-lg p-3 hover:bg-[#E8F9F9] transition">
                    <div className="flex items-center gap-3">
                      <Image src="/images/beef_steak.jpg" alt="Produk" width={45} height={45} className="rounded object-cover" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{item.product}</p>
                        <p className="text-xs text-gray-500">Dilihat {i + 5} kali</p>
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-[#52BFBE]">Populer</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overview Chart */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#3FA3A2]">Analisis Penjualan & Pendapatan</h3>

              <div className="flex gap-2 items-center">
                <button onClick={() => setMode('bulanan')} className={`text-sm px-3 py-1 rounded-md ${mode === 'bulanan' ? 'bg-[#52BFBE] text-white' : 'text-gray-600'}`}>Bulanan</button>
                <button onClick={() => setMode('mingguan')} className={`text-sm px-3 py-1 rounded-md ${mode === 'mingguan' ? 'bg-[#52BFBE] text-white' : 'text-gray-600'}`}>Mingguan</button>

                <button onClick={() => downloadPDF("chart_overview", mode === "bulanan" ? "laporan-bulanan" : "laporan-mingguan")} className="flex items-center gap-2 border border-[#52BFBE] text-[#52BFBE] text-sm px-3 py-1 rounded-md hover:bg-[#E8F9F9] transition">
                  <Download size={18} /> Unduh Chart
                </button>

                <button onClick={() => downloadDataPDF(mode, chartData)} className="flex items-center gap-2 border border-[#52BFBE] text-[#52BFBE] text-sm px-3 py-1 rounded-md hover:bg-[#E8F9F9] transition">
                  <Download size={18} /> Unduh Data
                </button>
              </div>
            </div>

            <div id="chart_overview" className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => typeof value === 'number' ? `${value}` : `${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="penjualan" name="Total Penjualan (Qty)" stroke={THEME_PRIMARY} strokeWidth={3} />
                  <Line type="monotone" dataKey="pendapatan" name="Pendapatan (Rp)" stroke="#A0E3E3" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Kolase Chart: Metode Order + Reservasi */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-5">
              <h4 className="font-semibold text-[#3FA3A2] mb-3">Metode Order</h4>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={filteredOrderType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {filteredOrderType.map((entry, idx) => <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {filteredOrderType.map((p) => <div key={p.name} className="flex justify-between py-1"><span>{p.name}</span><span className="font-semibold">{p.value}%</span></div>)}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-5 lg:col-span-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-[#3FA3A2]">Aktivitas Reservasi per Hari (30 Hari)</h4>
                <div className="text-xs text-gray-500">Granularity: {granularity.toUpperCase()} (Dummy)</div>
              </div>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredReservations} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(5)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reservations" name="Reservasi" fill="#39ABA7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 text-sm text-gray-600">Data dummy 30 hari terakhir</div>
            </div>
          </div>

          {/* Penjualan per Kategori & Tren */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <Card className="w-full p-6 rounded-xl shadow bg-white">
              <h2 className="text-xl font-semibold mb-4 text-[#3FA3A2]">Penjualan per Kategori</h2>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={penjualanKategori} margin={{ left: 5, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nama" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="jumlah" name="Jumlah Penjualan" fill={THEME_ACCENT} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="w-full p-6 rounded-xl shadow bg-white">
              <h2 className="text-xl font-semibold mb-4 text-[#3FA3A2]">Tren Penjualan (7 Hari)</h2>

              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trenPenjualan}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tanggal" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="jumlah" name="Penjualan (Qty)" stroke={THEME_PRIMARY} strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Radar Performa Kasir */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[#3FA3A2]">Performa Kasir (Radar)</h4>
              <div className="flex items-center gap-3">
                <select value={radarKasir} onChange={e => setRadarKasir(e.target.value)} className="border px-2 py-1 rounded text-sm">
                  {dataKinerjaKasir.map(k => <option key={k.name} value={k.name}>{k.name}</option>)}
                </select>
              </div>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} />
                  <Radar name={radarKasir} dataKey="A" stroke={THEME_PRIMARY} fill={THEME_PRIMARY} fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
