// src/app/(admin)/dashboard/laporan/page.tsx

'use client'

import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

import Link from 'next/link'
import { useState, ReactNode } from 'react'

import {
  Download,
  Calendar,
  Clock,
  BarChart,
  ShoppingBag,
  Receipt,
  Tag,
  List,
  Filter,
  Search,
  ChevronDown,
} from 'lucide-react'

// Anggap util ini ada di '@/utils/formatter.ts'
// *Karena formatRupiah digunakan di sini, saya sertakan dummy-nya jika Anda belum punya file formatter.ts*
const formatRupiah = (number: number): string => {
  if (typeof number !== 'number' || isNaN(number)) {
    return 'Rp0'
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number)
}

// =================================================================
// 📚 DEFINISI INTERFACE (TIPE DATA)
// =================================================================

type ChartMode = 'bulanan' | 'harian'
type BadgeType = 'tersedia' | 'lunas' | 'selesai' | 'aktif' | 'habis'

interface ChartData {
  name: string
  penjualan: number
  pendapatan: number
}

interface StatCardProps {
  title: string
  value: string
  subText: string
  icon: ReactNode
  color: string
}

interface BadgeProps {
  children: ReactNode
  type: BadgeType
}

interface LaporanSectionProps {
  title: string
  children: ReactNode
  link?: string
  linkText?: string
}

interface PenjualanData {
  id: number
  tanggal: string
  nomorNota: string
  kasir: string
  totalHarga: number
  metodePembayaran: string
  status: 'Selesai'
}

interface StokProdukData {
  id: number
  namaProduk: string
  jumlahAwal: number
  jumlahAkhir: number
  hargaSatuan: number
  keterangan: 'Tersedia' | 'Habis'
}

interface BuktiPembayaranData {
  id: number
  nomorNota: string
  tanggal: string
  namaPelanggan: string
  totalPembayaran: number
  metodePembayaran: string
  statusPembayaran: 'Lunas'
}

interface PromoAktifData {
  id: number
  namaPromo: string
  kode: string
  tanggalAwal: string
  tanggalAkhir: string
  diskon: string
  kuota: string
  totalPenggunaan: string
  status: 'Aktif'
}

interface PesananData {
  id: number
  nomorMeja: number
  tanggal: string
  waktu: string
  totalItem: number
  totalHarga: number
  metodePembayaran: string
  status: 'Selesai'
}

// =================================================================
// 📦 DATA DUMMY DENGAN TIPE
// =================================================================

const dataGrafikBulanan: ChartData[] = [
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

const dataGrafikHarian: ChartData[] = [
  { name: 'Sen', penjualan: 120, pendapatan: 80 },
  { name: 'Sel', penjualan: 150, pendapatan: 110 },
  { name: 'Rab', penjualan: 180, pendapatan: 130 },
  { name: 'Kam', penjualan: 200, pendapatan: 160 },
  { name: 'Jum', penjualan: 260, pendapatan: 190 },
  { name: 'Sab', penjualan: 300, pendapatan: 220 },
  { name: 'Min', penjualan: 240, pendapatan: 170 },
]

const dataPenjualan: PenjualanData[] = [
  {
    id: 1,
    tanggal: '15 Okt 2025',
    nomorNota: '400',
    kasir: 'Kasir 1',
    totalHarga: 80000,
    metodePembayaran: 'Tunai',
    status: 'Selesai',
  },
  {
    id: 2,
    tanggal: '17 Okt 2025',
    nomorNota: '400',
    kasir: 'Kasir 1',
    totalHarga: 30000,
    metodePembayaran: 'QRIS',
    status: 'Selesai',
  },
  {
    id: 3,
    tanggal: '17 Okt 2025',
    nomorNota: '400',
    kasir: 'Kasir 1',
    totalHarga: 19000,
    metodePembayaran: 'Tunai',
    status: 'Selesai',
  },
]

const paymentData = [
  { name: 'Tunai', value: 50 },
  { name: 'QRIS', value: 30 },
  { name: 'Lainnya', value: 20 },
]

const COLORS = ['#52BFBE', '#3FA3A2', '#D1D5DB']

const dataStokProduk: StokProdukData[] = [
  {
    id: 1,
    namaProduk: 'Nugget',
    jumlahAwal: 50,
    jumlahAkhir: 20,
    hargaSatuan: 22500,
    keterangan: 'Tersedia',
  },
  {
    id: 2,
    namaProduk: 'Kentang Goreng',
    jumlahAwal: 40,
    jumlahAkhir: 28,
    hargaSatuan: 20000,
    keterangan: 'Tersedia',
  },
  {
    id: 3,
    namaProduk: 'Sosis',
    jumlahAwal: 10,
    jumlahAkhir: 0,
    hargaSatuan: 45000,
    keterangan: 'Habis',
  },
]

const dataBuktiPembayaran: BuktiPembayaranData[] = [
  {
    id: 1,
    nomorNota: '#507',
    tanggal: '15 Okt 2025',
    namaPelanggan: 'Delta',
    totalPembayaran: 55000,
    metodePembayaran: 'Tunai',
    statusPembayaran: 'Lunas',
  },
  {
    id: 2,
    nomorNota: '#507',
    tanggal: '17 Okt 2025',
    namaPelanggan: 'Alfa',
    totalPembayaran: 23000,
    metodePembayaran: 'QRIS',
    statusPembayaran: 'Lunas',
  },
]

const dataPromoAktif: PromoAktifData[] = [
  {
    id: 1,
    namaPromo: 'Diskon Cap... ',
    kode: '123 ABC DEF',
    tanggalAwal: '01 Aug 2025',
    tanggalAkhir: '05 Aug 2025',
    diskon: '25%',
    kuota: '25',
    totalPenggunaan: '30',
    status: 'Aktif',
  },
  {
    id: 2,
    namaPromo: 'Merdeka Sale',
    kode: 'TTG 12.4',
    tanggalAwal: '17 Aug 2025',
    tanggalAkhir: '17 Aug 2025',
    diskon: '30%',
    kuota: '45',
    totalPenggunaan: '45',
    status: 'Aktif',
  },
]

const dataPesanan: PesananData[] = [
  {
    id: 1,
    nomorMeja: 315,
    tanggal: '15 Okt 2025',
    waktu: '12:00',
    totalItem: 5,
    totalHarga: 150000,
    metodePembayaran: 'Tunai',
    status: 'Selesai',
  },
  {
    id: 2,
    nomorMeja: 407,
    tanggal: '8 Des 2025',
    waktu: '20:38',
    totalItem: 2,
    totalHarga: 50000,
    metodePembayaran: 'QRIS',
    status: 'Selesai',
  },
]

// =================================================================
// 🎨 KOMPONEN DENGAN TIPE YANG JELAS
// =================================================================

// Komponen StatCard sekarang menerima props bertipe StatCardProps
const StatCard = ({ title, value, subText, icon, color }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow p-5 border-l-4" style={{ borderColor: color }}>
    <div className="flex justify-between items-start">
      <h3 className="text-sm mb-2 opacity-80 font-medium">{title}</h3>
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    {subText && <p className="text-xs mt-2 opacity-70 text-gray-600">{subText}</p>}
  </div>
)

// Komponen LaporanSection sekarang menerima props bertipe LaporanSectionProps
const LaporanSection = ({
  title,
  children,
  link,
  linkText = 'Lihat Semua',
}: LaporanSectionProps) => (
  <div className="bg-white rounded-xl shadow p-5">
    <div className="flex justify-between items-center mb-4 border-b pb-3">
      <h3 className="text-xl font-semibold text-[#3FA3A2]">{title}</h3>
      {link && (
        <Link href={link} className="text-[#52BFBE] text-sm font-medium hover:underline">
          {linkText} →
        </Link>
      )}
    </div>
    {children}
  </div>
)

// Komponen Badge sekarang menerima props bertipe BadgeProps
const Badge = ({ children, type }: BadgeProps) => {
  let color = 'bg-gray-200 text-gray-800'
  if (type === 'tersedia' || type === 'lunas' || type === 'selesai' || type === 'aktif') {
    color = 'bg-[#E8F9F9] text-[#52BFBE] font-semibold'
  } else if (type === 'habis') {
    color = 'bg-red-100 text-red-500 font-semibold'
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs rounded-full ${color}`}>
      {children}
    </span>
  )
}

// =================================================================
// 🖥️ KOMPONEN UTAMA
// =================================================================

export default function LaporanPage() {
  const [mode, setMode] = useState<ChartMode>('bulanan')
  const chartData = mode === 'bulanan' ? dataGrafikBulanan : dataGrafikHarian
  const chartModeLabel = mode === 'bulanan' ? 'Bulanan' : 'Harian'

  // Nilai numerik dengan tipe eksplisit
  const penjualanHarian: number = 500000
  const pendapatanBulanan: number = 13000000
  const jumlahTransaksi: number = 25
  const pendapatanKotor: number = 1000000
  const totalPengeluaran: number = 700000
  const keuntunganBersih: number = pendapatanKotor - totalPengeluaran

  return (
    <div className="flex min-h-screen bg-[#E8F9F9]-100">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Laporan" showBack={false} />

        <div className="p-6 space-y-6">
          {/* === STATISTIK UTAMA === */}
          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Penjualan Harian */}
            <StatCard
              title="Penjualan Hari Ini"
              value={formatRupiah(penjualanHarian)}
              subText="24 Oktober 2025"
              icon={<BarChart size={24} className="text-[#3FA3A2]" />}
              color="#FFFFFF"
            />

            {/* Pendapatan Bulanan */}
            <StatCard
              title="Pendapatan Bulanan"
              value={formatRupiah(pendapatanBulanan)}
              subText="1-31 Oktober 2025"
              icon={<BarChart size={24} className="text-[#3FA3A2]" />}
              color="#FFFFFF"
            />

            {/* Jumlah Transaksi */}
            <StatCard
              title="Jumlah Transaksi"
              value={`${jumlahTransaksi} Transaksi`}
              subText="Hari Ini"
              icon={<List size={24} className="text-[#3FA3A2]" />}
              color="#FFFFFF"
            />

            {/* Waktu Transaksi Terakhir */}
            <div className="bg-white rounded-xl shadow p-5 border-l-4 border-gray-400">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm opacity-80 font-medium">Waktu Transaksi Terakhir</h3>
                <Clock size={24} className="text-gray-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">14.00 - 15.00</p>
              <p className="text-xs mt-2 opacity-70 text-gray-600">24 Oktober 2025</p>
            </div>
          </div>

          {/* --- Pemisah Seksional --- */}
          <hr className="border-t-0 border-transparent" />

            {/* === METODE PEMBAYARAN & GRAFIK PENJUALAN === */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              
              {/* Metode Pembayaran (Pie Chart) */}
              <div className="bg-white rounded-xl shadow p-5 xl:col-span-1">
                <h3 className="font-semibold text-[#3FA3A2] mb-4">Metode Pembayaran</h3>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Tunai', value: 50 },
                          { name: 'QRIS', value: 30 },
                          { name: 'Lainnya', value: 20 },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label
                      >
                        <Cell fill="#52BFBE" />   {/* Tunai */}
                        <Cell fill="#3FA3A2" />   {/* QRIS */}
                        <Cell fill="#D1D5DB" />   {/* Lainnya */}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            {/* Grafik Penjualan */}
            <div className="bg-white rounded-xl shadow p-5 xl:col-span-2">
              <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h3 className="font-semibold text-[#3FA3A2]">Grafik Penjualan</h3>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setMode('bulanan')}
                    className={`text-sm px-3 py-1 rounded-md ${mode === 'bulanan' ? 'bg-[#52BFBE] text-white' : 'text-gray-600'}`}
                  >
                    Bulanan
                  </button>
                  <button
                    onClick={() => setMode('harian')}
                    className={`text-sm px-3 py-1 rounded-md ${mode === 'harian' ? 'bg-[#52BFBE] text-white' : 'text-gray-600'}`}
                  >
                    Harian
                  </button>
                  <button
                    // onClick={() => downloadPDF("chart_overview", `laporan-${chartModeLabel.toLowerCase()}`)}
                    className="flex items-center gap-2 border border-[#52BFBE] text-[#52BFBE] text-sm px-3 py-1 rounded-md hover:bg-[#E8F9F9] transition"
                  >
                    <Download size={18} />
                    Unduh
                  </button>
                </div>
              </div>

              {/* CHART WRAPPER */}
              <div id="chart_overview" className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid stroke="#eee" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      // Nilai data dummy * 1000 agar terlihat seperti rupiah jutaan/ribuan
                      formatter={(value: any, name: any) => [
                        formatRupiah(value * 1000),
                        name === 'penjualan' ? 'Penjualan' : 'Pendapatan',
                      ]}
                      labelFormatter={(label: any) =>
                        mode === 'bulanan' ? label : `${label} (Minggu)`
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="penjualan"
                      stroke="#52BFBE"
                      strokeWidth={3}
                      dot={false}
                      name="Penjualan"
                    />
                    <Line
                      type="monotone"
                      dataKey="pendapatan"
                      stroke="#A0E3E3"
                      strokeWidth={2}
                      dot={false}
                      name="Pendapatan"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* --- Pemisah Seksional --- */}
          <hr className="border-t-0 border-transparent" />

          {/* === KEUNTUNGAN BERSIH (Bar Biru Panjang) === */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] text-[#3FA3A2] rounded-xl shadow p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={28} />
                <div>
                  <p className="text-sm font-semibold">Pendapatan Kotor</p>
                  <p className="text-xl font-bold">{formatRupiah(pendapatanKotor)}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#FFFFFF] text-[#3FA3A2] rounded-xl shadow p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt size={28} />
                <div>
                  <p className="text-sm font-semibold">Total Pengeluaran</p>
                  <p className="text-xl font-bold">{formatRupiah(totalPengeluaran)}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#52BFBE] text-white rounded-xl shadow p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tag size={28} />
                <div>
                  <p className="text-sm font-semibold">Keuntungan Bersih</p>
                  <p className="text-xl font-bold">{formatRupiah(keuntunganBersih)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Pemisah Seksional --- */}
          <hr className="border-t-0 border-transparent" />

          {/* === FILTER BAR === */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
            <Filter size={20} className="text-[#3FA3A2]" />
            <span className="text-sm font-medium text-gray-600">Filter:</span>

            {/* Filter Rentang Tanggal */}
            <div className="flex items-center border rounded-lg px-3 py-1 text-sm bg-gray-50">
              <Calendar size={16} className="mr-2 text-gray-500" />
              <input
                type="text"
                defaultValue="15 Okt 2025 - 28 Okt 2025"
                className="bg-transparent focus:outline-none w-40"
              />
            </div>

            {/* Filter Produk */}
            <div className="flex items-center border rounded-lg px-3 py-1 text-sm bg-gray-50">
              <Search size={16} className="mr-2 text-gray-500" />
              <input
                type="text"
                placeholder="Produk"
                className="bg-transparent focus:outline-none w-20"
              />
            </div>

            {/* Filter Metode Pembayaran */}
            <div className="flex items-center border rounded-lg px-3 py-1 text-sm bg-gray-50 cursor-pointer">
              <span className="text-gray-600">Metode Pembayaran</span>
              <ChevronDown size={16} className="ml-2 text-gray-500" />
            </div>
          </div>

          {/* --- Pemisah Seksional --- */}
          <hr className="border-t-0 border-transparent" />

          {/* === TABEL PENJUALAN === */}
          <LaporanSection title="Penjualan" link="/laporan/penjualan" linkText="Lihat Semua">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F8F8F8]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nomor Nota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kasir
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Harga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metode Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataPenjualan.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.tanggal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.nomorNota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.kasir}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatRupiah(item.totalHarga)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.metodePembayaran}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge type="selesai">{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LaporanSection>

          {/* === TABEL STOK PRODUK === */}
          <LaporanSection title="Stok Produk" link="/laporan/stok-produk" linkText="Lihat Semua">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F8F8F8]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Produk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah Awal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah Akhir
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga Satuan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataStokProduk.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.namaProduk}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.jumlahAwal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.jumlahAkhir}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatRupiah(item.hargaSatuan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge type={item.keterangan === 'Habis' ? 'habis' : 'tersedia'}>
                          {item.keterangan}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LaporanSection>

          {/* === TABEL BUKTI PEMBAYARAN === */}
          <LaporanSection
            title="Bukti Pembayaran"
            link="/laporan/bukti-pembayaran"
            linkText="Lihat Semua"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F8F8F8]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nomor Nota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metode Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Pembayaran
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataBuktiPembayaran.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.nomorNota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.tanggal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.namaPelanggan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatRupiah(item.totalPembayaran)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.metodePembayaran}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge type="lunas">{item.statusPembayaran}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LaporanSection>

          {/* === TABEL PROMO AKTIF === */}
          <LaporanSection title="Promo Aktif" link="/laporan/promo-aktif" linkText="Lihat Semua">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F8F8F8]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Promo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tgl Awal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tgl Akhir
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diskon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kuota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Penggunaan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataPromoAktif.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.namaPromo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.kode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.tanggalAwal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.tanggalAkhir}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.diskon}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.kuota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.totalPenggunaan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge type="aktif">{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LaporanSection>

          {/* === TABEL PESANAN === */}
          <LaporanSection title="Pesanan" link="/laporan/pesanan" linkText="Lihat Semua">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F8F8F8]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nomor Meja
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Harga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metode Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataPesanan.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.nomorMeja}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.tanggal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.waktu}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.totalItem}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatRupiah(item.totalHarga)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.metodePembayaran}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge type="selesai">{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </LaporanSection>
        </div>
      </div>
    </div>
  )
}
