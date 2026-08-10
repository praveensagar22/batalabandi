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

import { AttributeGroup, AttributeValueItem } from '@/lib/attributes/types';
import { INITIAL_ATTRIBUTES } from '@/lib/attributes/mock-data';
import { fetchAttributesAPI, createAttributeAPI, updateAttributeAPI, deleteAttributeAPI } from '@/lib/api/catalog';
import AttributeStatistics from '@/components/admin/attributes/AttributeStatistics';
import AttributeSidebar from '@/components/admin/attributes/AttributeSidebar';
import AttributeTable from '@/components/admin/attributes/AttributeTable';
import AttributeFormDrawer from '@/components/admin/attributes/AttributeFormDrawer';
import AttributeValueModal from '@/components/admin/attributes/AttributeValueModal';
import AttributeDeleteModal from '@/components/admin/attributes/AttributeDeleteModal';
import AttributeExportImportModal from '@/components/admin/attributes/AttributeExportImportModal';

export default function ProductAttributesPage() {
  const [attributes, setAttributes] = useState<AttributeGroup[]>(INITIAL_ATTRIBUTES);
  const [selectedGroup, setSelectedGroup] = useState<AttributeGroup | null>(INITIAL_ATTRIBUTES[0] || null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Drawers & Modals state
  const [isGroupDrawerOpen, setIsGroupDrawerOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AttributeGroup | null>(null);

  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<AttributeValueItem | null>(null);

  const [deletingValue, setDeletingValue] = useState<AttributeValueItem | null>(null);
  const [exportImportMode, setExportImportMode] = useState<'import' | 'export' | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch Attributes from Backend REST API on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAttributesAPI();
        if (data && data.length > 0) {
          setAttributes(data);
          setSelectedGroup(data[0] || null);
        }
      } catch (err) {
        console.log('Backend API offline, using fallback client attributes state.');
      }
    }
    loadData();
  }, []);

  // Handlers for Group CRUD
  const handleOpenAddGroup = () => {
    setEditingGroup(null);
    setIsGroupDrawerOpen(true);
  };

  const handleOpenEditGroup = (group: AttributeGroup) => {
    setEditingGroup(group);
    setIsGroupDrawerOpen(true);
  };

  const handleSaveGroup = async (data: Partial<AttributeGroup>) => {
    if (editingGroup) {
      const updated = { ...editingGroup, ...data } as AttributeGroup;
      setAttributes((prev) =>
        prev.map((g) => (g.id === editingGroup.id ? updated : g))
      );
      if (selectedGroup?.id === editingGroup.id) {
        setSelectedGroup(updated);
      }
      updateAttributeAPI(editingGroup.id, data).catch(() => {});
      showToast(`Attribute group "${data.name}" updated.`);
    } else {
      const newGroup: AttributeGroup = {
        id: `attr-${Date.now()}`,
        name: data.name || 'New Group',
        slug: data.slug || 'new-group',
        description: data.description || '',
        type: data.type || 'Text',
        enableFilter: data.enableFilter ?? true,
        visibleOnProductPage: data.visibleOnProductPage ?? true,
        required: data.required ?? false,
        sortingMode: data.sortingMode || 'Manual',
        status: data.status || 'Active',
        icon: data.icon || 'Tag',
        values: [],
      };
      setAttributes((prev) => [newGroup, ...prev]);
      setSelectedGroup(newGroup);
      createAttributeAPI(newGroup).catch(() => {});
      showToast(`Created attribute group "${newGroup.name}".`);
    }
    setIsGroupDrawerOpen(false);
  };

  // Handlers for Value CRUD
  const handleOpenAddValue = () => {
    setEditingValue(null);
    setIsValueModalOpen(true);
  };

  const handleOpenEditValue = (val: AttributeValueItem) => {
    setEditingValue(val);
    setIsValueModalOpen(true);
  };

  const handleSaveValue = (valData: Partial<AttributeValueItem>) => {
    if (!selectedGroup) return;

    if (editingValue) {
      const nextValues = selectedGroup.values.map((v) =>
        v.id === editingValue.id ? ({ ...v, ...valData } as AttributeValueItem) : v
      );
      const updatedGroup = { ...selectedGroup, values: nextValues };
      setAttributes((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
      setSelectedGroup(updatedGroup);
      updateAttributeAPI(selectedGroup.id, { values: nextValues }).catch(() => {});
      showToast(`Updated option "${valData.name}".`);
    } else {
      const newVal: AttributeValueItem = {
        id: `v-${Date.now()}`,
        name: valData.name || 'New Option',
        slug: valData.slug || 'new-option',
        displayLabel: valData.displayLabel || valData.name || 'New Option',
        colorHex: valData.colorHex || '#000000',
        image: valData.image || '',
        sortOrder: valData.sortOrder || selectedGroup.values.length + 1,
        productsCount: 0,
        status: valData.status || 'Active',
      };
      const nextValues = [...selectedGroup.values, newVal];
      const updatedGroup = { ...selectedGroup, values: nextValues };
      setAttributes((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
      setSelectedGroup(updatedGroup);
      updateAttributeAPI(selectedGroup.id, { values: nextValues }).catch(() => {});
      showToast(`Added option "${newVal.name}" to ${selectedGroup.name}.`);
    }
    setIsValueModalOpen(false);
  };

  const handleToggleValueStatus = (val: AttributeValueItem) => {
    if (!selectedGroup) return;
    const nextStatus: 'Active' | 'Inactive' = val.status === 'Active' ? 'Inactive' : 'Active';
    const nextValues: AttributeValueItem[] = selectedGroup.values.map((v) =>
      v.id === val.id ? { ...v, status: nextStatus } : v
    );
    const updatedGroup: AttributeGroup = { ...selectedGroup, values: nextValues };
    setAttributes((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);
    updateAttributeAPI(selectedGroup.id, { values: nextValues }).catch(() => {});
    showToast(`"${val.name}" status set to ${nextStatus}.`);
  };

  const handleDuplicateValue = (val: AttributeValueItem) => {
    if (!selectedGroup) return;
    const dup: AttributeValueItem = {
      ...val,
      id: `v-dup-${Date.now()}`,
      name: `${val.name} (Copy)`,
      slug: `${val.slug}-copy`,
      productsCount: 0,
    };
    const nextValues = [...selectedGroup.values, dup];
    const updatedGroup = { ...selectedGroup, values: nextValues };
    setAttributes((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);
    updateAttributeAPI(selectedGroup.id, { values: nextValues }).catch(() => {});
    showToast(`Duplicated option "${val.name}".`);
  };

  const handleConfirmDeleteValue = (valueId: string, replacementValueId?: string) => {
    if (!selectedGroup) return;
    const valToDelete = selectedGroup.values.find((v) => v.id === valueId);
    if (!valToDelete) return;

    let nextValues = selectedGroup.values.filter((v) => v.id !== valueId);
    if (replacementValueId) {
      nextValues = nextValues.map((v) =>
        v.id === replacementValueId
          ? { ...v, productsCount: v.productsCount + valToDelete.productsCount }
          : v
      );
    }

    const updatedGroup = { ...selectedGroup, values: nextValues };
    setAttributes((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
    setSelectedGroup(updatedGroup);
    setSelectedRowIds((prev) => prev.filter((id) => id !== valueId));
    updateAttributeAPI(selectedGroup.id, { values: nextValues }).catch(() => {});
    showToast(`Deleted option "${valToDelete.name}".`);
  };

  const handleMergeValues = (sourceId: string, targetId: string) => {
    handleConfirmDeleteValue(sourceId, targetId);
    showToast(`Merged option value successfully.`);
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete' | 'export' | 'merge') => {
    if (!selectedGroup) return;

    if (action === 'activate') {
      const nextValues = selectedGroup.values.map((v) =>
        selectedRowIds.includes(v.id) ? { ...v, status: 'Active' as const } : v
      );
      const updatedGroup = { ...selectedGroup, values: nextValues };
      setAttributes((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
      setSelectedGroup(updatedGroup);
      setSelectedRowIds([]);
      updateAttributeAPI(selectedGroup.id, { values: nextValues }).catch(() => {});
      showToast(`Activated ${selectedRowIds.length} option values.`);
    } else if (action === 'deactivate') {
      const nextValues = selectedGroup.values.map((v) =>
        selectedRowIds.includes(v.id) ? { ...v, status: 'Inactive' as const } : v
      );
      const updatedGroup = { ...selectedGroup, values: nextValues };
      setAttributes((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
      setSelectedGroup(updatedGroup);
      setSelectedRowIds([]);
      updateAttributeAPI(selectedGroup.id, { values: nextValues }).catch(() => {});
      showToast(`Deactivated ${selectedRowIds.length} option values.`);
    } else if (action === 'delete') {
      const nextValues = selectedGroup.values.filter((v) => !selectedRowIds.includes(v.id));
      const updatedGroup = { ...selectedGroup, values: nextValues };
      setAttributes((prev) => prev.map((g) => (g.id === selectedGroup.id ? updatedGroup : g)));
      setSelectedGroup(updatedGroup);
      setSelectedRowIds([]);
      updateAttributeAPI(selectedGroup.id, { values: nextValues }).catch(() => {});
      showToast(`Deleted ${selectedRowIds.length} option values.`);
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
            <span className="text-stone-900 font-bold">Attributes</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Product Attributes
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Centrally manage reusable catalog options (Colors, Sizes, Materials, Fit Types, Sleeve & Neck Types).
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
            onClick={() => handleOpenAddGroup()}
            className="flex items-center gap-2 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Create Attribute
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <AttributeStatistics attributes={attributes} />

      {/* Main Split Layout: Left 30% Groups, Right 70% Values Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Attribute Groups (30%) */}
        <div className="lg:col-span-4">
          <AttributeSidebar
            attributes={attributes}
            selectedId={selectedGroup?.id || null}
            onSelect={(g) => {
              setSelectedGroup(g);
              setSelectedRowIds([]);
            }}
            onCreateGroup={handleOpenAddGroup}
            onEditGroup={handleOpenEditGroup}
          />
        </div>

        {/* Right Column: Attribute Values Table (70%) */}
        <div className="lg:col-span-8">
          <AttributeTable
            group={selectedGroup}
            values={selectedGroup?.values || []}
            selectedIds={selectedRowIds}
            onSelectRow={(id) =>
              setSelectedRowIds((prev) =>
                prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
              )
            }
            onSelectAll={(checked) =>
              setSelectedRowIds(
                checked && selectedGroup ? selectedGroup.values.map((v) => v.id) : []
              )
            }
            onAddValue={handleOpenAddValue}
            onEditValue={handleOpenEditValue}
            onDuplicateValue={handleDuplicateValue}
            onDeleteValue={(v) => setDeletingValue(v)}
            onToggleStatus={handleToggleValueStatus}
            onBulkAction={handleBulkAction}
          />
        </div>
      </div>

      {/* Attribute Group Form Drawer */}
      <AttributeFormDrawer
        isOpen={isGroupDrawerOpen}
        onClose={() => setIsGroupDrawerOpen(false)}
        onSave={handleSaveGroup}
        editingGroup={editingGroup}
      />

      {/* Attribute Value Form Modal */}
      <AttributeValueModal
        isOpen={isValueModalOpen}
        group={selectedGroup}
        editingValue={editingValue}
        onClose={() => setIsValueModalOpen(false)}
        onSave={handleSaveValue}
      />

      {/* Delete Confirmation Safety Modal */}
      <AttributeDeleteModal
        isOpen={!!deletingValue}
        group={selectedGroup}
        valueItem={deletingValue}
        onClose={() => setDeletingValue(null)}
        onConfirmDelete={handleConfirmDeleteValue}
        onMergeValues={handleMergeValues}
      />

      {/* Export / Import Modal */}
      <AttributeExportImportModal
        isOpen={!!exportImportMode}
        mode={exportImportMode}
        attributes={attributes}
        onClose={() => setExportImportMode(null)}
        onImportCompleted={(imported) => {
          setAttributes((prev) => [...imported, ...prev]);
          showToast(`Imported ${imported.length} new attribute groups.`);
        }}
      />
    </div>
  );
}
