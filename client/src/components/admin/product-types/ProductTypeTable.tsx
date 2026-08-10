'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Eye,
  Edit2,
  Copy,
  Archive,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  Download,
  Shirt,
  Flame,
  Layers,
  Sparkles,
  Shield,
  Activity,
  Sun,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { ProductType } from '@/lib/product-types/types';

interface Props {
  productTypes: ProductType[];
  selectedIds: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewDetails: (pt: ProductType) => void;
  onEdit: (pt: ProductType) => void;
  onDuplicate: (pt: ProductType) => void;
  onArchive: (pt: ProductType) => void;
  onDelete: (pt: ProductType) => void;
  onToggleStatus: (pt: ProductType) => void;
  onToggleFeatured: (pt: ProductType) => void;
  onBulkAction: (action: 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'delete' | 'export') => void;
}

export default function ProductTypeTable({
  productTypes,
  selectedIds,
  onSelectRow,
  onSelectAll,
  onViewDetails,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
  onBulkAction,
}: Props) {
  const isAllSelected =
    productTypes.length > 0 && productTypes.every((pt) => selectedIds.includes(pt.id));

  // Dynamic Lucide icon lookup
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4 text-amber-500" />;
      case 'Shirt': return <Shirt className="w-4 h-4 text-blue-500" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'Layers': return <Layers className="w-4 h-4 text-indigo-500" />;
      case 'Shield': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'Activity': return <Activity className="w-4 h-4 text-pink-500" />;
      case 'Sun': return <Sun className="w-4 h-4 text-orange-500" />;
      case 'Package': return <Package className="w-4 h-4 text-teal-500" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-cyan-500" />;
      default: return <Shirt className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-stone-900 text-white px-5 py-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-5 h-5 rounded-full bg-yellow-400 text-stone-950 font-black text-[10px] flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span>selected product types</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onBulkAction('activate')}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Activate
            </button>
            <button
              onClick={() => onBulkAction('deactivate')}
              className="flex items-center gap-1 px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-semibold transition text-xs"
            >
              <XCircle className="w-3.5 h-3.5" /> Deactivate
            </button>
            <button
              onClick={() => onBulkAction('feature')}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg transition text-xs"
            >
              <Star className="w-3.5 h-3.5 fill-current" /> Feature
            </button>
            <button
              onClick={() => onBulkAction('export')}
              className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-yellow-400 rounded-lg font-semibold transition text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export Selected
            </button>
            <button
              onClick={() => onBulkAction('delete')}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200/80 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-stone-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer w-4 h-4"
                />
              </th>
              <th className="p-4">Product Type</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Category</th>
              <th className="p-4">Gender Targets</th>
              <th className="p-4 text-center">Products</th>
              <th className="p-4 text-center">Featured</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Order</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {productTypes.length > 0 ? (
              productTypes.map((pt) => {
                const isSelected = selectedIds.includes(pt.id);

                return (
                  <tr
                    key={pt.id}
                    className={`hover:bg-yellow-50/40 transition ${
                      isSelected ? 'bg-yellow-50/70' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(pt.id)}
                        className="rounded border-stone-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer w-4 h-4"
                      />
                    </td>

                    {/* Image & Type Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 flex items-center justify-center">
                          {pt.image ? (
                            <Image
                              src={pt.image}
                              alt={pt.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            renderIcon(pt.icon)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-stone-100">{renderIcon(pt.icon)}</span>
                            <h4 className="font-bold text-stone-900 text-xs">{pt.name}</h4>
                          </div>
                          <p className="text-[11px] text-stone-400 line-clamp-1 max-w-[200px] mt-0.5">
                            {pt.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="p-4">
                      <code className="bg-stone-100 text-stone-700 font-mono text-[11px] px-2 py-0.5 rounded-md border border-stone-200/60">
                        {pt.slug}
                      </code>
                    </td>

                    {/* Parent Category */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/70 rounded-lg text-xs font-bold">
                        {pt.parentCategory}
                      </span>
                    </td>

                    {/* Gender Availability */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {pt.genderAvailability.map((g) => (
                          <span
                            key={g}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              g === 'Men'
                                ? 'bg-blue-100 text-blue-900'
                                : g === 'Women'
                                ? 'bg-pink-100 text-pink-900'
                                : 'bg-stone-100 text-stone-800'
                            }`}
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Products Count */}
                    <td className="p-4 text-center font-bold text-stone-900">
                      <span className="px-2.5 py-1 bg-stone-100 text-stone-900 rounded-lg border border-stone-200 text-xs">
                        {pt.productsCount}
                      </span>
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onToggleFeatured(pt)}
                        className={`p-1.5 rounded-xl transition ${
                          pt.featured
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-stone-100 text-stone-300 hover:text-stone-500'
                        }`}
                        title={pt.featured ? 'Featured on storefront' : 'Not featured'}
                      >
                        <Star className={`w-4 h-4 ${pt.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onToggleStatus(pt)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold border transition inline-flex items-center gap-1 ${
                          pt.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                            : pt.status === 'Inactive'
                            ? 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                            : 'bg-purple-100 text-purple-900 border-purple-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            pt.status === 'Active'
                              ? 'bg-emerald-600'
                              : pt.status === 'Inactive'
                              ? 'bg-stone-400'
                              : 'bg-purple-600'
                          }`}
                        />
                        {pt.status}
                      </button>
                    </td>

                    {/* Sort Order */}
                    <td className="p-4 text-center font-mono font-bold text-stone-700">
                      {pt.sortOrder}
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-stone-500 text-[11px] font-medium whitespace-nowrap">
                      {pt.createdDate}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="View Details"
                          onClick={() => onViewDetails(pt)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Edit Product Type"
                          onClick={() => onEdit(pt)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Duplicate"
                          onClick={() => onDuplicate(pt)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title={pt.status === 'Archived' ? 'Unarchive' : 'Archive'}
                          onClick={() => onArchive(pt)}
                          className="p-1.5 rounded-lg hover:bg-purple-50 text-stone-400 hover:text-purple-600 transition"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Product Type"
                          onClick={() => onDelete(pt)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={11} className="py-12 text-center">
                  <div className="max-w-xs mx-auto text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                      <Shirt className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">No Product Types Found</h3>
                    <p className="text-xs text-stone-500">
                      Try adjusting your search criteria or create a new apparel product type.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
