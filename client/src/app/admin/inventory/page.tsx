'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Download, CheckCircle2, X } from 'lucide-react';

import { InventoryItem, InventoryFilterState } from '@/lib/inventory/types';
import { INITIAL_INVENTORY } from '@/lib/inventory/mock-data';
import { fetchInventoryAPI, adjustStockAPI, deleteInventoryAPI } from '@/lib/api/catalog';
import InventoryStatistics from '@/components/admin/inventory/InventoryStatistics';
import InventorySearchAndFilters from '@/components/admin/inventory/InventorySearchAndFilters';
import InventoryTable from '@/components/admin/inventory/InventoryTable';
import StockAdjustModal from '@/components/admin/inventory/StockAdjustModal';
import StockLogsModal from '@/components/admin/inventory/StockLogsModal';

export default function InventoryManagementPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [filters, setFilters] = useState<InventoryFilterState>({
    search: '',
    status: 'All',
    location: 'All',
    category: 'All',
    sortBy: 'availableStock',
  });

  // Modal states
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [quickDelta, setQuickDelta] = useState<number>(0);

  const [logsItem, setLogsItem] = useState<InventoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Inventory from REST API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchInventoryAPI();
        if (data && data.length > 0) {
          setInventoryItems(data);
        }
      } catch (err) {
        console.log('Backend API offline, using fallback inventory state.');
      }
    }
    loadData();
  }, []);

  // Filtered List Calculation
  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchTitle = item.productTitle.toLowerCase().includes(q);
        const matchSKU = item.sku.toLowerCase().includes(q);
        if (!matchTitle && !matchSKU) return false;
      }
      if (filters.status !== 'All' && item.status !== filters.status) return false;
      if (filters.location !== 'All' && item.location !== filters.location) return false;
      return true;
    });
  }, [inventoryItems, filters]);

  // Unique Location options for dropdown
  const locationOptions = useMemo(() => {
    const locs = Array.from(new Set(inventoryItems.map((i) => i.location))).filter(Boolean);
    return locs.length > 0 ? locs : ['Main Warehouse (WH-01)', 'Fulfillment Center (WH-02)'];
  }, [inventoryItems]);

  // Handle Adjust Stock
  const handleConfirmAdjust = async (
    id: string,
    changeAmount: number,
    reason: string,
    note?: string
  ) => {
    const item = inventoryItems.find((i) => i.id === id);
    if (!item) return;

    const previousStock = item.availableStock;
    const newStock = Math.max(0, previousStock + changeAmount);

    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    if (newStock === 0) status = 'Out of Stock';
    else if (newStock <= item.lowStockThreshold) status = 'Low Stock';

    const newLog = {
      id: `log-${Date.now()}`,
      changeAmount,
      previousStock,
      newStock,
      reason: reason as any,
      note: note || '',
      user: 'Admin',
      timestamp: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedItem: InventoryItem = {
      ...item,
      availableStock: newStock,
      status,
      logs: [newLog, ...(item.logs || [])],
      updatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setInventoryItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)));
    adjustStockAPI(id, changeAmount, reason, note).catch(() => {});
    showToast(`Adjusted stock for ${item.sku} (${changeAmount > 0 ? `+${changeAmount}` : changeAmount} units).`);
  };

  const handleDeleteInventoryItem = (id: string) => {
    const item = inventoryItems.find((i) => i.id === id);
    setInventoryItems((prev) => prev.filter((i) => i.id !== id));
    deleteInventoryAPI(id).catch(() => {});
    showToast(`Deleted inventory SKU ${item?.sku || ''}.`);
  };

  const handleExportCSV = () => {
    const headers = ['SKU', 'Product Title', 'Location', 'Available Stock', 'Reserved Stock', 'Low Stock Limit', 'Status'];
    const rows = inventoryItems.map((i) => [
      i.sku,
      `"${i.productTitle}"`,
      `"${i.location}"`,
      String(i.availableStock),
      String(i.reservedStock),
      String(i.lowStockThreshold),
      i.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `batalabandi_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${inventoryItems.length} inventory records to CSV.`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-yellow-400/40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-1">
            <Link href="/admin" className="hover:text-stone-900 transition">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500">Inventory</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold">Stock</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Inventory & Stock Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor SKU stock quantities, warehouse locations, and audit logs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-stone-700 hover:bg-stone-50 text-xs font-bold rounded-xl transition border border-stone-200 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" /> Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <InventoryStatistics items={inventoryItems} />

      {/* Search & Filters */}
      <InventorySearchAndFilters
        filters={filters}
        onChange={setFilters}
        locationOptions={locationOptions}
      />

      {/* Main Inventory Table */}
      <InventoryTable
        items={filteredItems}
        onOpenAdjust={(item, delta) => {
          setAdjustingItem(item);
          setQuickDelta(delta || 0);
        }}
        onOpenLogs={(item) => setLogsItem(item)}
        onDeleteItem={handleDeleteInventoryItem}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustModal
        isOpen={!!adjustingItem}
        item={adjustingItem}
        initialDelta={quickDelta}
        onClose={() => setAdjustingItem(null)}
        onConfirmAdjust={handleConfirmAdjust}
      />

      {/* Stock History Audit Logs Modal */}
      <StockLogsModal
        isOpen={!!logsItem}
        item={logsItem}
        onClose={() => setLogsItem(null)}
      />
    </div>
  );
}
