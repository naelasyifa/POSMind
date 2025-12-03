'use client'

import { useState } from 'react'
import Sidebar from '@/components/SidebarAdmin'
import HeaderAdmin from '@/components/HeaderAdmin'

// =====================
// Tipe Data
// =====================
interface TableItem {
  id: number
  tableNumber: string
  shape: 'square' | 'circle'
  color: 'vip' | 'outdoor' | 'smoking'
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

  // Form tambah meja
  const [form, setForm] = useState({
    tableNumber: '',
    shape: 'square',
    color: 'vip',
    capacity: 4,
    dp: 0,
  })

  const [draggingId, setDraggingId] = useState<number | null>(null)

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
          x: 60,
          y: 60,
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
  // Tambah Lantai (dengan input nama)
  // ==================================================
  const addFloor = () => {
    const name = prompt('Masukkan nama lantai baru (misal: Lantai 2)')
    if (!name || !name.trim()) return

    setFloors([...floors, { id: Date.now(), name, tables: [] }])
  }

  // ==================================================
  // Drag meja
  // ==================================================
  const handleDrag = (e: React.MouseEvent) => {
    if (!draggingId) return

    const canvas = document.getElementById('canvas')
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - 40
    const y = e.clientY - rect.top - 40

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

  // Warna class
  const colorClass = (c: string) => {
    switch (c) {
      case 'vip':
        return 'bg-yellow-200 border-yellow-500'
      case 'outdoor':
        return 'bg-blue-200 border-blue-500'
      case 'smoking':
        return 'bg-red-200 border-red-500'
    }
  }

  const currentFloor = floors.find((f) => f.id === activeFloor)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-28">
        <HeaderAdmin title="Layout Meja (Drag & Drop)" />

        {/* FLOOR TABS */}
        <div className="mt-4 px-6 flex gap-3 items-end">
          {floors.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFloor(f.id)}
              className={`px-6 py-2 rounded-t-xl border 
              ${activeFloor === f.id ? 'bg-white border-white' : 'bg-gray-400 text-white'}`}
            >
              {f.name}
            </button>
          ))}

          <button onClick={addFloor} className="px-4 py-2 bg-green-600 text-white rounded">
            + Lantai
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="bg-white shadow rounded-xl m-6 p-6 flex gap-5">
          {/* FORM TAMBAH MEJA */}
          <div className="w-72 border rounded-xl p-4 bg-gray-50 shadow">
            <h2 className="font-bold text-lg mb-3">Tambah Meja</h2>

            <div className="flex flex-col gap-3">
              {/* Nama Meja */}
              <label className="font-semibold text-sm">Nama Meja</label>
              <input
                placeholder="Contoh: A1"
                value={form.tableNumber}
                className="border px-3 py-2 rounded"
                onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
              />

              {/* Kapasitas */}
              <label className="font-semibold text-sm">Kapasitas</label>
              <input
                type="number"
                value={form.capacity}
                className="border px-3 py-2 rounded"
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
              />

              {/* DP */}
              <label className="font-semibold text-sm">DP Meja</label>
              <input
                type="number"
                value={form.dp}
                className="border px-3 py-2 rounded"
                onChange={(e) => setForm({ ...form, dp: Number(e.target.value) })}
              />

              {/* Bentuk */}
              <label className="font-semibold text-sm">Bentuk Meja</label>
              <select
                className="border px-3 py-2 rounded"
                value={form.shape}
                onChange={(e) => setForm({ ...form, shape: e.target.value })}
              >
                <option value="square">Kotak</option>
                <option value="circle">Lingkaran</option>
              </select>

              {/* Warna */}
              <label className="font-semibold text-sm">Kategori Area</label>
              <select
                className="border px-3 py-2 rounded"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              >
                <option value="vip">VIP</option>
                <option value="outdoor">Outdoor</option>
                <option value="smoking">Smoking Area</option>
              </select>

              {/* Submit */}
              <button
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
                onClick={addTable}
              >
                Tambahkan Meja +
              </button>
            </div>
          </div>

          {/* CANVAS */}
          <div
            id="canvas"
            className="flex-1 h-[550px] border rounded-xl bg-gray-100 relative"
            onMouseMove={handleDrag}
            onMouseUp={() => setDraggingId(null)}
          >
            {currentFloor?.tables.map((t) => (
              <div
                key={t.id}
                onMouseDown={() => setDraggingId(t.id)}
                className={`absolute cursor-move flex flex-col items-center justify-center 
                text-sm font-medium shadow-md border 
                ${colorClass(t.color)} 
                ${t.shape === 'square' ? 'w-20 h-20' : 'w-20 h-20 rounded-full'}
                `}
                style={{ top: t.y, left: t.x }}
              >
                <span>{t.tableNumber}</span>
                <span className="text-[10px] opacity-70">({t.capacity} org)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
