'use client';

import { Tag, CheckCircle2, Layers, PackageCheck } from 'lucide-react';
import { AttributeGroup } from '@/lib/attributes/types';

interface Props {
  attributes: AttributeGroup[];
}

export default function AttributeStatistics({ attributes }: Props) {
  const totalAttr = attributes.length;
  const totalValues = attributes.reduce((acc, a) => acc + a.values.length, 0);
  const activeAttr = attributes.filter((a) => a.status === 'Active').length;
  const totalProductUsage = attributes.reduce(
    (acc, a) => acc + a.values.reduce((vAcc, v) => vAcc + v.productsCount, 0),
    0
  );

  const stats = [
    {
      label: 'Total Attributes',
      value: totalAttr,
      subtext: 'Attribute groups (Color, Size, Material)',
      icon: Tag,
      bgColor: 'bg-[#facc15]',
      textColor: 'text-stone-950',
      iconColor: 'text-stone-900',
    },
    {
      label: 'Attribute Values',
      value: totalValues,
      subtext: 'Total options defined',
      icon: Layers,
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-950',
      iconColor: 'text-emerald-700',
    },
    {
      label: 'Active Attributes',
      value: activeAttr,
      subtext: `${totalAttr ? Math.round((activeAttr / totalAttr) * 100) : 0}% live in product builder`,
      icon: CheckCircle2,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-950',
      iconColor: 'text-amber-800',
    },
    {
      label: 'Products Using Attributes',
      value: totalProductUsage.toLocaleString(),
      subtext: 'Variants mapped across catalog',
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
