'use client';

import type { ProductCreateForm, StepErrors } from '@/lib/products/create-types';
import ImageUploader from '../ui/ImageUploader';

interface StepProps {
  form: ProductCreateForm;
  onChange: (updates: Partial<ProductCreateForm>) => void;
  errors: StepErrors;
}

export default function StepImages({ form, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Images</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Upload product photos. Drag to reorder and set a primary image.
        </p>
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl p-5 sm:p-6 shadow-sm">
        <ImageUploader
          images={form.images}
          onChange={(images) => onChange({ images })}
          error={errors.images as string | undefined}
        />
      </div>
    </div>
  );
}
