import { Edit, Trash2 } from "lucide-react";

export default function ProductRow({ data, index }: any) {
  return (
    <tr className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
      <td className="p-3">
        <input type="checkbox" />
      </td>

      <td className="p-3 flex items-center gap-3">
        <img src={data.img} className="w-14 h-14 rounded-md" />
        <div>
          <div className="font-semibold text-gray-700">{data.name}</div>
          <div className="text-xs text-gray-500">{data.desc}</div>
        </div>
      </td>

      <td className="p-3 text-sm text-gray-700">{data.id}</td>
      <td className="p-3 text-gray-700">{data.stock}</td>
      <td className="p-3 text-gray-700">{data.category}</td>
      <td className="p-3 font-semibold text-gray-700">Rp. {data.price}</td>

      <td className="p-3 text-green-600">Tersedia</td>

      <td className="p-3 flex gap-3">
        <button 
          className="p-2 bg-gray-100 text-gray-700 hover:bg-[#3ABAB4] hover:text-white rounded transition-all"
        >
          <Edit size={16} />
        </button>

        <button
          className="p-2 bg-gray-100 text-red-500 hover:bg-[#3ABAB4] hover:text-white rounded transition-all"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
