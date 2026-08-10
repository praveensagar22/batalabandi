'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '@/lib/api/client';

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploadPicker({ value, onChange, label = 'Upload Image' }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files (JPG, PNG, WEBP) are allowed');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const uploadedUrl = await uploadFile(file);
      onChange(uploadedUrl);
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-stone-800">{label}</label>}

      {/* Preview if image URL exists */}
      {value ? (
        <div className="relative w-full h-40 rounded-2xl overflow-hidden border-2 border-stone-200 group bg-stone-900">
          <Image src={value} alt="Preview" fill unoptimized className="object-cover group-hover:opacity-75 transition" />
          <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <X className="w-4 h-4" /> Remove Image
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop File Upload Box */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className={`relative p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition ${
            dragActive
              ? 'border-yellow-500 bg-yellow-50/80'
              : 'border-stone-200 bg-stone-50 hover:bg-stone-100/70'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />

          <div className="space-y-1.5 pointer-events-none">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-stone-600">
                <Loader2 className="w-7 h-7 animate-spin text-amber-600" />
                <p className="text-xs font-bold">Uploading image via Multer...</p>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-stone-900">Click to upload or drag & drop your image</p>
                <p className="text-[11px] text-stone-400">PNG, JPG, WEBP up to 5MB (Saved via Multer)</p>
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[11px] font-bold text-red-600">{error}</p>}
    </div>
  );
}
