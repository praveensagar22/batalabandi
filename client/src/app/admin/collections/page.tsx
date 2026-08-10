'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Plus,
  Download,
  Upload,
  CheckCircle2,
  X,
} from 'lucide-react';

import { Collection, CollectionFilterState } from '@/lib/collections/types';
import { INITIAL_COLLECTIONS } from '@/lib/collections/mock-data';
import { fetchCollectionsAPI, createCollectionAPI, updateCollectionAPI, deleteCollectionAPI } from '@/lib/api/catalog';
import CollectionStatistics from '@/components/admin/collections/CollectionStatistics';
import CollectionSearchAndFilters from '@/components/admin/collections/CollectionSearchAndFilters';
import CollectionCard from '@/components/admin/collections/CollectionCard';
import CollectionTable from '@/components/admin/collections/CollectionTable';
import CollectionDetailsPanel from '@/components/admin/collections/CollectionDetailsPanel';
import CollectionFormDrawer from '@/components/admin/collections/CollectionFormDrawer';
import CollectionDeleteModal from '@/components/admin/collections/CollectionDeleteModal';
import CollectionExportImportModal from '@/components/admin/collections/CollectionExportImportModal';

export default function CollectionManagementPage() {
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(INITIAL_COLLECTIONS[0] || null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCollectionsAPI();
        if (data && data.length > 0) {
          setCollections(data);
          setSelectedCollection(data[0] || null);
        }
      } catch (err) {
        console.log('Backend API offline, using fallback catalog state.');
      }
    }
    loadData();
  }, []);

  // Filters state
  const [filters, setFilters] = useState<CollectionFilterState>({
    search: '',
    status: 'All',
    featured: 'All',
    sortBy: 'name',
  });

  // Drawer & Modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null);
  const [exportImportMode, setExportImportMode] = useState<'import' | 'export' | null>(null);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered collections
  const filteredCollections = useMemo(() => {
    let result = collections.filter((col) => {
      // 1. Search
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchName = col.name.toLowerCase().includes(q);
        const matchSlug = col.slug.toLowerCase().includes(q);
        if (!matchName && !matchSlug) return false;
      }

      // 2. Status
      if (filters.status !== 'All' && col.status !== filters.status) return false;

      // 3. Featured
      if (filters.featured !== 'All') {
        if (filters.featured === 'Yes' && !col.featured) return false;
        if (filters.featured === 'No' && col.featured) return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'productsCount') return b.productsCount - a.productsCount;
      if (filters.sortBy === 'createdDate') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [collections, filters]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingCollection(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (col: Collection) => {
    setEditingCollection(col);
    setIsDrawerOpen(true);
  };

  const handleSaveCollection = (data: Partial<Collection>) => {
    if (editingCollection) {
      setCollections((prev) =>
        prev.map((item) => (item.id === editingCollection.id ? ({ ...item, ...data } as Collection) : item))
      );
      if (selectedCollection?.id === editingCollection.id) {
        setSelectedCollection((prev) => (prev ? ({ ...prev, ...data } as Collection) : null));
      }
      showToast(`Collection "${data.name}" updated successfully.`);
    } else {
      const newCol: Collection = {
        id: `col-${Date.now()}`,
        name: data.name || 'New Collection',
        slug: data.slug || 'new-collection',
        shortDescription: data.shortDescription || '',
        detailedDescription: data.detailedDescription || '',
        productsCount: 0,
        status: data.status || 'Active',
        featured: data.featured ?? true,
        showOnHomepage: data.showOnHomepage ?? true,
        homepagePriority: data.homepagePriority || 1,
        displayOrder: data.displayOrder || 1,
        displayStyle: data.displayStyle || 'Card',
        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        icon: data.icon || 'Palette',
        coverImage: data.coverImage || '',
        bannerImage: data.bannerImage || '',
        themeColor: data.themeColor || '#facc15',
        marketing: data.marketing || { buttonText: 'Shop Collection', buttonUrl: '/collections', promoLabel: 'New' },
        seo: data.seo || { metaTitle: '', metaDescription: '', keywords: '' },
        analytics: {
          salesCount: 0,
          revenue: '₹0',
          views: 0,
          conversionRate: '0.0%',
          monthlySales: [{ month: 'Jul', amount: 0 }],
        },
        assignedProducts: [],
      };
      setCollections((prev) => [newCol, ...prev]);
      setSelectedCollection(newCol);
      showToast(`Collection "${newCol.name}" created successfully.`);
    }
    setIsDrawerOpen(false);
  };

  const handleToggleStatus = (col: Collection) => {
    const nextStatus = col.status === 'Active' ? 'Inactive' : 'Active';
    setCollections((prev) =>
      prev.map((item) => (item.id === col.id ? { ...item, status: nextStatus } : item))
    );
    showToast(`"${col.name}" status set to ${nextStatus}.`);
  };

  const handleToggleFeatured = (col: Collection) => {
    setCollections((prev) =>
      prev.map((item) => (item.id === col.id ? { ...item, featured: !item.featured } : item))
    );
    showToast(`"${col.name}" featured state updated.`);
  };

  const handleDuplicate = (col: Collection) => {
    const dup: Collection = {
      ...col,
      id: `col-dup-${Date.now()}`,
      name: `${col.name} (Copy)`,
      slug: `${col.slug}-copy`,
      productsCount: 0,
      assignedProducts: [],
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setCollections((prev) => [dup, ...prev]);
    showToast(`Duplicated "${col.name}" as "${dup.name}".`);
  };

  const handleArchive = (col: Collection | string) => {
    const colId = typeof col === 'string' ? col : col.id;
    const target = collections.find((c) => c.id === colId);
    if (!target) return;
    const nextStatus = target.status === 'Archived' ? 'Active' : 'Archived';
    setCollections((prev) =>
      prev.map((item) => (item.id === colId ? { ...item, status: nextStatus } : item))
    );
    showToast(`"${target.name}" is now ${nextStatus}.`);
  };

  const handleRemoveProductFromCollection = (productId: string) => {
    if (!selectedCollection) return;
    setCollections((prev) =>
      prev.map((col) => {
        if (col.id === selectedCollection.id) {
          const nextProducts = col.assignedProducts.filter((p) => p.id !== productId);
          return {
            ...col,
            assignedProducts: nextProducts,
            productsCount: Math.max(0, col.productsCount - 1),
          };
        }
        return col;
      })
    );
    setSelectedCollection((prev) =>
      prev
        ? {
            ...prev,
            assignedProducts: prev.assignedProducts.filter((p) => p.id !== productId),
            productsCount: Math.max(0, prev.productsCount - 1),
          }
        : null
    );
    showToast(`Removed product from collection.`);
  };

  const handleConfirmDelete = (collectionId: string, replacementCollectionId?: string) => {
    const targetToDelete = collections.find((c) => c.id === collectionId);
    if (!targetToDelete) return;

    setCollections((prev) => {
      let next = prev.filter((item) => item.id !== collectionId);
      if (replacementCollectionId) {
        const replacement = next.find((item) => item.id === replacementCollectionId);
        if (replacement) {
          replacement.productsCount += targetToDelete.productsCount;
          replacement.assignedProducts = [...replacement.assignedProducts, ...targetToDelete.assignedProducts];
        }
      }
      return next;
    });

    if (selectedCollection?.id === collectionId) {
      setSelectedCollection(filteredCollections.find((c) => c.id !== collectionId) || null);
    }

    setSelectedRowIds((prev) => prev.filter((id) => id !== collectionId));
    showToast(`Collection "${targetToDelete.name}" deleted.`);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'feature' | 'archive' | 'delete' | 'export') => {
    if (action === 'activate') {
      setCollections((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, status: 'Active' } : item))
      );
      showToast(`Activated ${selectedRowIds.length} collections.`);
      setSelectedRowIds([]);
    } else if (action === 'deactivate') {
      setCollections((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, status: 'Inactive' } : item))
      );
      showToast(`Deactivated ${selectedRowIds.length} collections.`);
      setSelectedRowIds([]);
    } else if (action === 'feature') {
      setCollections((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, featured: true } : item))
      );
      showToast(`Featured ${selectedRowIds.length} collections.`);
      setSelectedRowIds([]);
    } else if (action === 'archive') {
      setCollections((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, status: 'Archived' } : item))
      );
      showToast(`Archived ${selectedRowIds.length} collections.`);
      setSelectedRowIds([]);
    } else if (action === 'delete') {
      setCollections((prev) => prev.filter((item) => !selectedRowIds.includes(item.id)));
      showToast(`Deleted ${selectedRowIds.length} collections.`);
      setSelectedRowIds([]);
    } else if (action === 'export') {
      setExportImportMode('export');
    }
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
            <span className="text-stone-500">Catalog</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold">Collections</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Collection Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize products into design styles, showcase featured marketing groups, and analyze collection performance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setExportImportMode('import')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-xl transition border border-stone-200 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-stone-500" /> Import
          </button>
          <button
            onClick={() => setExportImportMode('export')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-xl transition border border-stone-200 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" /> Export
          </button>
          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Create Collection
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <CollectionStatistics collections={collections} />

      {/* Search & Filters */}
      <CollectionSearchAndFilters
        filters={filters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onChange={setFilters}
        onReset={() =>
          setFilters({ search: '', status: 'All', featured: 'All', sortBy: 'name' })
        }
        totalResults={filteredCollections.length}
      />

      {/* Main View Mode rendering */}
      {viewMode === 'grid' ? (
        /* Split View Layout: Left 35% Collection Cards, Right 65% Details */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Collection Cards (35%) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
              Select Collection ({filteredCollections.length})
            </h3>
            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredCollections.length > 0 ? (
                filteredCollections.map((col) => (
                  <CollectionCard
                    key={col.id}
                    collection={col}
                    isSelected={selectedCollection?.id === col.id}
                    onSelect={(item) => setSelectedCollection(item)}
                    onEdit={handleOpenEdit}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-xs text-stone-400 bg-white border border-stone-200 rounded-2xl">
                  No collections match filters.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Collection Details (65%) */}
          <div className="lg:col-span-8">
            <CollectionDetailsPanel
              collection={selectedCollection}
              onEdit={handleOpenEdit}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
              onRemoveProduct={handleRemoveProductFromCollection}
            />
          </div>
        </div>
      ) : (
        /* Full Table List View */
        <CollectionTable
          collections={filteredCollections}
          selectedIds={selectedRowIds}
          onSelectRow={(id) =>
            setSelectedRowIds((prev) =>
              prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            )
          }
          onSelectAll={(checked) =>
            setSelectedRowIds(checked ? filteredCollections.map((c) => c.id) : [])
          }
          onViewDetails={(col) => {
            setSelectedCollection(col);
            setViewMode('grid');
          }}
          onEdit={handleOpenEdit}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
          onDelete={(col) => setDeletingCollection(col)}
          onToggleStatus={handleToggleStatus}
          onToggleFeatured={handleToggleFeatured}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Create / Edit Collection Drawer */}
      <CollectionFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveCollection}
        editingCollection={editingCollection}
      />

      {/* Delete Confirmation Safety Modal */}
      <CollectionDeleteModal
        isOpen={!!deletingCollection}
        collection={deletingCollection}
        allCollections={collections}
        onClose={() => setDeletingCollection(null)}
        onConfirmDelete={handleConfirmDelete}
        onArchiveInstead={handleArchive}
      />

      {/* Export / Import Modal */}
      <CollectionExportImportModal
        isOpen={!!exportImportMode}
        mode={exportImportMode}
        collections={collections}
        onClose={() => setExportImportMode(null)}
        onImportCompleted={(imported) => {
          setCollections((prev) => [...imported, ...prev]);
          showToast(`Imported ${imported.length} new collections.`);
        }}
      />
    </div>
  );
}
