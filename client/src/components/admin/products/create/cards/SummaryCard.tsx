'use client';

import { ChevronRight } from 'lucide-react';
import type { ProductCreateForm } from '@/lib/products/create-types';
import { formatCurrency } from '@/lib/products/create-utils';
import { cn } from '@/lib/cn';

interface SummarySection {
  title: string;
  items: { label: string; value: string }[];
}

interface SummaryCardProps {
  title: string;
  sections: SummarySection[];
  onEdit?: () => void;
  incomplete?: boolean;
}

export function SummaryCard({ title, sections, onEdit, incomplete }: SummaryCardProps) {
  return (
    <div
      className={cn(
        'bg-white border rounded-2xl shadow-sm overflow-hidden',
        incomplete ? 'border-amber-200' : 'border-stone-100'
      )}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-50 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
          {incomplete && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-md">
              Incomplete
            </span>
          )}
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-medium text-stone-500 hover:text-stone-800 flex items-center gap-0.5 transition-colors"
          >
            Edit <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="p-5 space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            {sections.length > 1 && (
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                {section.title}
              </p>
            )}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {section.items.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-stone-400">{item.label}</dt>
                  <dd className="text-sm font-medium text-stone-800 mt-0.5">
                    {item.value || '—'}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

export function buildSummarySections(
  form: ProductCreateForm
): { step: number; title: string; sections: SummarySection[]; incomplete: boolean }[] {
  return [
    {
      step: 1,
      title: 'Basic Information',
      incomplete: !form.name || !form.shortDescription,
      sections: [
        {
          title: 'Details',
          items: [
            { label: 'Product Name', value: form.name },
            { label: 'Slug', value: form.slug },
            { label: 'Status', value: form.status },
            { label: 'Short Description', value: form.shortDescription },
          ],
        },
        {
          title: 'Badges',
          items: [
            { label: 'Featured', value: form.featured ? 'Yes' : 'No' },
            { label: 'New Arrival', value: form.newArrival ? 'Yes' : 'No' },
            { label: 'Best Seller', value: form.bestSeller ? 'Yes' : 'No' },
            { label: 'Trending', value: form.trending ? 'Yes' : 'No' },
          ],
        },
      ],
    },
    {
      step: 2,
      title: 'Classification',
      incomplete: !form.gender || !form.productType,
      sections: [
        {
          title: 'Classification',
          items: [
            { label: 'Gender', value: form.gender },
            { label: 'Category', value: form.category },
            { label: 'Product Type', value: form.productType },
            { label: 'Collection', value: form.collection },
            { label: 'Theme', value: form.theme },
            { label: 'Brand', value: form.brand },
            { label: 'Tags', value: form.tags.join(', ') },
          ],
        },
      ],
    },
    {
      step: 4,
      title: 'Pricing',
      incomplete: form.sellingPrice <= 0,
      sections: [
        {
          title: 'Pricing',
          items: [
            { label: 'MRP', value: formatCurrency(form.mrp) },
            { label: 'Selling Price', value: formatCurrency(form.sellingPrice) },
            { label: 'Cost Price', value: formatCurrency(form.costPrice) },
            { label: 'GST', value: `${form.gst}%` },
            { label: 'Tax Class', value: form.taxClass },
          ],
        },
      ],
    },
    {
      step: 5,
      title: 'Inventory',
      incomplete: !form.masterSku,
      sections: [
        {
          title: 'Inventory',
          items: [
            { label: 'Master SKU', value: form.masterSku },
            { label: 'Stock', value: String(form.stockQuantity) },
            { label: 'Low Stock Threshold', value: String(form.lowStockThreshold) },
            { label: 'Warehouse', value: form.warehouse },
            { label: 'Weight', value: form.weight ? `${form.weight} g` : '—' },
            { label: 'Dimensions', value: `${form.length} × ${form.width} × ${form.height} cm` },
          ],
        },
      ],
    },
    {
      step: 3,
      title: 'Variants',
      incomplete: form.variants.length === 0,
      sections: [
        {
          title: 'Variants',
          items: [
            { label: 'Total Variants', value: String(form.variants.length) },
            {
              label: 'Colors',
              value: [...new Set(form.variants.map((v) => v.color))].join(', '),
            },
            {
              label: 'Sizes',
              value: [...new Set(form.variants.map((v) => v.size))].join(', '),
            },
          ],
        },
      ],
    },
    {
      step: 6,
      title: 'Images',
      incomplete: form.images.length === 0,
      sections: [
        {
          title: 'Images',
          items: [
            { label: 'Total Images', value: String(form.images.length) },
            {
              label: 'Primary Image',
              value: form.images.find((i) => i.isPrimary)?.name || 'None set',
            },
          ],
        },
      ],
    },
    {
      step: 7,
      title: 'SEO',
      incomplete: !form.metaTitle,
      sections: [
        {
          title: 'SEO',
          items: [
            { label: 'Meta Title', value: form.metaTitle },
            { label: 'Meta Description', value: form.metaDescription },
            { label: 'Keywords', value: form.keywords.join(', ') },
            { label: 'Canonical URL', value: form.canonicalUrl },
          ],
        },
      ],
    },
  ];
}
