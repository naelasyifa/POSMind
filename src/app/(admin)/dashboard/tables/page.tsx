'use client'

import { useState } from 'react'
import {
  Users,
  Square,
  Circle,
  Star,
  Trees,
  Cigarette,
  Home,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  X,
} from 'lucide-react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'

// Inline CSS for animations
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes scaleOut {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.95);
      opacity: 0;
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }

  .animate-fadeOut {
    animation: fadeOut 0.2s ease-out;
  }

  .animate-scaleIn {
    animation: scaleIn 0.25s ease-out;
  }

  .animate-scaleOut {
    animation: scaleOut 0.2s ease-out;
  }
`

// =====================
// Tipe Data
// =====================
interface TableItem {
  id: number
  tableNumber: string
  shape: 'square' | 'circle'
  color: 'vip' | 'outdoor' | 'smoking' | 'indoor'
  capacity: number
  dp: number
  x: number
  y: number
}

interface Floor {
  id: number
  name: string
  tables: TableItem[]
}

export default function TableLayoutPage() {
  const [floors, setFloors] = useState<Floor[]>([
    {
      id: 1,
      name: 'Lantai 1',
      tables: [
        {
          id: 100,
          tableNumber: 'A1',
          shape: 'square',
          color: 'vip',
          capacity: 4,
          dp: 0,
          x: 80,
          y: 90,
        },
      ],
    },
  ])

  const [activeFloor, setActiveFloor] = useState(1)
  const [form, setForm] = useState({
    tableNumber: '',
    shape: 'square',
    color: 'vip',
    capacity: 4,
    dp: 0,
  })
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [zoom, setZoom] = useState(100)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [showAddFloorModal, setShowAddFloorModal] = useState(false)
  const [newFloorName, setNewFloorName] = useState('')
  const [isClosingModal, setIsClosingModal] = useState(false)

  const GRID_SIZE = 20

  // ==================================================
  // Snap to grid helper
  // ==================================================
  const snapToGridValue = (val: number) => {
    if (!snapToGrid) return val
    return Math.round(val / GRID_SIZE) * GRID_SIZE
  }

  // ==================================================
  // Tambah Meja
  // ==================================================
  const addTable = () => {
    if (!form.tableNumber.trim()) return

    setFloors((prev) =>
      prev.map((f) => {
        if (f.id !== activeFloor) return f

        const newTable: TableItem = {
          id: Date.now(),
          tableNumber: form.tableNumber,
          shape: form.shape as 'square' | 'circle',
          color: form.color as 'vip' | 'outdoor' | 'smoking',
          capacity: Number(form.capacity),
          dp: Number(form.dp),
          x: 100,
          y: 100,
        }

        return { ...f, tables: [...f.tables, newTable] }
      }),
    )

    setForm({
      tableNumber: '',
      shape: 'square',
      color: 'vip',
      capacity: 4,
      dp: 0,
    })
  }

  // ==================================================
  // Close modal dengan animasi
  // ==================================================
  const closeModal = () => {
    setIsClosingModal(true)
    setTimeout(() => {
      setShowAddFloorModal(false)
      setIsClosingModal(false)
      setNewFloorName('')
    }, 200)
  }

  // ==================================================
  // Tambah Lantai
  // ==================================================
  const addFloor = () => {
    if (!newFloorName.trim()) return

    const newFloor: Floor = {
      id: Date.now(),
      name: newFloorName,
      tables: [],
    }

    setFloors([...floors, newFloor])
    setActiveFloor(newFloor.id)
    closeModal()
  }

  // ==================================================
  // Hapus Lantai
  // ==================================================
  const deleteFloor = (floorId: number) => {
    if (floors.length === 1) {
      alert('Tidak bisa hapus lantai terakhir!')
      return
    }
    if (!confirm('Yakin hapus lantai ini dan semua mejanya?')) return

    setFloors(floors.filter((f) => f.id !== floorId))
    if (activeFloor === floorId) {
      setActiveFloor(floors[0].id)
    }
  }

  // ==================================================
  // Hapus Meja
  // ==================================================
  const deleteTable = (tableId: number) => {
    if (!confirm('Yakin hapus meja ini?')) return

    setFloors((prev) =>
      prev.map((f) =>
        f.id !== activeFloor ? f : { ...f, tables: f.tables.filter((t) => t.id !== tableId) },
      ),
    )
    setSelectedTable(null)
  }

  // ==================================================
  // Drag meja dengan snap
  // ==================================================
  const handleDrag = (e: React.MouseEvent) => {
    if (!draggingId) return

    const canvas = document.getElementById('canvas')
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    let x = e.clientX - rect.left - 40
    let y = e.clientY - rect.top - 40

    x = snapToGridValue(x)
    y = snapToGridValue(y)

    setFloors((prev) =>
      prev.map((f) =>
        f.id !== activeFloor
          ? f
          : {
              ...f,
              tables: f.tables.map((t) => (t.id === draggingId ? { ...t, x, y } : t)),
            },
      ),
    )
  }

  // ==================================================
  // Edit meja (inline)
  // ==================================================
  const updateTable = (field: string, value: any) => {
    if (!selectedTable) return

    setFloors((prev) =>
      prev.map((f) =>
        f.id !== activeFloor
          ? f
          : {
              ...f,
              tables: f.tables.map((t) => (t.id === selectedTable ? { ...t, [field]: value } : t)),
            },
      ),
    )
  }

  // Warna class
  const colorClass = (c: string) => {
    switch (c) {
      case 'vip':
        return 'bg-yellow-200 border-yellow-500'
      case 'outdoor':
        return 'bg-green-200 border-green-500'
      case 'smoking':
        return 'bg-red-200 border-red-500'
      case 'indoor':
        return 'bg-blue-200 border-blue-500'
    }
  }

  // Icon kategori
  const getCategoryIcon = (c: string) => {
    switch (c) {
      case 'vip':
        return <Star className="w-4 h-4" />
      case 'outdoor':
        return <Trees className="w-4 h-4" />
      case 'smoking':
        return <Cigarette className="w-4 h-4" />
      case 'indoor':
        return <Home className="w-4 h-4" />
    }
  }

  const currentFloor = floors.find((f) => f.id === activeFloor)
  const selectedTableData = currentFloor?.tables.find((t) => t.id === selectedTable)

  return (
    <div className="flex min-h-screen">
      <style>{styles}</style>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Layout Meja (Drag & Drop)" />

        {/* FLOOR TABS */}
        <div className="mt-4 px-6 flex gap-3 items-end">
          {floors.map((f) => (
            <div key={f.id} className="relative group">
              <button
                onClick={() => setActiveFloor(f.id)}
                className={`px-6 py-2 rounded-t-xl border transition-all
              ${
                activeFloor === f.id
                  ? 'bg-white border-gray-200 shadow-md'
                  : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
              }`}
              >
                {f.name}
              </button>
              {floors.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation() // supaya tidak klik lantai
                    deleteFloor(f.id)
                  }}
                  className="absolute -top-3 -right-3 bg-red-500/90 hover:bg-red-600 text-white 
             rounded-full w-6 h-6 flex items-center justify-center 
             text-sm shadow-md opacity-0 group-hover:opacity-100 
             transition-all duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => setShowAddFloorModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Lantai
          </button>
        </div>

        {/* MODAL TAMBAH LANTAI */}
        {showAddFloorModal && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 ${isClosingModal ? 'animate-fadeOut' : 'animate-fadeIn'}`}
            style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
            onClick={closeModal}
          >
            <div
              className={`bg-white rounded-2xl p-6 w-96 shadow-2xl border border-gray-500 ${isClosingModal ? 'animate-scaleOut' : 'animate-scaleIn'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Tambah Lantai Baru</h3>
                {/* <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button> */}
              </div>

              <div className="mb-5">
                <label className="block font-semibold text-sm text-gray-700 mb-2">
                  Nama Lantai
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Lantai 2, Rooftop, VIP Floor"
                  value={newFloorName}
                  onChange={(e) => setNewFloorName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newFloorName.trim()) addFloor()
                    if (e.key === 'Escape') closeModal()
                  }}
                  className="w-full border-2 border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={addFloor}
                  disabled={!newFloorName.trim()}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="bg-white shadow rounded-xl m-6 p-6 flex gap-5">
          {/* FORM TAMBAH MEJA */}
          <div className="w-72 border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg flex-shrink-0">
            <h2 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Tambah Meja Baru
            </h2>

            <div className="flex flex-col gap-3">
              <div>
                <label className="font-semibold text-sm text-gray-700">Nama Meja</label>
                <input
                  placeholder="Contoh: A1"
                  value={form.tableNumber}
                  className="border px-3 py-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold text-sm text-gray-700">Kapasitas</label>
                <input
                  type="number"
                  value={form.capacity}
                  className="border px-3 py-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="font-semibold text-sm text-gray-700">DP Meja (Rp)</label>
                <input
                  type="number"
                  value={form.dp}
                  className="border px-3 py-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) => setForm({ ...form, dp: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="font-semibold text-sm text-gray-700">Bentuk Meja</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, shape: 'square' })}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                      form.shape === 'square'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <Square className="w-4 h-4" />
                    <span>Kotak</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, shape: 'circle' })}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                      form.shape === 'circle'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <Circle className="w-4 h-4" />
                    <span>Bulat</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-sm text-gray-700">Kategori Area</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, color: 'vip' })}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                      form.color === 'vip'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700 font-semibold'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    <span>VIP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, color: 'indoor' })}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                      form.color === 'indoor'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Indoor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, color: 'outdoor' })}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                      form.color === 'outdoor'
                        ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <Trees className="w-4 h-4" />
                    <span>Outdoor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, color: 'smoking' })}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                      form.color === 'smoking'
                        ? 'border-red-500 bg-red-50 text-red-700 font-semibold'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <Cigarette className="w-4 h-4" />
                    <span>Smoking</span>
                  </button>
                </div>
              </div>

              <button
                className="w-full bg-[#52bfbe] hover:bg-[#32A9A4] text-white py-2.5 rounded-lg font-semibold mt-2 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                onClick={addTable}
              >
                <Plus className="w-5 h-5" />
                Tambahkan Meja
              </button>
            </div>
          </div>

          {/* CANVAS SECTION */}
          <div className="flex-1 flex flex-col gap-3">
            {/* TOOLBAR */}
            <div className="flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg border">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Zoom:</label>
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-mono w-12 text-center">{zoom}%</span>
                  <button
                    onClick={() => setZoom(Math.min(150, zoom + 10))}
                    className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Grid3x3 className="w-4 h-4" />
                  <span className="font-medium text-gray-700">Grid</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={(e) => setSnapToGrid(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-gray-700">Snap to Grid</span>
                </label>
              </div>

              <div className="text-sm text-gray-600">{currentFloor?.tables.length || 0} meja</div>
            </div>

            {/* CANVAS */}
            <div className="flex gap-3 flex-1">
              <div
                id="canvas"
                className="flex-1 border-2 border-gray-300 rounded-xl relative overflow-auto bg-gray-50"
                onMouseMove={handleDrag}
                onMouseUp={() => setDraggingId(null)}
              >
                <div
                  className="relative"
                  style={{
                    width: `${(zoom / 100)}px`,
                    height: `${(zoom / 100)}px`,
                    minWidth: '100%',
                    minHeight: '100%',
                    backgroundImage: showGrid
                      ? `linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                         linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`
                      : 'none',
                    backgroundSize: showGrid
                      ? `${GRID_SIZE * (zoom / 100)}px ${GRID_SIZE * (zoom / 100)}px`
                      : 'auto',
                    backgroundColor: '#f9fafb',
                  }}
                >
                  {currentFloor?.tables.map((t) => (
                    <div
                      key={t.id}
                      onMouseDown={() => {
                        setDraggingId(t.id)
                        setSelectedTable(t.id)
                      }}
                      className={`absolute cursor-move flex flex-col items-center justify-center 
                    text-sm font-semibold shadow-lg border-2 transition-all
                    ${colorClass(t.color)} 
                    ${t.shape === 'square' ? 'rounded-lg' : 'rounded-full'}
                    ${selectedTable === t.id ? 'ring-4 ring-blue-400 scale-105' : 'hover:scale-105'}
                    `}
                      style={{
                        top: `${t.y * (zoom / 100)}px`,
                        left: `${t.x * (zoom / 100)}px`,
                        width: `${80 * (zoom / 100)}px`,
                        height: `${80 * (zoom / 100)}px`,
                      }}
                    >
                      <span className="text-gray-800">{t.tableNumber}</span>
                      <span className="text-[10px] opacity-80 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {t.capacity}
                      </span>
                    </div>
                  ))}

                  {currentFloor?.tables.length === 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-lg whitespace-nowrap">
                      ← Tambahkan meja untuk memulai
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL - Table List & Edit */}
              <div className="w-72 border rounded-xl p-4 bg-white shadow-lg flex-shrink-0 overflow-y-auto max-h-[600px]">
                <h3 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                  <Grid3x3 className="w-5 h-5" />
                  Daftar Meja
                </h3>

                {selectedTableData ? (
                  <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-blue-800">
                        Edit: {selectedTableData.tableNumber}
                      </h4>
                      <button
                        onClick={() => setSelectedTable(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <label className="font-medium text-gray-700">Nama Meja</label>
                        <input
                          value={selectedTableData.tableNumber}
                          onChange={(e) => updateTable('tableNumber', e.target.value)}
                          className="w-full border px-2 py-1 rounded mt-1"
                        />
                      </div>

                      <div>
                        <label className="font-medium text-gray-700">Kapasitas</label>
                        <input
                          type="number"
                          value={selectedTableData.capacity}
                          onChange={(e) => updateTable('capacity', Number(e.target.value))}
                          className="w-full border px-2 py-1 rounded mt-1"
                        />
                      </div>

                      <div>
                        <label className="font-medium text-gray-700">DP (Rp)</label>
                        <input
                          type="number"
                          value={selectedTableData.dp}
                          onChange={(e) => updateTable('dp', Number(e.target.value))}
                          className="w-full border px-2 py-1 rounded mt-1"
                        />
                      </div>

                      <button
                        onClick={() => deleteTable(selectedTableData.id)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-1.5 rounded mt-3 text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus Meja
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2">
                  {currentFloor?.tables.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTable(t.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all
                      ${selectedTable === t.id ? 'bg-blue-100 border-blue-400 shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-800">{t.tableNumber}</div>
                          <div className="text-xs text-gray-600 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {t.capacity}
                            </span>
                            •
                            <span>
                              {t.shape === 'square' ? (
                                <Square className="w-3 h-3 inline" />
                              ) : (
                                <Circle className="w-3 h-3 inline" />
                              )}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-8 h-8 rounded ${t.shape === 'circle' ? 'rounded-full' : ''} border-2 ${colorClass(t.color)} flex items-center justify-center`}
                        >
                          {getCategoryIcon(t.color)}
                        </div>
                      </div>
                    </button>
                  ))}

                  {currentFloor?.tables.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-sm">Belum ada meja</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
