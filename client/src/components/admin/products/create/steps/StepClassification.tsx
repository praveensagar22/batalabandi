'use client';

import type { ProductCreateForm, StepErrors } from '@/lib/products/create-types';
import {
  GENDER_OPTIONS,
  COLLECTION_OPTIONS,
  THEME_OPTIONS,
} from '@/lib/products/constants';
import {
  CATEGORY_OPTIONS,
  WIZARD_PRODUCT_TYPES,
  BRAND_OPTIONS,
} from '@/lib/products/create-defaults';
import SelectInput from '../ui/SelectInput';
import TagInput from '../ui/TagInput';

interface StepProps {
  form: ProductCreateForm;
  onChange: (updates: Partial<ProductCreateForm>) => void;
  errors: StepErrors;
}

const TAG_SUGGESTIONS = [
  'Naruto',
  'Oversized',
  'Black',
  'Winter',
  'Limited Edition',
  'Anime',
  'Cotton',
  'Unisex',
];

export default function StepClassification({ form, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Classification</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Categorize your product for filtering and discovery.
        </p>
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectInput
            label="Gender"
            id="gender"
            value={form.gender}
            onChange={(gender) => onChange({ gender })}
            options={GENDER_OPTIONS}
            required
            error={errors.gender}
          />
          <SelectInput
            label="Category"
            id="category"
            value={form.category}
            onChange={(category) => onChange({ category })}
            options={CATEGORY_OPTIONS}
            required
            error={errors.category}
          />
          <SelectInput
            label="Product Type"
            id="productType"
            value={form.productType}
            onChange={(productType) => onChange({ productType })}
            options={WIZARD_PRODUCT_TYPES}
            required
            error={errors.productType}
          />
          <SelectInput
            label="Collection"
            id="collection"
            value={form.collection}
            onChange={(collection) => onChange({ collection })}
            options={COLLECTION_OPTIONS}
            required
            error={errors.collection}
          />
          <SelectInput
            label="Theme"
            id="theme"
            value={form.theme}
            onChange={(theme) => onChange({ theme })}
            options={THEME_OPTIONS}
            required
            error={errors.theme}
          />
          <SelectInput
            label="Brand"
            id="brand"
            value={form.brand}
            onChange={(brand) => onChange({ brand })}
            options={BRAND_OPTIONS}
          />
        </div>

        <div className="mt-5">
          <TagInput
            label="Tags"
            tags={form.tags}
            onChange={(tags) => onChange({ tags })}
            suggestions={TAG_SUGGESTIONS}
            hint="Press Enter to add tags. Used for search and filtering."
          />
        </div>
      </div>
    </div>
  );
}
