export interface ProductVariantItem {
  id: string;
  sku: string;
  color?: string;
  colorHex?: string;
  size?: string;
  price: number;
  stock: number;
  image?: string;
}

export interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface ProductItem {
  id: string;
  title: string;
  name?: string;
  subtitle?: string;
  slug: string;
  description: string;
  sku: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  status: 'Active' | 'Draft' | 'Out of Stock' | 'Archived';
  isFeatured: boolean;
  category: string;
  productType: string;
  collectionName?: string;
  collection?: string;
  themeName?: string;
  theme?: string;
  gender: 'Men' | 'Women' | 'Unisex';
  colors: string[];
  sizes: string[];
  material?: string;
  fitType?: string;
  images: string[];
  thumbnail?: string;
  variants: ProductVariantItem[];
  seo: ProductSEO;
  salesCount: number;
  rating: number;
  createdDate: string;
  createdAt?: string;
}

export type Product = ProductItem;

export type ProductFilterState = {
  search: string;
  status: any;
  category: any;
  productType: any;
  collection: any;
  theme: any;
  gender: any;
  stock?: any;
  sortBy: 'title' | 'price' | 'stock' | 'salesCount' | 'createdDate';
};

export type ProductFilters = ProductFilterState;
export type ProductCollection = string;
export type ProductGender = string;
export type ProductStatus = string;
export type ProductTheme = string;
export type ProductType = string;
export type StockFilter = string;

export interface ProductStats {
  total: number;
  totalProducts: number;
  active: number;
  activeProducts: number;
  draft: number;
  draftProducts: number;
  outOfStock: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  averagePrice: number;
}
