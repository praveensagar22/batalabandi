export interface InventoryLogItem {
  id: string;
  changeAmount: number;
  previousStock: number;
  newStock: number;
  reason: 'Restock' | 'Sale' | 'Damaged' | 'Return' | 'Audit Correction' | 'Initial Stock';
  note?: string;
  user: string;
  timestamp: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  productTitle: string;
  productImage?: string;
  category: string;
  color?: string;
  size?: string;
  location: string;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  unitCost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  logs: InventoryLogItem[];
  updatedAt: string;
}

export type InventoryFilterState = {
  search: string;
  status: 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock';
  location: string;
  category: string;
  sortBy: 'availableStock' | 'sku' | 'updatedAt';
};
