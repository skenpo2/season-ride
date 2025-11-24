// src/components/EmptyState.tsx
import { Car as CarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title = 'No vehicles found',
  message = "We couldn't find any cars matching that category. Try switching filters.",
  actionLabel = 'View All Cars',
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <CarIcon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-500 max-w-sm mt-1">{message}</p>
      {onAction && (
        <Button
          variant="outline"
          className="mt-6 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
