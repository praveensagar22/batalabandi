'use client';

import { useState } from 'react';
import { Download, Upload, X, CheckCircle2 } from 'lucide-react';
import { ProductType } from '@/lib/product-types/types';

interface Props {
  isOpen: boolean;
  mode: 'import' | 'export' | null;
  productTypes: ProductType[];
  onClose: () => void;
  onImportCompleted: (imported: ProductType[]) => void;
}

export default function ProductTypeExportImportModal({
  isOpen,
  mode,
  productTypes,
  onClose,
  onImportCompleted,
}: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  if (!isOpen || !mode) return null;

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Slug', 'Category', 'Genders', 'Products Count', 'Featured', 'Status', 'Size Chart', 'Material'];
    const rows = productTypes.map((pt) => [
      pt.id,
      `"${pt.name}"`,
      pt.slug,
      pt.parentCategory,
      `"${pt.genderAvailability.join(', ')}"`,
      pt.productsCount,
      pt.featured ? 'Yes' : 'No',
      pt.status,
      `"${pt.defaults.sizeChart}"`,
      `"${pt.defaults.material}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `batalabandi_product_types_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleSimulateImport = () => {
    const importedSample: ProductType[] = [
      {
        id: `pt-imported-${Date.now()}`,
        name: 'Denim Vest',
        slug: 'denim-vest',
        shortDescription: 'Sleeveless distressed denim vests.',
        fullDescription: 'Imported heavy denim vests for layering.',
        parentCategory: 'Tops',
        genderAvailability: ['Men', 'Unisex'],
        productsCount: 12,
        featured: false,
        status: 'Active',
        sortOrder: 11,
        priority: 6,
        showInNav: true,
        showOnHomepage: false,
        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        defaults: {
          sizeChart: 'Outerwear Standard',
          material: '100% Rigid Denim',
          taxClass: 'Standard 12%',
          shippingClass: 'Standard Apparel',
        },
        seo: { metaTitle: 'Denim Vest', metaDescription: 'Imported denim vests', keywords: 'denim vest' },
      },
    ];

    onImportCompleted(importedSample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-100 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            {mode === 'export' ? (
              <Download className="w-5 h-5 text-amber-600" />
            ) : (
              <Upload className="w-5 h-5 text-amber-600" />
            )}
            <h3 className="text-base font-extrabold text-stone-900">
              {mode === 'export' ? 'Export Product Types' : 'Import Product Types'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {mode === 'export' ? (
          <div className="space-y-4 text-xs text-stone-600">
            <p>
              Exporting all <strong className="text-stone-900">{productTypes.length}</strong> Product Types into CSV format.
              Includes apparel classification, gender targets, product counts, and size/fabric default settings.
            </p>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span>File Format</span>
                <span className="font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded">.CSV</span>
              </div>
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span>Total Items</span>
                <span>{productTypes.length} types</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 font-extrabold rounded-xl shadow-xs"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                setFileUploaded(true);
              }}
              className={`p-8 border-2 border-dashed rounded-2xl text-center space-y-2 transition ${
                dragActive
                  ? 'border-yellow-500 bg-yellow-50'
                  : fileUploaded
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/70'
              }`}
            >
              {fileUploaded ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-emerald-900">File uploaded ready for import!</p>
                  <p className="text-[11px] text-emerald-700">product_types_batch.csv</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="font-bold text-stone-800">Drag & drop CSV or JSON file here</p>
                  <p className="text-[11px] text-stone-400">or click to browse from device</p>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateImport}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 font-extrabold rounded-xl shadow-xs"
              >
                <Upload className="w-4 h-4" /> Start Import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
