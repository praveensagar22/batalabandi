'use client';

export function CreateWizardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-64 bg-stone-100 rounded" />
        <div className="h-8 w-48 bg-stone-100 rounded" />
        <div className="h-3 w-32 bg-stone-100 rounded" />
      </div>
      <div className="h-14 bg-stone-100 rounded-2xl" />
      <div className="bg-white border border-stone-100 rounded-2xl p-6 space-y-4">
        <div className="h-5 w-40 bg-stone-100 rounded" />
        <div className="h-10 bg-stone-100 rounded-xl" />
        <div className="h-10 bg-stone-100 rounded-xl" />
        <div className="h-24 bg-stone-100 rounded-xl" />
      </div>
    </div>
  );
}
