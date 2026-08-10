import type {
  ProductCollection,
  ProductGender,
  ProductStatus,
  ProductTheme,
  ProductType,
  StockFilter,
} from './types';

export const GENDER_OPTIONS: ProductGender[] = ['Men', 'Women', 'Unisex'];

export const PRODUCT_TYPE_OPTIONS: ProductType[] = [
  'Shirts',
  'Hoodies',
  'Oversized T-Shirts',
  'Sweatshirts',
  'Jackets',
];

export const COLLECTION_OPTIONS: ProductCollection[] = [
  'Painted',
  'Thread',
  'Printed',
];

export const THEME_OPTIONS: ProductTheme[] = [
  'Anime',
  'Marvel',
  'Nature',
  'Sports',
  'Quotes',
];

export const STATUS_OPTIONS: ProductStatus[] = ['Active', 'Draft', 'Archived'];

export const STOCK_OPTIONS: StockFilter[] = [
  'In Stock',
  'Low Stock',
  'Out of Stock',
];

export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export const EMPTY_FILTERS = {
  gender: [] as ProductGender[],
  productType: [] as ProductType[],
  collection: [] as ProductCollection[],
  theme: [] as ProductTheme[],
  status: [] as ProductStatus[],
  stock: [] as StockFilter[],
};

export const STATUS_STYLES: Record<ProductStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Draft: 'bg-stone-100 text-stone-600 ring-1 ring-stone-200',
  Archived: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
};

export const STOCK_STYLES = {
  inStock: 'text-emerald-600',
  lowStock: 'text-amber-600',
  outOfStock: 'text-red-600',
};
