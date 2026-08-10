'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Plus,
  Download,
  Upload,
  Layers,
  FolderTree,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

import { Category, CategoryFilterState } from '@/lib/categories/types';
import { INITIAL_CATEGORIES, buildCategoryTree } from '@/lib/categories/mock-data';
import { fetchCategoriesAPI, createCategoryAPI, updateCategoryAPI, deleteCategoryAPI, seedCatalogDB } from '@/lib/api/catalog';
import CategoryStatisticsCard from '@/components/admin/categories/CategoryStatisticsCard';
import CategoryTree from '@/components/admin/categories/CategoryTree';
import CategorySearchAndFilters from '@/components/admin/categories/CategorySearchAndFilters';
import CategoryTable from '@/components/admin/categories/CategoryTable';
import CategoryFormDrawer from '@/components/admin/categories/CategoryFormDrawer';
import CategoryDeleteModal from '@/components/admin/categories/CategoryDeleteModal';
import CategoryExportImportModal from '@/components/admin/categories/CategoryExportImportModal';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTreeCategory, setSelectedTreeCategory] = useState<Category | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Fetch categories from Backend API on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchCategoriesAPI();
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          // Trigger seed if DB is empty
          await seedCatalogDB().catch(() => {});
          const seeded = await fetchCategoriesAPI().catch(() => null);
          if (seeded && seeded.length > 0) setCategories(seeded);
        }
      } catch (err) {
        console.log('Backend API offline, using initialized client catalog.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter state
  const [filters, setFilters] = useState<CategoryFilterState>({
    search: '',
    status: 'All',
    level: 'All',
    gender: 'All',
  });

  // Modals / Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [drawerInitialParentId, setDrawerInitialParentId] = useState<string | null>(null);

  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [exportImportMode, setExportImportMode] = useState<'import' | 'export' | null>(null);

  // Toast feedback banner
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Map for quick parent lookup
  const categoriesMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  // Build recursive tree
  const categoryTree = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories]);

  // Filtered categories for table display
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // 1. If tree node is clicked
      if (selectedTreeCategory) {
        const isSelf = cat.id === selectedTreeCategory.id;
        const isDirectChild = cat.parentId === selectedTreeCategory.id;
        if (!isSelf && !isDirectChild) return false;
      }

      // 2. Search query (name or slug)
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchName = cat.name.toLowerCase().includes(q);
        const matchSlug = cat.slug.toLowerCase().includes(q);
        if (!matchName && !matchSlug) return false;
      }

      // 3. Status filter
      if (filters.status !== 'All' && cat.status !== filters.status) {
        return false;
      }

      // 4. Level filter
      if (filters.level !== 'All') {
        if (filters.level === 'Root' && cat.level !== 0) return false;
        if (filters.level === 'Parent' && cat.level !== 1) return false;
        if (filters.level === 'Child' && cat.level !== 2) return false;
      }

      // 5. Gender filter
      if (filters.gender !== 'All' && cat.gender !== filters.gender) {
        return false;
      }

      return true;
    });
  }, [categories, selectedTreeCategory, filters]);

  // Handler: Open Add Drawer
  const handleOpenAdd = (parentId?: string) => {
    setEditingCategory(null);
    setDrawerInitialParentId(parentId || null);
    setIsDrawerOpen(true);
  };

  // Handler: Open Edit Drawer
  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setDrawerInitialParentId(null);
    setIsDrawerOpen(true);
  };

  // Handler: Save Category (Create or Update)
  const handleSaveCategory = (data: Partial<Category>) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? ({ ...c, ...data } as Category) : c))
      );
      showToast(`Category "${data.name}" updated successfully.`);
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: data.name || 'New Category',
        slug: data.slug || 'new-category',
        description: data.description || '',
        parentId: data.parentId || null,
        gender: data.gender || 'Unisex',
        level: data.level || 0,
        productsCount: 0,
        status: data.status || 'Active',
        sortOrder: data.sortOrder || categories.length + 1,
        image: data.image || '',
        color: data.color || '#facc15',
        showOnHomepage: data.showOnHomepage ?? true,
        featured: data.featured ?? false,
        showInNav: data.showInNav ?? true,
        displayPriority: data.displayPriority || 5,
        seo: data.seo || { metaTitle: '', metaDescription: '', keywords: '' },
      };
      setCategories((prev) => [...prev, newCategory]);
      showToast(`Category "${newCategory.name}" created successfully.`);
    }
    setIsDrawerOpen(false);
  };

  // Handler: Toggle Status
  const handleToggleStatus = (category: Category) => {
    const nextStatus = category.status === 'Active' ? 'Inactive' : 'Active';
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, status: nextStatus } : c))
    );
    showToast(`"${category.name}" is now ${nextStatus}.`);
  };

  // Handler: Reorder Up / Down
  const handleMoveOrder = (id: string, direction: 'up' | 'down') => {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
    showToast(`Reordered category display sequence.`);
  };

  // Handler: Confirm Delete
  const handleConfirmDelete = (categoryId: string, replacementCategoryId?: string) => {
    const catToDelete = categoriesMap.get(categoryId);
    if (!catToDelete) return;

    setCategories((prev) => {
      let next = prev.filter((c) => c.id !== categoryId);
      if (replacementCategoryId) {
        const target = next.find((c) => c.id === replacementCategoryId);
        if (target) {
          target.productsCount += catToDelete.productsCount;
        }
      }
      return next;
    });

    setSelectedRowIds((prev) => prev.filter((id) => id !== categoryId));
    showToast(`Category "${catToDelete.name}" deleted successfully.`);
  };

  // Handler: Bulk Actions
  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete' | 'export') => {
    if (action === 'activate') {
      setCategories((prev) =>
        prev.map((c) => (selectedRowIds.includes(c.id) ? { ...c, status: 'Active' } : c))
      );
      showToast(`Activated ${selectedRowIds.length} categories.`);
      setSelectedRowIds([]);
    } else if (action === 'deactivate') {
      setCategories((prev) =>
        prev.map((c) => (selectedRowIds.includes(c.id) ? { ...c, status: 'Inactive' } : c))
      );
      showToast(`Deactivated ${selectedRowIds.length} categories.`);
      setSelectedRowIds([]);
    } else if (action === 'delete') {
      setCategories((prev) => prev.filter((c) => !selectedRowIds.includes(c.id)));
      showToast(`Deleted ${selectedRowIds.length} categories.`);
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
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-1">
            <Link href="/admin" className="hover:text-stone-900 transition">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500">Catalog</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold">Categories</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Category Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize catalog hierarchies, manage subcategories, display flags, and product mappings.
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
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Dashboard Statistics Cards */}
      <CategoryStatisticsCard categories={categories} />

      {/* Main Split Layout: Left 35% Category Tree, Right 65% Category Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Category Tree (35%) */}
        <div className="lg:col-span-4 h-full">
          <CategoryTree
            tree={categoryTree}
            selectedId={selectedTreeCategory?.id || null}
            onSelect={(cat) => setSelectedTreeCategory(cat)}
            onAddCategory={(parentId) => handleOpenAdd(parentId)}
            onEdit={(cat) => handleOpenEdit(cat)}
            onDelete={(cat) => setDeletingCategory(cat)}
            onToggleStatus={handleToggleStatus}
            onMoveOrder={handleMoveOrder}
          />
        </div>

        {/* Right Column: Category Details & Table (65%) */}
        <div className="lg:col-span-8 space-y-4">
          <CategorySearchAndFilters
            filters={filters}
            onChange={setFilters}
            onReset={() =>
              setFilters({ search: '', status: 'All', level: 'All', gender: 'All' })
            }
            totalResults={filteredCategories.length}
          />

          <CategoryTable
            categories={filteredCategories}
            allCategoriesMap={categoriesMap}
            selectedIds={selectedRowIds}
            onSelectRow={(id) =>
              setSelectedRowIds((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
              )
            }
            onSelectAll={(checked) =>
              setSelectedRowIds(checked ? filteredCategories.map((c) => c.id) : [])
            }
            onEdit={(cat) => handleOpenEdit(cat)}
            onDelete={(cat) => setDeletingCategory(cat)}
            onToggleStatus={handleToggleStatus}
            onBulkAction={handleBulkAction}
          />
        </div>
      </div>

      {/* Add / Edit Category Slide-over Drawer */}
      <CategoryFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        parentCandidateList={categories}
        initialParentId={drawerInitialParentId}
      />

      {/* Delete Confirmation Modal */}
      <CategoryDeleteModal
        isOpen={!!deletingCategory}
        category={deletingCategory}
        allCategories={categories}
        onClose={() => setDeletingCategory(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Export / Import Modal */}
      <CategoryExportImportModal
        isOpen={!!exportImportMode}
        mode={exportImportMode}
        categories={categories}
        onClose={() => setExportImportMode(null)}
        onImportCompleted={(imported) => {
          setCategories((prev) => [...prev, ...imported]);
          showToast(`Successfully imported ${imported.length} new categories.`);
        }}
      />
    </div>
  );
}
