'use client'

import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts'
import {
  CalendarClock, AlertTriangle, Wallet, Users,
  ShoppingCart, BarChart2, FileText
} from 'lucide-react'

// --- CONSTANTS ---
const THEME_PRIMARY = '#52BFBE'
const THEME_ACCENT = '#A0E3E3'
const PIE_COLORS = ['#52BFBE', '#A0E3E3', '#2C8E8D', '#7BE0E0']

function rupiah(val: number) {
  if (!val) return "Rp 0";
  return `Rp ${val.toLocaleString('id-ID')}`
}

export default function DashboardPage() {
  // Gunakan state objek kosong agar tidak null saat pertama kali akses properti
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState(true)

  // --- FETCHING DATA ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/frontend/admin/dashboard')
        if (!res.ok) throw new Error("Gagal mengambil data");
        const result = await res.json()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  // Guard Clause: Tunggu sampai data utama tersedia
  if (loading || !data || !data.summaryCards) {
    return (
      <div className="flex min-h-screen bg-[#52BFBE] items-center justify-center text-white font-bold animate-pulse">
        Memuat Data Dashboard...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#52BFBE] z-50">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Dashboard" showBack={false} />

        <div className="p-6 space-y-6">
          
      {/* URGENT / SUMMARY CARDS */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Reservasi */}
          <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-[#5D3FD3]">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <CalendarClock size={18} className="text-[#5D3FD3]" /> Reservasi
                </h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-[#5D3FD3]">
                    {data?.summaryCards?.reservasiHariIni ?? 0}
                  </p>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Hari Ini</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Meja Terisi: <span className="font-bold text-[#5D3FD3]">{data?.summaryCards?.mejaTerisi ?? 0}%</span>
                </p>
                <div className="mt-3">
                  <Link href="/dashboard/tables" className="text-[11px] font-bold text-[#5D3FD3] hover:underline uppercase tracking-tight">
                    + Atur Tata Letak Meja
                  </Link>
                </div>
              </div>
              <Link href="/dashboard/reservasiAdminManagement" className="bg-indigo-50 text-[#5D3FD3] px-3 py-1 rounded-md text-xs font-bold hover:bg-indigo-100 transition-colors whitespace-nowrap">
                Lihat
              </Link>
            </div>
          </div>

          {/* Card Stok Kritis */}
          <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" /> Stok Kritis
                </h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-red-600">
                    {data?.summaryCards?.stokKritis ?? 0}
                  </p>
                  <p className="text-sm text-gray-500">Produk</p>
                </div>
                <p className="text-xs text-gray-400 mt-2 italic">*Segera lakukan restock</p>
              </div>
              <Link href="/dashboard/stok" className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-red-100 transition-colors whitespace-nowrap">
                Cek Stok
              </Link>
            </div>
          </div>

          {/* Card Transaksi */}
          <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <Wallet size={18} className="text-orange-500" /> Omzet
                </h3>
                <div className="mt-2">
                  <p className="text-2xl font-black text-orange-600">
                    {rupiah(data?.summaryCards?.omzetHariIni ?? 0)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-tighter">Hari Ini</p>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 font-medium">Berdasarkan transaksi sukses</p>
              </div>
              <Link href="/dashboard/transaksi" className="bg-orange-50 text-orange-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-orange-100 transition-colors whitespace-nowrap">
                Rincian
              </Link>
            </div>
          </div>

        </div>
      </section>

          {/* SUMMARY METRICS */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-yellow-500">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <ShoppingCart size={18} className="text-yellow-500" /> Penjualan Hari Ini
                </h3>
                <div className="flex items-baseline gap-3 mt-2">
                  <p className="text-3xl font-bold text-yellow-600">{data?.summaryCards?.transaksiHariIni ?? 0}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Total transaksi yang berhasil</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-purple-500">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <BarChart2 size={18} className="text-purple-500" /> Total Omzet
                </h3>
                <div className="flex items-baseline gap-3 mt-2">
                  <p className="text-2xl font-bold text-purple-600">{rupiah(data?.summaryCards?.omzetHariIni)}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-pink-500">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <FileText size={18} className="text-pink-500" /> Waiting List
                </h3>
                <div className="flex items-baseline gap-3 mt-2">
                  <p className="text-3xl font-bold text-pink-600">{data?.reservasiSummary?.avgWaiting ?? 0} <span className="text-sm font-normal">Menit</span></p>
                </div>
                <p className="text-xs text-gray-400 mt-1">Rata-rata waktu tunggu</p>
              </div>
            </div>
          </section>

          {/* Kinerja Kasir */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-[#3FA3A2] mb-4 flex items-center gap-2">
              <Users size={18} /> Kinerja Kasir (Hari Ini)
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.cashierPerformance ?? []} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(val: any) => typeof val === 'number' && val > 1000 ? rupiah(val) : val} />
                  <Bar dataKey="total" name="Total (Rp)" fill={THEME_PRIMARY} barSize={20} />
                  <Bar dataKey="transaksi" name="Jml Transaksi" fill={THEME_ACCENT} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Produk Stok Menipis */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-[#3FA3A2] mb-4">Peringatan Stok Produk</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(data?.products?.stokMenipis ?? []).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">IMG</div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-red-500 font-bold">Sisa Stok: {item.stock}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Restock</span>
                </div>
              ))}
              {data?.products?.stokMenipis?.length === 0 && <p className="text-gray-400 text-sm">Semua stok aman.</p>}
            </div>
          </div>

          {/* Chart Penjualan 30 Hari */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-[#3FA3A2] mb-4">Analisis Penjualan & Pendapatan (30 Hari Terakhir)</h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.salesOverview ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickFormatter={(str) => str?.slice(5) ?? ''} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="penjualan" name="Qty" stroke={THEME_PRIMARY} strokeWidth={3} />
                  <Line yAxisId="right" type="monotone" dataKey="pendapatan" name="Rp" stroke="#FFA500" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row Bawah: Order Type & Reservasi */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-5">
              <h4 className="font-semibold text-[#3FA3A2] mb-3">Metode Order</h4>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data?.orderTypeShare ?? []} dataKey="value" nameKey="name" outerRadius={80} label>
                      {(data?.orderTypeShare ?? []).map((_: any, idx: number) => (
                        <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-5 lg:col-span-2">
              <h4 className="font-semibold text-[#3FA3A2] mb-3">Tren Reservasi (30 Hari)</h4>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.reservationChart30Days ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(d) => d?.slice(8) ?? ''} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="reservations" name="Reservasi" fill="#39ABA7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bar Chart Kategori & Line Chart 7 Hari */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4 text-[#3FA3A2]">Penjualan per Kategori</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data?.salesByCategory ?? []}>
                      <XAxis type="number" />
                      <YAxis dataKey="nama" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="jumlah" fill={THEME_ACCENT} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4 text-[#3FA3A2]">Tren Transaksi (7 Hari)</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.salesTrend7Days ?? []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tanggal" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="jumlah" stroke={THEME_PRIMARY} strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}