'use client';

import { useState } from 'react';
import { Download, Upload, X, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '@/lib/products/types';

interface Props {
  isOpen: boolean;
  mode: 'import' | 'export' | null;
  products: ProductItem[];
  onClose: () => void;
  onImportCompleted: (imported: ProductItem[]) => void;
}

export default function ProductExportImportModal({
  isOpen,
  mode,
  products,
  onClose,
  onImportCompleted,
}: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  if (!isOpen || !mode) return null;

  const handleExportCSV = () => {
    const headers = ['Title', 'SKU', 'Category', 'Product Type', 'Collection', 'Theme', 'Price', 'Stock', 'Status'];
    const rows = products.map((p) => [
      `"${p.title}"`,
      p.sku,
      `"${p.category}"`,
      `"${p.productType}"`,
      `"${p.collectionName || ''}"`,
      `"${p.themeName || ''}"`,
      String(p.price),
      String(p.stock),
      p.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `batalabandi_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleSimulateImport = () => {
    const importedSample: ProductItem[] = [
      {
        id: `prod-import-${Date.now()}`,
        title: 'Mythic Dragon Heavyweight Streetwear Hoodie',
        subtitle: '330 GSM fleece oversized anime dragon hoodie',
        slug: 'mythic-dragon-streetwear-hoodie',
        description: 'Heavyweight 330 GSM fleece hoodie with high density dragon embroidery.',
        sku: 'BB-HOD-099',
        price: 2990,
        compareAtPrice: 3590,
        costPrice: 1200,
        stock: 20,
        lowStockThreshold: 5,
        status: 'Active',
        isFeatured: true,
        category: 'Tops',
        productType: 'Hoodie',
        collectionName: 'Printed',
        themeName: 'Mythology',
        gender: 'Unisex',
        colors: ['Black'],
        sizes: ['M', 'L', 'XL'],
        material: 'Fleece',
        fitType: 'Oversized',
        images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80'],
        thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
        variants: [],
        seo: { metaTitle: '', metaDescription: '', keywords: '' },
        salesCount: 150,
        rating: 4.9,
        createdDate: '15 Mar 2026',
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
            {mode === 'export' ? <Download className="w-5 h-5 text-amber-600" /> : <Upload className="w-5 h-5 text-amber-600" />}
            <h3 className="text-base font-extrabold text-stone-900">
              {mode === 'export' ? 'Export Product Catalog' : 'Import Product Catalog'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {mode === 'export' ? (
          <div className="space-y-4 text-xs text-stone-600">
            <p>
              Exporting all <strong className="text-stone-900">{products.length}</strong> products into standard CSV format.
            </p>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 font-bold text-stone-800">
              <div className="flex justify-between">
                <span>Total Products</span>
                <span>{products.length} items</span>
              </div>
              <div className="flex justify-between">
                <span>File Format</span>
                <span className="font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded">.CSV</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl">
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
                  <p className="font-bold text-emerald-900">Catalog CSV ready for import!</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="font-bold text-stone-800">Drag & drop product CSV file here</p>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button onClick={onClose} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl">
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
