'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronRight, Plus, Minus, History, MapPin, Layers, Sparkles } from 'lucide-react';
import { InventoryItem } from '@/lib/inventory/types';

interface Props {
  items: InventoryItem[];
  onOpenAdjust: (item: InventoryItem, quickDelta?: number) => void;
  onOpenLogs: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

interface ProductGroup {
  productTitle: string;
  category: string;
  location: string;
  productImage: string;
  totalStock: number;
  totalReserved: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  variants: InventoryItem[];
}

export default function InventoryTable({
  items,
  onOpenAdjust,
  onOpenLogs,
}: Props) {
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  const toggleExpand = (title: string) => {
    setExpandedProducts((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Group inventory items by productTitle
  const groupedProducts = useMemo(() => {
    const groupsMap: Record<string, ProductGroup> = {};

    items.forEach((item) => {
      const title = item.productTitle || 'Uncategorized Product';
      if (!groupsMap[title]) {
        groupsMap[title] = {
          productTitle: title,
          category: item.category || 'Tops',
          location: item.location || 'Main Warehouse (WH-01)',
          productImage:
            item.productImage ||
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
          totalStock: 0,
          totalReserved: 0,
          status: 'In Stock',
          variants: [],
        };
      }

      groupsMap[title].variants.push(item);
      groupsMap[title].totalStock += item.availableStock || 0;
      groupsMap[title].totalReserved += item.reservedStock || 0;
    });

    // Compute status per product group
    Object.values(groupsMap).forEach((group) => {
      if (group.totalStock === 0) group.status = 'Out of Stock';
      else if (group.variants.some((v) => v.status === 'Low Stock')) group.status = 'Low Stock';
      else group.status = 'In Stock';
    });

    return Object.values(groupsMap);
  }, [items]);

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col p-4 sm:p-5">
      <div className="overflow-x-auto border border-stone-200/80 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200/80 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3.5 w-10"></th>
              <th className="p-3.5">Product & Category</th>
              <th className="p-3.5">Warehouse Location</th>
              <th className="p-3.5 text-center">Variants Count</th>
              <th className="p-3.5 text-center">Total Available Stock</th>
              <th className="p-3.5 text-center">Reserved</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100 font-sans">
            {groupedProducts.length > 0 ? (
              groupedProducts.map((group) => {
                const isExpanded = !!expandedProducts[group.productTitle];

                return (
                  <tr key={group.productTitle} className="contents group">
                    {/* Master Product Parent Row */}
                    <td
                      colSpan={8}
                      className="p-0 border-b border-stone-100"
                    >
                      <div
                        onClick={() => toggleExpand(group.productTitle)}
                        className={`flex items-center justify-between p-3.5 cursor-pointer transition select-none ${
                          isExpanded ? 'bg-yellow-50/70' : 'hover:bg-stone-50'
                        }`}
                      >
                        {/* Expand Chevron & Thumbnail + Title */}
                        <div className="flex items-center gap-3 min-w-[280px]">
                          <button
                            type="button"
                            className="p-1 rounded-lg text-stone-400 group-hover:text-stone-950 transition"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-stone-900" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-stone-400" />
                            )}
                          </button>

                          <div className="relative w-10 h-10 rounded-xl bg-stone-900 overflow-hidden flex-shrink-0 border border-stone-200 shadow-2xs">
                            <Image
                              src={group.productImage}
                              alt=""
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <h4 className="font-black text-stone-900 text-xs">
                              {group.productTitle}
                            </h4>
                            <span className="text-[10px] text-stone-400 font-semibold">
                              {group.category}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-stone-700 font-medium text-xs">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>{group.location}</span>
                        </div>

                        {/* Variant Count Pill */}
                        <div className="text-center">
                          <span className="px-2.5 py-1 bg-stone-100 text-stone-800 font-extrabold text-[11px] rounded-xl border border-stone-200/80 inline-flex items-center gap-1">
                            <Layers className="w-3 h-3 text-stone-500" />
                            {group.variants.length} {group.variants.length === 1 ? 'Variant' : 'Variants'}
                          </span>
                        </div>

                        {/* Total Stock */}
                        <div className="text-center font-mono">
                          <span className="font-black text-sm text-stone-950">
                            {group.totalStock} units
                          </span>
                        </div>

                        {/* Reserved Stock */}
                        <div className="text-center font-mono font-bold text-stone-500">
                          {group.totalReserved}
                        </div>

                        {/* Combined Status Badge */}
                        <div className="text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                              group.status === 'In Stock'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : group.status === 'Low Stock'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-red-100 text-red-900 border-red-300'
                            }`}
                          >
                            {group.status}
                          </span>
                        </div>

                        {/* Toggle Variants Action Button */}
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(group.productTitle);
                            }}
                            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition shadow-2xs inline-flex items-center gap-1"
                          >
                            <span>{isExpanded ? 'Hide Variants' : 'View Variants'}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Nested Variant Breakdown Table (Revealed when Expanded) */}
                      {isExpanded && (
                        <div className="bg-stone-950 text-white p-4 sm:p-5 border-t border-stone-800 animate-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                              Variant Stock Matrix ({group.variants.length} SKUs)
                            </h5>
                            <span className="text-[11px] text-stone-400">
                              Click +/- buttons to adjust stock for individual variants
                            </span>
                          </div>

                          <div className="border border-stone-800 rounded-xl overflow-hidden bg-stone-900/90 text-xs">
                            <table className="w-full text-left">
                              <thead className="bg-stone-800/90 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                  <th className="p-3">Variant SKU</th>
                                  <th className="p-3">Color & Size Options</th>
                                  <th className="p-3 text-center">Available Stock</th>
                                  <th className="p-3 text-center">Status</th>
                                  <th className="p-3 text-right">Variant Quick Stock Adjust</th>
                                </tr>
                              </thead>

                              <tbody className="divide-y divide-stone-800">
                                {group.variants.map((v) => (
                                  <tr key={v.id} className="hover:bg-stone-800/50 transition">
                                    <td className="p-3">
                                      <code className="font-mono font-bold text-yellow-400 text-xs block">
                                        {v.sku}
                                      </code>
                                    </td>

                                    <td className="p-3">
                                      <div className="flex items-center gap-2 font-bold text-stone-200">
                                        {v.color && (
                                          <span className="px-2 py-0.5 bg-stone-800 rounded border border-stone-700 text-[11px]">
                                            🎨 {v.color}
                                          </span>
                                        )}
                                        {v.size && (
                                          <span className="px-2 py-0.5 bg-stone-800 rounded border border-stone-700 text-[11px]">
                                            📏 Size: {v.size}
                                          </span>
                                        )}
                                        {!v.color && !v.size && <span className="text-stone-500">Standard Variant</span>}
                                      </div>
                                    </td>

                                    <td className="p-3 text-center">
                                      <span className="font-mono font-black text-sm text-emerald-400">
                                        {v.availableStock} units
                                      </span>
                                    </td>

                                    <td className="p-3 text-center">
                                      <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                          v.status === 'In Stock'
                                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                                            : v.status === 'Low Stock'
                                            ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                                            : 'bg-red-900/60 text-red-300 border border-red-700'
                                        }`}
                                      >
                                        {v.status}
                                      </span>
                                    </td>

                                    <td className="p-3 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => onOpenAdjust(v, 5)}
                                          className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold rounded-lg transition flex items-center gap-1"
                                          title="Add 5 Units"
                                        >
                                          <Plus className="w-3 h-3" /> 5
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => onOpenAdjust(v, -5)}
                                          className="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 text-xs font-extrabold rounded-lg transition flex items-center gap-1"
                                          title="Deduct 5 Units"
                                        >
                                          <Minus className="w-3 h-3" /> 5
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => onOpenAdjust(v)}
                                          className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-stone-950 text-xs font-black rounded-lg transition shadow-xs"
                                        >
                                          Custom Adjust
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => onOpenLogs(v)}
                                          className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition"
                                          title="View SKU Audit History Logs"
                                        >
                                          <History className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs text-stone-400">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
