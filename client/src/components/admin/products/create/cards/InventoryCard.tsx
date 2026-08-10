'use client';

import type { ProductCreateForm } from '@/lib/products/create-types';
import { Package, AlertTriangle, MapPin, Truck } from 'lucide-react';

interface InventoryCardProps {
  form: Pick<
    ProductCreateForm,
    | 'masterSku'
    | 'stockQuantity'
    | 'lowStockThreshold'
    | 'trackInventory'
    | 'allowBackorders'
    | 'warehouse'
    | 'shippingClass'
    | 'weight'
  >;
}

export default function InventoryCard({ form }: InventoryCardProps) {
  const isLowStock =
    form.trackInventory && form.stockQuantity <= form.lowStockThreshold;

  const items = [
    {
      icon: Package,
      label: 'Master SKU',
      value: form.masterSku || '—',
    },
    {
      icon: Package,
      label: 'Stock',
      value: form.trackInventory ? String(form.stockQuantity) : 'Not tracked',
      alert: isLowStock,
    },
    {
      icon: MapPin,
      label: 'Warehouse',
      value: form.warehouse || '—',
    },
    {
      icon: Truck,
      label: 'Shipping',
      value: form.shippingClass || '—',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-medium text-stone-500">{item.label}</span>
            </div>
            <p className="text-sm font-semibold text-stone-900 truncate">{item.value}</p>
            {item.alert && (
              <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3 h-3" /> Low stock
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
