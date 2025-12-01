import { useState } from 'react'

export default function MenuTabs() {
  const [active, setActive] = useState(0);
  const tabs = [
    "Normal Menu",
    "Diskon Special",
    "Promo Tahun Baru",
    "Makanan Penutup",
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((t, i) => (

<button
  key={i}
  onClick={() => setActive(i)}
  className={`px-4 py-2 transition cursor-pointer flex flex-col
    ${
      active === i
        ? 'rounded-t-lg bg-[#737373] text-white scale-105 shadow-md'
        : 'rounded-t-lg bg-[#52bfbe] text-white hover:bg-[#737373]/70'
    }`}
>
  {t}
</button>

      ))}
    </div>
  );
}
