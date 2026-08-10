'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WizardStep } from '@/lib/products/create-types';

interface WizardFooterProps {
  currentStep: WizardStep;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  isLastStep: boolean;
  nextDisabled?: boolean;
}

export default function WizardFooter({
  currentStep,
  onBack,
  onNext,
  onSaveDraft,
  onPublish,
  isLastStep,
  nextDisabled,
}: WizardFooterProps) {
  return (
    <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-md border-t border-stone-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mt-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={currentStep === 1}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <p className="text-xs text-stone-400 hidden sm:block">
          Step {currentStep} of 8
        </p>

        {!isLastStep ? (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSaveDraft ?? onNext}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={onPublish ?? onNext}
              disabled={nextDisabled}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Publish Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
