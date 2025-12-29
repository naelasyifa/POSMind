'use client'

import { useEffect, useState } from 'react'
import {
  Users, Square, Circle, Star, Trees, Cigarette, Home,
  Plus, Trash2, X
} from 'lucide-react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'

// Inline CSS animasi
const styles = `
  @keyframes fadeIn { from {opacity:0; transform: translateY(-5px);} to {opacity:1; transform: translateY(0);} }
  .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
`

// =====================
// Tipe Data
// =====================
interface TableItem {
  id: string
  tableNumber: string
  shape: 'square' | 'circle'
  color: 'vip' | 'outdoor' | 'smoking' | 'indoor'
  capacity: number
  dp: number
  x: number
  y: number
  status?: string
}

interface Floor {
  id: string
  name: string
  tables: TableItem[]
}

export default function TableLayoutPage() {
  // =====================
  // State
  // =====================
  const [floors, setFloors] = useState<Floor[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFloor, setActiveFloor] = useState<string>('')
  
  const [form, setForm] = useState({ 
    tableNumber: '', 
    shape: 'square', 
    color: 'vip', 
    capacity: 4, 
    dp: 0,
    status: 'available' 
  })
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [zoom] = useState(100)
  const [showGrid] = useState(true)
  const [snapToGrid] = useState(true)
  
  const GRID_SIZE = 20

  // =====================
  // Fetch & Grouping Data
  // =====================
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/frontend/admin/tables')
      if (!res.ok) throw new Error('Gagal fetch data')
      const data = await res.json()

      const groupedFloors: { [key: string]: TableItem[] } = {}
      
      data.forEach((t: any) => {
        const floorName = t.lantai || 'Lantai 1'
        if (!groupedFloors[floorName]) groupedFloors[floorName] = []
        
        groupedFloors[floorName].push({
          id: t.id,
          tableNumber: t.namaMeja,
          shape: t.bentuk === 'bulat' ? 'circle' : 'square',
          color: t.area || 'indoor',
          capacity: t.kapasitas || 4,
          dp: t.dpMeja || 0,
          x: t.posisi?.x ?? 50,
          y: t.posisi?.y ?? 50,
          status: t.status || 'available'
        })
      })

      const floorArray = Object.keys(groupedFloors).map((name) => ({
        id: name,
        name: name,
        tables: groupedFloors[name]
      }))

      setFloors(floorArray)
      if (floorArray.length > 0) setActiveFloor(floorArray[0].id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // =====================
  // API Mutations
  // =====================
  const updateTableDetails = async (id: string, updates: Partial<TableItem>) => {
    setFloors(prev => prev.map(f => ({
      ...f,
      tables: f.tables.map(t => t.id === id ? { ...t, ...updates } : t)
    })))

    try {
      const apiPayload: any = { ...updates }
      if (updates.tableNumber) apiPayload.namaMeja = updates.tableNumber
      if (updates.dp !== undefined) apiPayload.dpMeja = updates.dp
      if (updates.capacity) apiPayload.kapasitas = updates.capacity

      await fetch(`/api/frontend/admin/tables/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload)
      })
    } catch (err) {
      console.error("Gagal update meja:", err)
    }
  }

  const savePositionToDB = async (tableId: string, x: number, y: number) => {
    try {
      await fetch(`/api/frontend/admin/tables/${tableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y })
      })
    } catch (err) {
      console.error("Gagal simpan posisi:", err)
    }
  }

  const addTable = async () => {
    if (!form.tableNumber.trim()) return;
    try {
      const payloadData = {
        namaMeja: form.tableNumber,
        kapasitas: Number(form.capacity || 4),
        lantai: activeFloor,
        area: form.color,
        bentuk: form.shape === "square" ? "kotak" : "bulat",
        posisi: { x: 100, y: 100 },
        dpMeja: Number(form.dp || 0),
        status: form.status || "available",
      };

      const res = await fetch("/api/frontend/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadData),
      });

      if (res.ok) {
        fetchData();
        setForm({ tableNumber: "", shape: "square", color: "vip", capacity: 4, dp: 0, status: "available" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTable = async (tableId: string) => {
    if (!confirm('Yakin hapus meja ini?')) return
    try {
      const res = await fetch(`/api/frontend/admin/tables/${tableId}`, { method: 'DELETE' })
      if (res.ok) {
        setFloors(prev => prev.map(f => ({
          ...f,
          tables: f.tables.filter(t => t.id !== tableId)
        })))
        setSelectedTable(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // =====================
  // Drag Handler
  // =====================
  const snapToGridValue = (val: number) => (snapToGrid ? Math.round(val / GRID_SIZE) * GRID_SIZE : val)

  const handleDrag = (e: React.MouseEvent) => {
    if (!draggingId) return
    const canvas = document.getElementById('canvas')
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    
    let x = snapToGridValue(e.clientX - rect.left - 40)
    let y = snapToGridValue(e.clientY - rect.top - 40)

    setFloors(prev =>
      prev.map(f => f.id !== activeFloor ? f : {
        ...f,
        tables: f.tables.map(t => t.id === draggingId ? { ...t, x, y } : t)
      })
    )
  }

  const handleMouseUp = () => {
    if (draggingId) {
      const table = currentFloor?.tables.find(t => t.id === draggingId)
      if (table) savePositionToDB(table.id, table.x, table.y)
    }
    setDraggingId(null)
  }

  // =====================
  // Helpers
  // =====================
  const colorClass = (c: string) => {
    switch (c) {
      case 'vip': return 'bg-yellow-200 border-yellow-500'
      case 'outdoor': return 'bg-green-200 border-green-500'
      case 'smoking': return 'bg-red-200 border-red-500'
      default: return 'bg-blue-200 border-blue-500'
    }
  }

  const getCategoryIcon = (c: string) => {
    switch (c) {
      case 'vip': return <Star className="w-4 h-4" />
      case 'outdoor': return <Trees className="w-4 h-4" />
      case 'smoking': return <Cigarette className="w-4 h-4" />
      default: return <Home className="w-4 h-4" />
    }
  }

  const currentFloor = floors.find(f => f.id === activeFloor)
  const selectedTableData = currentFloor?.tables.find(t => t.id === selectedTable)

  return (
    <div className="flex min-h-screen">
      <style>{styles}</style>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Layout Meja" />

        {/* FLOOR TABS */}
        <div className="mt-4 px-6 flex gap-3 items-end">
          {loading ? (
             <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-t-xl" />
          ) : (
            floors.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFloor(f.id)}
                className={`px-6 py-2 rounded-t-xl border transition-all ${activeFloor === f.id ? 'bg-white border-gray-200 shadow-md font-bold' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'}`}
              >
                {f.name}
              </button>
            ))
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="bg-white shadow rounded-xl m-6 p-6 flex gap-5 flex-1 overflow-hidden">
          
{/* SIDEBAR KIRI: FORM TAMBAH */}
          <div className="w-72 flex flex-col gap-4 border-r pr-6 overflow-y-auto custom-scrollbar">
            <h2 className="font-bold text-gray-800 flex items-center gap-2"><Plus className="w-5 h-5 text-[#52bfbe]" /> Tambah Meja Baru</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Nama Meja</label>
                <input value={form.tableNumber} onChange={e => setForm({...form, tableNumber: e.target.value})} className="w-full border p-2 rounded mt-1 outline-none focus:border-[#52bfbe]" placeholder="Contoh: A1" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Kapasitas</label>
                  <input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: Number(e.target.value)})} className="w-full border p-2 rounded mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">DP (Rp)</label>
                  <input type="number" value={form.dp} onChange={e => setForm({...form, dp: Number(e.target.value)})} className="w-full border p-2 rounded mt-1" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Bentuk Meja</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button onClick={() => setForm({...form, shape: 'square'})} className={`p-2 border rounded flex items-center justify-center gap-2 ${form.shape === 'square' ? 'border-[#52bfbe] bg-teal-50 text-[#52bfbe]' : ''}`}><Square className="w-4 h-4" /> Kotak</button>
                  <button onClick={() => setForm({...form, shape: 'circle'})} className={`p-2 border rounded flex items-center justify-center gap-2 ${form.shape === 'circle' ? 'border-[#52bfbe] bg-teal-50 text-[#52bfbe]' : ''}`}><Circle className="w-4 h-4" /> Bulat</button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Area Meja</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['indoor', 'outdoor', 'vip', 'smoking'].map(a => (
                    <button key={a} onClick={() => setForm({...form, color: a as any})} className={`p-2 border rounded text-xs capitalize flex items-center gap-2 ${form.color === a ? 'border-[#52bfbe] bg-teal-50' : ''}`}>
                      {getCategoryIcon(a)} {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={addTable} className="w-full bg-[#52bfbe] text-white py-3 rounded-lg font-bold mt-auto hover:bg-[#41a3a2]">Tambah Meja</button>
          </div>

          {/* CANVAS AREA */}
          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl relative overflow-auto bg-[#f8fafc]" id="canvas" onMouseMove={handleDrag} onMouseUp={handleMouseUp}>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">Memuat Layout...</div>
            ) : (
              <div className="relative" style={{
                minWidth: '100%', minHeight: '600px',
                backgroundImage: showGrid ? `linear-gradient(to right,#e2e8f0 1px,transparent 1px),linear-gradient(to bottom,#e2e8f0 1px,transparent 1px)` : 'none',
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              }}>
                {currentFloor?.tables.map(t => (
                  <div 
                    key={t.id} 
                    onMouseDown={() => { setDraggingId(t.id); setSelectedTable(t.id) }} 
                    className={`absolute cursor-move flex flex-col items-center justify-center text-sm font-bold shadow-md border-2 transition-transform ${colorClass(t.color)} ${t.shape === 'square' ? 'rounded-lg' : 'rounded-full'} ${selectedTable === t.id ? 'ring-4 ring-blue-500 scale-110 z-10' : 'hover:scale-105'}`} 
                    style={{ top: `${t.y}px`, left: `${t.x}px`, width: `80px`, height: `80px` }}
                  >
                    <span>{t.tableNumber}</span>
                    <span className="text-[9px] flex items-center gap-1"><Users className="w-3 h-3" />{t.capacity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIDE LIST (WIDTH TETAP 64) */}
          <div className="w-64 border rounded-xl p-3 flex flex-col gap-3 bg-gray-50 shadow-inner overflow-hidden">
            
            {/* PANEL EDIT */}
            {selectedTableData && (
              <div className="bg-white border-2 border-blue-100 rounded-xl p-4 shadow-sm animate-fadeIn relative shrink-0">
                <button onClick={() => setSelectedTable(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                <h3 className="text-blue-600 font-bold mb-3 text-sm flex items-center gap-2">Edit: {selectedTableData.tableNumber}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Nama Meja</label>
                    <input type="text" value={selectedTableData.tableNumber} onChange={(e) => updateTableDetails(selectedTableData.id, { tableNumber: e.target.value })} className="w-full border rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-400 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Kapasitas</label>
                    <input type="number" value={selectedTableData.capacity} onChange={(e) => updateTableDetails(selectedTableData.id, { capacity: Number(e.target.value) })} className="w-full border rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-400 outline-none" />
                  </div>
                  {/* KOLOM DP YANG BARU DITAMBAHKAN */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">DP Meja (Rp)</label>
                    <input type="number" value={selectedTableData.dp} onChange={(e) => updateTableDetails(selectedTableData.id, { dp: Number(e.target.value) })} className="w-full border rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-400 outline-none" />
                  </div>
                  <button onClick={() => deleteTable(selectedTableData.id)} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 font-bold text-xs transition-colors"><Trash2 className="w-4 h-4" /> Hapus Meja</button>
                </div>
              </div>
            )}

            {/* DAFTAR MEJA */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <h3 className="font-bold text-sm mb-2 border-b">List Meja: {activeFloor}</h3>
              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {currentFloor?.tables.map(t => (
                  <div key={t.id} onClick={() => setSelectedTable(t.id)} className={`p-2 rounded border flex justify-between items-center cursor-pointer transition-colors ${selectedTable === t.id ? 'bg-blue-50 border-blue-400' : 'bg-white hover:bg-gray-100'}`}>
                    <div>
                      <div className="font-bold text-sm">{t.tableNumber}</div>
                      <div className="text-[10px] text-gray-500">Cap: {t.capacity} | DP: {t.dp}</div>
                    </div>
                    <div className={`p-1 rounded ${colorClass(t.color)}`}>{getCategoryIcon(t.color)}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}