'use client';

import { Shirt, CheckCircle2, Star, PackageCheck } from 'lucide-react';
import { ProductType } from '@/lib/product-types/types';

interface Props {
  productTypes: ProductType[];
}

export default function ProductTypeStatistics({ productTypes }: Props) {
  const total = productTypes.length;
  const active = productTypes.filter((pt) => pt.status === 'Active').length;
  const featured = productTypes.filter((pt) => pt.featured).length;
  const totalProducts = productTypes.reduce((acc, pt) => acc + pt.productsCount, 0);

  const stats = [
    {
      label: 'Total Product Types',
      value: total,
      subtext: 'Apparel catalog definitions',
      icon: Shirt,
      bgColor: 'bg-[#facc15]',
      textColor: 'text-stone-950',
      iconColor: 'text-stone-900',
    },
    {
      label: 'Active Product Types',
      value: active,
      subtext: `${total ? Math.round((active / total) * 100) : 0}% active in store`,
      icon: CheckCircle2,
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-950',
      iconColor: 'text-emerald-700',
    },
    {
      label: 'Featured Product Types',
      value: featured,
      subtext: 'Highlighted on storefront',
      icon: Star,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-950',
      iconColor: 'text-amber-800',
    },
    {
      label: 'Total Products Assigned',
      value: totalProducts.toLocaleString(),
      subtext: 'Live catalog items linked',
      icon: PackageCheck,
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
