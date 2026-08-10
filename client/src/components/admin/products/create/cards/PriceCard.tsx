'use client';

import type { PricingMetrics } from '@/lib/products/create-types';
import { formatCurrency } from '@/lib/products/create-utils';
import { TrendingDown, TrendingUp, Percent, PiggyBank } from 'lucide-react';

interface PriceCardProps {
  metrics: PricingMetrics;
  mrp: number;
  sellingPrice: number;
}

export default function PriceCard({ metrics, mrp, sellingPrice }: PriceCardProps) {
  const cards = [
    {
      label: 'Profit Margin',
      value: `${metrics.profitMargin.toFixed(1)}%`,
      icon: TrendingUp,
      color: metrics.profitMargin > 0 ? 'text-emerald-600' : 'text-red-500',
      bg: metrics.profitMargin > 0 ? 'bg-emerald-50' : 'bg-red-50',
    },
    {
      label: 'Discount',
      value: `${metrics.discountPercent.toFixed(0)}%`,
      icon: Percent,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Customer Savings',
      value: formatCurrency(metrics.customerSavings),
      icon: PiggyBank,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Discount Amount',
      value: formatCurrency(metrics.discount),
      icon: TrendingDown,
      color: 'text-stone-600',
      bg: 'bg-stone-50',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-500">{card.label}</span>
                <div className={`p-1.5 rounded-lg ${card.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${card.color}`} />
                </div>
              </div>
              <p className={`text-lg font-bold tabular-nums ${card.color}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 flex items-center justify-between text-sm">
        <span className="text-stone-500">Price Summary</span>
        <div className="flex items-center gap-3">
          {mrp > sellingPrice && (
            <span className="text-stone-400 line-through tabular-nums">
              {formatCurrency(mrp)}
            </span>
          )}
          <span className="font-bold text-stone-900 tabular-nums">
            {formatCurrency(sellingPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
