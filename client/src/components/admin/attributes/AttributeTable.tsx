'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  Download,
  GitMerge,
  ArrowUpDown,
  Tag,
  Palette,
} from 'lucide-react';
import { AttributeGroup, AttributeValueItem } from '@/lib/attributes/types';

interface Props {
  group: AttributeGroup | null;
  values: AttributeValueItem[];
  selectedIds: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onAddValue: () => void;
  onEditValue: (val: AttributeValueItem) => void;
  onDuplicateValue: (val: AttributeValueItem) => void;
  onDeleteValue: (val: AttributeValueItem) => void;
  onToggleStatus: (val: AttributeValueItem) => void;
  onBulkAction: (action: 'activate' | 'deactivate' | 'delete' | 'export' | 'merge') => void;
}

export default function AttributeTable({
  group,
  values,
  selectedIds,
  onSelectRow,
  onSelectAll,
  onAddValue,
  onEditValue,
  onDuplicateValue,
  onDeleteValue,
  onToggleStatus,
  onBulkAction,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  if (!group) {
    return (
      <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center text-stone-400 space-y-3">
        <Tag className="w-10 h-10 mx-auto text-stone-300" />
        <h3 className="text-sm font-bold text-stone-700">Select an Attribute Group</h3>
        <p className="text-xs text-stone-400 max-w-xs mx-auto">
          Select an attribute group on the left (Colors, Sizes, Materials) to view and manage its values.
        </p>
      </div>
    );
  }

  const filteredValues = values.filter((v) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = v.name.toLowerCase().includes(q);
      const matchLabel = v.displayLabel.toLowerCase().includes(q);
      if (!matchName && !matchLabel) return false;
    }
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;
    return true;
  });

  const isAllSelected =
    filteredValues.length > 0 && filteredValues.every((v) => selectedIds.includes(v.id));

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col space-y-4 p-4 sm:p-5">
      {/* Header Banner for Group */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 bg-yellow-400 text-stone-950 font-black text-[10px] uppercase rounded">
              {group.type}
            </span>
            <span className="text-xs font-bold text-stone-400">• {values.length} values total</span>
          </div>
          <h2 className="text-xl font-black text-stone-950 tracking-tight">{group.name} Values</h2>
          <p className="text-xs text-stone-500 mt-0.5">{group.description}</p>
        </div>

        <button
          onClick={onAddValue}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-xs transition flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add {group.name} Value
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${group.name.toLowerCase()} values (e.g. Black, XS, Cotton)...`}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-stone-900 text-white px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-5 h-5 rounded-full bg-yellow-400 text-stone-950 font-black text-[10px] flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span>selected values</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkAction('activate')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
            >
              Activate
            </button>
            <button
              onClick={() => onBulkAction('deactivate')}
              className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-semibold text-xs"
            >
              Deactivate
            </button>
            <button
              onClick={() => onBulkAction('merge')}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center gap-1"
            >
              <GitMerge className="w-3 h-3" /> Merge
            </button>
            <button
              onClick={() => onBulkAction('delete')}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Values Table */}
      <div className="overflow-x-auto border border-stone-200/80 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200/80 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-stone-300 text-yellow-500 cursor-pointer w-4 h-4"
                />
              </th>
              <th className="p-3.5">Value</th>
              <th className="p-3.5">Display Label</th>
              {group.type === 'Color Picker' && <th className="p-3.5 text-center">Color Swatch</th>}
              <th className="p-3.5 text-center">Sort Order</th>
              <th className="p-3.5 text-center">Products Count</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {filteredValues.length > 0 ? (
              filteredValues.map((val) => {
                const isSelected = selectedIds.includes(val.id);

                return (
                  <tr
                    key={val.id}
                    className={`hover:bg-yellow-50/40 transition ${
                      isSelected ? 'bg-yellow-50/70' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(val.id)}
                        className="rounded border-stone-300 text-yellow-500 cursor-pointer w-4 h-4"
                      />
                    </td>

                    <td className="p-3.5 font-extrabold text-stone-900">{val.name}</td>
                    <td className="p-3.5 font-semibold text-stone-700">{val.displayLabel}</td>

                    {group.type === 'Color Picker' && (
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs inline-block"
                            style={{ backgroundColor: val.colorHex || '#000000' }}
                          />
                          <code className="text-[10px] font-mono text-stone-500">{val.colorHex}</code>
                        </div>
                      </td>
                    )}

                    <td className="p-3.5 text-center font-mono font-bold text-stone-600">
                      {val.sortOrder}
                    </td>

                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 bg-stone-100 text-stone-900 font-bold rounded-lg border border-stone-200">
                        {val.productsCount} Products
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onToggleStatus(val)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border transition ${
                          val.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-stone-100 text-stone-500 border-stone-300'
                        }`}
                      >
                        {val.status}
                      </button>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditValue(val)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition"
                          title="Edit Value"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicateValue(val)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition"
                          title="Duplicate Value"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteValue(val)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
                          title="Delete Value"
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
                <td colSpan={8} className="py-10 text-center text-xs text-stone-400">
                  No values found matching search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
