import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

import { useCars } from '@/hooks/useCar';
import { FeatureHero } from '@/components/FeatureHero';
import { CarCard } from '@/components/CarCard';
import { BookingSheetDrawer } from '@/components/BookingSheetDrawer';
import { Pagination } from '@/components/Pagination';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { CarGridSkeleton } from '@/components/skeletons/CarGridSkeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Car } from '@/types/carTypes';

// Explicitly typed to fix the TypeScript error
const FADE_ANIMATION: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 50 },
  },
};

// --- Sub-component defined OUTSIDE the main render loop ---
interface FilterPillProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: (value: string) => void;
}

const FilterPill = ({ label, value, isActive, onClick }: FilterPillProps) => (
  <button
    onClick={() => onClick(value)}
    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'text-white shadow-md'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`}
  >
    {isActive && (
      <motion.div
        layoutId="activeFilter"
        className="absolute inset-0 bg-slate-900 rounded-full"
        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10">{label}</span>
  </button>
);
// ----------------------------------------------------------

export const CarsPage = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  const {
    data: carsResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useCars({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    type: filterType,
  });

  // Handler prevents "setState in useEffect" error
  const handleFilterChange = (newType: string) => {
    setFilterType(newType);
    setCurrentPage(1);
  };

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setTimeout(() => setSelectedCar(null), 300);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const gridElement = document.getElementById('car-grid-anchor');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <FeatureHero onBook={handleCarSelect} />

      <div id="car-grid-anchor" className="h-8" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Header & Controls Section */}
        <div className="space-y-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Our Fleet
              </h2>
              <div className="flex items-center gap-2 mt-2 text-slate-500">
                <span>Premium vehicles available for your dates</span>
                {carsResponse?.meta && (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2.5 bg-slate-200 text-slate-700"
                  >
                    {carsResponse.meta.totalItems}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Modern Toolbar (Filters Only) */}
          <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-md border border-slate-200/60 p-2 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex p-1 bg-slate-100/50 rounded-xl overflow-x-auto w-full md:w-auto no-scrollbar">
              <FilterPill
                label="All Vehicles"
                value="all"
                isActive={filterType === 'all'}
                onClick={handleFilterChange}
              />
              <FilterPill
                label="SUVs"
                value="suv"
                isActive={filterType === 'suv'}
                onClick={handleFilterChange}
              />
              <FilterPill
                label="Sedans"
                value="sedan"
                isActive={filterType === 'sedan'}
                onClick={handleFilterChange}
              />
            </div>

            {/* Actions (Sort Only) */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl shrink-0 border-slate-200"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl shrink-0 border-slate-200"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {isLoading && <CarGridSkeleton />}

          {error && !isLoading && (
            <ErrorState
              title="Unable to load fleet"
              message="We encountered an issue loading the vehicles."
              onRetry={() => refetch()}
            />
          )}

          {!isLoading && !error && carsResponse && (
            <>
              {carsResponse.data.length === 0 ? (
                <EmptyState
                  title="No vehicles found"
                  onAction={() => handleFilterChange('all')}
                />
              ) : (
                <motion.div
                  initial="hidden"
                  animate="show"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {carsResponse.data.map((car) => (
                      <motion.div key={car.id} layout variants={FADE_ANIMATION}>
                        <CarCard
                          car={car}
                          onSelect={handleCarSelect}
                          className="h-full"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {isFetching && !isLoading && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3 text-sm z-40 animate-in fade-in slide-in-from-bottom-4">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating results...
                </div>
              )}

              <div className="mt-16">
                <Pagination
                  currentPage={carsResponse.meta.currentPage}
                  totalPages={carsResponse.meta.totalPages}
                  onPageChange={handlePageChange}
                  hasNext={carsResponse.meta.hasNextPage}
                  hasPrev={carsResponse.meta.hasPreviousPage}
                  isLoading={isFetching}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <BookingSheetDrawer
        car={selectedCar}
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
      />
    </div>
  );
};
