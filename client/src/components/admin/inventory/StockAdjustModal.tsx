'use client';

import { useEffect, useState } from 'react';
import { X, Save, Boxes, Plus, Minus } from 'lucide-react';
import { InventoryItem } from '@/lib/inventory/types';

interface Props {
  isOpen: boolean;
  item: InventoryItem | null;
  initialDelta?: number;
  onClose: () => void;
  onConfirmAdjust: (id: string, changeAmount: number, reason: string, note?: string) => void;
}

export default function StockAdjustModal({
  isOpen,
  item,
  initialDelta = 0,
  onClose,
  onConfirmAdjust,
}: Props) {
  const [changeAmount, setChangeAmount] = useState<number>(0);
  const [reason, setReason] = useState<'Restock' | 'Sale' | 'Damaged' | 'Return' | 'Audit Correction'>('Restock');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (initialDelta !== 0) {
      setChangeAmount(initialDelta);
      setReason(initialDelta > 0 ? 'Restock' : 'Audit Correction');
    } else {
      setChangeAmount(0);
      setReason('Restock');
    }
    setNote('');
  }, [initialDelta, item, isOpen]);

  if (!isOpen || !item) return null;

  const currentStock = item.availableStock;
  const projectedStock = Math.max(0, currentStock + Number(changeAmount));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (changeAmount === 0) return;
    onConfirmAdjust(item.id, Number(changeAmount), reason, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-xl text-stone-950 font-black">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
                Stock Adjustment
              </span>
              <h3 className="text-base font-extrabold text-stone-900">{item.productTitle}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Stock Banner */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
          <div>
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Current Stock</span>
            <span className="text-lg font-black text-stone-900">{currentStock} units</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-stone-400 block uppercase">New Stock Level</span>
            <span className="text-lg font-black text-emerald-700">{projectedStock} units</span>
          </div>
        </div>

        {/* Form */}
        <form id="adjustForm" onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Quantity Adjustment (+ to add, - to deduct)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setChangeAmount((prev) => prev - 5)}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-extrabold"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => setChangeAmount((prev) => prev - 1)}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-extrabold"
              >
                -1
              </button>
              <input
                type="number"
                required
                value={changeAmount}
                onChange={(e) => setChangeAmount(Number(e.target.value))}
                className="flex-1 font-mono font-black text-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 outline-none focus:border-yellow-400"
              />
              <button
                type="button"
                onClick={() => setChangeAmount((prev) => prev + 1)}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-extrabold"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => setChangeAmount((prev) => prev + 5)}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-extrabold"
              >
                +5
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Reason for Adjustment</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-stone-900 outline-none focus:border-yellow-400"
            >
              <option value="Restock">Warehouse Restock / Shipment</option>
              <option value="Sale">Manual Sale Override</option>
              <option value="Damaged">Damaged / Defective Stock</option>
              <option value="Return">Customer Return</option>
              <option value="Audit Correction">Inventory Audit Correction</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Admin Memo / Note (Optional)</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Shipment PO #108 received from supplier..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 outline-none focus:border-yellow-400"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="adjustForm"
            disabled={changeAmount === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] disabled:opacity-50 text-stone-950 text-xs font-extrabold rounded-xl shadow-xs"
          >
            <Save className="w-4 h-4" /> Save Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}
