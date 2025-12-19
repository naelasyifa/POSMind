'use client'

import { DollarSign, Clock, X, Info, Scale, ArrowDown, ArrowUp, Calculator } from 'lucide-react' 
import React, { useState, useMemo } from 'react'

// --- MOCK DATA & UTILITY ---
// Nilai MOCK Non-Tunai yang akan digunakan jika props yang masuk adalah 0 atau null
const MOCK_EXPECTED_NON_CASH = 5500000; 
const MOCK_EXPECTED_CASH = 4690000;

const DENOMINATIONS = [
    { value: 100000, label: 'Rp 100.000' },
    { value: 50000, label: 'Rp 50.000' },
    { value: 20000, label: 'Rp 20.000' },
    { value: 10000, label: 'Rp 10.000' },
    { value: 5000, label: 'Rp 5.000' },
    { value: 1000, label: 'Rp 1.000' },
];

const formatRupiah = (number: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);

interface DenominationCounts {
    [key: number]: string; 
}

// --- KOMPONEN UTAMA ---
interface CloseShiftFormProps {
    expectedCash: number; 
    expectedNonCash?: number;
    shiftId: string;
    onClose: () => void;
    onSubmit: (actualCash: number, note: string, settlementConfirmed: boolean, actualNonCash: number) => void; 
}

export default function CloseShiftForm({ 
    expectedCash, 
    expectedNonCash,
    shiftId, 
    onClose, 
    onSubmit,
}: CloseShiftFormProps) {
    
    // State untuk input
    const [counts, setCounts] = useState<DenominationCounts>(
        DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom.value]: '' }), {})
    );
    const [cashierNote, setCashierNote] = useState('');
    const [error, setError] = useState<string | null>(null);

    // State untuk Non-Tunai
    const [isSettlementConfirmed, setIsSettlementConfirmed] = useState(false); 

    // PERBAIKAN UTAMA: Gunakan MOCK_EXPECTED_NON_CASH jika nilai prop expectedNonCash adalah 0
    const nonCashFromParent = expectedNonCash || MOCK_EXPECTED_NON_CASH; 
    
    // Non-Tunai Aktual (Settlement) diambil langsung dari expected Non-Cash
    const settlementActual = nonCashFromParent; 

    // --- LOGIKA PERHITUNGAN KAS TUNAI ---
    const actualCash = useMemo(() => {
        return DENOMINATIONS.reduce((sum, denom) => {
            const count = parseInt(counts[denom.value] || '0');
            return sum + (denom.value * count);
        }, 0);
    }, [counts]);
    
    const difference = actualCash - expectedCash;
    const isShort = difference < 0;
    const status = difference === 0 ? 'MATCH' : isShort ? 'SHORTAGE (Kurang)' : 'SURPLUS (Lebih)';

    // --- LOGIKA PERHITUNGAN NON-TUNAI ---
    // nonCashDifference dihitung dari nonCashFromParent (yang kini sudah dipastikan bukan 0)
    const nonCashDifference = settlementActual - nonCashFromParent; 
    const nonCashIsShort = nonCashDifference < 0;
    const nonCashStatus = nonCashDifference === 0 ? 'MATCH (Sesuai)' : nonCashIsShort ? 'SHORTAGE (Kurang)' : 'SURPLUS (Lebih)';

    // --- HANDLERS ---
    const handleCountChange = (value: number, newValue: string) => {
        const cleanValue = newValue.replace(/\D/g, '');
        setCounts(prevCounts => ({
            ...prevCounts,
            [value]: cleanValue,
        }));
        setError(null);
    };

    const handleSubmit = () => {
        // ... (Validasi Kas Tunai Tetap Sama) ...
        if (actualCash === 0 && expectedCash > 0) {
            setError('Anda harus menghitung dan memasukkan kas fisik. Total kas tidak boleh nol jika ada ekspektasi kas.');
            return;
        }

        if (Math.abs(difference) > 100 && cashierNote.trim().length < 10) {
            setError('Terdapat selisih kas tunai yang signifikan. Catatan Kasir wajib diisi minimal 10 karakter untuk menjelaskan perbedaan ini.');
            return;
        }
        
        // Validasi Konfirmasi Settlement Non-Tunai
        if (!isSettlementConfirmed) {
            setError('Anda harus mengkonfirmasi Settlement Non-Tunai sebelum menutup shift.');
            return;
        }

        // Validasi Catatan Kasir (untuk Non-Tunai, jika selisihnya signifikan)
        if (Math.abs(nonCashDifference) > 100 && cashierNote.trim().length < 10) {
            setError('Terdapat selisih non-tunai yang signifikan. Catatan Kasir wajib diisi minimal 10 karakter untuk menjelaskan perbedaan ini.');
            return;
        }

        setError(null);
        onSubmit(actualCash, cashierNote, isSettlementConfirmed, settlementActual); 
    };

    // --- RENDER ---
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={onClose} 
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl mx-4 transform transition-all duration-300 scale-100 opacity-100 relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ... (Header dan Error Message) ... */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={20} />
                </button>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Penutupan Shift Kasir</h2>
                <p className="text-center text-sm text-gray-500 mb-6 flex items-center justify-center">
                    <Clock size={16} className="mr-1 text-indigo-500" /> ID Shift: **{shiftId}** | Mohon hitung kas fisik dengan teliti.
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm font-medium" role="alert">
                        {error}
                    </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* KOLOM KIRI: INPUT DENOMINASI */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-indigo-700 flex items-center border-b pb-2">
                            <DollarSign className="w-5 h-5 mr-2" /> Input Rincian Kas Tunai Fisik
                        </h3>
                        
                        {/* Tabel Denominasi (Tidak Berubah) */}
                        <div className="overflow-x-auto border rounded-lg shadow-inner">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pecahan</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Jumlah Lembar/Koin</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {DENOMINATIONS.map((denom) => {
                                        const count = parseInt(counts[denom.value] || '0');
                                        const subtotal = denom.value * count;
                                        return (
                                            <tr key={denom.value}>
                                                <td className="px-6 py-2 text-sm font-medium text-gray-800">{denom.label}</td>
                                                <td className="px-6 py-2 text-center">
                                                    <input
                                                        type="text" 
                                                        pattern="[0-9]*" 
                                                        min="0"
                                                        value={counts[denom.value]}
                                                        onChange={(e) => handleCountChange(denom.value, e.target.value)}
                                                        className="w-24 border border-gray-300 rounded-md p-1 text-sm text-center focus:ring-indigo-500 focus:border-indigo-500"
                                                        placeholder="0"
                                                    />
                                                </td>
                                                <td className="px-6 py-2 text-right text-sm font-semibold">{formatRupiah(subtotal)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* TOTAL KAS ACTUAL (Tidak Berubah) */}
                        <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg shadow-md flex justify-between items-center">
                            <div className="flex items-center">
                                <Calculator className="w-6 h-6 mr-3 text-green-700" />
                                <p className="text-lg font-bold text-green-800">TOTAL KAS FISIK (ACTUAL)</p>
                            </div>
                            <p className="text-2xl font-extrabold text-green-800">
                                {formatRupiah(actualCash)}
                            </p>
                        </div>
                    </div>

                    {/* KOLOM KANAN: RINGKASAN AUDIT & CATATAN */}
                    <div className="lg:col-span-1 space-y-4">
                        
                        {/* 1. Ringkasan Audit Tunai (Tidak Berubah) */}
                        <div className={`p-4 rounded-lg shadow-md ${Math.abs(difference) > 100 ? 'bg-red-100 border border-red-400' : 'bg-green-100 border border-green-400'}`}>
                            <h4 className="font-bold text-gray-800 mb-2">Ringkasan Audit Tunai</h4>
                            <div className="space-y-1 text-sm">
                                <p className="flex justify-between font-medium">Kas Harapan (Sistem): 
                                    <span className="text-indigo-700 font-bold">{formatRupiah(expectedCash)}</span>
                                </p>
                                <p className="flex justify-between font-medium">Kas Aktual (Input): 
                                    <span className="text-green-700 font-bold">{formatRupiah(actualCash)}</span>
                                </p>
                                <hr className="my-2 border-gray-300"/>
                                <p className={`flex justify-between text-lg font-extrabold ${Math.abs(difference) > 100 ? 'text-red-600' : 'text-green-600'}`}>
                                    SELISIH
                                    <span className="flex items-center">
                                        {Math.abs(difference) > 0 && (isShort ? <ArrowDown size={18} className="mr-1"/> : <ArrowUp size={18} className="mr-1"/>)}
                                        {formatRupiah(Math.abs(difference))} 
                                    </span>
                                </p>
                                <span className={`text-xs block text-right font-semibold ${Math.abs(difference) > 100 ? 'text-red-500' : 'text-green-500'}`}>
                                    {status}
                                </span>
                            </div>
                        </div>

                        {/* 2. Ringkasan Audit Non-Tunai (MENGGUNAKAN nonCashFromParent) */}
                        <div className={`p-4 rounded-lg shadow-md ${Math.abs(nonCashDifference) > 100 ? 'bg-red-100 border border-red-400' : 'bg-green-100 border border-green-400'}`}>
                            <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                                <Scale className="w-4 h-4 mr-2 text-blue-500" /> Audit Non-Tunai (Data Sistem)
                            </h4>
                            <div className="space-y-1 text-sm">
                                <p className="flex justify-between font-medium">Total Non-Tunai (Expected): 
                                    {/* Menggunakan nonCashFromParent */}
                                    <span className="text-indigo-700 font-bold">{formatRupiah(nonCashFromParent)}</span>
                                </p>
                                <div className="flex justify-between items-center bg-blue-50 p-2 rounded">
                                    <label className="font-bold text-blue-700">Settlement (Aktual Otomatis):</label>
                                    <span className="text-blue-700 font-extrabold">
                                        {/* Menggunakan settlementActual */}
                                        {formatRupiah(settlementActual)}
                                    </span>
                                </div>
                                
                                <hr className="my-2 border-gray-300"/>
                                <p className={`flex justify-between text-lg font-extrabold ${Math.abs(nonCashDifference) > 100 ? 'text-red-600' : 'text-green-600'}`}>
                                    SELISIH
                                    <span className="flex items-center">
                                        {Math.abs(nonCashDifference) > 0 && (nonCashIsShort ? <ArrowDown size={18} className="mr-1"/> : <ArrowUp size={18} className="mr-1"/>)}
                                        {formatRupiah(Math.abs(nonCashDifference))} 
                                    </span>
                                </p>
                                <span className={`text-xs block text-right font-semibold ${Math.abs(nonCashDifference) > 100 ? 'text-red-500' : 'text-green-500'}`}>
                                    {nonCashStatus}
                                </span>
                            </div>
                        </div>

                        {/* 3. Input Catatan Kasir (Tidak Berubah) */}
                        <div className="p-4 border rounded-lg shadow-sm">
                            <h4 className="font-bold text-gray-800 flex items-center mb-2">
                                <Info className="w-4 h-4 mr-2 text-red-500" /> Catatan Kasir (Wajib Jika Selisih Tunai!)
                            </h4>
                            <textarea
                                value={cashierNote}
                                onChange={(e) => setCashierNote(e.target.value)}
                                placeholder="Jelaskan selisih kas tunai yang ditemukan, atau kejadian penting lainnya."
                                rows={3}
                                className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                        
                        {/* Konfirmasi Settlement (Tidak Berubah) */}
                        <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                            <label className="flex items-center space-x-2 font-medium text-gray-700">
                                <input 
                                    type="checkbox" 
                                    className="form-checkbox text-blue-600 rounded" 
                                    checked={isSettlementConfirmed}
                                    onChange={(e) => setIsSettlementConfirmed(e.target.checked)}
                                />
                                <span>**Konfirmasi:** Data Non-Tunai di atas (dari sistem) sudah diverifikasi ke laporan EDC/QR.</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Tombol Aksi (Tidak Berubah) */}
                <div className="mt-8 pt-4 border-t flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                        Batalkan Shift
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center bg-[#52BFBE] hover:bg-[#3FA3A2] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                        Tutup Shift & Kirim Audit
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- CONTOH PENGGUNAAN (Simulasi di Parent) ---
function ParentComponentSimulasi() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    // Kirim nilai 0 di sini, tapi komponen CloseShiftForm akan menggunakan MOCK
    const MOCK_SCENARIO_EXPECTED_CASH = 4690000; 
    const MOCK_SCENARIO_EXPECTED_NON_CASH = 0; // Sengaja diatur 0 untuk menguji perbaikan

    const handleTutupShift = (actualCash: number, note: string, settlementConfirmed: boolean, actualNonCash: number) => {
        alert(`Shift Ditutup!
        Kas Aktual: ${formatRupiah(actualCash)}
        Non-Tunai Aktual (Otomatis): ${formatRupiah(actualNonCash)}
        Catatan Kasir: ${note}
        Settlement Dikonfirmasi: ${settlementConfirmed ? 'Ya' : 'Tidak'}`);
        setIsModalOpen(false);
    };

    return (
        <div className="h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-4">Simulasi Halaman Kasir (Non-Tunai Otomatis, Menggunakan MOCK 5.5 Juta)</h1>
            <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white p-2 rounded">
                Buka Modal Tutup Shift
            </button>
            
            {isModalOpen && (
                <CloseShiftForm
                    expectedCash={MOCK_SCENARIO_EXPECTED_CASH}
                    expectedNonCash={MOCK_SCENARIO_EXPECTED_NON_CASH}
                    shiftId="SH-20251202-A"
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleTutupShift}
                />
            )}
        </div>
    );
}