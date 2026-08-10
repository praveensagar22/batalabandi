'use client';

import { Layers, CheckCircle2, Star, PackageCheck } from 'lucide-react';
import { Collection } from '@/lib/collections/types';

interface Props {
  collections: Collection[];
}

export default function CollectionStatistics({ collections }: Props) {
  const total = collections.length;
  const active = collections.filter((c) => c.status === 'Active').length;
  const featured = collections.filter((c) => c.featured).length;
  const totalProducts = collections.reduce((acc, c) => acc + c.productsCount, 0);

  const stats = [
    {
      label: 'Total Collections',
      value: total,
      subtext: 'Catalog style groups',
      icon: Layers,
      bgColor: 'bg-[#facc15]',
      textColor: 'text-stone-950',
      iconColor: 'text-stone-900',
    },
    {
      label: 'Active Collections',
      value: active,
      subtext: `${total ? Math.round((active / total) * 100) : 0}% live in store`,
      icon: CheckCircle2,
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-950',
      iconColor: 'text-emerald-700',
    },
    {
      label: 'Featured Collections',
      value: featured,
      subtext: 'Showcased on homepage',
      icon: Star,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-950',
      iconColor: 'text-amber-800',
    },
    {
      label: 'Products Assigned',
      value: totalProducts.toLocaleString(),
      subtext: 'Total items categorized',
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
