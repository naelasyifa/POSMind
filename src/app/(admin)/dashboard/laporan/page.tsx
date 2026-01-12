'use client'

import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import {
  CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'
import { useState, useEffect } from 'react'
import { 
  BarChart, List, Download, TrendingUp, 
  Wallet, ArrowDownRight, ArrowUpRight, Search, Calendar
} from 'lucide-react'

/* ================= UTIL ================= */
const formatRupiah = (number: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(number || 0)

const COLORS = ['#52BFBE', '#3FA3A2', '#2C7A79', '#76D7D6', '#A0E4E3'];

/* ================= COMPONENTS ================= */
const StatCard = ({ title, value, subText, icon, trend, color = "text-[#3FA3A2]" }: any) => (
  <div className="bg-white rounded-xl shadow-md p-5 border-none transform transition-hover hover:scale-[1.02]">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2 rounded-lg bg-gray-50 ${color}`}>{icon}</div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-xs mt-1 text-gray-500">{subText}</p>
  </div>
)

const TableCard = ({ title, children, rightElement }: { title: string, children: React.ReactNode, rightElement?: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-lg border-none overflow-hidden">
    <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
      <h3 className="font-bold text-gray-800">{title}</h3>
      {rightElement}
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
  const [dataPromo, setDataPromo] = useState([])
  const [dataPesanan, setDataPesanan] = useState([])
  const [dataPenjualan, setDataPenjualan] = useState([])

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/frontend/admin/report', { cache: 'no-store' });
      const data = await res.json();
      
      if (data.stat) {
        setStatistik(data.stat);
      }
      
      // Sinkronisasi data ke state tabel
      setGrafikBulanan(data.grafikBulanan || []);
      setGrafikHarian(data.grafikHarian || []);
      setMetodePembayaran(data.metodePembayaran || []);
      
      // Perbaikan: Pastikan key ini ada di response API
      setDataPenjualan(data.penjualan || []); 
      setDataPesanan(data.pesanan || []);
      setDataPromo(data.promos || []);
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  const handleDownload = () => alert("Mengekspor laporan...");

  if (loading) return <div className="p-10 text-center text-white bg-[#52BFBE] min-h-screen">Memproses Laporan Analistik...</div>

  return (
    <div className="flex min-h-screen bg-[#52BFBE]"> {/* BACKGROUND KEMBALI HIJAU */}
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Laporan Strategis" showBack={true} />

        <div className="p-6 space-y-6">
          {/* HEADER & FILTER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-lg">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Evaluasi Performa Bisnis</h2>
              <p className="text-sm text-gray-500 font-medium">Analisis data real-time transaksi selesai.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
                <Calendar size={16} className="text-[#3FA3A2]" />
                <input type="date" className="bg-transparent text-xs focus:outline-none font-semibold text-gray-600" />
                <span className="text-gray-400">-</span>
                <input type="date" className="bg-transparent text-xs focus:outline-none font-semibold text-gray-600" />
              </div>
              
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-[#3FA3A2] text-white px-5 py-2.5 rounded-lg hover:bg-[#2C7A79] transition-all shadow-md text-sm font-bold"
              >
                <Download size={18} /> Ekspor Laporan
              </button>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Omzet" value={formatRupiah(statistik.pendapatanBulanan)} subText="Bulan berjalan" trend={12.5} icon={<TrendingUp size={20} />} />
            <StatCard title="Rata-rata Order" value={formatRupiah(statistik.pendapatanBulanan / (statistik.jumlahTransaksi || 1))} subText="Nilai per transaksi" icon={<Wallet size={20} />} />
            <StatCard title="Volume Pesanan" value={`${statistik.jumlahTransaksi} Trx`} subText="Total aktivitas" icon={<List size={20} />} />
            <StatCard title="Profit Bersih" value={formatRupiah(statistik.keuntunganBersih)} subText="Estimasi margin" icon={<ArrowUpRight size={20} />} color="text-green-500" />
          </div>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-1 border-none">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 uppercase text-xs tracking-wider">
                <BarChart size={18} className="text-[#3FA3A2]" /> Neraca Keuangan
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-500">Revenue</span>
                  <span className="font-bold text-gray-800">{formatRupiah(statistik.pendapatanBulanan)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                    <ArrowDownRight size={16} /> Pengeluaran
                  </div>
                  <span className="font-bold text-red-600">-{formatRupiah(statistik.totalPengeluaran)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#52BFBE]/10 rounded-lg border border-[#52BFBE]/20">
                  <div className="flex items-center gap-2 text-[#2C7A79]">
                    <ArrowUpRight size={18} /> <span className="font-black">LABA REAL</span>
                  </div>
                  <span className="font-black text-[#2C7A79] text-xl">{formatRupiah(statistik.keuntunganBersih)}</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-gray-400 mb-4 text-[10px] uppercase tracking-[0.2em]">Payment Methods</h3>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={metodePembayaran} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={5} dataKey="value" nameKey="name">
                        {metodePembayaran.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" wrapperStyle={{fontSize: '10px', fontWeight: 'bold'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2 border-none">
              <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="font-bold text-gray-800 text-lg">Grafik Pertumbuhan</h3>
                   <p className="text-xs text-gray-400 font-medium">Tren fluktuasi omzet harian/bulanan</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button onClick={() => setMode('bulanan')} className={`px-4 py-1.5 text-xs rounded-md transition-all ${mode === 'bulanan' ? 'bg-[#3FA3A2] text-white shadow-md font-bold' : 'text-gray-500 hover:text-gray-700'}`}>Tahunan</button>
                  <button onClick={() => setMode('harian')} className={`px-4 py-1.5 text-xs rounded-md transition-all ${mode === 'harian' ? 'bg-[#3FA3A2] text-white shadow-md font-bold' : 'text-gray-500 hover:text-gray-700'}`}>Harian</button>
                </div>
              </div>
              <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mode === 'bulanan' ? grafikBulanan : grafikHarian}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#52BFBE" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#52BFBE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af', fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#9ca3af'}} tickFormatter={(v) => `Rp${v/1000}k`} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="total" stroke="#3FA3A2" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* DATA TABLES SECTION */}
          <TableCard 
            title="Detail Riwayat Penjualan" 
            rightElement={
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" placeholder="Cari No. Nota..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#3FA3A2]/20 outline-none w-64 transition-all" />
              </div>
            }
          >
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase text-[10px] tracking-[0.15em]">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">No Nota</th>
                  <th className="px-6 py-4">Penanggung Jawab</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dataPenjualan.map((item: any, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium">{item.tanggal}</td>
                    <td className="px-6 py-4 font-mono text-[#3FA3A2] font-bold">{item.noNota}</td>
                    <td className="px-6 py-4 text-gray-600">{item.kasir}</td>
                    <td className="px-6 py-4 font-black text-gray-800">{formatRupiah(item.totalHarga)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-[#3FA3A2] text-white px-3 py-1 rounded-md text-[10px] font-black">SETTLED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCard>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TableCard title="Evaluasi Promo">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
                    <tr>
                      <th className="px-4 py-3">Nama Program</th>
                      <th className="px-4 py-3">Diskon</th>
                      <th className="px-4 py-3">Terpakai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dataPromo.map((p: any, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 font-bold text-gray-700">{p.nama}</td>
                        <td className="px-4 py-3 text-[#3FA3A2] font-bold">{p.diskon}%</td>
                        <td className="px-4 py-3 font-medium text-gray-500">{p.terpakai} Transaksi</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableCard>

              <TableCard title="Pesanan Meja Terakhir">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
                    <tr>
                      <th className="px-4 py-3">Identitas</th>
                      <th className="px-4 py-3">Waktu</th>
                      <th className="px-4 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dataPesanan.map((o: any, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 font-black text-[#3FA3A2]">MEJA {o.noMeja}</td>
                        <td className="px-4 py-3 text-gray-400">{o.waktu}</td>
                        <td className="px-4 py-3 font-bold">{formatRupiah(o.totalHarga)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableCard>
          </div>
        </div>
      </div>
    </div>
  )
}