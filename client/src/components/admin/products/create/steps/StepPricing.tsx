'use client';

import type { ProductCreateForm, StepErrors } from '@/lib/products/create-types';
import { TAX_CLASS_OPTIONS } from '@/lib/products/create-defaults';
import { computePricingMetrics } from '@/lib/products/create-utils';
import NumberInput from '../ui/NumberInput';
import SelectInput from '../ui/SelectInput';
import PriceCard from '../cards/PriceCard';

interface StepProps {
  form: ProductCreateForm;
  onChange: (updates: Partial<ProductCreateForm>) => void;
  errors: StepErrors;
}

export default function StepPricing({ form, onChange, errors }: StepProps) {
  const metrics = computePricingMetrics(form);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Pricing</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Set your pricing strategy and view calculated metrics.
        </p>
      </div>

      <div className="bg-white border border-stone-100 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <NumberInput
            label="MRP"
            id="mrp"
            value={form.mrp}
            onChange={(mrp) => onChange({ mrp })}
            prefix="₹"
            required
            error={errors.mrp}
          />
          <NumberInput
            label="Selling Price"
            id="sellingPrice"
            value={form.sellingPrice}
            onChange={(sellingPrice) => onChange({ sellingPrice })}
            prefix="₹"
            required
            error={errors.sellingPrice}
          />
          <NumberInput
            label="Cost Price"
            id="costPrice"
            value={form.costPrice}
            onChange={(costPrice) => onChange({ costPrice })}
            prefix="₹"
            error={errors.costPrice}
            hint="Your cost to produce or acquire"
          />
          <NumberInput
            label="GST"
            id="gst"
            value={form.gst}
            onChange={(gst) => onChange({ gst })}
            suffix="%"
            step={0.1}
          />
          <SelectInput
            label="Tax Class"
            id="taxClass"
            value={form.taxClass}
            onChange={(taxClass) => onChange({ taxClass })}
            options={TAX_CLASS_OPTIONS}
          />
        </div>
      </div>

      <PriceCard metrics={metrics} mrp={form.mrp} sellingPrice={form.sellingPrice} />
    </div>
  );
}
