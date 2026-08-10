'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  Archive,
  Trash2,
} from 'lucide-react';
import type { Product } from '@/lib/products/types';

interface ProductRowActionsProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onArchive: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const menuItemClass =
  'flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 rounded-lg cursor-pointer outline-none hover:bg-stone-50 focus:bg-stone-50 data-[highlighted]:bg-stone-50';

export default function ProductRowActions({
  product,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
}: ProductRowActionsProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-900/20"
          aria-label={`Actions for ${product.name}`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] bg-white rounded-xl border border-stone-200 shadow-lg p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
          sideOffset={4}
          align="end"
        >
          <DropdownMenu.Item
            className={menuItemClass}
            onSelect={() => onView(product)}
          >
            <Eye className="w-4 h-4 text-stone-400" />
            View Product
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={menuItemClass}
            onSelect={() => onEdit(product)}
          >
            <Pencil className="w-4 h-4 text-stone-400" />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={menuItemClass}
            onSelect={() => onDuplicate(product)}
          >
            <Copy className="w-4 h-4 text-stone-400" />
            Duplicate
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-stone-100 my-1" />
          <DropdownMenu.Item
            className={menuItemClass}
            onSelect={() => onArchive(product)}
          >
            <Archive className="w-4 h-4 text-stone-400" />
            Archive
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={`${menuItemClass} text-red-600 hover:bg-red-50 focus:bg-red-50 data-[highlighted]:bg-red-50`}
            onSelect={() => onDelete(product)}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
