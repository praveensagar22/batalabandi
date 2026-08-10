'use client';

import type { ProductCreateForm, StepErrors } from '@/lib/products/create-types';
import TextInput from '../ui/TextInput';
import Textarea from '../ui/Textarea';
import TagInput from '../ui/TagInput';
import SEOPreview from '../cards/SEOPreview';

interface StepProps {
  form: ProductCreateForm;
  onChange: (updates: Partial<ProductCreateForm>) => void;
  errors: StepErrors;
}

export default function StepSEO({ form, onChange, errors }: StepProps) {
  const defaultUrl = form.slug
    ? `batalabandi.com/products/${form.slug}`
    : '';

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">SEO</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Optimize how your product appears in search engines and social media.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-stone-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <TextInput
            label="Meta Title"
            id="metaTitle"
            value={form.metaTitle}
            onChange={(metaTitle) => onChange({ metaTitle })}
            placeholder={form.name || 'Product title for search engines'}
            required
            error={errors.metaTitle}
            hint={`${form.metaTitle.length}/60 characters recommended`}
          />
          <Textarea
            label="Meta Description"
            id="metaDescription"
            value={form.metaDescription}
            onChange={(metaDescription) => onChange({ metaDescription })}
            placeholder={form.shortDescription || 'Brief description for search results'}
            required
            error={errors.metaDescription}
            rows={3}
            hint={`${form.metaDescription.length}/160 characters recommended`}
          />
          <TagInput
            label="Keywords"
            tags={form.keywords}
            onChange={(keywords) => onChange({ keywords })}
            placeholder="Add SEO keywords"
          />
          <TextInput
            label="Canonical URL"
            id="canonicalUrl"
            value={form.canonicalUrl || defaultUrl}
            onChange={(canonicalUrl) => onChange({ canonicalUrl })}
            placeholder={defaultUrl}
            type="url"
          />
          <TextInput
            label="Open Graph Image URL"
            id="ogImage"
            value={form.ogImage}
            onChange={(ogImage) => onChange({ ogImage })}
            placeholder="https://..."
            type="url"
            hint="Image shown when shared on social media"
          />
        </div>

        <SEOPreview
          title={form.metaTitle || form.name}
          description={form.metaDescription || form.shortDescription}
          url={form.canonicalUrl || defaultUrl}
        />
      </div>
    </div>
  );
}
