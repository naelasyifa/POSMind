'use client'

import { DollarSign, Clock, X, Info, Scale, ArrowDown, ArrowUp, Calculator, Loader2 } from 'lucide-react' 
import React, { useState, useMemo } from 'react'

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

interface CloseShiftFormProps {
    expectedCash: number; 
    expectedNonCash?: number;
    shiftId: string;
    onClose: () => void;
    onSubmit: () => void; // Diubah untuk memicu refresh data di parent setelah sukses
}

export default function CloseShiftForm({ 
    expectedCash, 
    expectedNonCash = 0,
    shiftId, 
    onClose, 
    onSubmit,
}: CloseShiftFormProps) {
    
    // State
    const [counts, setCounts] = useState<DenominationCounts>(
        DENOMINATIONS.reduce((acc, denom) => ({ ...acc, [denom.value]: '' }), {})
    );
    const [cashierNote, setCashierNote] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSettlementConfirmed, setIsSettlementConfirmed] = useState(false); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Perhitungan Tunai
    const actualCash = useMemo(() => {
        return DENOMINATIONS.reduce((sum, denom) => {
            const count = parseInt(counts[denom.value] || '0');
            return sum + (denom.value * count);
        }, 0);
    }, [counts]);
    
    const difference = actualCash - expectedCash;
    const isShort = difference < 0;
    const status = difference === 0 ? 'MATCH' : isShort ? 'SHORTAGE (Kurang)' : 'SURPLUS (Lebih)';

    // Perhitungan Non-Tunai (Auto-Settlement)
    const settlementActual = expectedNonCash; 
    const nonCashDifference = 0; // Karena auto-settlement dari sistem

    const handleCountChange = (value: number, newValue: string) => {
        const cleanValue = newValue.replace(/\D/g, '');
        setCounts(prevCounts => ({ ...prevCounts, [value]: cleanValue }));
        setError(null);
    };

    const handleFinalSubmit = async () => {
        // --- VALIDASI FRONT-END ---
        if (actualCash === 0 && expectedCash > 0) {
            setError('Anda harus menghitung kas fisik. Total tidak boleh nol.');
            return;
        }

        if (Math.abs(difference) > 100 && cashierNote.trim().length < 5) {
            setError('Terdapat selisih kas. Harap isi catatan singkat.');
            return;
        }
        
        if (!isSettlementConfirmed) {
            setError('Anda harus mengkonfirmasi Settlement Non-Tunai.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/frontend/shifts/close', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shiftId,
                    actualCash,
                    actualNonCash: settlementActual,
                    cashierNote,
                    settlementConfirmed: isSettlementConfirmed,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Gagal menutup shift');
            }

            // Jika sukses, panggil callback onSubmit dari parent (untuk refresh UI)
            onSubmit();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
            <div 
                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-5xl mx-4 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full">
                    <X size={24} />
                </button>
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Penutupan Shift</h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-2">
                        <Clock size={16} className="text-[#52BFBE]" /> 
                        ID Shift: <span className="font-bold text-gray-700">{shiftId}</span>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-3">
                        <Info size={18} /> {error}
                    </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: DENOMINATIONS */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" /> Rincian Kas Tunai
                        </h3>
                        
                        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase">Pecahan</th>
                                        <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase">Jumlah</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {DENOMINATIONS.map((denom) => (
                                        <tr key={denom.value} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-3 text-sm font-bold text-gray-700">{denom.label}</td>
                                            <td className="px-6 py-3 text-center">
                                                <input
                                                    type="text" 
                                                    value={counts[denom.value]}
                                                    onChange={(e) => handleCountChange(denom.value, e.target.value)}
                                                    className="w-20 border-2 border-gray-100 rounded-xl p-2 text-sm text-center font-bold focus:border-[#52BFBE] outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="px-6 py-3 text-right text-sm font-black text-gray-800">
                                                {formatRupiah(denom.value * parseInt(counts[denom.value] || '0'))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-6 bg-[#f0f9f9] border-2 border-[#52BFBE] rounded-2xl flex justify-between items-center shadow-inner">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#52BFBE] p-2 rounded-lg text-white"><Calculator size={20} /></div>
                                <p className="text-sm font-black text-[#3FA3A2] uppercase">Total Kas Fisik</p>
                            </div>
                            <p className="text-3xl font-black text-[#2D7A79]">{formatRupiah(actualCash)}</p>
                        </div>
                    </div>

                    {/* RIGHT: AUDIT SUMMARY */}
                    <div className="space-y-6">
                        {/* Audit Tunai */}
                        <div className={`p-6 rounded-2xl border-2 ${Math.abs(difference) > 100 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <h4 className="font-black text-[10px] uppercase text-gray-400 mb-4 tracking-widest">Audit Tunai</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Sistem</span>
                                    <span className="font-bold text-gray-800">{formatRupiah(expectedCash)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Aktual</span>
                                    <span className="font-bold text-gray-800">{formatRupiah(actualCash)}</span>
                                </div>
                                <div className="h-px bg-gray-200 my-2" />
                                <div className={`flex justify-between items-end ${Math.abs(difference) > 100 ? 'text-red-600' : 'text-green-600'}`}>
                                    <span className="text-[10px] font-black uppercase">Selisih</span>
                                    <div className="text-right">
                                        <div className="text-xl font-black flex items-center justify-end">
                                            {difference !== 0 && (isShort ? <ArrowDown size={18} /> : <ArrowUp size={18} />)}
                                            {formatRupiah(Math.abs(difference))}
                                        </div>
                                        <span className="text-[9px] font-bold uppercase">{status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audit Non-Tunai */}
                        <div className="p-6 rounded-2xl bg-indigo-50 border-2 border-indigo-100">
                            <h4 className="font-black text-[10px] uppercase text-indigo-400 mb-4 tracking-widest">Audit Non-Tunai</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-indigo-900">
                                    <span>Expected</span>
                                    <span>{formatRupiah(expectedNonCash)}</span>
                                </div>
                                <div className="bg-white/60 p-3 rounded-xl flex justify-between items-center mt-2 border border-indigo-100">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase">Settlement</span>
                                    <span className="text-sm font-black text-indigo-700">{formatRupiah(settlementActual)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Catatan Kasir</label>
                            <textarea
                                value={cashierNote}
                                onChange={(e) => setCashierNote(e.target.value)}
                                placeholder="Wajib diisi jika ada selisih..."
                                className="w-full p-4 border-2 border-gray-100 rounded-2xl text-sm focus:border-[#52BFBE] outline-none min-h-[100px] transition-all"
                            />
                        </div>

                        {/* Checkbox */}
                        <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors group">
                            <input 
                                type="checkbox" 
                                className="mt-1 w-5 h-5 rounded-lg border-2 border-gray-300 text-[#52BFBE] focus:ring-[#52BFBE]" 
                                checked={isSettlementConfirmed}
                                onChange={(e) => setIsSettlementConfirmed(e.target.checked)}
                            />
                            <span className="text-[11px] leading-tight font-bold text-gray-600 group-hover:text-gray-800">
                                Konfirmasi bahwa data Non-Tunai sudah sesuai dengan EDC / QRIS.
                            </span>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-10 pt-6 border-t border-gray-50 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
                    >
                        Batalkan
                    </button>
                    <button
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                        className="bg-[#52BFBE] hover:bg-[#3FA3A2] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#52BFBE]/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Memproses...
                            </>
                        ) : (
                            'Tutup Shift & Kirim Audit'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}