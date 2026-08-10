'use client';

import type { ProductCreateForm, StepErrors } from '@/lib/products/create-types';
import type { WizardStep } from '@/lib/products/create-types';
import { canPublish } from '@/lib/products/create-validation';
import { SummaryCard, buildSummarySections } from '../cards/SummaryCard';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface StepProps {
  form: ProductCreateForm;
  onChange: (updates: Partial<ProductCreateForm>) => void;
  errors: StepErrors;
  onGoToStep: (step: WizardStep) => void;
}

export default function StepReview({ form, onGoToStep }: StepProps) {
  const sections = buildSummarySections(form);
  const publishReady = canPublish(form);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Review & Publish</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Review all product details before publishing to your store.
        </p>
      </div>

      <div
        className={`flex items-center gap-3 p-4 rounded-xl border ${
          publishReady
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-amber-50 border-amber-200'
        }`}
      >
        {publishReady ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
        )}
        <div>
          <p
            className={`text-sm font-semibold ${
              publishReady ? 'text-emerald-800' : 'text-amber-800'
            }`}
          >
            {publishReady
              ? 'Ready to publish'
              : 'Complete required fields before publishing'}
          </p>
          <p
            className={`text-xs mt-0.5 ${
              publishReady ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {publishReady
              ? 'All required information has been provided.'
              : 'Review highlighted sections below and fill in missing details.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => (
          <SummaryCard
            key={section.title}
            title={section.title}
            sections={section.sections}
            incomplete={section.incomplete}
            onEdit={() => onGoToStep(section.step as WizardStep)}
          />
        ))}
      </div>
    </div>
  );
}
