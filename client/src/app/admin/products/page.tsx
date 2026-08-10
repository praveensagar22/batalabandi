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

import { ProductItem, ProductFilterState } from '@/lib/products/types';
import { INITIAL_PRODUCTS } from '@/lib/products/mock-data';
import { fetchProductsAPI, createProductAPI, updateProductAPI, deleteProductAPI, fetchCategoriesAPI, fetchProductTypesAPI, fetchCollectionsAPI, fetchThemesAPI } from '@/lib/api/catalog';
import ProductStatistics from '@/components/admin/products/ProductStatistics';
import ProductSearchAndFilters from '@/components/admin/products/ProductSearchAndFilters';
import ProductCard from '@/components/admin/products/ProductCard';
import ProductTable from '@/components/admin/products/ProductTable';
import ProductDetailsPanel from '@/components/admin/products/ProductDetailsPanel';
import ProductFormDrawer from '@/components/admin/products/ProductFormDrawer';
import ProductDeleteModal from '@/components/admin/products/ProductDeleteModal';
import ProductExportImportModal from '@/components/admin/products/ProductExportImportModal';

export default function ProductManagementPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter State
  const [filters, setFilters] = useState<ProductFilterState>({
    search: '',
    status: 'All',
    category: 'All',
    productType: 'All',
    collection: 'All',
    theme: 'All',
    gender: 'All',
    sortBy: 'createdDate',
  });

  // Dynamic Option Lists for Dropdowns
  const [categoriesList, setCategoriesList] = useState<string[]>(['Tops', 'Bottoms', 'Ethnic Wear', 'Outerwear', 'Accessories']);
  const [productTypesList, setProductTypesList] = useState<string[]>(['Shirt', 'Hoodie', 'Oversized T-Shirt', 'Kurta', 'Joggers']);
  const [collectionsList, setCollectionsList] = useState<string[]>(['Painted', 'Thread', 'Printed', 'Limited Edition', 'Hand Painted']);
  const [themesList, setThemesList] = useState<string[]>(['Anime', 'Marvel', 'Nature', 'Quotes', 'Gaming', 'Sports']);

  // Drawers & Modals State
  const [inspectProduct, setInspectProduct] = useState<ProductItem | null>(null);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null);
  const [exportImportMode, setExportImportMode] = useState<'import' | 'export' | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Products & Taxonomy Options from REST API on Mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProductsAPI();
        if (data && data.length > 0) setProducts(data);

        // Fetch dynamic category names
        const cats = await fetchCategoriesAPI();
        if (cats && cats.length > 0) setCategoriesList(cats.map((c) => c.name));

        // Fetch product types
        const pts = await fetchProductTypesAPI();
        if (pts && pts.length > 0) setProductTypesList(pts.map((pt) => pt.name));

        // Fetch collections
        const cols = await fetchCollectionsAPI();
        if (cols && cols.length > 0) setCollectionsList(cols.map((col) => col.name));

        // Fetch themes
        const thms = await fetchThemesAPI();
        if (thms && thms.length > 0) setThemesList(thms.map((t) => t.name));
      } catch (err) {
        console.log('Backend API offline, using fallback catalog state.');
      }
    }
    loadData();
  }, []);

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSKU = p.sku.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchTitle && !matchSKU && !matchDesc) return false;
      }

      if (filters.status !== 'All' && p.status !== filters.status) return false;
      if (filters.category !== 'All' && p.category !== filters.category) return false;
      if (filters.productType !== 'All' && p.productType !== filters.productType) return false;
      if (filters.collection !== 'All' && p.collectionName !== filters.collection) return false;
      if (filters.theme !== 'All' && p.themeName !== filters.theme) return false;

      return true;
    });
  }, [products, filters]);

  // CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsFormDrawerOpen(true);
  };

  const handleOpenEditProduct = (p: ProductItem) => {
    setEditingProduct(p);
    setIsFormDrawerOpen(true);
  };

  const handleSaveProduct = async (data: Partial<ProductItem>) => {
    try {
      if (editingProduct) {
        const saved = await updateProductAPI(editingProduct.id, data);
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? saved : p)));
        showToast(`Product "${saved.title}" updated successfully.`);
      } else {
        const payload = {
          ...data,
          title: data.title || 'New Product',
          description: data.description || 'Product description...',
          price: data.price || 1490,
          sku: data.sku || `BB-${Date.now().toString().slice(-4)}`,
          category: data.category || categoriesList[0] || 'Tops',
          productType: data.productType || productTypesList[0] || 'Shirt',
          gender: data.gender || 'Unisex',
          status: data.status || 'Active',
          colors: data.colors || ['Black'],
          sizes: data.sizes || ['S', 'M', 'L'],
          images: data.images || [],
          thumbnail: data.thumbnail || data.images?.[0] || '',
          variants: data.variants || [],
        };
        const created = await createProductAPI(payload);
        setProducts((prev) => [created, ...prev]);
        showToast(`Created product "${created.title}" successfully.`);
      }
    } catch (err) {
      console.error('Failed to save product:', err);
      showToast('Error saving product to backend database.', 'error');
    }
    setIsFormDrawerOpen(false);
  };

  const handleDuplicateProduct = (p: ProductItem) => {
    const dup: ProductItem = {
      ...p,
      id: `prod-dup-${Date.now()}`,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy`,
      sku: `${p.sku}-COPY`,
      salesCount: 0,
    };
    setProducts((prev) => [dup, ...prev]);
    createProductAPI(dup).catch(() => {});
    showToast(`Duplicated product "${p.title}".`);
  };

  const handleConfirmDeleteProduct = (id: string) => {
    const deletedProd = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    deleteProductAPI(id).catch(() => {});
    showToast(`Deleted product "${deletedProd?.title || 'item'}".`);
  };

  const handleToggleStatus = (p: ProductItem) => {
    const nextStatus: ProductItem['status'] = p.status === 'Active' ? 'Draft' : 'Active';
    const updated = { ...p, status: nextStatus };
    setProducts((prev) => prev.map((item) => (item.id === p.id ? updated : item)));
    updateProductAPI(p.id, { status: nextStatus }).catch(() => {});
    showToast(`Status of "${p.title}" set to ${nextStatus}.`);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete' | 'export') => {
    if (action === 'activate') {
      setProducts((prev) =>
        prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'Active' } : p))
      );
      setSelectedIds([]);
      showToast(`Activated ${selectedIds.length} products.`);
    } else if (action === 'deactivate') {
      setProducts((prev) =>
        prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'Draft' } : p))
      );
      setSelectedIds([]);
      showToast(`Set ${selectedIds.length} products to Draft.`);
    } else if (action === 'delete') {
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      showToast(`Deleted ${selectedIds.length} products.`);
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
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-1">
            <Link href="/admin" className="hover:text-stone-900 transition">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500">Catalog</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold">Products</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your entire e-commerce garment catalog, pricing, variants, and stock.
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
            onClick={handleOpenAddProduct}
            className="flex items-center gap-2 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <ProductStatistics products={products} />

      {/* Search & Filters */}
      <ProductSearchAndFilters
        filters={filters}
        onChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categoryOptions={categoriesList}
        productTypeOptions={productTypesList}
        collectionOptions={collectionsList}
        themeOptions={themesList}
      />

      {/* Main View Mode Content (Grid vs Table) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onInspect={(item) => setInspectProduct(item)}
                onEdit={(item) => handleOpenEditProduct(item)}
                onDuplicate={(item) => handleDuplicateProduct(item)}
                onDelete={(item) => setDeletingProduct(item)}
              />
            ))
          ) : (
            <div className="col-span-full bg-white border border-stone-200/80 rounded-2xl p-12 text-center text-xs text-stone-400">
              No products found matching active search & filter conditions.
            </div>
          )}
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          selectedIds={selectedIds}
          onSelectRow={(id) =>
            setSelectedIds((prev) =>
              prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            )
          }
          onSelectAll={(checked) =>
            setSelectedIds(checked ? filteredProducts.map((p) => p.id) : [])
          }
          onInspect={(p) => setInspectProduct(p)}
          onEdit={(p) => handleOpenEditProduct(p)}
          onDuplicate={(p) => handleDuplicateProduct(p)}
          onDelete={(p) => setDeletingProduct(p)}
          onToggleStatus={handleToggleStatus}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Inspect Side Drawer Panel */}
      <ProductDetailsPanel
        product={inspectProduct}
        onClose={() => setInspectProduct(null)}
        onEdit={(p) => {
          setInspectProduct(null);
          handleOpenEditProduct(p);
        }}
      />

      {/* Multi-Tab Product Builder Drawer */}
      <ProductFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => setIsFormDrawerOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        categoriesList={categoriesList}
        productTypesList={productTypesList}
        collectionsList={collectionsList}
        themesList={themesList}
      />

      {/* Delete Confirmation Modal */}
      <ProductDeleteModal
        isOpen={!!deletingProduct}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirmDelete={handleConfirmDeleteProduct}
      />

      {/* Export / Import Modal */}
      <ProductExportImportModal
        isOpen={!!exportImportMode}
        mode={exportImportMode}
        products={products}
        onClose={() => setExportImportMode(null)}
        onImportCompleted={(imported) => {
          setProducts((prev) => [...imported, ...prev]);
          showToast(`Imported ${imported.length} products to catalog.`);
        }}
      />
    </div>
  );
}
