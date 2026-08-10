'use client';

import { useState } from 'react';
import { Search, Plus, Maximize2, Minimize2, FolderTree } from 'lucide-react';
import { Category } from '@/lib/categories/types';
import CategoryNode from './CategoryNode';

interface CategoryTreeProps {
  tree: Category[];
  selectedId: string | null;
  onSelect: (category: Category | null) => void;
  onAddCategory: (parentId?: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  onMoveOrder: (id: string, direction: 'up' | 'down') => void;
}

export default function CategoryTree({
  tree,
  selectedId,
  onSelect,
  onAddCategory,
  onEdit,
  onDelete,
  onToggleStatus,
  onMoveOrder,
}: CategoryTreeProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter tree nodes by search term
  const filterTree = (nodes: Category[], query: string): Category[] => {
    if (!query.trim()) return nodes;
    const lower = query.toLowerCase();

    return nodes.reduce<Category[]>((acc, node) => {
      const match = node.name.toLowerCase().includes(lower) || node.slug.toLowerCase().includes(lower);
      const filteredChildren = node.children ? filterTree(node.children, query) : [];

      if (match || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren,
        });
      }
      return acc;
    }, []);
  };

  const displayTree = filterTree(tree, searchTerm);

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-extrabold text-stone-900">Category Structure</h2>
        </div>

        <button
          onClick={() => onAddCategory()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-bold rounded-xl transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Root
        </button>
      </div>

      {/* Tree Search Box */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter tree structure..."
          className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-yellow-400 focus:bg-white transition"
        />
      </div>

      {/* All Selection Reset */}
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-extrabold transition mb-2.5 flex items-center justify-between shadow-2xs ${
          selectedId === null
            ? 'bg-stone-950 text-yellow-400 border border-stone-800'
            : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/80'
        }`}
      >
        <span>Show All Categories</span>
        <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Reset View</span>
      </button>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar min-h-[300px]">
        {displayTree.length > 0 ? (
          displayTree.map((rootNode) => (
            <CategoryNode
              key={rootNode.id}
              node={rootNode}
              selectedId={selectedId}
              onSelect={(cat) => onSelect(cat)}
              onAddSubcategory={(parentId) => onAddCategory(parentId)}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              onMoveOrder={onMoveOrder}
            />
          ))
        ) : (
          <div className="py-8 text-center text-xs text-stone-400">
            No categories matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-400 flex items-center justify-between">
        <span>Click node to filter table</span>
        <span className="font-semibold text-stone-500">Hover for actions</span>
      </div>
    </div>
  );
}
