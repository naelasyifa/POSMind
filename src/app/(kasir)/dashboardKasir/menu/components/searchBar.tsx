import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-70 mb-2">
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
      <input
        type="text"
        placeholder="Cari produk..."
        className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-gray-400 focus:outline-none"
      />
    </div>
  );
}
