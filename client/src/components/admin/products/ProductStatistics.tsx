'use client';

import { Package, CheckCircle2, AlertTriangle, IndianRupee } from 'lucide-react';
import { ProductItem } from '@/lib/products/types';

interface Props {
  products: ProductItem[];
}

export default function ProductStatistics({ products }: Props) {
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === 'Active').length;
  const lowOrOutStock = products.filter((p) => p.stock <= p.lowStockThreshold).length;
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      subtext: 'Catalog garments & merchandise',
      icon: Package,
      bgColor: 'bg-[#facc15]',
      textColor: 'text-stone-950',
      iconColor: 'text-stone-900',
    },
    {
      label: 'Active Products',
      value: activeProducts,
      subtext: `${totalProducts ? Math.round((activeProducts / totalProducts) * 100) : 0}% available on storefront`,
      icon: CheckCircle2,
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-950',
      iconColor: 'text-emerald-700',
    },
    {
      label: 'Low / Out of Stock',
      value: lowOrOutStock,
      subtext: lowOrOutStock > 0 ? 'Requires stock replenishment' : 'All items well stocked',
      icon: AlertTriangle,
      bgColor: lowOrOutStock > 0 ? 'bg-amber-100' : 'bg-stone-100',
      textColor: lowOrOutStock > 0 ? 'text-amber-950' : 'text-stone-700',
      iconColor: lowOrOutStock > 0 ? 'text-amber-800' : 'text-stone-500',
    },
    {
      label: 'Inventory Asset Value',
      value: `₹${totalInventoryValue.toLocaleString('en-IN')}`,
      subtext: 'Combined retail stock valuation',
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
