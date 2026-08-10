'use client';

import { X, History, ArrowRight } from 'lucide-react';
import { InventoryItem } from '@/lib/inventory/types';

interface Props {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
}

export default function StockLogsModal({ isOpen, item, onClose }: Props) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-100 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-stone-100 rounded-xl text-stone-900">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
                Stock Audit Logs
              </span>
              <h3 className="text-base font-extrabold text-stone-900">{item.productTitle}</h3>
              <p className="text-[11px] font-mono text-stone-400">{item.sku}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Logs List */}
        <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
          {item.logs && item.logs.length > 0 ? (
            item.logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-stone-900 text-white font-extrabold text-[10px] rounded">
                    {log.reason}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">{log.timestamp}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 font-mono font-bold">
                    <span className="text-stone-500">{log.previousStock} units</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                    <span className="text-stone-950 font-black">{log.newStock} units</span>
                  </div>

                  <span
                    className={`font-mono font-extrabold text-xs ${
                      log.changeAmount > 0 ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount} units
                  </span>
                </div>

                {log.note && (
                  <p className="text-[11px] text-stone-600 italic bg-white p-2 rounded-xl border border-stone-100 mt-1">
                    "{log.note}" — <strong className="not-italic text-stone-800">{log.user}</strong>
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-stone-400">
              No audit logs recorded for this SKU yet.
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-2 border-t border-stone-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
}
