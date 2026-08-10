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

import { Theme, ThemeFilterState } from '@/lib/themes/types';
import { INITIAL_THEMES } from '@/lib/themes/mock-data';
import { fetchThemesAPI, createThemeAPI, updateThemeAPI, deleteThemeAPI } from '@/lib/api/catalog';
import ThemeStatistics from '@/components/admin/themes/ThemeStatistics';
import ThemeSearchAndFilters from '@/components/admin/themes/ThemeSearchAndFilters';
import ThemeCard from '@/components/admin/themes/ThemeCard';
import ThemeTable from '@/components/admin/themes/ThemeTable';
import ThemeDetailsPanel from '@/components/admin/themes/ThemeDetailsPanel';
import ThemeFormDrawer from '@/components/admin/themes/ThemeFormDrawer';
import ThemeDeleteModal from '@/components/admin/themes/ThemeDeleteModal';
import ThemeExportImportModal from '@/components/admin/themes/ThemeExportImportModal';

export default function ThemeManagementPage() {
  const [themes, setThemes] = useState<Theme[]>(INITIAL_THEMES);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(INITIAL_THEMES[0] || null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchThemesAPI();
        if (data && data.length > 0) {
          setThemes(data);
          setSelectedTheme(data[0] || null);
        }
      } catch (err) {
        console.log('Backend API offline, using fallback catalog state.');
      }
    }
    loadData();
  }, []);

  // Filters
  const [filters, setFilters] = useState<ThemeFilterState>({
    search: '',
    status: 'All',
    featured: 'All',
    collection: 'All',
    sortBy: 'name',
  });

  // Drawer & Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);

  const [deletingTheme, setDeletingTheme] = useState<Theme | null>(null);
  const [exportImportMode, setExportImportMode] = useState<'import' | 'export' | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered themes
  const filteredThemes = useMemo(() => {
    let result = themes.filter((t) => {
      // 1. Search (name, slug, keywords)
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q);
        const matchSlug = t.slug.toLowerCase().includes(q);
        const matchKeywords = t.seo.keywords.toLowerCase().includes(q);
        if (!matchName && !matchSlug && !matchKeywords) return false;
      }

      // 2. Status
      if (filters.status !== 'All' && t.status !== filters.status) return false;

      // 3. Featured
      if (filters.featured !== 'All') {
        if (filters.featured === 'Yes' && !t.featured) return false;
        if (filters.featured === 'No' && t.featured) return false;
      }

      // 4. Collection compatibility
      if (filters.collection !== 'All' && !t.compatibleCollections.includes(filters.collection)) {
        return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'productsCount') return b.productsCount - a.productsCount;
      if (filters.sortBy === 'views') return b.analytics.views - a.analytics.views;
      if (filters.sortBy === 'createdDate') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [themes, filters]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingTheme(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (t: Theme) => {
    setEditingTheme(t);
    setIsDrawerOpen(true);
  };

  const handleSaveTheme = (data: Partial<Theme>) => {
    if (editingTheme) {
      setThemes((prev) =>
        prev.map((item) => (item.id === editingTheme.id ? ({ ...item, ...data } as Theme) : item))
      );
      if (selectedTheme?.id === editingTheme.id) {
        setSelectedTheme((prev) => (prev ? ({ ...prev, ...data } as Theme) : null));
      }
      showToast(`Theme "${data.name}" updated successfully.`);
    } else {
      const newTheme: Theme = {
        id: `theme-${Date.now()}`,
        name: data.name || 'New Theme',
        slug: data.slug || 'new-theme',
        shortDescription: data.shortDescription || '',
        fullDescription: data.fullDescription || '',
        productsCount: 0,
        status: data.status || 'Active',
        featured: data.featured ?? true,
        trending: data.trending ?? true,
        showOnHomepage: data.showOnHomepage ?? true,
        homepagePriority: data.homepagePriority || 1,
        showInNav: data.showInNav ?? true,
        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        icon: data.icon || 'Sparkles',
        bannerImage: data.bannerImage || '',
        thumbnailImage: data.thumbnailImage || '',
        themeColor: data.themeColor || '#ef4444',
        gradientColor: data.gradientColor || 'from-red-500 to-amber-500',
        compatibleCollections: data.compatibleCollections || ['Painted', 'Printed'],
        marketing: data.marketing || { tagline: 'Explore Theme', buttonText: 'Explore', buttonUrl: '/themes', campaignLabel: 'New' },
        seo: data.seo || { metaTitle: '', metaDescription: '', keywords: '' },
        analytics: {
          salesCount: 0,
          revenue: '₹0',
          views: 0,
          conversionRate: '0.0%',
          wishlistCount: 0,
          averageRating: 5.0,
          monthlySales: [{ month: 'Jul', amount: 0 }],
        },
        assignedProducts: [],
      };
      setThemes((prev) => [newTheme, ...prev]);
      setSelectedTheme(newTheme);
      showToast(`Theme "${newTheme.name}" created successfully.`);
    }
    setIsDrawerOpen(false);
  };

  const handleToggleStatus = (t: Theme) => {
    const nextStatus = t.status === 'Active' ? 'Draft' : 'Active';
    setThemes((prev) =>
      prev.map((item) => (item.id === t.id ? { ...item, status: nextStatus } : item))
    );
    showToast(`"${t.name}" status set to ${nextStatus}.`);
  };

  const handleToggleFeatured = (t: Theme) => {
    setThemes((prev) =>
      prev.map((item) => (item.id === t.id ? { ...item, featured: !item.featured } : item))
    );
    showToast(`"${t.name}" featured state updated.`);
  };

  const handleDuplicate = (t: Theme) => {
    const dup: Theme = {
      ...t,
      id: `theme-dup-${Date.now()}`,
      name: `${t.name} (Copy)`,
      slug: `${t.slug}-copy`,
      productsCount: 0,
      assignedProducts: [],
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setThemes((prev) => [dup, ...prev]);
    showToast(`Duplicated "${t.name}" as "${dup.name}".`);
  };

  const handleArchive = (t: Theme | string) => {
    const themeId = typeof t === 'string' ? t : t.id;
    const target = themes.find((item) => item.id === themeId);
    if (!target) return;
    const nextStatus = target.status === 'Archived' ? 'Active' : 'Archived';
    setThemes((prev) =>
      prev.map((item) => (item.id === themeId ? { ...item, status: nextStatus } : item))
    );
    showToast(`"${target.name}" is now ${nextStatus}.`);
  };

  const handleRemoveProductFromTheme = (productId: string) => {
    if (!selectedTheme) return;
    setThemes((prev) =>
      prev.map((t) => {
        if (t.id === selectedTheme.id) {
          const nextProducts = t.assignedProducts.filter((p) => p.id !== productId);
          return {
            ...t,
            assignedProducts: nextProducts,
            productsCount: Math.max(0, t.productsCount - 1),
          };
        }
        return t;
      })
    );
    setSelectedTheme((prev) =>
      prev
        ? {
            ...prev,
            assignedProducts: prev.assignedProducts.filter((p) => p.id !== productId),
            productsCount: Math.max(0, prev.productsCount - 1),
          }
        : null
    );
    showToast(`Removed product from theme.`);
  };

  const handleConfirmDelete = (themeId: string, replacementThemeId?: string) => {
    const targetToDelete = themes.find((t) => t.id === themeId);
    if (!targetToDelete) return;

    setThemes((prev) => {
      let next = prev.filter((item) => item.id !== themeId);
      if (replacementThemeId) {
        const replacement = next.find((item) => item.id === replacementThemeId);
        if (replacement) {
          replacement.productsCount += targetToDelete.productsCount;
          replacement.assignedProducts = [...replacement.assignedProducts, ...targetToDelete.assignedProducts];
        }
      }
      return next;
    });

    if (selectedTheme?.id === themeId) {
      setSelectedTheme(filteredThemes.find((t) => t.id !== themeId) || null);
    }

    setSelectedRowIds((prev) => prev.filter((id) => id !== themeId));
    showToast(`Theme "${targetToDelete.name}" deleted.`);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'feature' | 'archive' | 'delete' | 'export') => {
    if (action === 'activate') {
      setThemes((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, status: 'Active' } : item))
      );
      showToast(`Activated ${selectedRowIds.length} themes.`);
      setSelectedRowIds([]);
    } else if (action === 'deactivate') {
      setThemes((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, status: 'Draft' } : item))
      );
      showToast(`Deactivated ${selectedRowIds.length} themes.`);
      setSelectedRowIds([]);
    } else if (action === 'feature') {
      setThemes((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, featured: true } : item))
      );
      showToast(`Featured ${selectedRowIds.length} themes.`);
      setSelectedRowIds([]);
    } else if (action === 'archive') {
      setThemes((prev) =>
        prev.map((item) => (selectedRowIds.includes(item.id) ? { ...item, status: 'Archived' } : item))
      );
      showToast(`Archived ${selectedRowIds.length} themes.`);
      setSelectedRowIds([]);
    } else if (action === 'delete') {
      setThemes((prev) => prev.filter((item) => !selectedRowIds.includes(item.id)));
      showToast(`Deleted ${selectedRowIds.length} themes.`);
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
            <span className="text-stone-900 font-bold">Themes</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Theme Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize products by artwork design concepts (Anime, Marvel, Nature, Gaming) and build custom landing pages.
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
            <Plus className="w-4 h-4" /> Create Theme
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <ThemeStatistics themes={themes} />

      {/* Search & Filters */}
      <ThemeSearchAndFilters
        filters={filters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onChange={setFilters}
        onReset={() =>
          setFilters({ search: '', status: 'All', featured: 'All', collection: 'All', sortBy: 'name' })
        }
        totalResults={filteredThemes.length}
      />

      {/* Main View Mode Rendering */}
      {viewMode === 'grid' ? (
        /* Split View Layout: Left 35% Theme Cards, Right 65% Theme Details Panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Theme Cards (35%) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
              Select Theme ({filteredThemes.length})
            </h3>
            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredThemes.length > 0 ? (
                filteredThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isSelected={selectedTheme?.id === theme.id}
                    onSelect={(t) => setSelectedTheme(t)}
                    onEdit={handleOpenEdit}
                  />
                ))
              ) : (
                <div className="py-12 text-center text-xs text-stone-400 bg-white border border-stone-200 rounded-2xl">
                  No themes match filters.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Theme Details Panel (65%) */}
          <div className="lg:col-span-8">
            <ThemeDetailsPanel
              theme={selectedTheme}
              onEdit={handleOpenEdit}
              onDuplicate={handleDuplicate}
              onArchive={handleArchive}
              onRemoveProduct={handleRemoveProductFromTheme}
            />
          </div>
        </div>
      ) : (
        /* Full Table List View */
        <ThemeTable
          themes={filteredThemes}
          selectedIds={selectedRowIds}
          onSelectRow={(id) =>
            setSelectedRowIds((prev) =>
              prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
            )
          }
          onSelectAll={(checked) =>
            setSelectedRowIds(checked ? filteredThemes.map((t) => t.id) : [])
          }
          onViewDetails={(t) => {
            setSelectedTheme(t);
            setViewMode('grid');
          }}
          onEdit={handleOpenEdit}
          onDuplicate={handleDuplicate}
          onArchive={handleArchive}
          onDelete={(t) => setDeletingTheme(t)}
          onToggleStatus={handleToggleStatus}
          onToggleFeatured={handleToggleFeatured}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Create / Edit Theme Drawer */}
      <ThemeFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveTheme}
        editingTheme={editingTheme}
      />

      {/* Delete Confirmation Safety Modal */}
      <ThemeDeleteModal
        isOpen={!!deletingTheme}
        theme={deletingTheme}
        allThemes={themes}
        onClose={() => setDeletingTheme(null)}
        onConfirmDelete={handleConfirmDelete}
        onArchiveInstead={handleArchive}
      />

      {/* Export / Import Modal */}
      <ThemeExportImportModal
        isOpen={!!exportImportMode}
        mode={exportImportMode}
        themes={themes}
        onClose={() => setExportImportMode(null)}
        onImportCompleted={(imported) => {
          setThemes((prev) => [...imported, ...prev]);
          showToast(`Imported ${imported.length} new themes.`);
        }}
      />
    </div>
  );
}
