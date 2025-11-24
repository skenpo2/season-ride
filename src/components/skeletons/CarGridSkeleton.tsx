// src/components/skeletons/CarGridSkeleton.tsx
import { CarCardSkeleton } from './CarCardSkeleton';

export const CarGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 12 }).map((_, idx) => (
        <CarCardSkeleton key={idx} />
      ))}
    </div>
  );
};
