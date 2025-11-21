'use client'

export default function StrukTab() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border w-full">
      <h3 className="font-semibold text-lg border-b pb-2 mb-4">Pengaturan Struk</h3>
      <input type="text" placeholder="Header Struk" className="border p-2 rounded w-full mb-2" />
      <input type="text" placeholder="Footer Struk" className="border p-2 rounded w-full mb-2" />
      <button className="bg-[#52bfbe] text-white px-4 py-2 rounded mt-2">Simpan</button>
    </div>
  )
}
