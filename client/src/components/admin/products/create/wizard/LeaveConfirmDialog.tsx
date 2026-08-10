'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface LeaveConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function LeaveConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: LeaveConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 border border-stone-100">
          <AlertDialog.Title className="text-lg font-semibold text-stone-900">
            Unsaved changes
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-stone-500 mt-2">
            You have unsaved changes that will be lost if you leave this page. Your draft is auto-saved locally, but recent edits may not be saved yet.
          </AlertDialog.Description>
          <div className="flex items-center justify-end gap-3 mt-6">
            <AlertDialog.Cancel className="px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors">
              Stay on page
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
            >
              Leave anyway
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
