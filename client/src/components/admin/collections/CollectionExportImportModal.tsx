'use client';

import { useState } from 'react';
import { Download, Upload, X, CheckCircle2 } from 'lucide-react';
import { Collection } from '@/lib/collections/types';

interface Props {
  isOpen: boolean;
  mode: 'import' | 'export' | null;
  collections: Collection[];
  onClose: () => void;
  onImportCompleted: (imported: Collection[]) => void;
}

export default function CollectionExportImportModal({
  isOpen,
  mode,
  collections,
  onClose,
  onImportCompleted,
}: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  if (!isOpen || !mode) return null;

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Slug', 'Products Count', 'Status', 'Featured', 'Promo Label', 'Revenue', 'Created Date'];
    const rows = collections.map((c) => [
      c.id,
      `"${c.name}"`,
      c.slug,
      c.productsCount,
      c.status,
      c.featured ? 'Yes' : 'No',
      `"${c.marketing.promoLabel || ''}"`,
      `"${c.analytics.revenue}"`,
      c.createdDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `batalabandi_collections_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleSimulateImport = () => {
    const importedSample: Collection[] = [
      {
        id: `col-imported-${Date.now()}`,
        name: 'Indigo Dye Art',
        slug: 'indigo-dye-art',
        shortDescription: 'Natural organic indigo dyed apparel.',
        detailedDescription: 'Hand-dyed organic cotton streetwear utilizing traditional Indian indigo vats.',
        productsCount: 18,
        status: 'Active',
        featured: false,
        showOnHomepage: true,
        homepagePriority: 6,
        displayOrder: 6,
        displayStyle: 'Card',
        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        icon: 'Palette',
        themeColor: '#3b82f6',
        marketing: {
          buttonText: 'Shop Indigo Art',
          buttonUrl: '/collections/indigo-dye-art',
          promoLabel: 'New',
        },
        seo: { metaTitle: 'Indigo Dye Collection', metaDescription: 'Organic indigo dyed clothing.', keywords: 'indigo dye' },
        analytics: {
          salesCount: 140,
          revenue: '₹2,80,000',
          views: 6200,
          conversionRate: '2.5%',
          monthlySales: [{ month: 'Jul', amount: 280000 }],
        },
        assignedProducts: [],
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
              {mode === 'export' ? 'Export Collections' : 'Import Collections'}
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
              Exporting all <strong className="text-stone-900">{collections.length}</strong> collections into CSV format.
              Includes sales revenue analytics, homepage priorities, and promotional labels.
            </p>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span>File Format</span>
                <span className="font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded">.CSV</span>
              </div>
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span>Total Items</span>
                <span>{collections.length} collections</span>
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
                  <p className="text-[11px] text-emerald-700">collections_marketing_batch.csv</p>
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
