'use client';

import Image from 'next/image';
import { Sparkles, Shield, Sun, MessageSquare, Gamepad2, Star, Flame, Eye, Layers } from 'lucide-react';
import { Theme } from '@/lib/themes/types';

interface Props {
  theme: Theme;
  isSelected?: boolean;
  onSelect: (theme: Theme) => void;
  onEdit: (theme: Theme) => void;
}

export default function ThemeCard({
  theme,
  isSelected = false,
  onSelect,
  onEdit,
}: Props) {
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-red-500" />;
      case 'Shield': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'Sun': return <Sun className="w-4 h-4 text-emerald-500" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4 text-purple-500" />;
      default: return <Sparkles className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(theme)}
      className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden space-y-3 p-4 ${
        isSelected
          ? 'bg-yellow-50/90 border-yellow-400 shadow-md ring-2 ring-yellow-400/40'
          : 'bg-white border-stone-200/80 hover:border-stone-300 hover:shadow-sm'
      }`}
    >
      {/* Banner / Cover Header */}
      <div className="flex items-start gap-3">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
          {theme.thumbnailImage || theme.bannerImage ? (
            <Image
              src={theme.thumbnailImage || theme.bannerImage!}
              alt={theme.name}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {renderIcon(theme.icon)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="p-1 bg-stone-100 rounded-md flex-shrink-0">{renderIcon(theme.icon)}</span>
              <h3 className="font-extrabold text-stone-900 text-sm truncate">{theme.name}</h3>
            </div>

            {theme.featured && (
              <span className="p-1 bg-amber-100 text-amber-900 rounded-md flex-shrink-0" title="Featured">
                <Star className="w-3.5 h-3.5 fill-current" />
              </span>
            )}
          </div>

          <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
            {theme.shortDescription}
          </p>
        </div>
      </div>

      {/* Badges & Metrics Row */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 bg-stone-100 text-stone-900 rounded-lg text-xs font-bold border border-stone-200/60">
            {theme.productsCount} Products
          </span>
          {theme.marketing.campaignLabel && (
            <span className="px-2 py-0.5 bg-yellow-400 text-stone-950 font-black rounded text-[10px] uppercase">
              {theme.marketing.campaignLabel}
            </span>
          )}
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
            theme.status === 'Active'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : 'bg-stone-100 text-stone-500 border-stone-200'
          }`}
        >
          {theme.status}
        </span>
      </div>
    </div>
  );
}
