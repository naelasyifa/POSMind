'use client'

import { useRouter } from 'next/navigation'
import Sidebar from '@/components/SidebarKasir'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import HeaderKasir from '@/components/HeaderKasir'
import Image from "next/image"
import {
    PlusCircle, Search, History, Table, ClipboardList, CircleDollarSign, 
    Lock, ScanLine, Landmark, HandCoins, Hourglass, CheckCircle, Smartphone, User2
} from 'lucide-react'

import CloseShiftForm from './components/TutupShift'
import ShiftForm from './components/BukaShift'

const PAYMENT_ICONS: Record<string, React.ReactElement> = {
    QRIS: <ScanLine size={18} className="text-green-600" />,
    CASH: <HandCoins size={18} className="text-blue-600" />,
    TRANSFER: <Landmark size={18} className="text-indigo-600" />,
    EWALLET: <Smartphone size={18} className="text-purple-600" />,
};

/* ================= COMPONENT: SHIFT INDICATOR ================= */
const ShiftStatusIndicator = ({ name, shiftName, startTime, onOpenClose }: any) => {
    const [duration, setDuration] = useState('00:00:00');

    useEffect(() => {
        const timer = setInterval(() => {
            if (!startTime) return;
            const start = new Date(startTime).getTime();
            const now = new Date().getTime();
            const diff = now - start;

            const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
            
            setDuration(`${hours}:${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    return (
        <div className="inline-flex items-center bg-[#555555] text-white p-1.5 rounded-2xl shadow-lg border border-white/10">
            {/* User Part */}
            <div className="flex items-center gap-3 px-4 py-1 border-r border-white/20">
                <User2 size={18} className="opacity-80" />
                <span className="text-sm font-bold">{name || 'User'}</span>
            </div>

            {/* Shift Info Part */}
            <div className="flex items-center gap-3 px-4 py-1 border-r border-white/20">
                <Hourglass size={18} className="text-white/70" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-medium leading-tight opacity-90">Shift: {shiftName}</span>
                    <span className="text-[11px] font-bold leading-tight">Berjalan • Durasi {duration}</span>
                </div>
            </div>

            {/* Button Part */}
            <div className="px-2">
                <button 
                    onClick={onOpenClose}
                    className="bg-white text-gray-800 px-5 py-2 rounded-xl text-[11px] font-black uppercase hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                    Tutup Shift
                </button>
            </div>
        </div>
    );
};

export default function DashboardKasir() {
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [loading, setLoading] = useState(true)
    const [apiData, setApiData] = useState<any>(null)
    const [shiftOpen, setShiftOpen] = useState(false)
    const [shiftData, setShiftData] = useState<any>(null)
    const [showShiftForm, setShowShiftForm] = useState(false)
    const [showCloseShiftModal, setShowCloseShiftModal] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const [resDashboard, resShift] = await Promise.all([
            fetch('/api/frontend/kasir/dashboard', {
                credentials: 'include',
            }),
            fetch('/api/frontend/shifts/active', {
                credentials: 'include',
            }),
            ])
            const dataDashboard = await resDashboard.json()
            const dataActive = await resShift.json()

            setApiData(dataDashboard)
            
            if (resShift.ok && dataActive.active) {
            setShiftOpen(true)
            setShiftData(dataActive.shift)
            }

        } catch (error) {
            console.error("Fetch error:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        setIsClient(true)
        fetchData()
    }, [fetchData])

    const totalCash = useMemo(() => {
        const opening = Number(shiftData?.openingCash || 0)
        const cashIn = Number(apiData?.summary?.cashIn || 0)
        return opening + cashIn
    }, [shiftData, apiData])

    // PENAMBAHAN LOGIKA UNTUK MODAL TUTUP SHIFT
    const totalNonCash = useMemo(() => {
        const totalRevenue = Number(apiData?.summary?.revenue || 0)
        const cashIn = Number(apiData?.summary?.cashIn || 0)
        return totalRevenue - cashIn
    }, [apiData])

    if (!isClient) return null

    return (
        <div className="flex min-h-screen bg-[#52BFBE]">
            <Sidebar key="dashboard" />
            
            <div className="flex-1 flex flex-col ml-28">
                <HeaderKasir 
                    title="Dashboard" 
                    shiftName={shiftData?.shiftName || 'Shift: -'} 
                    onCloseShift={() => setShowCloseShiftModal(true)}
                />

            <main className="p-7 space-y-6">
            {/* HEADER SECTION: WELCOME TEXT & SHIFT INDICATOR SEJAJAR */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                {/* Sisi Kiri: Teks Selamat Datang */}
                <div>
                <h1 className="text-4xl font-bold text-white">Selamat Datang, Kasir</h1>
                <p className="text-sm text-white opacity-90">
                    Semangat meraih target hari ini!
                </p>
                </div>

                {/* Sisi Kanan: Shift Indicator */}
                {shiftOpen && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <ShiftStatusIndicator
                    name={shiftData?.cashier?.email || shiftData?.cashierEmail || "Memuat..."}
                    shiftName={shiftData?.shiftName || "-"}
                    startTime={shiftData?.openedAt}
                    onOpenClose={() => setShowCloseShiftModal(true)}
                    />
                </div>
                )}
            </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <ActionButton label="Buat Pesanan" icon={<PlusCircle />} color="bg-[#6A5AE0]" onClick={() => router.push('/dashboardKasir/transaksi')} />
                        <ActionButton label="Pesanan Berjalan" icon={<ClipboardList />} color="bg-[#FFB74D]" />
                        <ActionButton label="Riwayat Pembayaran" icon={<History />} color="bg-[#9E9E9E]" />
                        <ActionButton label="Cari Menu" icon={<Search />} color="bg-[#7986CB]"onClick={() => router.push('/dashboardKasir/menu')}  />
                        <ActionButton label="Kas Masuk/Keluar" icon={<CircleDollarSign />} color="bg-[#37474F]" />
                        <ActionButton label="Lihat Meja" icon={<Table />} color="bg-[#F06292]" onClick={() => router.push('/dashboardKasir/reservasi')} />
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Pesanan" value={apiData?.summary?.total || 0} />
                        <StatCard title="Pendapatan Hari Ini" value={`Rp ${apiData?.summary?.revenue?.toLocaleString() || 0}`} />
                        <StatCard title="Total Pax" value={apiData?.summary?.customers || 0} />
                        
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Kas Fisik</h3>
                            <div className="text-[11px] space-y-1 text-gray-600 border-b pb-2">
                                <div className="flex justify-between"><span>Modal Awal</span> <b>Rp {shiftData?.openingCash?.toLocaleString() || 0}</b></div>
                                <div className="flex justify-between"><span>Kas Masuk</span> <b>Rp {apiData?.summary?.cashIn?.toLocaleString() || 0}</b></div>
                                <div className="flex justify-between text-red-500"><span>Kas Keluar</span> <b>Rp 0</b></div>
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase">Total Kas</span>
                                <span className="text-base font-black text-gray-800">Rp {totalCash.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT SPLIT */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <SectionWrapper title="Status Pesanan">
                                <StatusItem label="Dalam Proses" value={apiData?.summary?.proses || 0} icon={<Hourglass className="text-amber-500" />} />
                                <StatusItem label="Selesai" value={apiData?.summary?.selesai || 0} icon={<CheckCircle className="text-green-500" />} />
                            </SectionWrapper>

                            <SectionWrapper title="Produk Terlaris">
                                {apiData?.popularProducts?.map((prod: any, i: number) => (
                                    <ProductItem key={i} name={prod.name} sub={`Dipesan ${prod.timesOrdered} kali`} />
                                ))}
                            </SectionWrapper>

                            <SectionWrapper title="Overview Meja">
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                    {apiData?.tables?.slice(0, 12).map((meja: any) => (
                                        <div key={meja.id} className={`h-12 rounded-lg border-2 flex items-center justify-center text-[10px] font-bold ${
                                            meja.status === 'isi' ? 'bg-blue-100 border-blue-400 text-blue-600' : 
                                            meja.status === 'kosong' ? 'bg-green-100 border-green-400 text-green-600' : 
                                            'bg-gray-100 border-gray-300 text-gray-400'
                                        }`}>
                                            {meja.name}
                                        </div>
                                    ))}
                                </div>
                            </SectionWrapper>
                        </div>

                        <div className="space-y-6">
                            <SectionWrapper title="Metode Pembayaran">
                                {apiData?.paymentDetails && Object.entries(apiData.paymentDetails).map(([method, detail]: any) => (
                                    <PaymentItem key={method} label={method} icon={PAYMENT_ICONS[method.toUpperCase()]} />
                                ))}
                            </SectionWrapper>

                            <SectionWrapper title="Stok Menipis">
                                {apiData?.lowStocks?.map((item: any, i: number) => (
                                    <ProductItem key={i} name={item.name} sub={`Sisa Stok: ${item.qty}`} isAlert />
                                ))}
                            </SectionWrapper>

                            <SectionWrapper title="Aktivitas Terbaru">
                                {apiData?.activities?.slice(0, 5).map((act: any) => (
                                    <div key={act.id} className="flex justify-between items-center p-3 border-b last:border-0 border-gray-50">
                                        <p className="text-xs text-gray-700 font-medium">{act.text}</p>
                                        <span className="text-[10px] text-gray-400">{new Date(act.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                ))}
                            </SectionWrapper>
                        </div>
                    </div>
                </main>
            </div>

            {/* MODALS */}
            {!loading && !shiftOpen && !showShiftForm && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl relative">
                        {/* Tombol X untuk menutup dan kembali ke dashboard */}
                        <button 
                            onClick={() => setShowShiftForm(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-teal-500" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 uppercase">Shift Terkunci</h2>
                        <p className="text-sm text-gray-500 mt-2 mb-8">Anda harus membuka shift terlebih dahulu untuk mulai berjualan.</p>
                        <button onClick={() => setShowShiftForm(true)} className="w-full bg-[#4DB6AC] hover:bg-teal-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
                            Buka Shift Sekarang
                        </button>
                    </div>
                </div>
            )}
            
            {showShiftForm && (
            <ShiftForm
                onSuccess={(shift) => {
                    setShowShiftForm(false);
                    setShiftOpen(true);
                    setShiftData(shift);
                    fetchData(); // Panggil ini untuk menyegarkan data dashboard
                }}
                onClose={() => setShowShiftForm(false)}
            />
                        )}

            {/* MODAL TUTUP SHIFT */}
            {showCloseShiftModal && shiftData && (
                <CloseShiftForm
                    shiftId={shiftData.id}
                    expectedCash={totalCash}
                    expectedNonCash={totalNonCash}
                    onClose={() => setShowCloseShiftModal(false)}
                    onSubmit={() => { // Pastikan di CloseShiftForm.tsx kamu memanggil onSubmit() setelah sukses
                        setShowCloseShiftModal(false);
                        setShiftOpen(false); // 🔥 TAMBAHKAN INI: Agar dashboard langsung tertutup
                        setShiftData(null);  // 🔥 TAMBAHKAN INI: Agar durasi berhenti
                        fetchData();         // Refresh data
                    }}
                />
            )}
        </div>
    )
}

/* ================= REUSABLE UI COMPONENTS ================= */

const ActionButton = ({ label, icon, color, onClick }: any) => (
    <button onClick={onClick} className={`${color} text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all`}>
        <div className="bg-white/20 p-2 rounded-xl">{React.cloneElement(icon, { size: 24 })}</div>
        <span className="text-[10px] font-bold uppercase text-center leading-tight tracking-wide">{label}</span>
    </button>
)

const StatCard = ({ title, value }: any) => (
    <div className="bg-white rounded-xl p-5 shadow-md flex flex-col justify-center min-h-[100px]">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-2xl font-black text-gray-800">{value}</p>
    </div>
)

const SectionWrapper = ({ title, children }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">{title}</h3>
            <button className="text-[11px] text-teal-500 font-bold hover:underline">Lihat Semua</button>
        </div>
        <div className="space-y-3">{children}</div>
    </div>
)

const StatusItem = ({ label, value, icon }: any) => (
    <div className="flex justify-between items-center p-4 border rounded-xl border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
            <span className="text-xs font-bold text-gray-700">{label}</span>
        </div>
        <span className="text-lg font-black text-teal-600">{value}</span>
    </div>
)

const PaymentItem = ({ label, icon }: any) => (
    <div className="flex justify-between items-center p-3 border rounded-xl border-gray-50 hover:border-teal-200 transition-all">
        <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
            <span className="text-xs font-bold text-gray-700 uppercase">{label}</span>
        </div>
        <span className="text-[9px] bg-teal-50 text-teal-600 px-2 py-1 rounded-full font-bold uppercase">Aktif</span>
    </div>
)

const ProductItem = ({ name, sub, isAlert }: any) => (
    <div className="flex justify-between items-center p-3 border rounded-xl border-gray-50 group hover:shadow-sm transition-all">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-100">
                <Image src="/api/placeholder/48/48" alt="prod" fill className="object-cover group-hover:scale-110 transition-transform" />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-800">{name}</p>
                <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
            </div>
        </div>
        <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase ${isAlert ? 'bg-red-50 text-red-500' : 'bg-teal-50 text-teal-600'}`}>
            {isAlert ? 'Stok Menipis' : 'Tersedia'}
        </span>
    </div>
)