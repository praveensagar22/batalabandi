'use client';

import Image from 'next/image';
import { Palette, Scissors, Printer, Sparkles, Brush, Layers, CheckCircle2, Star, Eye } from 'lucide-react';
import { Collection } from '@/lib/collections/types';

interface Props {
  collection: Collection;
  isSelected?: boolean;
  onSelect: (collection: Collection) => void;
  onEdit: (collection: Collection) => void;
}

export default function CollectionCard({
  collection,
  isSelected = false,
  onSelect,
  onEdit,
}: Props) {
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Palette': return <Palette className="w-4 h-4 text-amber-500" />;
      case 'Needle':
      case 'Scissors': return <Scissors className="w-4 h-4 text-purple-500" />;
      case 'Printer': return <Printer className="w-4 h-4 text-blue-500" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-pink-500" />;
      case 'Brush': return <Brush className="w-4 h-4 text-emerald-500" />;
      default: return <Layers className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(collection)}
      className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden p-4 space-y-3 ${
        isSelected
          ? 'bg-yellow-50/90 border-yellow-400 shadow-md ring-2 ring-yellow-400/40'
          : 'bg-white border-stone-200/80 hover:border-stone-300 hover:shadow-sm'
      }`}
    >
      {/* Cover Header */}
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
          {collection.coverImage ? (
            <Image
              src={collection.coverImage}
              alt={collection.name}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {renderIcon(collection.icon)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="p-1 bg-stone-100 rounded-md flex-shrink-0">{renderIcon(collection.icon)}</span>
              <h3 className="font-extrabold text-stone-900 text-sm truncate">{collection.name}</h3>
            </div>

            {collection.featured && (
              <span className="p-1 bg-amber-100 text-amber-900 rounded-md flex-shrink-0" title="Featured">
                <Star className="w-3.5 h-3.5 fill-current" />
              </span>
            )}
          </div>

          <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
            {collection.shortDescription}
          </p>
        </div>
      </div>

      {/* Badges & Metrics Row */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 bg-stone-100 text-stone-900 rounded-lg text-xs font-bold border border-stone-200/60">
            {collection.productsCount} Products
          </span>
          {collection.marketing.promoLabel && (
            <span className="px-2 py-0.5 bg-yellow-400 text-stone-950 font-black rounded text-[10px] uppercase">
              {collection.marketing.promoLabel}
            </span>
          )}
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
            collection.status === 'Active'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : 'bg-stone-100 text-stone-500 border-stone-200'
          }`}
        >
          {collection.status}
        </span>
      </div>
    </div>
  );
}
