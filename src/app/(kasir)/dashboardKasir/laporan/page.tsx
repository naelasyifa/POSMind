'use client'

import React, { useState } from 'react'
import {
  DollarSign,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  ShoppingCart,
  AlertTriangle,
  Scale,
  XCircle,
  Calendar,
  FileText,
  FileUp,
  Printer,
  CheckCircle,
  MinusCircle,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Info,
  Link,
  UserCheck,
} from 'lucide-react'
import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'

/* ========================================================================
   MOCK DATA & INTERFACE BARU
======================================================================== */

interface PaymentDetail {
    type: 'Tunai' | 'Kartu Debit/Kredit' | 'E-Wallet';
    value: number;
    percentage: number;
    icon: React.ElementType;
    color: string;
}

interface NetSales {
    netSales: number;
    totalTransactions: number;
    averageTransactionValue: number;
    netSalesPrevious: number;
    totalTransactionsPrevious: number;
    paymentDetails: PaymentDetail[];
}

interface BestSeller {
    id: number;
    name: string;
    quantity: number;
    revenue: number;
    latestTransactionId: string;
}

interface DPTransaction {
    id: string;
    name: string;
    billTotal: number;
    dpUsed: number;
    cashierReceived: number;
    paymentMethod: 'Tunai' | 'Kartu Debit' | 'E-Wallet';
}

interface Reservations {
    dpReceivedShift: number;
    dpUsedShift: number;
    dpTransactions: DPTransaction[];
}

interface VoidRefund {
    time: string;
    item: string;
    value: number;
    type: 'Refund' | 'Void';
    reason: string;
    transactionId: string;
}

interface AuditData {
    shiftDate: string;
    cashier: string;
    shiftTime: string;
    shiftId: string;
    modalAwal: number;
    expectedCash: number;
    actualCash: number;
    auditStatus: string;
    supervisorNote: string;
    cashierNote: string;
    voidRefunds: VoidRefund[];
    totalNonCashSettlement: number;
    actualNonCashSettlement: number;
}

const mockNetSales: NetSales = {
  netSales: 8750000,
  totalTransactions: 125,
  averageTransactionValue: 70000,
  netSalesPrevious: 7800000,
  totalTransactionsPrevious: 110,
  paymentDetails: [
    { type: 'Tunai', value: 3500000, percentage: 40, icon: DollarSign, color: 'bg-green-100 text-green-700' },
    { type: 'Kartu Debit/Kredit', value: 3062500, percentage: 35, icon: Scale, color: 'bg-blue-100 text-blue-700' },
    { type: 'E-Wallet', value: 2187500, percentage: 25, icon: ShoppingCart, color: 'bg-purple-100 text-purple-700' },
  ],
}

const mockBestSellers: BestSeller[] = [
  { id: 1, name: 'Nasi Goreng Spesial', quantity: 85, revenue: 2125000, latestTransactionId: 'TRX-101' },
  { id: 2, name: 'Es Teh Manis Jumbo', quantity: 72, revenue: 720000, latestTransactionId: 'TRX-105' },
  { id: 3, name: 'Kopi Susu Premium', quantity: 68, revenue: 1530000, latestTransactionId: 'TRX-112' },
  { id: 4, name: 'Ayam Fillet Crispy', quantity: 55, revenue: 1375000, latestTransactionId: 'TRX-120' },
  { id: 5, name: 'Mie Instan Kuah', quantity: 48, revenue: 480000, latestTransactionId: 'TRX-123' },
]

const mockReservations: Reservations = {
  dpReceivedShift: 500000,
  dpUsedShift: 300000,
  dpTransactions: [
    { 
      id: 'TRX-126', 
      name: 'Pesta Ulang Tahun A', 
      billTotal: 1500000, 
      dpUsed: 200000, 
      cashierReceived: 1300000, 
      paymentMethod: 'Tunai' 
    },
    { 
      id: 'TRX-127', 
      name: 'Meeting Kantor B', 
      billTotal: 750000, 
      dpUsed: 100000, 
      cashierReceived: 650000, 
      paymentMethod: 'Kartu Debit' 
    },
  ]
}

const mockAudit: AuditData = {
  shiftDate: '2025-12-02',
  cashier: 'Budi Santoso (ID: CSH-001)',
  shiftTime: '09:00 - 17:00',
  shiftId: 'SH-20251202-A',
  modalAwal: 500000,
  expectedCash: 3940000,
  actualCash: 3945000,
  auditStatus: 'Pending',
  supervisorNote: '',
  cashierNote: 'Ada kembalian 5.000 yang terselip di laci. Juga ada penerimaan DP Rp 500.000 (Rp 250.000 tunai) untuk reservasi besok.',
  voidRefunds: [
    { time: '10:15', item: 'Kopi Susu Premium', value: 45000, type: 'Refund', reason: 'Barang Cacat', transactionId: 'TRX-010' },
    { time: '14:30', item: 'Nasi Goreng Spesial', value: 25000, type: 'Void', reason: 'Kesalahan Input', transactionId: 'TRX-075' },
    { time: '16:00', item: 'Ayam Fillet Crispy', value: 65000, type: 'Refund', reason: 'Tukar Ukuran', transactionId: 'TRX-110' },
  ],
  totalNonCashSettlement: 5250000,
  actualNonCashSettlement: 5250000,
}

const mockCashiers: string[] = ['Budi Santoso', 'Sari Dewi', 'Joko Purnomo']
const mockShifts: string[] = ['Pagi (09:00-17:00)', 'Siang (12:00-20:00)', 'Malam (17:00-Tutup)']

/* ========================================================================
   UTIL
======================================================================== */
const formatRupiah = (number: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number)

const calculateChange = (current: number, previous: number) => {
  if (previous === 0) {
    return { percentage: 'N/A', isPositive: true }
  }
  const percentage = ((current - previous) / previous) * 100
  return {
    percentage: `${Math.abs(percentage).toFixed(1)}%`,
    isPositive: percentage >= 0,
  }
}

/* ========================================================================
   COMPONENTS DENGAN PERBAIKAN TIPE
======================================================================== */

const ActionButton = ({ icon: Icon, label, color = 'bg-indigo-600', hoverColor = 'hover:bg-indigo-700', className = 'py-2 px-4 text-base' }: { icon: React.ElementType, label: string, color?: string, hoverColor?: string, className?: string }) => (
  <button className={`flex items-center ${color} ${hoverColor} text-white font-medium rounded-lg transition-colors ${className}`}>
    <Icon className="w-5 h-5 mr-2" />
    {label}
  </button>
)

const ComparisonMetric = ({ icon: Icon, title, value, previousValue, valueFormatter = formatRupiah }: { icon: React.ElementType, title: string, value: number, previousValue: number, valueFormatter?: (v: number) => string | number }) => {
  const change = calculateChange(value, previousValue)
  return (
    <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100 flex items-center transition-transform hover:scale-[1.02] hover:shadow-2xl">
      <div className="p-3 rounded-full mr-4 bg-indigo-100 text-indigo-600 flex-shrink-0">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{valueFormatter(value)}</p>
        <div className="flex items-center mt-1">
          {change.percentage !== 'N/A' ? (
            <>
              {change.isPositive ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {change.percentage}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs kemarin</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">Tidak ada data sebelumnya</span>
          )}
        </div>
      </div>
    </div>
  )
}

const MetricCard = ({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string | number }) => (
  <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100 flex items-center transition-transform hover:scale-[1.02] hover:shadow-2xl">
    <div className="p-3 rounded-full mr-4 bg-indigo-100 text-indigo-600 flex-shrink-0">
      <Icon className="w-6 h-6" aria-hidden="true" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
)

const AuditMetric = ({ title, value, color = 'text-gray-900' }: { title: string, value: string, color?: string }) => (
  <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-200 text-center transition-shadow hover:shadow-xl">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
)

const AuditDifferenceCard = ({ expected, actual, title, subtitle }: { expected: number, actual: number, title: string, subtitle?: string }) => {
  const diff = actual - expected
  const isShort = diff < 0
  const absDiff = Math.abs(diff)
  
  const isMatch = absDiff < 100 
  const bgColor = isMatch ? 'bg-green-100' : 'bg-red-100'
  const borderColor = isMatch ? 'border-green-500' : 'border-red-500'
  const textColor = isMatch ? 'text-green-700' : 'text-red-700'
  const status = isShort ? 'SHORTAGE (Kurang)' : 'SURPLUS (Lebih)'
  const warning = absDiff > 50000 && !isMatch

  return (
    <div className={`p-4 rounded-xl text-center shadow-xl border-2 ${borderColor} ${bgColor} transition-shadow hover:shadow-2xl`}>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className={`text-2xl font-extrabold mt-1 ${textColor}`}>
        {formatRupiah(absDiff)}
      </p>
      <span className="text-xs mt-1 block font-bold">
        {isMatch ? 'MATCH (Sesuai)' : (subtitle || status)}
      </span>
      {warning && (
        <p className="text-xs font-semibold text-red-500 mt-1 flex items-center justify-center">
          <AlertTriangle className="w-3 h-3 mr-1" /> Risiko Tinggi
        </p>
      )}
    </div>
  )
}

const DateFilterControls = ({ date, setDate, shift, setShift, cashier, setCashier }: { date: string, setDate: (s: string) => void, shift: string, setShift: (s: string) => void, cashier: string, setCashier: (s: string) => void }) => (
  <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-white rounded-lg shadow">
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center">
        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="flex items-center">
        <Clock className="w-5 h-5 text-gray-500 mr-2" />
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {mockShifts.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center">
        <Users className="w-5 h-5 text-gray-500 mr-2" />
        <select
          value={cashier}
          onChange={(e) => setCashier(e.target.value)}
          className="border rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {mockCashiers.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
    
    <button className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
      <ChevronDown className="w-5 h-5 mr-1" />
      Filter Lainnya
    </button>
  </div>
)

const ProductTable = ({ title, data, keyField, valueFormatter }: { title: string, data: BestSeller[], keyField: keyof BestSeller, valueFormatter: (v: number) => string | number }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
    <div className="p-4 border-b">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-4 text-sm font-semibold text-gray-700">Produk</th>
            <th className="text-right p-4 text-sm font-semibold text-gray-700">Kuantitas</th>
            <th className="text-right p-4 text-sm font-semibold text-gray-700">Pendapatan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="p-4">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">Transaksi terakhir: {item.latestTransactionId}</p>
                </div>
              </td>
              <td className="p-4 text-right font-medium text-gray-900">
                {valueFormatter(item[keyField] as number)}
              </td>
              <td className="p-4 text-right font-bold text-indigo-700">
                {formatRupiah(item.revenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const AuditTable = ({ data }: { data: VoidRefund[] }) => (
  <div className="overflow-x-auto rounded-lg shadow-lg border border-red-200">
    <table className="w-full">
      <thead className="bg-red-100 border-b border-red-300">
        <tr>
          <th className="p-3 text-left text-sm font-semibold text-red-700">Waktu</th>
          <th className="p-3 text-left text-sm font-semibold text-red-700">Item</th>
          <th className="p-3 text-left text-sm font-semibold text-red-700">Tipe</th>
          <th className="p-3 text-left text-sm font-semibold text-red-700">Alasan</th>
          <th className="p-3 text-left text-sm font-semibold text-red-700">Nilai</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item.transactionId} className={`${index % 2 === 0 ? 'bg-white' : 'bg-red-50/50'} border-b border-gray-100 hover:bg-red-50`}>
            <td className="p-3 text-sm text-gray-700">{item.time}</td>
            <td className="p-3 text-sm font-medium text-gray-900">{item.item}</td>
            <td className="p-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${item.type === 'Refund' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.type}
              </span>
            </td>
            <td className="p-3 text-sm text-gray-600">{item.reason}</td>
            <td className="p-3 text-sm font-bold text-red-600">{formatRupiah(item.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const DPTransactionTable = ({ data }: { data: DPTransaction[] }) => (
  <div className="overflow-x-auto rounded-lg shadow-inner">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-indigo-50">
        <tr>
          {['Waktu', 'ID Transaksi', 'Nama/Deskripsi', 'Total Tagihan', 'DP Terpakai', 'Sisa Dibayar', 'Metode Bayar'].map((h) => (
            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {data.map((item, index) => (
          <tr key={item.id} className="hover:bg-indigo-50 transition-colors">
            <td className="px-6 py-4 text-sm whitespace-nowrap">{index + 1}</td>
            <td className="px-6 py-4 text-sm font-medium text-indigo-600 whitespace-nowrap">{item.id}</td>
            <td className="px-6 py-4 text-sm">{item.name}</td>
            <td className="px-6 py-4 text-sm whitespace-nowrap">{formatRupiah(item.billTotal)}</td>
            <td className="px-6 py-4 text-red-600 font-semibold text-sm whitespace-nowrap">
              ({formatRupiah(item.dpUsed)})
            </td>
            <td className="px-6 py-4 text-green-700 font-bold text-sm whitespace-nowrap">
              {formatRupiah(item.cashierReceived)}
            </td>
            <td className="px-6 py-4 text-sm whitespace-nowrap">{item.paymentMethod}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)


/* ========================================================================
   FINAL PAGE — LAPORAN KASIR (DENGAN PERBAIKAN LOGIKA)
======================================================================== */
export default function LaporanKasirPage() {
    
    const totalCashRefundsAndVoids = mockAudit.voidRefunds
        .filter(v => ['Tunai', 'tunai'].includes(mockNetSales.paymentDetails.find(p => p.type === 'Tunai')?.type || ''))
        .reduce((sum, item) => sum + item.value, 0);

    const totalCashSales = mockNetSales.paymentDetails.find(p => p.type === 'Tunai')?.value || 0;

    const expectedClosingCash = mockAudit.modalAwal + totalCashSales - totalCashRefundsAndVoids;
    
    const expectedNonCashSales = mockNetSales.paymentDetails
        .filter(p => p.type !== 'Tunai')
        .reduce((sum, p) => sum + p.value, 0);

    const actualNonCashSettlement = mockAudit.actualNonCashSettlement;
    
    const cashExpected = expectedClosingCash; 
    const cashActual = mockAudit.actualCash; 
    
    const nonCashExpected = expectedNonCashSales; 
    const nonCashActual = actualNonCashSettlement;

    const [selectedDate, setSelectedDate] = useState(mockAudit.shiftDate)
    const [selectedShift, setSelectedShift] = useState(mockAudit.shiftTime)
    const [selectedCashier, setSelectedCashier] = useState(mockAudit.cashier.split(' ')[0])

    const topQuantitySellers = mockBestSellers
    const topRevenueSellers = [...mockBestSellers].sort((a, b) => b.revenue - a.revenue)
    
    const AuditStatusIcon = mockAudit.auditStatus === 'Approved' ? CheckCircle : MinusCircle
    const AuditStatusColor = mockAudit.auditStatus === 'Approved' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'

    return (
    <div className="flex min-h-screen bg-[#52bfbe]">
      <Sidebar />
      
      <div className="flex-1 ml-28 flex flex-col">
        <HeaderKasir title="Laporan Operasional Kasir" showBack={true} />

        <main className="p-6 space-y-10 max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 justify-end">
              <ActionButton 
                icon={FileUp} 
                label="Export Excel" 
                color="bg-green-600" 
                hoverColor="hover:bg-green-700" 
                className="py-2 px-3 text-sm"
              />
              <ActionButton 
                icon={FileText} 
                label="Export PDF" 
                color="bg-red-600" 
                hoverColor="hover:bg-red-700" 
                className="py-1 px-3 text-sm"
              />
              <ActionButton 
                icon={Printer} 
                label="Cetak Laporan" 
                className="py-1 px-3 text-sm"
              />
            </div>

            <DateFilterControls
              date={selectedDate}
              setDate={setSelectedDate}
              shift={selectedShift}
              setShift={setSelectedShift}
              cashier={selectedCashier}
              setCashier={setSelectedCashier}
            />
          </div>
          
          <hr className="border-t border-gray-200" />

          <section aria-labelledby="sales-summary-heading">
            <h2 id="sales-summary-heading" className="text-2xl font-bold mb-6 text-gray-800">
              <BarChart3 className="w-6 h-6 inline-block mr-2 text-indigo-600" aria-hidden="true" />
              Ringkasan Penjualan Harian
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <ComparisonMetric 
                icon={DollarSign} 
                title="Penjualan Bersih" 
                value={mockNetSales.netSales} 
                previousValue={mockNetSales.netSalesPrevious}
              />
              <MetricCard 
                icon={TrendingUp} 
                title="Rata-rata Transaksi" 
                value={formatRupiah(mockNetSales.averageTransactionValue)} 
              />
              <ComparisonMetric 
                icon={BarChart3} 
                title="Total Transaksi" 
                value={mockNetSales.totalTransactions + mockReservations.dpTransactions.length}
                previousValue={mockNetSales.totalTransactionsPrevious}
                valueFormatter={(v: number) => v.toString()}
              />
              <MetricCard 
                icon={Users} 
                title="Kasir Shift" 
                value={mockAudit.cashier.split(' ')[0]} 
              />
            </div>
          </section>

          <hr className="border-t border-gray-200" />

          <section aria-labelledby="payment-details-heading">
            <h2 id="payment-details-heading" className="text-2xl font-bold mb-6 text-gray-800">
              <Scale className="w-6 h-6 inline-block mr-2 text-indigo-600" aria-hidden="true" />
              Rincian Metode Pembayaran
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockNetSales.paymentDetails.map((pay) => (
                <div key={pay.type} className="p-5 bg-white rounded-xl shadow-lg flex items-center transition-transform hover:scale-[1.02] hover:shadow-xl">
                  <div className={`${pay.color} p-3 rounded-full mr-4 flex-shrink-0`}>
                    <pay.icon className="w-6 h-6" aria-hidden="true" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">{pay.type}</p>
                    <p className="text-xl font-bold text-gray-900">{formatRupiah(pay.value)}</p>
                    <p className="text-sm font-medium text-indigo-600 mt-1">{pay.percentage}% dari total</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-t border-gray-200" />

          <section aria-labelledby="reservation-details-heading">
            <h2 id="reservation-details-heading" className="text-2xl font-bold mb-6 text-gray-800">
              <UserCheck className="w-6 h-6 inline-block mr-2 text-indigo-600" aria-hidden="true" />
              Rincian Reservasi & Down Payment (DP)
            </h2>
            
            <div className="p-6 bg-white rounded-xl shadow-xl border border-gray-100 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b pb-4 mb-4">
                <AuditMetric 
                  title="Total DP Diterima (Shift)" 
                  value={formatRupiah(mockReservations.dpReceivedShift)} 
                  color="text-green-600" 
                />
                <AuditMetric 
                  title="Total DP Digunakan (Shift)" 
                  value={formatRupiah(mockReservations.dpUsedShift)} 
                  color="text-red-600" 
                />
                <AuditMetric 
                  title="Net Arus Kas DP (Shift)" 
                  value={formatRupiah(mockReservations.dpReceivedShift - mockReservations.dpUsedShift)} 
                  color={(mockReservations.dpReceivedShift - mockReservations.dpUsedShift) >= 0 ? 'text-green-700' : 'text-red-700'} 
                />
              </div>

              <h4 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
                <Link className="w-5 h-5 mr-2 text-indigo-500" aria-hidden="true" />
                Transaksi yang Dilunasi Menggunakan DP ({mockReservations.dpTransactions.length} Transaksi)
              </h4>
              
              {mockReservations.dpTransactions.length > 0 ? (
                <DPTransactionTable data={mockReservations.dpTransactions} />
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg text-gray-500 shadow-inner">
                  Tidak ada transaksi reservasi yang melunasi tagihan menggunakan DP pada shift ini.
                </div>
              )}
            </div>
          </section>
          
          <hr className="border-t border-gray-200" />

          <section aria-labelledby="best-sellers-heading">
            <h2 id="best-sellers-heading" className="text-2xl font-bold mb-6 text-gray-800">
              <ShoppingCart className="w-6 h-6 inline-block mr-2 text-indigo-600" aria-hidden="true" />
              Analisis Produk Terlaris
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductTable
                title="Top Kuantitas (Unit Terjual)"
                data={topQuantitySellers}
                keyField="quantity"
                valueFormatter={(v) => `${v} unit`}
              />

              <ProductTable
                title="Top Pendapatan (Revenue)"
                data={topRevenueSellers}
                keyField="revenue"
                valueFormatter={formatRupiah}
              />
            </div>
          </section>

          <hr className="border-t border-gray-200" />

          <section aria-labelledby="shift-audit-heading">
            <h2 id="shift-audit-heading" className="text-2xl font-bold mb-6 text-gray-800">
              <AlertTriangle className="w-6 h-6 inline-block mr-2 text-indigo-600" aria-hidden="true" />
              Audit Shift Kasir
            </h2>

            <div className="p-6 bg-white rounded-xl shadow-2xl border border-gray-400 space-y-6">
              <div className="border-b pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h3 className="text-xl font-semibold flex items-center text-gray-700 mb-2 sm:mb-0">
                  <Users className="w-5 h-5 mr-2 text-indigo-600" aria-hidden="true" /> {mockAudit.cashier}
                </h3>

                <div className="flex items-center space-x-4">
                  <span className="text-sm flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" aria-hidden="true" /> **{mockAudit.shiftDate}** ({mockAudit.shiftTime})
                  </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${AuditStatusColor}`}>
                      <AuditStatusIcon className="w-4 h-4 mr-1" />
                      Status: {mockAudit.auditStatus}
                    </span>
                </div>
              </div>

              <h4 className="text-xl font-semibold flex items-center text-gray-700">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" aria-hidden="true" /> Audit Kas Tunai
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <AuditMetric 
                  title="Modal Awal Shift" 
                  value={formatRupiah(mockAudit.modalAwal)} 
                  color="text-gray-600" 
                />
                <AuditMetric 
                  title="Total Kas (Expected)" 
                  value={formatRupiah(cashExpected)} 
                  color="text-indigo-600" 
                />
                <AuditMetric 
                  title="Kas Tunai (Actual)" 
                  value={formatRupiah(cashActual)} 
                  color="text-indigo-600" 
                />
                <AuditDifferenceCard 
                  expected={cashExpected} 
                  actual={cashActual} 
                  title="Selisih Tunai"
                />
              </div>

              <h4 className="text-xl font-semibold flex items-center text-gray-700 pt-4 border-t mt-6">
                <Scale className="w-5 h-5 mr-2 text-blue-600" aria-hidden="true" /> Audit Non-Tunai (Digital/Kartu)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AuditMetric 
                  title="Total Non-Tunai (Expected)" 
                  value={formatRupiah(nonCashExpected)} 
                  color="text-indigo-600" 
                />
                <AuditMetric 
                  title="Settlement (Actual)" 
                  value={formatRupiah(nonCashActual)} 
                  color="text-indigo-600" 
                />
                <AuditDifferenceCard 
                  expected={nonCashExpected} 
                  actual={nonCashActual} 
                  title="Selisih Non-Tunai"
                  subtitle={nonCashExpected === nonCashActual ? 'MATCH (Sesuai)' : 'PERLU DIVERIFIKASI'}
                />
              </div>

              <div className="pt-5 border-t mt-6 grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
                  <h5 className="font-semibold text-gray-700 flex items-center mb-2"><Info className="w-4 h-4 mr-1 text-indigo-500" /> Catatan Kasir:</h5>
                  <blockquote className="text-sm italic text-gray-600 border-l-4 border-indigo-300 pl-3">
                    {mockAudit.cashierNote || 'Tidak ada catatan dari Kasir.'}
                  </blockquote>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div> 
  )
}