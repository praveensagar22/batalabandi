'use client';

import { useEffect, useState } from "react";
import { fetchCollectionsAPI } from "@/lib/api/catalog";

interface FilterBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

interface FilterTab {
  id: string;
  label: string;
  icon?: string;
}

const DEFAULT_FILTERS: FilterTab[] = [
  { id: "all", label: "All" },
  { id: "painted", label: "Painted", icon: "🎨" },
  { id: "thread", label: "Thread Work", icon: "🧵" },
  { id: "printed", label: "Printed", icon: "🖨️" },
];

export default function FilterBar({ activeTab = "all", onTabChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterTab[]>(DEFAULT_FILTERS);

  useEffect(() => {
    async function loadCollections() {
      try {
        const collections = await fetchCollectionsAPI();
        if (collections && collections.length > 0) {
          const dynamicTabs: FilterTab[] = [
            { id: "all", label: "All" },
            ...collections
              .filter((c) => c.status === "Active" || !c.status)
              .map((c) => ({
                id: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
                label: c.name,
                icon: c.icon ? undefined : "✨",
              })),
          ];
          setFilters(dynamicTabs);
        }
      } catch (err) {
        console.log("Using default fallback filter tabs");
      }
    }
    loadCollections();
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-[#f4f0e6] transition-colors duration-300 font-sans">
      {/* Folder tab strip */}
      <div className="flex items-stretch gap-1 overflow-x-auto no-scrollbar pt-2 px-2 bg-[#f4f0e6]">
        {filters.map((f) => {
          const isActive = activeTab === f.id || activeTab === f.label.toLowerCase();
          return (
            <button
              key={f.id}
              onClick={() => onTabChange?.(f.id)}
              className={`
                relative flex items-center justify-center gap-1.5 px-5 py-3 text-[13px] font-bold
                transition-all duration-200 flex-1 whitespace-nowrap cursor-pointer 
                ${isActive
                  ? "bg-white text-stone-950 font-black z-10 pt-2 rounded-t-xl border-t-3 border-t-[#facc15] shadow-xs"
                  : "bg-white/80 mb-2 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-white"
                }
              `}
              aria-selected={isActive}
            >
              {f.icon && <span className="text-xs">{f.icon}</span>}
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
