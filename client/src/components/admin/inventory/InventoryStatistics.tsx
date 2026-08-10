'use client';

import { Boxes, CheckCircle2, AlertTriangle, XCircle, IndianRupee } from 'lucide-react';
import { InventoryItem } from '@/lib/inventory/types';

interface Props {
  items: InventoryItem[];
}

export default function InventoryStatistics({ items }: Props) {
  const totalStock = items.reduce((acc, i) => acc + i.availableStock, 0);
  const lowStockCount = items.filter((i) => i.availableStock > 0 && i.availableStock <= i.lowStockThreshold).length;
  const outOfStockCount = items.filter((i) => i.availableStock === 0).length;
  const totalInventoryAssetValue = items.reduce((acc, i) => acc + (i.unitCost || 500) * i.availableStock, 0);

  const stats = [
    {
      label: 'Available Stock Units',
      value: totalStock.toLocaleString('en-IN'),
      subtext: 'Units available across warehouses',
      icon: Boxes,
      bgColor: 'bg-[#facc15]',
      textColor: 'text-stone-950',
      iconColor: 'text-stone-900',
    },
    {
      label: 'Low Stock Alerts',
      value: lowStockCount,
      subtext: lowStockCount > 0 ? 'Requires stock replenishment' : 'All SKUs above safety margin',
      icon: AlertTriangle,
      bgColor: lowStockCount > 0 ? 'bg-amber-100' : 'bg-stone-100',
      textColor: lowStockCount > 0 ? 'text-amber-950' : 'text-stone-700',
      iconColor: lowStockCount > 0 ? 'text-amber-800' : 'text-stone-500',
    },
    {
      label: 'Out of Stock SKUs',
      value: outOfStockCount,
      subtext: outOfStockCount > 0 ? 'Currently unfillable variants' : 'Zero out-of-stock items',
      icon: XCircle,
      bgColor: outOfStockCount > 0 ? 'bg-red-100' : 'bg-emerald-100',
      textColor: outOfStockCount > 0 ? 'text-red-950' : 'text-emerald-950',
      iconColor: outOfStockCount > 0 ? 'text-red-700' : 'text-emerald-700',
    },
    {
      label: 'Stock Cost Valuation',
      value: `₹${totalInventoryAssetValue.toLocaleString('en-IN')}`,
      subtext: 'Total wholesale inventory asset cost',
      icon: IndianRupee,
      bgColor: 'bg-stone-100',
      textColor: 'text-stone-900',
      iconColor: 'text-stone-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white border border-stone-200/80 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600">
                {item.label}
              </span>
              <div className={`p-2.5 rounded-xl ${item.bgColor}`}>
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
            </div>
            <h3 className={`text-2xl font-black mt-2 tracking-tight ${item.textColor}`}>
              {item.value}
            </h3>
            <p className="text-[11px] font-medium text-stone-400 mt-1">
              {item.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
