import { ArrowRight, Palette, Scissors, Printer } from "lucide-react";

const artCollections = [
  {
    id: "painted",
    title: "Painted",
    subtitle: "Collection",
    bg: "bg-amber-100",
    iconBg: "bg-amber-200",
    Icon: Palette,
  },
  {
    id: "thread",
    title: "Thread Work",
    subtitle: "Collection",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    Icon: Scissors,
  },
  {
    id: "printed",
    title: "Printed",
    subtitle: "Collection",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    Icon: Printer,
  },
];

interface ShopByArtProps {
  onTabChange?: (tabId: string) => void;
}

export default function ShopByArt({ onTabChange }: ShopByArtProps) {
  return (
    <section className="px-4 pt-4 pb-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h3 className="text-[15px] font-bold text-stone-900">Shop by Art</h3>
        <button
          onClick={() => onTabChange?.("painted")}
          className="text-[11px] font-semibold text-stone-500 flex items-center gap-1 hover:text-amber-700 transition-colors"
        >
          See All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Cards */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex gap-3 min-w-max">
          {artCollections.map((art) => {
            const Icon = art.Icon;
            return (
              <div
                key={art.id}
                onClick={() => onTabChange?.(art.id)}
                className={`${art.bg} w-[180px] min-w-[180px] rounded-3xl p-4 h-[125px] flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow active:scale-95 border border-stone-200/50`}
              >
                <div className={`${art.iconBg} w-9 h-9 rounded-2xl flex items-center justify-center`}>
                  <Icon className="w-4.5 h-4.5 text-amber-800" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-stone-900 leading-tight">{art.title}</p>
                  <p className="text-[10px] text-stone-500 font-medium">{art.subtitle}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-stone-700" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
