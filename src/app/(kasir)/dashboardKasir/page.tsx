'use client'

import { useRouter } from 'next/navigation' 
import Sidebar from '@/components/SidebarKasir'
import React from 'react'; 
import HeaderKasir from '@/components/HeaderKasir'
import Link from 'next/link'
import Image from "next/image"; 
import {
    CreditCard,
    Wallet,
    Clock,
    ShoppingBag,
    Users,
    PlusCircle,
    Search,
    History,
    Table,
    ClipboardList,
    CircleDollarSign,
    Lock, 
    X,
    ScanLine, 
    Landmark, 
    HandCoins,
    Hourglass,    
    CheckCircle,  
    Ban,          
    Smartphone,   
} from 'lucide-react'
import { useEffect, useMemo, useState, useCallback } from 'react' 
import ShiftForm from './components/ShiftForm' 

// --- DATA PEMETAAN GAMBAR STATIS ---
const PRODUCT_IMAGE_MAP: { [key: string]: string } = {
    'Nasi Goreng Spesial': '/images/nasi_goreng_spesial.jpg', 
    'Es Kopi Susu': '/images/es_kopi_susu.jpg',           
    'Chicken Katsu': '/images/chicken_katsu.jpg',         
    'Cumi Saus Padang': '/images/cumi_saus_padang.jpg',    
    'diskon 20 persen': '/images/promo_20.jpg',           
    'diskon 30 persen': '/images/promo_30.jpg',           
};

// 💡 DATA PEMETAAN ICON UNTUK METODE PEMBAYARAN
const PAYMENT_METHOD_ICONS: { [key: string]: React.ReactElement } = {
    'QRIS': <ScanLine size={20} className="text-green-600" />,
    'Cash': <HandCoins size={20} className="text-blue-600" />,
    'E-wallet': <Smartphone size={20} className="text-purple-600" />, 
    'Transfer': <Landmark size={20} className="text-indigo-600" />, 
    'Credit Card': <CreditCard size={20} className="text-red-600" />,
    'Unknown': <Wallet size={20} className="text-gray-500" />, 
};

// 💡 DATA PEMETAAN ICON UNTUK STATUS PESANAN
const ORDER_STATUS_ICONS: { [key: string]: React.ReactElement } = {
    'dalam_proses': <Hourglass size={20} className="text-yellow-600" />,
    'selesai': <CheckCircle size={20} className="text-green-600" />,
    'dibatalkan': <Ban size={20} className="text-red-600" />,
};


export default function DashboardKasir() {
    const router = useRouter() 

    // ====== STATE SHIFT ======
    const [shiftOpen, setShiftOpen] = useState(false)
    const [shiftStart, setShiftStart] = useState<Date | null>(null)
    const [shiftEnd, setShiftEnd] = useState<Date | null>(null)
    const [now, setNow] = useState<Date | null>(null) 
    const [isClient, setIsClient] = useState(false)

    // ====== STATE UNTUK FORM & ALERT SHIFT ======
    const [showShiftAlert, setShowShiftAlert] = useState(true) 
    const [showShiftForm, setShowShiftForm] = useState(false) 
    
    const [initialCapital, setInitialCapital] = useState(0) 
    const [currentShiftName, setCurrentShiftName] = useState('N/A') 

    // ====== IDENTITAS ======
    const kasirName = 'Ruby Nana'
    
    // --- Data Dummy ---
    const staticNow = useMemo(() => new Date(), [])
    const [transactions, setTransactions] = useState<Array<any>>([
        { id: 1, status: 'selesai', amount: 45000, payment: 'QRIS', table: 1, time: staticNow },
        { id: 2, status: 'dalam_proses', amount: 60000, payment: 'Cash', table: 4, time: staticNow },
        { id: 3, status: 'dibatalkan', amount: 30000, payment: 'E-wallet', table: 6, time: staticNow },
        { id: 4, status: 'selesai', amount: 120000, payment: 'Transfer', table: 2, time: staticNow },
        { id: 5, status: 'selesai', amount: 20000, payment: 'Cash', table: 10, time: staticNow },
    ])

    // ✅ STATE: Lantai yang sedang dilihat
    const [selectedFloor, setSelectedFloor] = useState('Lantai 1'); 

    // ✅ DATA: Setiap lantai memiliki 9 meja
    const [tables] = useState([
        // Lantai 1 (Total: 9 Meja)
        { id: 1, floor: 'Lantai 1', name: 'Bar', status: 'terisi', pax: 1, customer: 'John Doe' },
        { id: 2, floor: 'Lantai 1', name: 'A1', status: 'kosong', pax: 0 },
        { id: 3, floor: 'Lantai 1', name: 'A2', status: 'terisi', pax: 1, customer: 'John Doe' },
        { id: 4, floor: 'Lantai 1', name: 'B1', status: 'terisi', pax: 4, customer: 'Keluarga Budi' },
        { id: 5, floor: 'Lantai 1', name: 'B2', status: 'kosong', pax: 0 },
        { id: 6, floor: 'Lantai 1', name: 'B3', status: 'menunggu_bayar', pax: 2, customer: 'Jane Smith' },
        { id: 7, floor: 'Lantai 1', name: 'C1', status: 'kosong', pax: 0 },
        { id: 8, floor: 'Lantai 1', name: 'C2', status: 'kosong', pax: 0 },
        { id: 17, floor: 'Lantai 1', name: 'D3', status: 'terisi', pax: 3, customer: 'Grup 3' }, 

        // Lantai 2 (Total: 9 Meja)
        { id: 9, floor: 'Lantai 2', name: 'D1', status: 'terisi', pax: 4, customer: 'Marketing Team' },
        { id: 10, floor: 'Lantai 2', name: 'D2', status: 'kosong', pax: 0 },
        { id: 11, floor: 'Lantai 2', name: 'E1', status: 'terisi', pax: 3, customer: 'Mr. Budi' },
        { id: 12, floor: 'Lantai 2', name: 'E2', status: 'kosong', pax: 0 },
        { id: 13, floor: 'Lantai 2', name: 'F1', status: 'terisi', pax: 2, customer: 'Pasangan Muda' },
        { id: 18, floor: 'Lantai 2', name: 'D3', status: 'kosong', pax: 0 }, 
        { id: 19, floor: 'Lantai 2', name: 'D4', status: 'menunggu_bayar', pax: 4, customer: 'Dinar' }, 
        { id: 20, floor: 'Lantai 2', name: 'D5', status: 'kosong', pax: 0 }, 
        { id: 21, floor: 'Lantai 2', name: 'D6', status: 'terisi', pax: 6, customer: 'Rapat Kecil' }, 

        // Lantai 3 (Total: 9 Meja)
        { id: 14, floor: 'Lantai 3', name: 'VIP A', status: 'kosong', pax: 0 },
        { id: 15, floor: 'Lantai 3', name: 'VIP B', status: 'terisi', pax: 5, customer: 'Private Event' },
        { id: 16, floor: 'Lantai 3', name: 'VIP C', status: 'kosong', pax: 0 },
        { id: 22, floor: 'Lantai 3', name: 'VIP D', status: 'terisi', pax: 8, customer: 'Birthday Party' }, 
        { id: 23, floor: 'Lantai 3', name: 'VIP E', status: 'kosong', pax: 0 }, 
        { id: 24, floor: 'Lantai 3', name: 'VIP F', status: 'kosong', pax: 0 }, 
        { id: 25, floor: 'Lantai 3', name: 'VIP G', status: 'terisi', pax: 4, customer: 'Investor' }, 
        { id: 26, floor: 'Lantai 3', name: 'VIP H', status: 'menunggu_bayar', pax: 2, customer: 'Febri' }, 
        { id: 27, floor: 'Lantai 3', name: 'VIP I', status: 'kosong', pax: 0 }, 
    ]);

    const [stocks] = useState([
        { id: 1, name: 'Chicken Parmesan', qty: 2, threshold: 5 },
        { id: 2, name: 'French Fries', qty: 0, threshold: 10 },
        { id: 3, name: 'Ice Tea', qty: 3, threshold: 5 },
        { id: 4, name: 'Nasi Goreng', qty: 8, threshold: 5 },
    ])

    const [activities, setActivities] = useState<Array<{ id: number; text: string; time: Date }>>([
        { id: 1, text: 'Dashboard dibuka', time: staticNow },
    ])

    // Data Produk Populer dengan path gambar
    const [popularProducts] = useState([
        { name: 'Nasi Goreng Spesial', timesOrdered: 125, imagePath: PRODUCT_IMAGE_MAP['Nasi Goreng Spesial'] },
        { name: 'Es Kopi Susu', timesOrdered: 98, imagePath: PRODUCT_IMAGE_MAP['Es Kopi Susu'] },
        { name: 'Chicken Katsu', timesOrdered: 70, imagePath: PRODUCT_IMAGE_MAP['Chicken Katsu'] },
        { name: 'Cumi Saus Padang', timesOrdered: 65, imagePath: PRODUCT_IMAGE_MAP['Cumi Saus Padang'] },
    ]);

    // ====== TIMER & Mount Flag ======
    useEffect(() => {
        setNow(new Date()) 
        setIsClient(true) 
        const t = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(t)
    }, [])
    
    useEffect(() => {
        if (!shiftOpen) {
            setShowShiftAlert(true)
        }
    }, [shiftOpen])


    // ====== COMPUTED TRANSACTION SUMMARY ======
    const summary = useMemo(() => {
        const total = transactions.length
        const selesai = transactions.filter((t) => t.status === 'selesai').length
        const proses = transactions.filter((t) => t.status === 'dalam_proses').length
        const batal = transactions.filter((t) => t.status === 'dibatalkan').length 
        const revenue = transactions.filter((t) => t.status === 'selesai').reduce((s, t) => s + t.amount, 0)
        
        const cashIn = transactions
            .filter((t) => t.status === 'selesai' && t.payment === 'Cash')
            .reduce((s, t) => s + t.amount, 0)
            
        const customers = tables.filter(t => t.status !== 'kosong').reduce((s, t) => s + t.pax, 0); 
        return { total, selesai, proses, batal, revenue, customers, cashIn }
    }, [transactions, tables])

    // ====== PAYMENT DETAILS ======
    const paymentDetails = useMemo(() => {
        const map: Record<string, { count: number; total: number }> = {}
        transactions.forEach((t) => {
            const key = t.payment || 'Unknown'
            if (!map[key]) map[key] = { count: 0, total: 0 }
            map[key].count++
            if (t.status === 'selesai') map[key].total += t.amount
        })
        return map
    }, [transactions])

    const filteredTables = useMemo(() => {
        return tables.filter(t => t.floor === selectedFloor);
    }, [tables, selectedFloor]);
    
    // ====== LOW STOCKS ======
    const lowStocks = stocks.filter((s) => s.qty <= s.threshold)

    // ====== SHIFT ACTIONS ======
    const openShift = (capital: number, shift: string, note: string) => {
        const started = new Date()
        setShiftOpen(true)
        setShiftStart(started)
        setShiftEnd(null)
        setShowShiftForm(false) 
        setShowShiftAlert(false) 
        setInitialCapital(capital) 
        setCurrentShiftName(shift) 
        pushActivity(`Shift ${shift} dibuka oleh ${kasirName} dengan Modal Awal Rp ${formatNumber(capital)}. Catatan: ${note || '-'}`)
    }

    const closeShift = () => {
        const ended = new Date()
        setShiftOpen(false)
        setShiftEnd(ended)
        setShowShiftAlert(true) 
        setInitialCapital(0) 
        setCurrentShiftName('N/A') 
        pushActivity(`Shift ${currentShiftName} ditutup oleh ${kasirName} pada ${formatTime(ended)}`)
    }

    const toggleShift = () => {
        if (shiftOpen) {
            closeShift()
        } else {
            setShowShiftForm(true) 
        }
    }

    // Handle klik tombol 'Buka Shift' dari alert
    const handleOpenShiftAlert = () => {
        setShowShiftAlert(false)
        setShowShiftForm(true)
    }

    const handleCloseShiftForm = useCallback(() => {
        if (!shiftOpen) {
            setShowShiftForm(false)
            setShowShiftAlert(true) 
        } else {
            setShowShiftForm(false)
        }
    }, [shiftOpen])


    // ====== UTILITY: push activity ======
    function pushActivity(text: string) {
        setActivities((prev) => [{ id: Date.now(), text, time: new Date() }, ...prev].slice(0, 20))
    }

    // ====== UTILITY: format duration ======
    function formatDuration(from: Date | null, to: Date | null = now) {
        if (!from || !to) return '- - : - - : - -' 
        
        const diff = Math.max(0, Math.floor((to.getTime() - from.getTime()) / 1000))
        const h = Math.floor(diff / 3600)
        const m = Math.floor((diff % 3600) / 60)
        const s = diff % 60
        return `${pad(h)}:${pad(m)}:${pad(s)}`
    }
    function pad(n: number) {
        return n.toString().padStart(2, '0')
    }
    // UTILITY: format time (digunakan di Activity Log)
    function formatTime(d: Date) {
        return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }

    // ====== SIMULATE: add dummy transaction (for demo) ======
    const addDummyTransaction = (opt: { status?: string; amount?: number; payment?: string; table?: number }) => {
        if (!shiftOpen) {
            alert('Shift belum dibuka. Buka shift terlebih dahulu untuk menambah transaksi.')
            return
        }

        const t = {
            id: Date.now(),
            status: opt.status || 'selesai',
            amount: opt.amount ?? 50000,
            payment: opt.payment ?? 'QRIS',
            table: opt.table ?? Math.floor(Math.random() * 20) + 1, 
            time: new Date(),
        }
        setTransactions((p) => [t, ...p].slice(0, 200))
        pushActivity(`Transaksi baru: ${t.id} (${t.payment}) Rp ${formatNumber(t.amount)}`)
    }

    const totalCash = initialCapital + summary.cashIn

    // Render Alert Pop-up (saat shift belum dibuka)
    const ShiftAlert = () => (

        <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center px-4"
        > 
            <div className="bg-white rounded-xl shadow-2xl p-10 text-center w-full max-w-sm z-50 relative">
                <Lock size={48} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Shift Belum Dibuka</h3>
                <p className="text-gray-600 mb-6">Silakan buka shift sebelum melanjutkan.</p>
                <button
                    onClick={handleOpenShiftAlert}
                    className="bg-[#52BFBE] hover:bg-[#3FA3A2] text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                    Buka Shift
                </button>
            </div>
        </div>
    )

    const isLocked = showShiftForm || (showShiftAlert && !shiftOpen)

    // ====== JSX ======
    return (
        <div className="flex min-h-screen bg-[#52bfbe] relative">

            {/* 1. Pop-ups */}
            {showShiftForm && <ShiftForm onOpen={openShift} onClose={handleCloseShiftForm} />} 
            
            {/* Tampilkan Alert hanya jika shift belum buka DAN form tidak sedang tampil */}
            {showShiftAlert && !shiftOpen && !showShiftForm && <ShiftAlert />}

            {/* Container utama untuk Dashboard */}
            <div className={`flex flex-1 z-0 ${isLocked ? 'pointer-events-none' : ''}`}>

                
                {/* Sidebar */}
                <Sidebar />

                {/* Flex-grow untuk Main Content Area */}
                <div className="flex-1 flex flex-col">
                    
                    {/* HEADER */}
                    <div className="flex items-center justify-between pr-6 pt-10 ml-28"> 
                        <HeaderKasir title="Dashboard Kasir" />
                    

                        {/* SHIFT PANEL */}
                        <div className="flex items-center gap-5 bg-[#737373] px-5 py-3 rounded-xl shadow text-white">
                            <div className="flex items-center gap-2">
                                <Users size={18} />
                                <span className="font-medium">{kasirName}</span>
                            </div>

                            <div className="border-r h-6 opacity-40"></div>

                            <div className="flex items-center gap-2">
                                <Clock size={18} />
                                <div className="text-sm">
                                    <div>Shift: <span className="font-medium">{currentShiftName}</span></div>
                                    <div className="text-xs opacity-90">
                                        {shiftOpen 
                                            ? `Berjalan • Durasi ${isClient ? formatDuration(shiftStart) : '- - : - - : - -'}` 
                                            : shiftStart 
                                                ? `Terakhir: ${isClient ? formatTime(shiftStart) : '- - : - - : - -'}` 
                                                : 'Belum dibuka'}
                                    </div>
                                </div>
                            </div>

                            <div className="border-r h-6 opacity-40"></div>

                            <button
                                onClick={toggleShift}
                                disabled={showShiftForm} 
                                className={`px-4 py-1 rounded-md font-medium transition ${shiftOpen ? 'bg-white text-gray-700 border border-gray-300' : 'bg-green-600 text-white'}`}
                            >
                                {shiftOpen ? 'Tutup Shift' : 'Buka Shift'}
                            </button>
                        </div>
                    </div>

                    {/* Konten Utama */}
                    <main className="flex-1 flex flex-col ml-28"> 
                        {/* CONTENT */}
                        <div className="p-6 space-y-6">
                            {/* QUICK ACTIONS */}
                            <QuickActions
                                onSimulateNew={() => addDummyTransaction({ status: 'selesai', amount: 75000, payment: 'QRIS' })}
                            />

                            {/* SUMMARY CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <SummaryCard title="Total Pesanan" value={summary.total} icon={<ShoppingBag size={28} className="text-[#2DB2AE]" />} />
                                <SummaryCard title="Pendapatan Hari Ini" value={`Rp ${formatNumber(summary.revenue)}`} icon={<CreditCard size={28} className="text-[#2DB2AE]" />} />
                                <SummaryCard title="Total Pax (Duduk)" value={summary.customers} icon={<Users size={28} className="text-[#2DB2AE]" />} />
                                <div className="bg-white rounded-xl shadow p-5 border-l-4 border-[#2DB2AE]">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-black-800">Kas Fisik</h3>
                                        <Wallet size={28} className="text-[#2DB2AE]" />
                                    </div>
                                    <div className="space-y-1 text-sm text-black-700">
                                        <p><span className="font-medium">Modal Awal:</span> Rp {formatNumber(initialCapital)}</p>
                                        <p><span className="font-medium">Kas Masuk (Cash):</span> Rp {formatNumber(summary.cashIn)}</p>
                                        <p><span className="font-medium">Kas Keluar:</span> Rp 0</p>
                                        <div className="pt-2 mt-2 border-t border-gray-100">
                                            <p className="font-bold text-base"><span className="font-medium">Total Kas:</span> Rp {formatNumber(totalCash)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* STATUS & PAYMENT DETAIL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Panel title="Status Pesanan">
                                    <StatusItem 
                                        label="Dalam Proses" 
                                        value={summary.proses} 
                                        statusKey="dalam_proses"
                                    />
                                    <StatusItem 
                                        label="Selesai" 
                                        value={summary.selesai} 
                                        statusKey="selesai"
                                    />
                                    <StatusItem 
                                        label="Dibatalkan" 
                                        value={summary.batal} 
                                        valueClass="text-red-500" 
                                        statusKey="dibatalkan"
                                    />
                                </Panel>

                                <Panel title="Metode Pembayaran (Detail)">
                                    <div className="space-y-2">
                                        {Object.keys(paymentDetails).length === 0 && <p className="text-sm text-gray-500">Belum ada transaksi</p>}
                                        {Object.entries(paymentDetails).map(([method, data]) => (
                                            <div key={method} className="flex justify-between items-center p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {PAYMENT_METHOD_ICONS[method] || PAYMENT_METHOD_ICONS['Unknown']}
                                                    <p className="font-medium">{method}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">{data.count} transaksi</p>
                                                    <p className="font-semibold">Rp {formatNumber(data.total)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Panel>
                            </div>

                            {/* PRODUCTS + STOCKS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    {/* MENGGUNAKAN DATA POPULAR PRODUCTS DENGAN GAMBAR */}
                                    <ProductList 
                                        title="Produk Terlaris" 
                                        products={popularProducts} 
                                    />
                                    <div className="bg-white rounded-xl shadow p-5">
                                        <h3 className="font-semibold text-[#3FA3A2] mb-3">Promo Berlangsung</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* MENGGUNAKAN IMAGE PATH */}
                                            <PromoCard discount={20} imagePath={PRODUCT_IMAGE_MAP['diskon 20 persen']} />
                                            <PromoCard discount={30} imagePath={PRODUCT_IMAGE_MAP['diskon 30 persen']} />
                                        </div>
                                    </div>
                                </div>

                                {/* STOCK PANEL */}
                                <div className="bg-white rounded-xl shadow p-5 h-full">
                                    <h3 className="font-semibold text-[#3FA3A2] mb-3">Stok Menipis / Habis</h3>
                                    <div className="space-y-2">
                                        {lowStocks.length === 0 && <p className="text-sm text-gray-500">Tidak ada stok menipis</p>}
                                        {lowStocks.map((s) => (
                                            <div key={s.id} className="flex justify-between items-center p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{s.name}</p>
                                                    <p className="text-xs text-gray-500">Stok: {s.qty} (threshold {s.threshold})</p>
                                                </div>
                                                <div className={`text-sm font-semibold ${s.qty === 0 ? 'text-red-500' : 'text-yellow-600'}`}>
                                                    {s.qty === 0 ? 'Habis' : 'Menipis'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* TABLE OVERVIEW + ACTIVITY LOG */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 bg-white rounded-xl shadow p-5">
                                    <h3 className="font-semibold text-[#3FA3A2] mb-4">Overview Meja</h3>
                                    
                                    <div className="flex space-x-2 mb-4">
                                        {['Lantai 1', 'Lantai 2', 'Lantai 3'].map((floor) => (
                                            <button
                                                key={floor}
                                                onClick={() => setSelectedFloor(floor)}
                                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                                    selectedFloor === floor 
                                                        ? 'bg-[#52BFBE] text-white shadow-md' 
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {floor}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className="grid grid-cols-4 gap-3">
                                        {filteredTables.map((t) => (
                                            <div key={t.id} 
                                                // Logika styling berdasarkan status
                                                className={`p-3 rounded-lg text-sm border flex flex-col items-center justify-center text-center 
                                                ${t.status === 'kosong' ? 'bg-white border-gray-300 hover:shadow-sm cursor-pointer' 
                                                  : t.status === 'terisi' ? 'bg-[#fffbf0] border-yellow-500 shadow-lg cursor-pointer' 
                                                  : 'bg-[#fff7f7] border-red-500 shadow-lg cursor-pointer'}`
                                                }>
                                                <div className="font-bold text-gray-800">{t.name}</div>
                                                <div className={`text-xs opacity-90 font-medium ${t.status === 'kosong' ? 'text-gray-500' : 'text-gray-700'}`}>
                                                    {statusLabel(t.status)}
                                                </div>
                                                {/* Tampilkan Pax dan Customer hanya jika meja terisi/menunggu bayar */}
                                                {t.status !== 'kosong' && (
                                                    <>
                                                        <div className="text-xs text-gray-500 mt-1">Pax: {t.pax}</div>
                                                        {/* Tambahkan nama customer jika ada */}
                                                        {t.customer && <div className="text-xs text-gray-400 italic truncate w-full px-1">({t.customer})</div>}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow p-5 h-full flex flex-col">
                                    <h3 className="font-semibold text-[#3FA3A2] mb-4">Aktivitas Terbaru</h3>
                                    <div className="space-y-2 max-h-100 overflow-y-auto pr-2">
                                        {activities.map((a) => (
                                            <div key={a.id} className="text-sm border rounded-lg p-2">
                                                <div className="text-xs text-gray-500">{isClient ? formatTime(a.time) : '- - : - -'}</div>
                                                <div>{a.text}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}


const QuickActions = ({ onSimulateNew }: any) => {
    const items = [
        { label: 'Pesanan Baru', icon: <PlusCircle size={22} />, bgColor: 'bg-blue-600', hoverColor: 'hover:bg-blue-700' },
        
        { label: 'Pesanan Berjalan', icon: <ClipboardList size={22} />, bgColor: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600' },
        
        { label: 'Riwayat Pembayaran', icon: <History size={22} />, bgColor: 'bg-gray-500', hoverColor: 'hover:bg-gray-600' },
        
        { label: 'Cari Menu', icon: <Search size={22} />, bgColor: 'bg-indigo-500', hoverColor: 'hover:bg-indigo-600' },
        
        { label: 'Kas Masuk/Keluar', icon: <CircleDollarSign size={22} />, bgColor: 'bg-gray-700', hoverColor: 'hover:bg-gray-700' },
        
        { label: 'Lihat Meja', icon: <Table size={22} />, bgColor: 'bg-pink-500', hoverColor: 'hover:bg-pink-600' },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {items.map((item, i) => (
                <button 
                    key={i} 
                    className={`flex flex-col items-center justify-center p-3 rounded-xl shadow text-white transition ${item.bgColor} ${item.hoverColor}`}
                >
                    {item.icon}
                    <span className="text-xs mt-2 font-medium">{item.label}</span>
                </button>
            ))}
            {/* Tombol demo: menambahkan transaksi (Merah/Khusus, dipertahankan) */}
            <button 
                onClick={onSimulateNew} 
                className="col-span-2 md:col-span-1 flex items-center gap-2 justify-center p-3 rounded-xl shadow bg-red-500 hover:bg-red-600 text-white transition"
            >
                <PlusCircle size={18} />
                <span className="text-xs font-medium">Simulasi Transaksi</span>
            </button>
        </div>
    )
}

const SummaryCard = ({ title, value, icon }: any) => (
    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-[#2DB2AE]">
        <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-600">{title}</h3>
            {icon}
        </div>
        <p className="text-3xl font-bold">{value}</p>
    </div>
)

const Panel = ({ title, children }: any) => (
    <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-[#3FA3A2] mb-4">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
)

const StatusItem = ({ label, value, valueClass = 'text-[#2DB2AE]', statusKey }: { label: string, value: number, valueClass?: string, statusKey: string }) => {
    const icon = ORDER_STATUS_ICONS[statusKey] || <ClipboardList size={20} className="text-gray-500" />;
    return (
        <div className="flex justify-between items-center p-3 border rounded-lg">
            <div className="flex items-center gap-3">
                {icon}
                <p>{label}</p>
            </div>
            <span className={`font-semibold ${valueClass}`}>{value}</span>
        </div>
    );
};


const ProductList = ({ title, products }: { title: string, products: Array<{ name: string, timesOrdered: number, imagePath: string }> }) => (
    <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-[#3FA3A2]">{title}</h3>
            <Link href="#" className="text-[#52BFBE] text-sm font-medium hover:underline">
                Lihat Semua →
            </Link>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {products.map((product, i) => (
                <div key={i} className="flex items-center justify-between border rounded-lg p-3 hover:bg-[#E8F9F9] transition">
                    <div className="flex items-center gap-3">
                        {/* IMPLEMENTASI GAMBAR PRODUK */}
                        <div className="w-[45px] h-[45px] bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-600 overflow-hidden relative flex-shrink-0">
                            {product.imagePath ? (
                                <Image
                                    src={product.imagePath}
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="45px" 
                                />
                            ) : (
                                <span className="text-xs text-gray-500">No Img</span>
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">Dipesan {product.timesOrdered} kali</p>
                        </div>
                    </div>

                    <span className="text-sm font-semibold text-[#52BFBE]">Tersedia</span>
                </div>
            ))}
        </div>
    </div>
)

const PromoCard = ({ discount, imagePath }: { discount: number, imagePath?: string }) => (
    <div className="relative w-full h-28 rounded-xl overflow-hidden shadow">
        <div className="absolute inset-0 z-0">
            {imagePath ? (
                <Image
                    src={imagePath}
                    alt={`Diskon ${discount}%`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw" 
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 italic text-xs">
                    No Promo Image
                </div>
            )}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#dff8f7]/80 to-[#f6fffe]/80 z-10" />
        
        <div className="absolute top-3 left-3 px-3 py-1 rounded-md z-20">
            <p className="text-black text-lg font-bold leading-tight">
                Diskon <br /> hingga {discount}%
            </p>
            <p className="text-xs text-gray-700 mt-1">Spesial Hari Ini!</p>
        </div>
    </div>
)

/* -------------------------
    Helpers
    ------------------------- */
function formatNumber(n: number) {
    return n.toLocaleString('id-ID')
}

function statusLabel(s: string) {
    if (s === 'kosong') return 'Kosong'
    if (s === 'terisi') return 'Terisi'
    if (s === 'menunggu_bayar') return 'Menunggu Bayar'
    return s
}