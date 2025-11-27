// dashboard/components/ShiftForm.tsx
'use client'

import { Wallet, Clock, X, ChevronDown } from 'lucide-react' 
import { useState } from 'react'

interface ShiftFormProps {
    onOpen: (initialCapital: number, shift: string, note: string) => void
    onClose: () => void 
}

export default function ShiftForm({ onOpen, onClose }: ShiftFormProps) {
    const [modalAwal, setModalAwal] = useState('') 
    const [shift, setShift] = useState('Pagi') 
    const [catatan, setCatatan] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleOpenShift = () => {
        const capital = parseInt(modalAwal.replace(/\./g, '').replace(/[^0-9]/g, ''), 10)

        if (isNaN(capital) || capital < 0) {
            setError('Modal Awal harus diisi dengan angka yang valid.')
            return
        }

        if (!shift) {
            setError('Pilih shift yang akan Anda buka.')
            return
        }

        setError(null)
        onOpen(capital, shift, catatan)
    }

    const formatNumberInput = (value: string) => {
        const cleanValue = value.replace(/\D/g, '')
        return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    const handleModalAwalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModalAwal(formatNumberInput(e.target.value))
        setError(null)
    }

    return (
        // Backdrop
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={onClose} 
        >
            {/* Modal Box */}
            <div 
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Buka Shift Baru</h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Isi detail shift Anda sebelum memulai pekerjaan.
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Modal Awal */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Wallet size={16} className="mr-2 text-[#3FA3A2]" /> Modal Awal (Cash)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                            <input
                                type="text"
                                value={modalAwal}
                                onChange={handleModalAwalChange}
                                placeholder="Contoh: 50.000"
                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#52BFBE] focus:border-[#52BFBE] placeholder:text-sm"
                                required
                            />
                        </div>
                    </div>

                    {/* Shift - PERBAIKAN DROPDOWN */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Clock size={16} className="mr-2 text-[#3FA3A2]" /> Pilih Shift
                        </label>
                        {/* Kontainer untuk dropdown dan ikon kustom */}
                        <div className="relative"> 
                            <select
                                value={shift}
                                onChange={(e) => { setShift(e.target.value); setError(null); }}
                                // appearance-none menghilangkan panah default browser
                                // pr-10 memastikan ada ruang untuk ikon kustom
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#52BFBE] focus:border-[#52BFBE] appearance-none pr-10"
                            >
                                <option value="Pagi">Pagi</option>
                                <option value="Siang">Siang</option>
                                <option value="Malam">Malam</option>
                            </select>
                            
                            {/* Ikon kustom untuk menggantikan panah default */}
                            <ChevronDown 
                                size={18} 
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" 
                            />
                        </div>
                    </div>

                    {/* Catatan (Logo sudah dihapus dari revisi sebelumnya) */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                             Catatan (Opsional) 
                        </label>
                        <textarea
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            placeholder="Catatan tambahan untuk shift ini (misal: penyerahan kunci)"
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#52BFBE] focus:border-[#52BFBE] placeholder:text-sm"
                        />
                    </div>
                </div>

                {/* Tombol Masuk */}
                <div className="mt-6">
                    <button
                        onClick={handleOpenShift}
                        className="w-full bg-[#52BFBE] hover:bg-[#3FA3A2] text-white font-medium py-2 rounded-lg transition duration-200"
                    >
                        Mulai Shift {shift}
                    </button>
                </div>

            </div>
        </div>
    )
}