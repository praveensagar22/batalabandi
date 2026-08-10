'use client';

import { Upload, Archive, Trash2, Download, X } from 'lucide-react';

interface ProductBulkActionsBarProps {
  selectedCount: number;
  onPublish: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onExport: () => void;
  onClearSelection: () => void;
}

export default function ProductBulkActionsBar({
  selectedCount,
  onPublish,
  onArchive,
  onDelete,
  onExport,
  onClearSelection,
}: ProductBulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-[3.5rem] z-20 bg-stone-900 text-white rounded-2xl px-4 py-3 shadow-lg flex flex-col sm:flex-row sm:items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold tabular-nums">
          {selectedCount} selected
        </span>
        <button
          type="button"
          onClick={onClearSelection}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
        <button
          type="button"
          onClick={onPublish}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Publish
        </button>
        <button
          type="button"
          onClick={onArchive}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Archive className="w-3.5 h-3.5" />
          Archive
        </button>
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-500/90 hover:bg-red-500 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
