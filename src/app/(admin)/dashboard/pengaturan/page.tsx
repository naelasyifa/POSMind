'use client'
import { useState } from 'react'
import PajakTab from './components/PajakTab'
import StrukTab from './components/StrukTab'
import CetakTab from './components/CetakTab'

export default function DashboardSettings() {
  const [activeTab, setActiveTab] = useState<'pajak' | 'struk' | 'cetak'>('pajak')

  const handleTabClick = (tab: 'pajak' | 'struk' | 'cetak') => setActiveTab(tab)

  return (
    <div className="pt-3 pl-17 min-h-screen bg-transparent">
      {/* Tabs */}
      <div className="flex gap-4 mb-3 ml-12">
        {['pajak', 'struk', 'cetak'].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-t-xl ${
              activeTab === tab
                ? 'bg-white text-black font-semibold border-b-4 border-white'
                : 'bg-[#737373] text-white'
            }`}
            onClick={() => handleTabClick(tab as any)}
          >
            {tab === 'pajak'
              ? 'Pajak dan Jam Buka'
              : tab === 'struk'
                ? 'Pengaturan Struk'
                : 'Pengaturan Cetakan'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="ml-12">
        {activeTab === 'pajak' && <PajakTab />}
        {activeTab === 'struk' && <StrukTab />}
        {activeTab === 'cetak' && <CetakTab />}
      </div>
    </div>
  )
}
