'use client';

import { Layers, CheckCircle2 } from 'lucide-react';
import { Theme } from '@/lib/themes/types';

interface Props {
  theme: Theme;
}

export default function ThemeCollectionsBreakdown({ theme }: Props) {
  const collectionList = ['Painted', 'Thread', 'Printed', 'Limited Edition', 'Hand Painted', 'Embroidery'];

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-extrabold text-stone-900">Collection Compatibility Matrix</h4>
          <p className="text-[11px] text-stone-400">Marketing collections compatible with "{theme.name}" artwork.</p>
        </div>
        <span className="px-2.5 py-1 bg-amber-100 text-amber-950 font-bold text-xs rounded-lg">
          {theme.compatibleCollections.length} Enabled
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {collectionList.map((colName) => {
          const isCompatible = theme.compatibleCollections.includes(colName);
          const count = theme.assignedProducts.filter((p) => p.collection === colName).length;

          return (
            <div
              key={colName}
              className={`p-3.5 rounded-2xl border transition-all ${
                isCompatible
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-stone-50 border-stone-200 text-stone-400 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold">{colName}</span>
                {isCompatible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-[10px] text-stone-400">Disabled</span>
                )}
              </div>
              <p className="text-[11px] font-bold text-stone-500">
                {isCompatible ? `${count} products assigned` : 'Not linked'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
