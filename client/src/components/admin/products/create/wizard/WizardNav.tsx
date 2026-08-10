'use client';

import Link from 'next/link';
import { ChevronRight, Home, Check, Loader2 } from 'lucide-react';
import { WIZARD_STEPS } from '@/lib/products/create-defaults';
import type { WizardStep } from '@/lib/products/create-types';
import { cn } from '@/lib/cn';
import { formatRelativeTime } from '@/lib/products/create-utils';

interface WizardStepNavProps {
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
  incompleteSteps: WizardStep[];
  visitedSteps: Set<WizardStep>;
}

export default function WizardStepNav({
  currentStep,
  onStepClick,
  incompleteSteps,
  visitedSteps,
}: WizardStepNavProps) {
  return (
    <nav className="bg-white border border-stone-100 rounded-2xl shadow-sm p-2 sm:p-3 overflow-x-auto no-scrollbar">
      <ol className="flex items-center gap-1 min-w-max">
        {WIZARD_STEPS.map((step, index) => {
          const isCurrent = step.id === currentStep;
          const isVisited = visitedSteps.has(step.id);
          const isIncomplete = incompleteSteps.includes(step.id);
          const canNavigate = isVisited || step.id <= currentStep;

          return (
            <li key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => canNavigate && onStepClick(step.id)}
                disabled={!canNavigate}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap',
                  isCurrent
                    ? 'bg-stone-900 text-white'
                    : canNavigate
                      ? 'text-stone-600 hover:bg-stone-50'
                      : 'text-stone-300 cursor-not-allowed'
                )}
              >
                <span
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0',
                    isCurrent
                      ? 'bg-white/20 text-white'
                      : isVisited && !isIncomplete
                        ? 'bg-emerald-100 text-emerald-700'
                        : isIncomplete && isVisited
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-stone-100 text-stone-400'
                  )}
                >
                  {isVisited && !isIncomplete && !isCurrent ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    step.id
                  )}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel}</span>
              </button>
              {index < WIZARD_STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4 text-stone-300 mx-0.5 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface WizardHeaderProps {
  lastSaved: Date | null;
  saving: boolean;
  dirty: boolean;
  onSaveDraft: () => void;
  onPreview: () => void;
  onPublish: () => void;
  canPublish: boolean;
}

export function WizardHeader({
  lastSaved,
  saving,
  dirty,
  onSaveDraft,
  onPreview,
  onPublish,
  canPublish,
}: WizardHeaderProps) {
  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-1.5 text-xs text-stone-400 flex-wrap">
        <Link
          href="/admin"
          className="flex items-center gap-1 hover:text-stone-600 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          Dashboard
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/products" className="hover:text-stone-600 transition-colors">
          Catalog
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/admin/products" className="hover:text-stone-600 transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-stone-600 font-medium">Create Product</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight">
            Create Product
          </h1>
          <AutosaveIndicator lastSaved={lastSaved} saving={saving} dirty={dirty} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={onPreview}
            className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={!canPublish}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

function AutosaveIndicator({
  lastSaved,
  saving,
  dirty,
}: {
  lastSaved: Date | null;
  saving: boolean;
  dirty: boolean;
}) {
  if (saving) {
    return (
      <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
        <Loader2 className="w-3 h-3 animate-spin" /> Saving...
      </p>
    );
  }

  if (dirty) {
    return (
      <p className="text-xs text-amber-600 mt-1 font-medium">Unsaved changes</p>
    );
  }

  if (lastSaved) {
    return (
      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
        <Check className="w-3 h-3" /> Saved {formatRelativeTime(lastSaved)}
      </p>
    );
  }

  return null;
}
