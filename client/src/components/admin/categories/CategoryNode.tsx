'use client';

import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Layers,
  Tag,
} from 'lucide-react';
import { Category } from '@/lib/categories/types';

interface CategoryNodeProps {
  node: Category;
  selectedId: string | null;
  onSelect: (category: Category) => void;
  onAddSubcategory: (parentId: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  onMoveOrder: (id: string, direction: 'up' | 'down') => void;
  level?: number;
}

export default function CategoryNode({
  node,
  selectedId,
  onSelect,
  onAddSubcategory,
  onEdit,
  onDelete,
  onToggleStatus,
  onMoveOrder,
  level = 0,
}: CategoryNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;
  const isActive = node.status === 'Active';

  return (
    <div className="select-none text-xs">
      <div
        className={`group relative flex items-center justify-between py-2 px-2.5 rounded-xl transition-all ${
          isSelected
            ? 'bg-yellow-400/90 text-stone-950 font-bold shadow-sm'
            : 'hover:bg-stone-100 text-stone-700'
        } ${!isActive ? 'opacity-60' : ''}`}
        style={{ paddingLeft: `${Math.max(0.5, level * 1.25)}rem` }}
      >
        {/* Left Side: Toggle Arrow + Icon + Title */}
        <div
          className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
          onClick={() => onSelect(node)}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1 rounded-md hover:bg-stone-200/60 text-stone-600 transition"
            >
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-4 h-4 flex items-center justify-center text-[10px] text-stone-300 flex-shrink-0 font-mono">
              └
            </span>
          )}

          {/* Icon based on level */}
          {level === 0 ? (
            <Layers className="w-4 h-4 text-amber-600 flex-shrink-0" />
          ) : hasChildren ? (
            isOpen ? (
              <FolderOpen className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-stone-400 flex-shrink-0" />
            )
          ) : (
            <Tag className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
          )}

          {/* Name & Count */}
          <span className="truncate text-xs font-semibold">{node.name}</span>
          {node.gender && level === 0 && (
            <span className="text-[10px] px-1.5 py-0.2 bg-stone-900 text-yellow-400 rounded font-bold uppercase tracking-wider">
              {node.gender}
            </span>
          )}

          <span
            className={`ml-auto mr-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isSelected
                ? 'bg-stone-950 text-yellow-400'
                : 'bg-stone-200/70 text-stone-600'
            }`}
          >
            {node.productsCount}
          </span>
        </div>

        {/* Hover Quick Actions */}
        <div className="hidden group-hover:flex items-center gap-1 opacity-90 transition-opacity">
          {level < 2 && (
            <button
              title="Add Subcategory"
              onClick={(e) => {
                e.stopPropagation();
                onAddSubcategory(node.id);
              }}
              className="p-1 rounded-lg hover:bg-stone-200 text-stone-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            title="Edit Category"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-700 transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            title={isActive ? 'Deactivate' : 'Activate'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(node);
            }}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-700 transition"
          >
            {isActive ? (
              <Eye className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          {/* Dropdown Menu for Order / Delete */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-lg hover:bg-stone-200 text-stone-700 transition"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-6 z-30 w-36 bg-white border border-stone-200 rounded-xl shadow-lg py-1 text-stone-800 text-xs font-normal"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  className="w-full px-3 py-1.5 text-left hover:bg-stone-100 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveOrder(node.id, 'up');
                    setShowMenu(false);
                  }}
                >
                  <ArrowUp className="w-3.5 h-3.5 text-stone-500" /> Move Up
                </button>
                <button
                  className="w-full px-3 py-1.5 text-left hover:bg-stone-100 flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveOrder(node.id, 'down');
                    setShowMenu(false);
                  }}
                >
                  <ArrowDown className="w-3.5 h-3.5 text-stone-500" /> Move Down
                </button>
                <div className="my-1 border-t border-stone-100" />
                <button
                  className="w-full px-3 py-1.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(node);
                    setShowMenu(false);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Children Nodes */}
      {hasChildren && isOpen && (
        <div className="space-y-1 mt-0.5 border-l-2 border-stone-200/60 ml-3.5">
          {node.children?.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddSubcategory={onAddSubcategory}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              onMoveOrder={onMoveOrder}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
