'use client';

import {
  Package,
  CheckCircle2,
  FileEdit,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { ProductStats } from '@/lib/products/types';
import { cn } from '@/lib/cn';

interface StatCard {
  label: string;
  value: number;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface ProductStatsCardsProps {
  stats: ProductStats;
  loading?: boolean;
}

function StatSkeleton() {
  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-4 sm:p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 bg-stone-100 rounded" />
        <div className="h-9 w-9 bg-stone-100 rounded-xl" />
      </div>
      <div className="h-7 w-16 bg-stone-100 rounded mt-4" />
      <div className="h-3 w-28 bg-stone-100 rounded mt-2" />
    </div>
  );
}

export default function ProductStatsCards({ stats, loading }: ProductStatsCardsProps) {
  const cards: StatCard[] = [
    {
      label: 'Total Products',
      value: stats.total,
      trend: '+3 this month',
      trendUp: true,
      icon: Package,
      iconBg: 'bg-stone-100',
      iconColor: 'text-stone-700',
    },
    {
      label: 'Active Products',
      value: stats.active,
      trend: '+2 this week',
      trendUp: true,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Draft Products',
      value: stats.draft,
      trend: '2 pending review',
      trendUp: false,
      icon: FileEdit,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStock,
      trend: stats.outOfStock > 0 ? 'Needs attention' : 'All stocked',
      trendUp: stats.outOfStock === 0,
      icon: AlertCircle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trendUp ? TrendingUp : TrendingDown;

        return (
          <div
            key={card.label}
            className="bg-white border border-stone-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500">{card.label}</span>
              <div className={cn('p-2 rounded-xl', card.iconBg)}>
                <Icon className={cn('w-4 h-4', card.iconColor)} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-stone-950 mt-3 tracking-tight tabular-nums">
              {card.value}
            </p>
            <p
              className={cn(
                'text-[11px] font-medium mt-1.5 flex items-center gap-1',
                card.trendUp ? 'text-emerald-600' : 'text-stone-400'
              )}
            >
              <TrendIcon className="w-3 h-3 shrink-0" />
              {card.trend}
            </p>
          </div>
        );
      })}
    </div>
  );
}
