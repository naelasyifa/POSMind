'use client'
import { useState } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'
import PajakTab from './components/PajakTab'
import StrukTab from './components/StrukTab'
import CetakTab from './components/CetakTab'

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<'pajak' | 'struk' | 'cetak'>('pajak')

  const handleTabClick = (tab: 'pajak' | 'struk' | 'cetak') => setActiveTab(tab)

  return (
    <div className="flex min-h-screen bg-transparant">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '7rem' }}>
        {/* Header */}
        <HeaderAdmin title="Settings" />

        {/* Tabs */}
        <div className="pt-3 pl-6">
          <div className="flex gap-4 mb-3">
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
          <div>
            {activeTab === 'pajak' && <PajakTab />}
            {activeTab === 'struk' && <StrukTab />}
            {activeTab === 'cetak' && <CetakTab />}
          </div>
        </div>
      </div>
    </div>
  )
}
