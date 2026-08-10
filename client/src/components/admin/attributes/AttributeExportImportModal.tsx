'use client';

import { useState } from 'react';
import { Download, Upload, X, CheckCircle2 } from 'lucide-react';
import { AttributeGroup } from '@/lib/attributes/types';

interface Props {
  isOpen: boolean;
  mode: 'import' | 'export' | null;
  attributes: AttributeGroup[];
  onClose: () => void;
  onImportCompleted: (imported: AttributeGroup[]) => void;
}

export default function AttributeExportImportModal({
  isOpen,
  mode,
  attributes,
  onClose,
  onImportCompleted,
}: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  if (!isOpen || !mode) return null;

  const handleExportCSV = () => {
    const headers = ['Group', 'Type', 'Value Name', 'Display Label', 'Color Hex', 'Sort Order', 'Products Count', 'Status'];
    const rows: string[][] = [];

    attributes.forEach((group) => {
      group.values.forEach((v) => {
        rows.push([
          `"${group.name}"`,
          group.type,
          `"${v.name}"`,
          `"${v.displayLabel}"`,
          v.colorHex || '',
          String(v.sortOrder),
          String(v.productsCount),
          v.status,
        ]);
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `batalabandi_attributes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleSimulateImport = () => {
    const importedSample: AttributeGroup[] = [
      {
        id: `attr-import-${Date.now()}`,
        name: 'Fabric GSM',
        slug: 'fabric-gsm',
        description: 'Fabric weight metrics in grams per square meter',
        type: 'Number',
        enableFilter: true,
        visibleOnProductPage: true,
        required: false,
        sortingMode: 'Manual',
        status: 'Active',
        icon: 'Layers',
        values: [
          { id: 'v-240-gsm', name: '240 GSM', slug: '240-gsm', displayLabel: '240 GSM Heavyweight Cotton', sortOrder: 1, productsCount: 310, status: 'Active' },
          { id: 'v-180-gsm', name: '180 GSM', slug: '180-gsm', displayLabel: '180 GSM Everyday Lightweight Cotton', sortOrder: 2, productsCount: 140, status: 'Active' },
        ],
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
              {mode === 'export' ? 'Export Attributes' : 'Import Attributes'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {mode === 'export' ? (
          <div className="space-y-4 text-xs text-stone-600">
            <p>
              Exporting all <strong className="text-stone-900">{attributes.length}</strong> attribute groups and their option values into CSV format.
            </p>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span>File Format</span>
                <span className="font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded">.CSV</span>
              </div>
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span>Attribute Groups</span>
                <span>{attributes.length} groups</span>
              </div>
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span>Total Values</span>
                <span>{attributes.reduce((acc, a) => acc + a.values.length, 0)} option values</span>
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
                  <p className="font-bold text-emerald-900">File uploaded ready for import!</p>
                  <p className="text-[11px] text-emerald-700">attributes_batch.csv</p>
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
