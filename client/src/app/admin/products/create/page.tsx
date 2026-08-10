'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductCreateForm, WizardStep } from '@/lib/products/create-types';
import {
  DEFAULT_FORM,
  AUTOSAVE_KEY,
  AUTOSAVE_INTERVAL_MS,
} from '@/lib/products/create-defaults';
import {
  slugify,
  generateMasterSku,
  formatRelativeTime,
} from '@/lib/products/create-utils';
import {
  validateStep,
  getIncompleteSteps,
  canPublish,
} from '@/lib/products/create-validation';
import { ToastProvider, useToast } from '@/components/admin/products/create/ui/Toast';
import WizardStepNav, { WizardHeader } from '@/components/admin/products/create/wizard/WizardNav';
import WizardFooter from '@/components/admin/products/create/wizard/WizardFooter';
import LeaveConfirmDialog from '@/components/admin/products/create/wizard/LeaveConfirmDialog';
import { CreateWizardSkeleton } from '@/components/admin/products/create/wizard/CreateWizardSkeleton';
import StepBasicInfo from '@/components/admin/products/create/steps/StepBasicInfo';
import StepClassification from '@/components/admin/products/create/steps/StepClassification';
import StepVariants from '@/components/admin/products/create/steps/StepVariants';
import StepPricing from '@/components/admin/products/create/steps/StepPricing';
import StepInventory from '@/components/admin/products/create/steps/StepInventory';
import StepImages from '@/components/admin/products/create/steps/StepImages';
import StepSEO from '@/components/admin/products/create/steps/StepSEO';
import StepReview from '@/components/admin/products/create/steps/StepReview';

function CreateProductWizardInner() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProductCreateForm>(DEFAULT_FORM);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [visitedSteps, setVisitedSteps] = useState<Set<WizardStep>>(new Set([1]));
  const [stepErrors, setStepErrors] = useState<Record<number, ReturnType<typeof validateStep>['errors']>>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const pendingNavigation = useRef<string | null>(null);
  const slugManualEdit = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ProductCreateForm;
        setForm(parsed);
        setLastSaved(new Date());
      }
    } catch {
      /* ignore corrupt draft */
    }
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const updateForm = useCallback((updates: Partial<ProductCreateForm>) => {
    setForm((prev) => {
      const next = { ...prev, ...updates };

      if ('name' in updates && !slugManualEdit.current) {
        next.slug = slugify(updates.name ?? prev.name);
        if (!next.metaTitle && updates.name) {
          next.metaTitle = `${updates.name} — BatalaBandi`;
        }
        if (!next.metaDescription && prev.shortDescription) {
          next.metaDescription = prev.shortDescription;
        }
      }

      if ('slug' in updates) {
        slugManualEdit.current = true;
        if (!next.canonicalUrl) {
          next.canonicalUrl = `batalabandi.com/products/${updates.slug}`;
        }
      }

      if ('productType' in updates && !next.masterSku) {
        next.masterSku = generateMasterSku(next.name, next.productType);
      }

      if ('shortDescription' in updates && !next.metaDescription) {
        next.metaDescription = updates.shortDescription ?? '';
      }

      return next;
    });
    setDirty(true);
  }, []);

  const saveDraft = useCallback(async () => {
    setSaving(true);
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form));
      await new Promise((r) => setTimeout(r, 400));
      setLastSaved(new Date());
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }, [form]);

  useEffect(() => {
    if (!dirty) return;
    const interval = setInterval(() => {
      saveDraft();
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [dirty, saveDraft]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveDraft();
        toast('Draft saved', formatRelativeTime(new Date()));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveDraft, toast]);

  const incompleteSteps = useMemo(() => getIncompleteSteps(form), [form]);
  const publishReady = useMemo(() => canPublish(form), [form]);

  const goToStep = (step: WizardStep) => {
    setVisitedSteps((prev) => new Set([...prev, step]));
    setCurrentStep(step);
  };

  const validateCurrentStep = () => {
    const result = validateStep(currentStep, form);
    setStepErrors((prev) => ({ ...prev, [currentStep]: result.errors }));
    return result.valid;
  };

  const handleNext = () => {
    if (currentStep < 8) {
      if (!validateCurrentStep()) {
        toast('Validation failed', 'Please fix the errors before continuing.', 'error');
        return;
      }
      const next = (currentStep + 1) as WizardStep;
      goToStep(next);
    } else {
      handlePublish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep((currentStep - 1) as WizardStep);
    }
  };

  const handleSaveDraft = () => {
    saveDraft();
    toast('Draft saved', 'Your progress has been saved locally.');
  };

  const handlePublish = () => {
    if (!canPublish(form)) {
      toast('Cannot publish', 'Complete all required fields first.', 'error');
      return;
    }
    saveDraft();
    toast('Product published', `${form.name} is now live in your catalog.`);
    setTimeout(() => router.push('/admin/products'), 1500);
  };

  const handlePreview = () => {
    toast('Preview', 'Product preview will open in a new tab.');
  };

  const errors = stepErrors[currentStep] ?? {};

  const stepContent = {
    1: <StepBasicInfo form={form} onChange={updateForm} errors={errors} />,
    2: <StepClassification form={form} onChange={updateForm} errors={errors} />,
    3: <StepVariants form={form} onChange={updateForm} errors={errors} />,
    4: <StepPricing form={form} onChange={updateForm} errors={errors} />,
    5: <StepInventory form={form} onChange={updateForm} errors={errors} />,
    6: <StepImages form={form} onChange={updateForm} errors={errors} />,
    7: <StepSEO form={form} onChange={updateForm} errors={errors} />,
    8: <StepReview form={form} onChange={updateForm} errors={errors} onGoToStep={goToStep} />,
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-24">
        <CreateWizardSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto pb-24">
        <div className="space-y-5">
          <WizardHeader
            lastSaved={lastSaved}
            saving={saving}
            dirty={dirty}
            onSaveDraft={handleSaveDraft}
            onPreview={handlePreview}
            onPublish={handlePublish}
            canPublish={publishReady}
          />

          <WizardStepNav
            currentStep={currentStep}
            onStepClick={goToStep}
            incompleteSteps={incompleteSteps}
            visitedSteps={visitedSteps}
          />

          <div className="min-h-[400px]">{stepContent[currentStep]}</div>
        </div>
      </div>

      <WizardFooter
        currentStep={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isLastStep={currentStep === 8}
        nextDisabled={currentStep === 8 && !publishReady}
      />

      <LeaveConfirmDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        onConfirm={() => {
          if (pendingNavigation.current) {
            router.push(pendingNavigation.current);
          }
        }}
      />
    </>
  );
}

export default function CreateProductPage() {
  return (
    <ToastProvider>
      <CreateProductWizardInner />
    </ToastProvider>
  );
}
