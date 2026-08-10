'use client';

import { useState } from 'react';
import {
  Palette,
  Ruler,
  Layers,
  Shirt,
  Scissors,
  Circle,
  Sparkles,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Tag,
  Search,
} from 'lucide-react';
import { AttributeGroup } from '@/lib/attributes/types';

interface Props {
  attributes: AttributeGroup[];
  selectedId: string | null;
  onSelect: (group: AttributeGroup) => void;
  onCreateGroup: () => void;
  onEditGroup: (group: AttributeGroup) => void;
}

export default function AttributeSidebar({
  attributes,
  selectedId,
  onSelect,
  onCreateGroup,
  onEditGroup,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Palette': return <Palette className="w-4 h-4 text-amber-500" />;
      case 'Ruler': return <Ruler className="w-4 h-4 text-blue-500" />;
      case 'Layers': return <Layers className="w-4 h-4 text-purple-500" />;
      case 'Shirt': return <Shirt className="w-4 h-4 text-emerald-500" />;
      case 'Scissors': return <Scissors className="w-4 h-4 text-pink-500" />;
      case 'Circle': return <Circle className="w-4 h-4 text-amber-600" />;
      default: return <Tag className="w-4 h-4 text-yellow-600" />;
    }
  };

  const filteredAttributes = attributes.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-3 flex flex-col h-full">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-stone-900">Attribute Groups</h3>
          <p className="text-[11px] text-stone-400">Reusable catalog options</p>
        </div>
        <button
          onClick={onCreateGroup}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" /> Group
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter groups (Color, Size)..."
          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 outline-none focus:border-yellow-400 transition"
        />
      </div>

      {/* Attribute Groups List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar min-h-[350px]">
        {filteredAttributes.length > 0 ? (
          filteredAttributes.map((group) => {
            const isSelected = selectedId === group.id;

            return (
              <div
                key={group.id}
                onClick={() => onSelect(group)}
                className={`group relative p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-yellow-50/90 border-yellow-400 shadow-xs ring-2 ring-yellow-400/40'
                    : 'bg-stone-50/70 border-stone-200/80 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-white border border-stone-200/80 flex-shrink-0 shadow-2xs">
                    {renderIcon(group.icon)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-stone-900 truncate">{group.name}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-medium mt-0.5">
                      <span className="px-1.5 py-0.2 bg-stone-200/70 text-stone-800 rounded font-bold">
                        {group.type}
                      </span>
                      <span>• {group.values.length} values</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditGroup(group);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white text-stone-600 transition"
                    title="Edit Attribute Settings"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <span
                    className={`w-2 h-2 rounded-full ${
                      group.status === 'Active' ? 'bg-emerald-500' : 'bg-stone-300'
                    }`}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-xs text-stone-400">
            No attribute groups found.
          </div>
        )}
      </div>
    </div>
  );
}
