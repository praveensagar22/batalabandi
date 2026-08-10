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

import { ProductType, ProductTypeFilterState } from '@/lib/product-types/types';
import { INITIAL_PRODUCT_TYPES } from '@/lib/product-types/mock-data';
import { fetchProductTypesAPI, createProductTypeAPI, updateProductTypeAPI, deleteProductTypeAPI } from '@/lib/api/catalog';
import ProductTypeStatistics from '@/components/admin/product-types/ProductTypeStatistics';
import ProductTypeSearchAndFilters from '@/components/admin/product-types/ProductTypeSearchAndFilters';
import ProductTypeTable from '@/components/admin/product-types/ProductTypeTable';
import ProductTypeFormDrawer from '@/components/admin/product-types/ProductTypeFormDrawer';
import ProductTypeDetailsPanel from '@/components/admin/product-types/ProductTypeDetailsPanel';
import ProductTypeDeleteModal from '@/components/admin/product-types/ProductTypeDeleteModal';
import ProductTypeExportImportModal from '@/components/admin/product-types/ProductTypeExportImportModal';

export default function ProductTypeManagementPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>(INITIAL_PRODUCT_TYPES);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProductTypesAPI();
        if (data && data.length > 0) setProductTypes(data);
      } catch (err) {
        console.log('Backend API offline, using fallback catalog state.');
      }
    }
    loadData();
  }, []);

  // Filters state
  const [filters, setFilters] = useState<ProductTypeFilterState>({
    search: '',
    status: 'All',
    category: 'All',
    gender: 'All',
    featured: 'All',
  });

  // Drawer & Panel state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProductType, setEditingProductType] = useState<ProductType | null>(null);
  const [detailsProductType, setDetailsProductType] = useState<ProductType | null>(null);

  // Modals state
  const [deletingProductType, setDeletingProductType] = useState<ProductType | null>(null);
  const [exportImportMode, setExportImportMode] = useState<'import' | 'export' | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Distinct parent categories list
  const parentCategoriesList = useMemo(() => {
    const set = new Set<string>();
    productTypes.forEach((pt) => set.add(pt.parentCategory));
    return Array.from(set);
  }, [productTypes]);

  // Filtered product types
  const filteredProductTypes = useMemo(() => {
    return productTypes.filter((pt) => {
      // 1. Search (name or slug)
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchName = pt.name.toLowerCase().includes(q);
        const matchSlug = pt.slug.toLowerCase().includes(q);
        if (!matchName && !matchSlug) return false;
      }

      // 2. Status
      if (filters.status !== 'All' && pt.status !== filters.status) return false;

      // 3. Category
      if (filters.category !== 'All' && pt.parentCategory !== filters.category) return false;

      // 4. Gender
      if (filters.gender !== 'All' && !pt.genderAvailability.includes(filters.gender as any)) return false;

      // 5. Featured
      if (filters.featured !== 'All') {
        if (filters.featured === 'Yes' && !pt.featured) return false;
        if (filters.featured === 'No' && pt.featured) return false;
      }

      return true;
    });
  }, [productTypes, filters]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingProductType(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (pt: ProductType) => {
    setEditingProductType(pt);
    setIsDrawerOpen(true);
  };

  const handleSaveProductType = (data: Partial<ProductType>) => {
    if (editingProductType) {
      setProductTypes((prev) =>
        prev.map((item) => (item.id === editingProductType.id ? ({ ...item, ...data } as ProductType) : item))
      );
      showToast(`Product Type "${data.name}" updated successfully.`);
    } else {
      const newPt: ProductType = {
        id: `pt-${Date.now()}`,
        name: data.name || 'New Product Type',
        slug: data.slug || 'new-product-type',
        shortDescription: data.shortDescription || '',
        fullDescription: data.fullDescription || '',
        parentCategory: data.parentCategory || 'Tops',
        genderAvailability: data.genderAvailability || ['Men', 'Women', 'Unisex'],
        productsCount: 0,
        featured: data.featured ?? false,
        status: data.status || 'Active',
        sortOrder: data.sortOrder || productTypes.length + 1,
        priority: data.priority || 5,
        icon: data.icon || 'Shirt',
        image: data.image || '',
        color: data.color || '#facc15',
        showInNav: data.showInNav ?? true,
        showOnHomepage: data.showOnHomepage ?? true,
        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        defaults: data.defaults || {
          sizeChart: 'Standard Fit',
          material: '100% Cotton',
          taxClass: 'Standard 12%',
          shippingClass: 'Standard Apparel',
        },
        seo: data.seo || { metaTitle: '', metaDescription: '', keywords: '' },
      };
      setProductTypes((prev) => [...prev, newPt]);
      showToast(`Product Type "${newPt.name}" created successfully.`);
    }
    setIsDrawerOpen(false);
  };

  const handleToggleStatus = (pt: ProductType) => {
    const nextStatus = pt.status === 'Active' ? 'Inactive' : 'Active';
    setProductTypes((prev) =>
      prev.map((item) => (item.id === pt.id ? { ...item, status: nextStatus } : item))
    );
    showToast(`"${pt.name}" status set to ${nextStatus}.`);
  };

  const handleToggleFeatured = (pt: ProductType) => {
    setProductTypes((prev) =>
      prev.map((item) => (item.id === pt.id ? { ...item, featured: !item.featured } : item))
    );
    showToast(`"${pt.name}" featured state updated.`);
  };

  const handleDuplicate = (pt: ProductType) => {
    const dup: ProductType = {
      ...pt,
      id: `pt-dup-${Date.now()}`,
      name: `${pt.name} (Copy)`,
      slug: `${pt.slug}-copy`,
      productsCount: 0,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setProductTypes((prev) => [...prev, dup]);
    showToast(`Duplicated "${pt.name}" as "${dup.name}".`);
  };

  const handleArchive = (pt: ProductType) => {
    const nextStatus = pt.status === 'Archived' ? 'Active' : 'Archived';
    setProductTypes((prev) =>
      prev.map((item) => (item.id === pt.id ? { ...item, status: nextStatus } : item))
    );
    showToast(`"${pt.name}" is now ${nextStatus}.`);
  };

  const handleConfirmDelete = (productTypeId: string, replacementTypeId?: string) => {
    const targetToDelete = productTypes.find((pt) => pt.id === productTypeId);
    if (!targetToDelete) return;

    setProductTypes((prev) => {
      let next = prev.filter((item) => item.id !== productTypeId);
      if (replacementTypeId) {
        const replacement = next.find((item) => item.id === replacementTypeId);
        if (replacement) {
          replacement.productsCount += targetToDelete.productsCount;
        }
      }
      return next;
    });

    setSelectedRowIds((prev) => prev.filter((id) => id !== productTypeId));
    showToast(`Product Type "${targetToDelete.name}" deleted.`);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'delete' | 'export') => {
    if (action === 'activate') {
      setProductTypes((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, status: 'Active' } : item))
      );
      showToast(`Activated ${selectedRowIds.length} product types.`);
      setSelectedRowIds([]);
    } else if (action === 'deactivate') {
      setProductTypes((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, status: 'Inactive' } : item))
      );
      showToast(`Deactivated ${selectedRowIds.length} product types.`);
      setSelectedRowIds([]);
    } else if (action === 'feature') {
      setProductTypes((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, featured: true } : item))
      );
      showToast(`Featured ${selectedRowIds.length} product types.`);
      setSelectedRowIds([]);
    } else if (action === 'delete') {
      setProductTypes((prev) => prev.filter((item) => !selectedRowIds.includes(item.id)));
      showToast(`Deleted ${selectedRowIds.length} product types.`);
      setSelectedRowIds([]);
    } else if (action === 'export') {
      setExportImportMode('export');
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Toast Banner */}
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
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-1">
            <Link href="/admin" className="hover:text-stone-900 transition">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500">Catalog</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold">Product Types</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Product Type Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Define apparel types, size charts, material defaults, and tax classes independently from categories.
          </p>
        </div>

        {/* Header Action Buttons */}
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
            <Plus className="w-4 h-4" /> Add Product Type
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <ProductTypeStatistics productTypes={productTypes} />

      {/* Search and Filters */}
      <ProductTypeSearchAndFilters
        filters={filters}
        categoriesList={parentCategoriesList}
        onChange={setFilters}
        onReset={() =>
          setFilters({ search: '', status: 'All', category: 'All', gender: 'All', featured: 'All' })
        }
        totalResults={filteredProductTypes.length}
      />

      {/* Product Types Table */}
      <ProductTypeTable
        productTypes={filteredProductTypes}
        selectedIds={selectedRowIds}
        onSelectRow={(id) =>
          setSelectedRowIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
          )
        }
        onSelectAll={(checked) =>
          setSelectedRowIds(checked ? filteredProductTypes.map((pt) => pt.id) : [])
        }
        onViewDetails={(pt) => setDetailsProductType(pt)}
        onEdit={(pt) => handleOpenEdit(pt)}
        onDuplicate={handleDuplicate}
        onArchive={handleArchive}
        onDelete={(pt) => setDeletingProductType(pt)}
        onToggleStatus={handleToggleStatus}
        onToggleFeatured={handleToggleFeatured}
        onBulkAction={handleBulkAction}
      />

      {/* Add / Edit Product Type Drawer */}
      <ProductTypeFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveProductType}
        editingProductType={editingProductType}
        parentCategories={['Tops', 'Bottoms', 'Ethnic Wear', 'Outerwear', 'Accessories']}
      />

      {/* Details Side Panel */}
      <ProductTypeDetailsPanel
        productType={detailsProductType}
        onClose={() => setDetailsProductType(null)}
        onEdit={(pt) => handleOpenEdit(pt)}
        onDuplicate={handleDuplicate}
        onArchive={handleArchive}
      />

      {/* Delete Confirmation Modal */}
      <ProductTypeDeleteModal
        isOpen={!!deletingProductType}
        productType={deletingProductType}
        allProductTypes={productTypes}
        onClose={() => setDeletingProductType(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Export / Import Modal */}
      <ProductTypeExportImportModal
        isOpen={!!exportImportMode}
        mode={exportImportMode}
        productTypes={productTypes}
        onClose={() => setExportImportMode(null)}
        onImportCompleted={(imported) => {
          setProductTypes((prev) => [...prev, ...imported]);
          showToast(`Imported ${imported.length} new Product Types.`);
        }}
      />
    </div>
  );
}
