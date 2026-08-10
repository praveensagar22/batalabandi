export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ProductCreateStatus = 'Draft' | 'Active' | 'Scheduled' | 'Archived';

export type VariantStatus = 'Active' | 'Draft';

export type ImageType = 'front' | 'back' | 'lifestyle' | 'variant';

export interface ProductVariant {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  barcode: string;
  priceOverride: number | null;
  stock: number;
  weight: number;
  status: VariantStatus;
}

export interface ProductImage {
  id: string;
  url: string;
  name: string;
  type: ImageType;
  isPrimary: boolean;
  variantId?: string;
}

export interface ProductCreateForm {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  status: ProductCreateStatus;
  scheduledAt: string;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  trending: boolean;

  gender: string;
  category: string;
  productType: string;
  collection: string;
  theme: string;
  brand: string;
  tags: string[];

  colors: string[];
  sizes: string[];
  variants: ProductVariant[];

  mrp: number;
  sellingPrice: number;
  costPrice: number;
  gst: number;
  taxClass: string;

  masterSku: string;
  stockQuantity: number;
  lowStockThreshold: number;
  allowBackorders: boolean;
  trackInventory: boolean;
  warehouse: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  shippingClass: string;

  images: ProductImage[];

  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
}

export interface StepMeta {
  id: WizardStep;
  label: string;
  shortLabel: string;
}

export interface PricingMetrics {
  discount: number;
  discountPercent: number;
  profitMargin: number;
  customerSavings: number;
}

export type StepErrors = Partial<Record<keyof ProductCreateForm, string>>;

export interface ValidationResult {
  valid: boolean;
  errors: StepErrors;
}
