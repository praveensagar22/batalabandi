'use client';

import { useCallback, useRef, useState } from 'react';
import {
  Upload,
  X,
  Star,
  GripVertical,
  ImageIcon,
  Crop,
  Trash2,
} from 'lucide-react';
import type { ImageType, ProductImage } from '@/lib/products/create-types';
import FormField from './FormField';
import { cn } from '@/lib/cn';

interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  error?: string;
}

const IMAGE_TYPES: { value: ImageType; label: string }[] = [
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'variant', label: 'Variant' },
];

function generateImageId() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ImageUploader({ images, onChange, error }: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedType, setSelectedType] = useState<ImageType>('front');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newImages: ProductImage[] = Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .map((file, idx) => ({
          id: generateImageId(),
          url: URL.createObjectURL(file),
          name: file.name,
          type: selectedType,
          isPrimary: images.length === 0 && idx === 0,
        }));
      onChange([...images, ...newImages]);
    },
    [images, onChange, selectedType]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const setPrimary = (id: string) => {
    onChange(images.map((img) => ({ ...img, isPrimary: img.id === id })));
  };

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((i) => i.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onChange(filtered);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  return (
    <FormField label="Product Images" error={error} hint="Drag to reorder. Set one as primary.">
      <div className="space-y-4">
        {/* Type selector */}
        <div className="flex flex-wrap gap-2">
          {IMAGE_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setSelectedType(t.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                selectedType === t.value
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors',
            dragOver
              ? 'border-stone-400 bg-stone-50'
              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
          )}
        >
          <Upload className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-stone-700">
            Drop images here or click to upload
          </p>
          <p className="text-xs text-stone-400 mt-1">
            PNG, JPG, WebP up to 10MB · Auto-compressed on upload
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div
                key={img.id}
                className={cn(
                  'group relative rounded-xl border overflow-hidden bg-stone-50',
                  img.isPrimary ? 'ring-2 ring-stone-900 ring-offset-2' : 'border-stone-200'
                )}
              >
                <div className="aspect-square relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                  {img.isPrimary && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-stone-900 text-white text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" /> Primary
                    </span>
                  )}
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/90 text-stone-600 text-[10px] font-medium rounded-md capitalize">
                    {img.type}
                  </span>
                </div>

                <div className="p-2 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => index > 0 && moveImage(index, index - 1)}
                      className="p-1 text-stone-400 hover:text-stone-600"
                      title="Move left"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimary(img.id)}
                        className="p-1 text-stone-400 hover:text-amber-500"
                        title="Set as primary"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="p-1 text-stone-400 hover:text-stone-600"
                      title="Crop"
                    >
                      <Crop className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="p-1 text-stone-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="px-2 pb-2 text-[10px] text-stone-400 truncate">{img.name}</p>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <ImageIcon className="w-4 h-4" />
            No images uploaded yet
          </div>
        )}
      </div>
    </FormField>
  );
}
