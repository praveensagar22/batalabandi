'use client';

import { Megaphone, Image as ImageIcon, Ticket, MousePointerClick, IndianRupee } from 'lucide-react';
import { BannerItem, CouponItem } from '@/lib/marketing/types';

interface Props {
  banners: BannerItem[];
  coupons: CouponItem[];
}

export default function MarketingStatistics({ banners, coupons }: Props) {
  const activeBanners = banners.filter((b) => b.status === 'Active').length;
  const activeCoupons = coupons.filter((c) => c.status === 'Active').length;
  const totalClicks = banners.reduce((acc, b) => acc + (b.clicksCount || 0), 0);
  const totalCouponRedemptions = coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0);

  const stats = [
    {
      label: 'Active Hero Banners',
      value: activeBanners,
      subtext: `${banners.length} total banner assets`,
      icon: ImageIcon,
      bgColor: 'bg-yellow-100',
      textColor: 'text-stone-950',
      iconColor: 'text-stone-900',
    },
    {
      label: 'Active Promo Coupons',
      value: activeCoupons,
      subtext: `${coupons.length} promotional code offers`,
      icon: Ticket,
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-950',
      iconColor: 'text-emerald-800',
    },
    {
      label: 'Banner Clicks & Conversions',
      value: totalClicks.toLocaleString('en-IN'),
      subtext: 'Total storefront banner clickthroughs',
      icon: MousePointerClick,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-950',
      iconColor: 'text-amber-800',
    },
    {
      label: 'Coupon Redemptions',
      value: totalCouponRedemptions,
      subtext: 'Successful promo redemptions at checkout',
      icon: Megaphone,
      bgColor: 'bg-stone-100',
      textColor: 'text-stone-900',
      iconColor: 'text-stone-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans">
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
