'use client';

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
  Sparkles,
  Shield,
  Sun,
  MessageSquare,
  Gamepad2,
} from 'lucide-react';
import { Theme } from '@/lib/themes/types';

interface Props {
  themes: Theme[];
  selectedIds: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewDetails: (theme: Theme) => void;
  onEdit: (theme: Theme) => void;
  onDuplicate: (theme: Theme) => void;
  onArchive: (theme: Theme) => void;
  onDelete: (theme: Theme) => void;
  onToggleStatus: (theme: Theme) => void;
  onToggleFeatured: (theme: Theme) => void;
  onBulkAction: (action: 'activate' | 'deactivate' | 'feature' | 'archive' | 'delete' | 'export') => void;
}

export default function ThemeTable({
  themes,
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
    themes.length > 0 && themes.every((t) => selectedIds.includes(t.id));

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-red-500" />;
      case 'Shield': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'Sun': return <Sun className="w-4 h-4 text-emerald-500" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4 text-purple-500" />;
      default: return <Sparkles className="w-4 h-4 text-yellow-500" />;
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
            <span>selected themes</span>
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
              <th className="p-4">Theme</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Compatible Collections</th>
              <th className="p-4 text-center">Products</th>
              <th className="p-4 text-center">Views</th>
              <th className="p-4 text-center">Featured</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Created Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {themes.length > 0 ? (
              themes.map((theme) => {
                const isSelected = selectedIds.includes(theme.id);

                return (
                  <tr
                    key={theme.id}
                    className={`hover:bg-yellow-50/40 transition ${
                      isSelected ? 'bg-yellow-50/70' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(theme.id)}
                        className="rounded border-stone-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer w-4 h-4"
                      />
                    </td>

                    {/* Banner & Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 flex items-center justify-center">
                          {theme.thumbnailImage || theme.bannerImage ? (
                            <Image
                              src={theme.thumbnailImage || theme.bannerImage!}
                              alt={theme.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            renderIcon(theme.icon)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="p-0.5 bg-stone-100 rounded">{renderIcon(theme.icon)}</span>
                            <h4 className="font-bold text-stone-900 text-xs">{theme.name}</h4>
                            {theme.marketing.campaignLabel && (
                              <span className="px-1.5 py-0.2 bg-yellow-400 text-stone-950 text-[9px] font-black rounded uppercase">
                                {theme.marketing.campaignLabel}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 line-clamp-1 max-w-[220px] mt-0.5">
                            {theme.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="p-4">
                      <code className="bg-stone-100 text-stone-700 font-mono text-[11px] px-2 py-0.5 rounded-md border border-stone-200/60">
                        {theme.slug}
                      </code>
                    </td>

                    {/* Compatible Collections */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {theme.compatibleCollections.map((col) => (
                          <span
                            key={col}
                            className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-[10px] font-bold"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Products Count */}
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 bg-stone-100 text-stone-900 font-bold rounded-lg text-xs border border-stone-200/60">
                        {theme.productsCount}
                      </span>
                    </td>

                    {/* Store Views */}
                    <td className="p-4 text-center font-bold text-stone-700">
                      {theme.analytics.views.toLocaleString()}
                    </td>

                    {/* Featured Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onToggleFeatured(theme)}
                        className={`p-1.5 rounded-xl transition ${
                          theme.featured
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'bg-stone-100 text-stone-300 hover:text-stone-500'
                        }`}
                        title={theme.featured ? 'Featured on storefront' : 'Not featured'}
                      >
                        <Star className={`w-4 h-4 ${theme.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onToggleStatus(theme)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold border transition inline-flex items-center gap-1 ${
                          theme.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            theme.status === 'Active' ? 'bg-emerald-600' : 'bg-stone-400'
                          }`}
                        />
                        {theme.status}
                      </button>
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-stone-500 text-[11px] font-medium whitespace-nowrap">
                      {theme.createdDate}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="View Details"
                          onClick={() => onViewDetails(theme)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Edit Theme"
                          onClick={() => onEdit(theme)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Duplicate"
                          onClick={() => onDuplicate(theme)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title={theme.status === 'Archived' ? 'Unarchive' : 'Archive'}
                          onClick={() => onArchive(theme)}
                          className="p-1.5 rounded-lg hover:bg-purple-50 text-stone-400 hover:text-purple-600 transition"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Theme"
                          onClick={() => onDelete(theme)}
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
                <td colSpan={10} className="py-12 text-center">
                  <div className="max-w-xs mx-auto text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">No Themes Found</h3>
                    <p className="text-xs text-stone-500">
                      Try adjusting your search criteria or create a new artwork theme.
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
