'use client'

import React, { useState, useEffect } from 'react'
import {
  DollarSign, BarChart3, TrendingUp, Users, Clock, ShoppingCart,
  AlertTriangle, Scale, Calendar, FileText, FileUp, Printer,
  UserCheck, Loader2
} from 'lucide-react'
import Sidebar from '@/components/SidebarKasir'
import HeaderKasir from '@/components/HeaderKasir'

/* =====================
 * UTIL
 * ===================== */
const formatRupiah = (number: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number || 0)

/* =====================
 * COMPONENTS 
 * ===================== */
const ActionButton = ({ icon: Icon, label, color = 'bg-indigo-600', hoverColor = 'hover:bg-indigo-700', className = 'py-2 px-4 text-base' }: any) => (
  <button className={`flex items-center ${color} ${hoverColor} text-white font-medium rounded-lg transition-colors ${className}`}>
    <Icon className="w-5 h-5 mr-2" />
    {label}
  </button>
)

const ComparisonMetric = ({ icon: Icon, title, value, valueFormatter = formatRupiah }: any) => (
  <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100 flex items-center transition-transform hover:scale-[1.02]">
    <div className="p-3 rounded-full mr-4 bg-indigo-100 text-indigo-600 flex-shrink-0">
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 truncate">{valueFormatter(value)}</p>
      <p className="text-xs text-gray-400 mt-1 italic">*Data real-time API</p>
    </div>
  </div>
)

const MetricCard = ({ icon: Icon, title, value }: any) => (
  <div className="p-5 bg-white rounded-xl shadow-xl border border-gray-100 flex items-center transition-transform hover:scale-[1.02]">
    <div className="p-3 rounded-full mr-4 bg-indigo-100 text-indigo-600 flex-shrink-0">
      <Icon className="w-6 h-6" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-gray-500">{title}</p>
      {/* FIXED: text-lg dan truncate untuk menangani email panjang */}
      <p className="text-lg font-bold text-gray-900 truncate" title={value}>
        {value}
      </p>
    </div>
  </div>
)

const AuditMetric = ({ title, value, color = 'text-gray-900' }: any) => (
  <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
)

const AuditDifferenceCard = ({ expected, actual, title }: any) => {
  const diff = actual - expected
  const isMatch = Math.abs(diff) < 100 
  return (
    <div className={`p-4 rounded-xl text-center shadow-xl border-2 ${isMatch ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'}`}>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className={`text-2xl font-extrabold mt-1 ${isMatch ? 'text-green-700' : 'text-red-700'}`}>
        {formatRupiah(Math.abs(diff))}
      </p>
      <span className="text-xs mt-1 block font-bold">{isMatch ? 'MATCH' : (diff < 0 ? 'SHORTAGE' : 'SURPLUS')}</span>
    </div>
  )
}

/* ========================================================================
   MAIN PAGE
======================================================================== */
export default function LaporanKasirPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [shiftId, setShiftId] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(
        `/api/frontend/kasir/report?date=${date}`,
        { credentials: 'include' }
      )
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mengambil data dari server');
      }
      
      const result = await res.json()
      setData(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [date, shiftId])

  if (loading) return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#52bfbe]">
      <Loader2 className="w-12 h-12 animate-spin text-white" />
    </div>
  )

  if (error) return (
    <div className="flex min-h-screen bg-[#52bfbe]">
      <Sidebar />
      <div className="flex-1 ml-28 p-10">
         <div className="bg-red-600 text-white p-6 rounded-lg shadow-xl">
            <h1 className="text-xl font-bold flex items-center"><AlertTriangle className="mr-2"/> Error Connection</h1>
            <p className="mt-2">{error}</p>
            <button onClick={fetchData} className="mt-4 bg-white text-red-600 px-4 py-2 rounded font-bold">Coba Lagi</button>
         </div>
      </div>
    </div>
  )

  if (!data) return null

  // Destructuring dengan fallback value agar tidak error
  const {
    summary = { netSales: 0, totalTransactions: 0, averageTransactionValue: 0 },
    paymentDetails = [],
    bestSellers = { byQuantity: [], byRevenue: [] },
    reservations = { dpReceived: 0, dpUsed: 0, transactions: [] },
    audit = { startingCash: 0, expectedCash: 0, actualCash: 0, notes: "" },
    meta = { cashierName: 'Kasir' },
  } = data

  return (
    <div className="flex min-h-screen bg-[#52bfbe]">
      <Sidebar />
      <div className="flex-1 ml-28 flex flex-col">
        <HeaderKasir title="Laporan Operasional Kasir" showBack={true} />

        <main className="p-6 space-y-10 max-w-7xl mx-auto w-full">
          {/* Action & Filter */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 justify-end">
              <ActionButton icon={FileUp} label="Export Excel" color="bg-green-600" />
              <ActionButton icon={FileText} label="Export PDF" color="bg-red-600" />
              <ActionButton icon={Printer} label="Cetak Laporan" />
            </div>

            <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-lg shadow">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-md p-2 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-500 mr-2" />
                <input type="text" placeholder="Shift ID (Contoh: SH-001)" value={shiftId} onChange={(e) => setShiftId(e.target.value)} className="border rounded-md p-2 focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-200" />

          {/* 1. Ringkasan Penjualan */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" /> Ringkasan Penjualan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <ComparisonMetric icon={DollarSign} title="Penjualan Bersih" value={summary.netSales} />
              <MetricCard icon={TrendingUp} title="Rata-rata Transaksi" value={formatRupiah(summary.averageTransactionValue)} />
              <MetricCard icon={BarChart3} title="Total Transaksi" value={summary.totalTransactions} />
              <MetricCard icon={Users} title="Kasir" value={meta.cashierName} />
            </div>
          </section>

          {/* 2. Metode Pembayaran */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <Scale className="w-6 h-6 mr-2 text-indigo-600" /> Rincian Pembayaran
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paymentDetails.length > 0 ? (
                paymentDetails.map((pay: any) => (
                  <div key={pay.type} className="p-5 bg-white rounded-xl shadow-lg flex items-center transition-transform hover:scale-[1.02]">
                    <div className="bg-indigo-100 text-indigo-700 p-3 rounded-full mr-4">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500 truncate">{pay.type}</p>
                      <p className="text-xl font-bold text-gray-900">{formatRupiah(pay.value)}</p>
                      <p className="text-sm font-medium text-indigo-600">{pay.percentage}% dari total</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full p-8 bg-white/50 border-2 border-dashed border-white rounded-xl text-center text-white font-medium">
                  Tidak ada data transaksi PAID pada tanggal ini.
                </div>
              )}
            </div>
          </section>

          {/* 3. Reservasi & DP */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <UserCheck className="w-6 h-6 mr-2 text-indigo-600" /> Reservasi & Down Payment
            </h2>
            <div className="p-6 bg-white rounded-xl shadow-xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b pb-4">
                <AuditMetric title="Total DP Diterima" value={formatRupiah(reservations.dpReceived)} color="text-green-600" />
                <AuditMetric title="Total DP Digunakan" value={formatRupiah(reservations.dpUsed)} color="text-red-600" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-indigo-50 text-indigo-700">
                    <tr>
                      <th className="p-3">Nama Pelanggan</th>
                      <th className="p-3">Total Tagihan</th>
                      <th className="p-3">DP Terpotong</th>
                      <th className="p-3">Sisa Dibayar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.transactions.length > 0 ? reservations.transactions.map((t: any, idx: number) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{t.name}</td>
                        <td className="p-3">{formatRupiah(t.billTotal)}</td>
                        <td className="p-3 text-red-500 font-semibold">({formatRupiah(t.dpUsed)})</td>
                        <td className="p-3 font-bold text-green-700">{formatRupiah(t.cashierReceived)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="p-5 text-center text-gray-400">Tidak ada transaksi reservasi.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 4. Produk Terlaris */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2 text-indigo-600" /> Analisis Produk
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
                  <h3 className="font-bold text-lg mb-4 text-indigo-700 border-b pb-2">Top Kuantitas</h3>
                  {bestSellers.byQuantity.length > 0 ? bestSellers.byQuantity.map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center py-3 border-b last:border-0">
                      <span className="font-medium text-gray-700 truncate mr-2">{p.name}</span>
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">{p.quantity} Unit</span>
                    </div>
                  )) : <p className="text-gray-400 text-center py-4">Data tidak tersedia</p>}
               </div>
               <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
                  <h3 className="font-bold text-lg mb-4 text-green-700 border-b pb-2">Top Revenue</h3>
                  {bestSellers.byRevenue.length > 0 ? bestSellers.byRevenue.map((p: any) => (
                    <div key={p.id} className="flex justify-between items-center py-3 border-b last:border-0">
                      <span className="font-medium text-gray-700 truncate mr-2">{p.name}</span>
                      <span className="font-bold text-indigo-600 flex-shrink-0">{formatRupiah(p.revenue)}</span>
                    </div>
                  )) : <p className="text-gray-400 text-center py-4">Data tidak tersedia</p>}
               </div>
            </div>
          </section>

          {/* 5. Audit Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-indigo-600" /> Audit Kasir
            </h2>
            <div className="p-6 bg-white rounded-xl shadow-2xl border border-gray-200 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <AuditMetric title="Modal Awal" value={formatRupiah(audit.startingCash)} color="text-gray-600" />
                <AuditMetric title="Ekspektasi Kas" value={formatRupiah(audit.expectedCash)} color="text-indigo-600" />
                <AuditMetric title="Kas Aktual" value={formatRupiah(audit.actualCash)} color="text-indigo-600" />
                <AuditDifferenceCard expected={audit.expectedCash} actual={audit.actualCash} title="Selisih Tunai" />
              </div>
              {audit.notes && (
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                  <p className="text-sm font-bold text-gray-700">Catatan Audit:</p>
                  <p className="text-sm text-gray-600 italic mt-1">"{audit.notes}"</p>
                </div>
              )}
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}