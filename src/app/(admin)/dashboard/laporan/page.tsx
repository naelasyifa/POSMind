'use client'

import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'
import { useState, useEffect } from 'react'
import { 
  BarChart, List, Clock, Download, TrendingUp, 
  Wallet, ArrowDownRight, ArrowUpRight, Search
} from 'lucide-react'

/* ================= UTIL ================= */
const formatRupiah = (number: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(number || 0)

const COLORS = ['#52BFBE', '#3FA3A2', '#2C7A79', '#76D7D6', '#A0E4E3'];

/* ================= COMPONENTS ================= */
const StatCard = ({ title, value, subText, icon, color = "text-[#3FA3A2]" }: any) => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2 rounded-lg bg-gray-50 ${color}`}>{icon}</div>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-xs mt-1 text-gray-500">{subText}</p>
  </div>
)

const TableCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-5 border-b border-gray-50 flex justify-between items-center">
      <h3 className="font-bold text-gray-800">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
)

/* ================= PAGE ================= */
export default function LaporanPage() {
  const [mode, setMode] = useState<'bulanan' | 'harian'>('bulanan')
  const [loading, setLoading] = useState(true)
  const [statistik, setStatistik] = useState<any>({
    penjualanHariIni: 0,
    pendapatanBulanan: 0,
    jumlahTransaksi: 0,
    waktuTerakhir: '—',
    pendapatanKotor: 0,
    totalPengeluaran: 0,
    keuntunganBersih: 0
  })

  const [grafikBulanan, setGrafikBulanan] = useState([])
  const [grafikHarian, setGrafikHarian] = useState([])
  const [metodePembayaran, setMetodePembayaran] = useState([])
  
  // State Baru untuk Tabel
  const [dataPromo, setDataPromo] = useState([])
  const [dataPesanan, setDataPesanan] = useState([])
  const [dataPenjualan, setDataPenjualan] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/frontend/report', { cache: 'no-store' })
        const data = await res.json()
        if (data.stat) setStatistik(data.stat)
        setGrafikBulanan(data.grafikBulanan || [])
        setGrafikHarian(data.grafikHarian || [])
        setMetodePembayaran(data.metodePembayaran || [])
        
        // Asumsi API mengembalikan data tabel ini
        setDataPromo(data.promos || [])
        setDataPesanan(data.pesanan || [])
        setDataPenjualan(data.penjualan || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDownload = () => {
    alert("Fitur download laporan (PDF/CSV) sedang diproses...");
  }

  if (loading) return <div className="p-10 text-center text-[#3FA3A2]">Memproses Laporan...</div>

  return (
    <div className="flex min-h-screen bg-[#52BFBE]">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Laporan Analistik" showBack={true} />

        <div className="p-6 space-y-6">
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Ringkasan Performa</h2>
              <p className="text-sm text-gray-500">Data real-time dari seluruh transaksi selesai.</p>
            </div>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-[#3FA3A2] text-white px-4 py-2 rounded-lg hover:bg-[#2C7A79] transition-all shadow-md text-sm"
            >
              <Download size={18} /> Unduh Laporan
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Penjualan Hari Ini" value={formatRupiah(statistik.penjualanHariIni)} subText="Total omzet masuk hari ini" icon={<TrendingUp size={20} />} />
            <StatCard title="Pendapatan Bulanan" value={formatRupiah(statistik.pendapatanBulanan)} subText="Akumulasi bulan berjalan" icon={<Wallet size={20} />} />
            <StatCard title="Jumlah Transaksi" value={`${statistik.jumlahTransaksi} Trx`} subText="Total pesanan hari ini" icon={<List size={20} />} />
            <StatCard title="Waktu Terakhir" value={statistik.waktuTerakhir !== '—' ? new Date(statistik.waktuTerakhir).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}) : '—'} subText={statistik.waktuTerakhir !== '—' ? new Date(statistik.waktuTerakhir).toLocaleDateString('id-ID') : 'Belum ada transaksi'} icon={<Clock size={20} />} color="text-blue-500" />
          </div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
              <h3 className="font-bold text-gray-700 mb-4">Ringkasan Keuangan</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Pendapatan Kotor</span>
                  <span className="font-semibold text-gray-800">{formatRupiah(statistik.pendapatanKotor || statistik.pendapatanBulanan)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600">
                    <ArrowDownRight size={16} /> <span className="text-sm">Pengeluaran</span>
                  </div>
                  <span className="font-semibold text-red-600">-{formatRupiah(statistik.totalPengeluaran)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 text-green-700">
                    <ArrowUpRight size={18} /> <span className="font-bold">Laba Bersih</span>
                  </div>
                  <span className="font-bold text-green-700 text-lg">{formatRupiah(statistik.keuntunganBersih)}</span>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase">Metode Pembayaran</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={metodePembayaran} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" nameKey="name">
                        {metodePembayaran.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Tren Penjualan</h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button onClick={() => setMode('bulanan')} className={`px-4 py-1 text-xs rounded-md ${mode === 'bulanan' ? 'bg-white shadow text-[#3FA3A2]' : 'text-gray-500'}`}>Bulanan</button>
                  <button onClick={() => setMode('harian')} className={`px-4 py-1 text-xs rounded-md ${mode === 'harian' ? 'bg-white shadow text-[#3FA3A2]' : 'text-gray-500'}`}>Harian</button>
                </div>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mode === 'bulanan' ? grafikBulanan : grafikHarian}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#52BFBE" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#52BFBE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} tickFormatter={(v) => `Rp${v/1000}k`} />
                    <Tooltip formatter={(v: any) => formatRupiah(v)} />
                    <Area type="monotone" dataKey="total" stroke="#52BFBE" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ================= NEW TABLES SECTION ================= */}
          
          {/* 9. TABEL PROMO AKTIF */}
          <TableCard title="Tabel Promo Aktif">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Nama Promo</th>
                  <th className="px-4 py-3">Kode Promo</th>
                  <th className="px-4 py-3">Mulai</th>
                  <th className="px-4 py-3">Berakhir</th>
                  <th className="px-4 py-3">Diskon</th>
                  <th className="px-4 py-3">Kuota</th>
                  <th className="px-4 py-3">Penggunaan</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataPromo.map((item: any, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.nama}</td>
                    <td className="px-4 py-3 text-[#3FA3A2] font-mono">{item.kode}</td>
                    <td className="px-4 py-3">{item.tglMulai}</td>
                    <td className="px-4 py-3">{item.tglSelesai}</td>
                    <td className="px-4 py-3 text-green-600 font-bold">{item.diskon}%</td>
                    <td className="px-4 py-3">{item.kuota}</td>
                    <td className="px-4 py-3">{item.terpakai}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold">AKTIF</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>

          {/* 10. TABEL PESANAN */}
          <TableCard title="Tabel Pesanan">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">No Meja</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Total Item</th>
                  <th className="px-4 py-3">Total Harga</th>
                  <th className="px-4 py-3">Pembayaran</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataPesanan.map((item: any, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold">Meja {item.noMeja}</td>
                    <td className="px-4 py-3">{item.tanggal}</td>
                    <td className="px-4 py-3">{item.waktu}</td>
                    <td className="px-4 py-3">{item.totalItem} Item</td>
                    <td className="px-4 py-3 font-semibold">{formatRupiah(item.totalHarga)}</td>
                    <td className="px-4 py-3">{item.metode}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold">SELESAI</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>

          {/* 6. TABEL PENJUALAN */}
          <TableCard title="Tabel Penjualan">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">No Nota</th>
                  <th className="px-4 py-3">Kasir</th>
                  <th className="px-4 py-3">Total Harga</th>
                  <th className="px-4 py-3">Metode</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataPenjualan.map((item: any, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{item.tanggal}</td>
                    <td className="px-4 py-3 font-mono text-gray-500">{item.noNota}</td>
                    <td className="px-4 py-3">{item.kasir}</td>
                    <td className="px-4 py-3 font-bold text-gray-800">{formatRupiah(item.totalHarga)}</td>
                    <td className="px-4 py-3">{item.metode}</td>
                    <td className="px-4 py-3">
                      <span className="bg-[#3FA3A2] text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase">Selesai</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>

        </div>
      </div>
    </div>
  )
}