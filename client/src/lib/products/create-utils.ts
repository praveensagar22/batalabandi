import type {
  PricingMetrics,
  ProductCreateForm,
  ProductVariant,
} from './create-types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateVariantId(): string {
  return `var-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateVariants(
  colors: string[],
  sizes: string[],
  masterSku: string
): ProductVariant[] {
  const variants: ProductVariant[] = [];
  let index = 1;

  for (const color of colors) {
    for (const size of sizes) {
      const name = `${color} - ${size}`;
      const skuSuffix = `${color.slice(0, 3).toUpperCase()}-${size}`;
      variants.push({
        id: generateVariantId(),
        name,
        color,
        size,
        sku: masterSku ? `${masterSku}-${skuSuffix}` : `SKU-${String(index).padStart(3, '0')}`,
        barcode: '',
        priceOverride: null,
        stock: 0,
        weight: 0,
        status: 'Active',
      });
      index++;
    }
  }

  return variants;
}

export function computePricingMetrics(form: ProductCreateForm): PricingMetrics {
  const { mrp, sellingPrice, costPrice } = form;
  const discount = Math.max(0, mrp - sellingPrice);
  const discountPercent = mrp > 0 ? (discount / mrp) * 100 : 0;
  const profitMargin =
    sellingPrice > 0 ? ((sellingPrice - costPrice) / sellingPrice) * 100 : 0;
  const customerSavings = discount;

  return {
    discount,
    discountPercent,
    profitMargin,
    customerSavings,
  };
}

export function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  return `${hours} hours ago`;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function generateMasterSku(name: string, productType: string): string {
  const prefix = productType
    ? productType.slice(0, 2).toUpperCase()
    : 'PR';
  const suffix = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((w) => w.charAt(0))
        .join('')
        .toUpperCase()
    : '001';
  return `${prefix}-${suffix}-${Date.now().toString().slice(-4)}`;
}
