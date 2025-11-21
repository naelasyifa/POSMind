import { Edit, Trash2 } from "lucide-react";

export default function ProductRow({ data }: any) {
  return (
    <tr className="border-b">
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

      <td className="p-3 text-sm">{data.id}</td>
      <td className="p-3">{data.stock}</td>
      <td className="p-3">{data.category}</td>
      <td className="p-3 font-semibold">${data.price}</td>

      <td className="p-3 text-green-600">Tersedia</td>

      <td className="p-3 flex gap-3">
        <button 
        className="p-2 bg-gray-100 hover:bg-[#3ABAB4] hover:text-white rounded transition-all">
          <Edit className=" text-gray-700" size={16} />
        </button>
        <button
        className="p-2 bg-gray-100 hover:bg-[#3ABAB4] hover:text-white rounded transition-all">
          <Trash2 className="text-red-500 cursor-pointer" size={18} />
        </button>
      </td>
    </tr>
  );
}
