'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ROWS_PER_PAGE_OPTIONS } from '@/lib/products/constants';
import { cn } from '@/lib/cn';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('ellipsis');

  pages.push(total);
  return pages;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
}: ProductPaginationProps) {
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, totalItems);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 pt-2">
      <div className="flex items-center gap-3 text-sm text-stone-500">
        <span>
          Showing{' '}
          <span className="font-medium text-stone-700 tabular-nums">
            {start}–{end}
          </span>{' '}
          of{' '}
          <span className="font-medium text-stone-700 tabular-nums">
            {totalItems}
          </span>
        </span>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-stone-400">|</span>
          <label className="flex items-center gap-2">
            <span className="text-xs">Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="bg-white border border-stone-200 text-stone-700 text-xs font-medium rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-stone-900/10 cursor-pointer"
            >
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        <div className="hidden sm:flex items-center gap-1 mx-1">
          {pages.map((page, idx) =>
            page === 'ellipsis' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-stone-400 text-xs">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={cn(
                  'w-8 h-8 text-xs font-medium rounded-lg transition-colors tabular-nums',
                  page === currentPage
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        <span className="sm:hidden text-xs text-stone-500 font-medium px-2 tabular-nums">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
