'use client';

import { useEffect, useState } from "react";
import { fetchCollectionsAPI, fetchCategoriesAPI, fetchProductTypesAPI, fetchThemesAPI } from "@/lib/api/catalog";

interface FilterBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

interface FilterTab {
  id: string;
  label: string;
  icon?: string;
  type?: 'all' | 'collection' | 'category' | 'type' | 'theme';
}

const DEFAULT_FILTERS: FilterTab[] = [
  { id: "all", label: "All", icon: "✨", type: "all" },
  { id: "painted", label: "Painted", icon: "🎨", type: "collection" },
  { id: "thread", label: "Thread Work", icon: "🧵", type: "collection" },
  { id: "printed", label: "Printed", icon: "🖨️", type: "collection" },
  { id: "hoodies", label: "Hoodies", icon: "🧥", type: "type" },
  { id: "t-shirts", label: "T-Shirts", icon: "👕", type: "type" },
  { id: "kurtas", label: "Kurtas", icon: "🥻", type: "type" },
  { id: "anime", label: "Anime", icon: "🐉", type: "theme" },
  { id: "oversized", label: "Oversized", icon: "⚡", type: "category" },
];

export default function FilterBar({ activeTab = "all", onTabChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterTab[]>(DEFAULT_FILTERS);

  useEffect(() => {
    async function loadAllFilters() {
      try {
        const [cols, cats, types, themes] = await Promise.allSettled([
          fetchCollectionsAPI(),
          fetchCategoriesAPI(),
          fetchProductTypesAPI(),
          fetchThemesAPI(),
        ]);

        const loadedCols = cols.status === 'fulfilled' ? cols.value : [];
        const loadedCats = cats.status === 'fulfilled' ? cats.value : [];
        const loadedTypes = types.status === 'fulfilled' ? types.value : [];
        const loadedThemes = themes.status === 'fulfilled' ? themes.value : [];

        const dynamicTabs: FilterTab[] = [{ id: "all", label: "All", icon: "✨", type: "all" }];
        const addedIds = new Set(["all"]);

        // 1. Collections (Art styles: Painted, Thread Work, Printed, etc.)
        loadedCols
          .filter((c) => c.status === "Active" || !c.status)
          .forEach((c) => {
            const id = c.slug || c.name.toLowerCase().replace(/\s+/g, "-");
            if (!addedIds.has(id)) {
              addedIds.add(id);
              dynamicTabs.push({ id, label: c.name, type: 'collection' });
            }
          });

        // 2. Product Types (Hoodies, T-Shirts, Kurtas, etc.)
        loadedTypes
          .filter((t) => t.status === "Active" || !t.status)
          .forEach((t) => {
            const id = t.slug || t.name.toLowerCase().replace(/\s+/g, "-");
            if (!addedIds.has(id)) {
              addedIds.add(id);
              dynamicTabs.push({ id, label: t.name, type: 'type' });
            }
          });

        // 3. Themes (Anime, Kalamkari, Cyberpunk, etc.)
        loadedThemes
          .filter((th) => th.status === "Active" || !th.status)
          .forEach((th) => {
            const id = th.slug || th.name.toLowerCase().replace(/\s+/g, "-");
            if (!addedIds.has(id)) {
              addedIds.add(id);
              dynamicTabs.push({ id, label: th.name, type: 'theme' });
            }
          });

        // 4. Categories (Men, Women, Kids, Oversized, etc.)
        loadedCats
          .filter((cat) => cat.status === "Active" || !cat.status)
          .forEach((cat) => {
            const id = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
            if (!addedIds.has(id)) {
              addedIds.add(id);
              dynamicTabs.push({ id, label: cat.name, type: 'category' });
            }
          });

        if (dynamicTabs.length > 1) {
          setFilters(dynamicTabs);
        }
      } catch (err) {
        console.log("Using default fallback filter tabs");
      }
    }
    loadAllFilters();
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-[#f4f0e6] transition-colors duration-300 font-sans">
      {/* Folder tab strip */}
      <div className="flex items-stretch gap-1.5 overflow-x-auto no-scrollbar pt-2 px-2 bg-[#f4f0e6]">
        {filters.map((f) => {
          const isActive = activeTab === f.id || activeTab === f.label.toLowerCase();
          return (
            <button
              key={f.id}
              onClick={() => onTabChange?.(f.id)}
              className={`
                relative flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12.5px] font-bold
                transition-all duration-200 whitespace-nowrap cursor-pointer rounded-t-xl
                ${isActive
                  ? "bg-white text-stone-950 font-black z-10 border-t-3 border-t-[#facc15] shadow-xs"
                  : "bg-white/80 mb-1 text-stone-700 hover:text-stone-950 hover:bg-white"
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
