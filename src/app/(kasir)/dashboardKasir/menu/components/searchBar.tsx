'use client'
import { Search } from 'lucide-react'

type Props = {
  search: string
  setSearch: (val: string) => void
}

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <div className="relative w-70 text-gray-500">
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
      <input
        type="text"
        placeholder="Cari produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-gray-400 focus:outline-none"
      />
    </div>
  )
}
