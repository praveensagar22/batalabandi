import type {
  Product,
  ProductFilters,
  ProductStats,
  StockFilter,
} from './types';

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getStockLevel(stock: number): StockFilter {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return 'Low Stock';
  return 'In Stock';
}

export function computeStats(products: Product[]): ProductStats {
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const avgPrice = products.length > 0 ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / products.length) : 0;
  return {
    total: products.length,
    totalProducts: products.length,
    active: products.filter((p) => p.status === 'Active').length,
    activeProducts: products.filter((p) => p.status === 'Active').length,
    draft: products.filter((p) => p.status === 'Draft').length,
    draftProducts: products.filter((p) => p.status === 'Draft').length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    outOfStockProducts: products.filter((p) => p.stock === 0).length,
    lowStockProducts: products.filter((p) => p.stock <= 5).length,
    totalInventoryValue,
    averagePrice: avgPrice,
  };
}

function matchesFilter<T>(value: T, selected: T[]): boolean {
  return !selected || selected.length === 0 || selected.includes(value);
}

export function filterProducts(
  products: Product[],
  search: string,
  filters: any
): Product[] {
  const query = search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      !query ||
      (product.title && product.title.toLowerCase().includes(query)) ||
      (product.sku && product.sku.toLowerCase().includes(query));

    return matchesSearch;
  });
}

export function countActiveFilters(filters: any): number {
  if (!filters) return 0;
  return Object.values(filters).reduce((sum: number, val: any) => sum + (Array.isArray(val) ? val.length : val && val !== 'All' ? 1 : 0), 0);
}

export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

export function getTotalPages(total: number, perPage: number): number {
  return Math.max(1, Math.ceil(total / perPage));
}
