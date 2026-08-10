'use client';

import type { ProductCreateForm } from '@/lib/products/create-types';
import type { StepErrors } from '@/lib/products/create-types';
import TextInput from '../ui/TextInput';
import Textarea from '../ui/Textarea';
import RichTextEditor from '../ui/RichTextEditor';
import ToggleGroup from '../ui/ToggleGroup';
import { ToggleOption } from '../ui/ToggleGroup';

interface StepProps {
  form: ProductCreateForm;
  onChange: (updates: Partial<ProductCreateForm>) => void;
  errors: StepErrors;
}

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Active', label: 'Active' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Archived', label: 'Archived' },
];

export default function StepBasicInfo({ form, onChange, errors }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Basic Information</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Enter the core details for your product listing.
        </p>
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <TextInput
          label="Product Name"
          id="name"
          value={form.name}
          onChange={(name) => onChange({ name })}
          placeholder="e.g. Naruto Akatsuki Hoodie"
          required
          error={errors.name}
        />

        <TextInput
          label="Slug"
          id="slug"
          value={form.slug}
          onChange={(slug) => onChange({ slug })}
          placeholder="naruto-akatsuki-hoodie"
          required
          error={errors.slug}
          hint="Auto-generated from product name. Edit if needed."
        />

        <Textarea
          label="Short Description"
          id="shortDescription"
          value={form.shortDescription}
          onChange={(shortDescription) => onChange({ shortDescription })}
          placeholder="A brief summary shown in product cards and search results."
          required
          error={errors.shortDescription}
          rows={3}
        />

        <RichTextEditor
          label="Full Description"
          value={form.fullDescription}
          onChange={(fullDescription) => onChange({ fullDescription })}
          hint="Detailed product description with formatting."
        />

        <ToggleOption
          label="Product Status"
          options={STATUS_OPTIONS}
          value={form.status}
          onChange={(status) =>
            onChange({ status: status as ProductCreateForm['status'] })
          }
        />

        {form.status === 'Scheduled' && (
          <TextInput
            label="Schedule Date"
            id="scheduledAt"
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(scheduledAt) => onChange({ scheduledAt })}
            required
            error={errors.scheduledAt}
          />
        )}
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Product Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ToggleGroup
            label="Featured Product"
            value={form.featured}
            onChange={(featured) => onChange({ featured })}
          />
          <ToggleGroup
            label="New Arrival"
            value={form.newArrival}
            onChange={(newArrival) => onChange({ newArrival })}
          />
          <ToggleGroup
            label="Best Seller"
            value={form.bestSeller}
            onChange={(bestSeller) => onChange({ bestSeller })}
          />
          <ToggleGroup
            label="Trending"
            value={form.trending}
            onChange={(trending) => onChange({ trending })}
          />
        </div>
      </div>
    </div>
  );
}
