'use client';

import { useState, useMemo, Fragment } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  History,
  MapPin,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
} from 'lucide-react';
import { InventoryItem } from '@/lib/inventory/types';
import { formatImageUrl } from '@/lib/api/client';

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
          productImage: formatImageUrl(item.productImage),
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

  const statusBadgeStyle = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Low Stock':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Out of Stock':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="bg-white border border-stone-200/90 rounded-3xl shadow-xs overflow-hidden font-sans">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200/80 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4 w-10"></th>
              <th className="py-3.5 px-4">Product Details</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4 text-center">Variants</th>
              <th className="py-3.5 px-4 text-center">Available Stock</th>
              <th className="py-3.5 px-4 text-center">Reserved</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Fulfillment Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {groupedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-xs text-stone-400 font-medium">
                  No inventory items match the selected filter criteria.
                </td>
              </tr>
            ) : (
              groupedProducts.map((group) => {
                const isExpanded = !!expandedProducts[group.productTitle];

                return (
                  <Fragment key={group.productTitle}>
                    {/* Primary Product Row */}
                    <tr
                      onClick={() => toggleExpand(group.productTitle)}
                      className={`cursor-pointer transition-colors ${
                        isExpanded ? 'bg-amber-50/60' : 'hover:bg-stone-50/80'
                      }`}
                    >
                      {/* Chevron */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          className="p-1 rounded-lg text-stone-400 group-hover:text-stone-900 transition"
                        >
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-90 text-amber-700' : ''
                            }`}
                          />
                        </button>
                      </td>

                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 shadow-2xs">
                            <Image
                              src={group.productImage}
                              alt={group.productTitle}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-stone-950 text-xs leading-tight">
                              {group.productTitle}
                            </h4>
                            <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                              {group.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-stone-700 font-medium text-xs">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{group.location}</span>
                        </div>
                      </td>

                      {/* Variants Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 font-extrabold text-[11px] rounded-xl border border-stone-200">
                          <Layers className="w-3 h-3 text-stone-500" />
                          {group.variants.length} SKU{group.variants.length !== 1 ? 's' : ''}
                        </span>
                      </td>

                      {/* Available Stock */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-black text-sm text-stone-950 font-mono">
                          {group.totalStock.toLocaleString('en-IN')} <span className="text-[10px] text-stone-400 font-sans font-normal">units</span>
                        </span>
                      </td>

                      {/* Reserved Stock */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-stone-500">
                        {group.totalReserved}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeStyle(
                            group.status
                          )}`}
                        >
                          {group.status === 'In Stock' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {group.status === 'Low Stock' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          {group.status === 'Out of Stock' && <XCircle className="w-3 h-3 text-red-600" />}
                          <span>{group.status}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(group.productTitle);
                          }}
                          className="px-3.5 py-1.5 bg-stone-950 hover:bg-black text-white text-[11px] font-bold rounded-xl transition shadow-2xs inline-flex items-center gap-1.5 active:scale-95"
                        >
                          <span>{isExpanded ? 'Hide Matrix' : 'Manage SKUs'}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-amber-400' : 'text-stone-400'
                            }`}
                          />
                        </button>
                      </td>
                    </tr>

                    {/* Nested Variant Breakdown Matrix (Revealed when Expanded) */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="p-0 bg-stone-950 text-white">
                          <div className="p-4 sm:p-5 space-y-3 animate-fadeIn">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <h5 className="text-xs font-black text-white uppercase tracking-wider">
                                  Variant Stock Matrix — {group.productTitle} ({group.variants.length} SKUs)
                                </h5>
                              </div>
                              <span className="text-[10px] text-stone-400 font-semibold">
                                Adjust stock levels or review audit history logs per SKU
                              </span>
                            </div>

                            <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-900/90 text-xs">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-stone-800/90 text-stone-400 font-bold uppercase tracking-wider text-[10px] border-b border-stone-800">
                                    <th className="py-2.5 px-4">SKU Code</th>
                                    <th className="py-2.5 px-4">Color & Size Options</th>
                                    <th className="py-2.5 px-4 text-center">Available Stock</th>
                                    <th className="py-2.5 px-4 text-center">Status</th>
                                    <th className="py-2.5 px-4 text-right">Quick Stock Adjustment</th>
                                  </tr>
                                </thead>

                                <tbody className="divide-y divide-stone-800 font-sans">
                                  {group.variants.map((v) => (
                                    <tr key={v.id} className="hover:bg-stone-800/60 transition">
                                      <td className="py-3 px-4">
                                        <code className="font-mono font-bold text-yellow-400 text-xs bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                                          {v.sku}
                                        </code>
                                      </td>

                                      <td className="py-3 px-4">
                                        <div className="flex items-center gap-2 font-bold text-stone-200">
                                          {v.color && (
                                            <span className="px-2 py-0.5 bg-stone-800 rounded-md border border-stone-700 text-[11px]">
                                              🎨 {v.color}
                                            </span>
                                          )}
                                          {v.size && (
                                            <span className="px-2 py-0.5 bg-stone-800 rounded-md border border-stone-700 text-[11px]">
                                              📏 Size: {v.size}
                                            </span>
                                          )}
                                          {!v.color && !v.size && <span className="text-stone-500">Standard Variant</span>}
                                        </div>
                                      </td>

                                      <td className="py-3 px-4 text-center">
                                        <span className="font-mono font-black text-sm text-emerald-400">
                                          {v.availableStock} units
                                        </span>
                                      </td>

                                      <td className="py-3 px-4 text-center">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                            v.status === 'In Stock'
                                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                              : v.status === 'Low Stock'
                                              ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                                              : 'bg-red-950/80 text-red-300 border-red-700'
                                          }`}
                                        >
                                          {v.status}
                                        </span>
                                      </td>

                                      <td className="py-3 px-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                          <button
                                            type="button"
                                            onClick={() => onOpenAdjust(v, 5)}
                                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-lg transition flex items-center gap-1 active:scale-95"
                                            title="Add 5 Units"
                                          >
                                            <Plus className="w-3 h-3" /> 5
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => onOpenAdjust(v, -5)}
                                            className="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-lg transition flex items-center gap-1 active:scale-95"
                                            title="Deduct 5 Units"
                                          >
                                            <Minus className="w-3 h-3" /> 5
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => onOpenAdjust(v)}
                                            className="px-3 py-1 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-black rounded-lg transition shadow-2xs active:scale-95 flex items-center gap-1"
                                          >
                                            <Edit3 className="w-3 h-3" /> Adjust
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => onOpenLogs(v)}
                                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                                            title="Audit Logs"
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
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="lg:hidden p-4 space-y-3">
        {groupedProducts.map((group) => {
          const isExpanded = !!expandedProducts[group.productTitle];

          return (
            <div
              key={group.productTitle}
              className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                    <Image src={group.productImage} alt="" fill unoptimized className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-950 text-xs leading-snug">{group.productTitle}</h4>
                    <p className="text-[10px] text-stone-400 font-semibold uppercase">{group.category}</p>
                    <p className="text-[11px] text-amber-700 font-bold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-600" /> {group.location}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusBadgeStyle(
                    group.status
                  )}`}
                >
                  {group.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Total Stock</span>
                  <span className="font-black text-stone-950 font-mono text-sm">{group.totalStock} units</span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpand(group.productTitle)}
                  className="px-3.5 py-1.5 bg-stone-950 text-white text-xs font-bold rounded-xl flex items-center gap-1 active:scale-95 transition"
                >
                  <span>{isExpanded ? 'Hide SKUs' : `Manage (${group.variants.length}) SKUs`}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Mobile Expanded Variants */}
              {isExpanded && (
                <div className="bg-stone-950 text-white rounded-xl p-3 space-y-2 mt-2">
                  <h5 className="text-[10px] font-black text-yellow-400 uppercase tracking-wider">
                    Variant SKUs ({group.variants.length})
                  </h5>
                  <div className="space-y-2">
                    {group.variants.map((v) => (
                      <div key={v.id} className="p-2.5 bg-stone-900 rounded-lg border border-stone-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <code className="font-mono text-yellow-400 font-bold text-[11px]">{v.sku}</code>
                          <span className="font-black text-emerald-400 font-mono">{v.availableStock} in stock</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-stone-300 font-bold">{v.color} · {v.size}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenAdjust(v, 5)}
                              className="px-2 py-0.5 bg-emerald-600/30 text-emerald-300 rounded font-bold"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => onOpenAdjust(v, -5)}
                              className="px-2 py-0.5 bg-amber-600/30 text-amber-300 rounded font-bold"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => onOpenAdjust(v)}
                              className="px-2 py-0.5 bg-yellow-400 text-stone-950 rounded font-black text-[10px]"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
