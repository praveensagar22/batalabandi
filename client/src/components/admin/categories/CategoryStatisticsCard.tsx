'use client';

import { FolderTree, CheckCircle2, Layers, GitFork } from 'lucide-react';
import { Category } from '@/lib/categories/types';

interface Props {
  categories: Category[];
}

export default function CategoryStatisticsCard({ categories }: Props) {
  const total = categories.length;
  const active = categories.filter((c) => c.status === 'Active').length;
  const parent = categories.filter((c) => c.level === 0 || c.level === 1).length;
  const child = categories.filter((c) => c.level === 2).length;

  const stats = [
    {
      label: 'Total Categories',
      value: total,
      subtext: 'All catalog nodes',
      icon: FolderTree,
      bgColor: 'bg-[#facc15]',
      textColor: 'text-stone-950',
      iconColor: 'text-stone-900',
    },
    {
      label: 'Active Categories',
      value: active,
      subtext: `${total ? Math.round((active / total) * 100) : 0}% live in store`,
      icon: CheckCircle2,
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-950',
      iconColor: 'text-emerald-700',
    },
    {
      label: 'Parent Categories',
      value: parent,
      subtext: 'Root & main groups',
      icon: Layers,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-950',
      iconColor: 'text-amber-800',
    },
    {
      label: 'Child Categories',
      value: child,
      subtext: 'Sub-category items',
      icon: GitFork,
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
            className="bg-white border border-stone-200/70 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
