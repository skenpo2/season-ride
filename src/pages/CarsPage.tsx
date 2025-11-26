import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { LayoutGrid, List } from 'lucide-react';

import { useCars } from '@/hooks/useCar';
import { FeatureHero } from '@/components/FeatureHero';
import { CarCard } from '@/components/CarCard';
import { BookingSheetDrawer } from '@/components/BookingSheetDrawer';
import { Pagination } from '@/components/Pagination';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { CarGridSkeleton } from '@/components/skeletons/CarGridSkeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { type Car } from '@/types/carTypes';

const FADE_ANIMATION: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 70, damping: 20 },
  },
};

export const CarsPage = () => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const totalCars = carsResponse?.meta?.totalItems || 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      <FeatureHero onBook={handleCarSelect} />

      <div id="car-grid-anchor" className="h-12" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Modern Header Section */}
        <div className="flex flex-col gap-8 mb-10">
          {/* Title and Stats */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  Our Fleet
                </h1>
                <Badge
                  variant="secondary"
                  className="h-6 px-3 bg-slate-900 text-white hover:bg-slate-800"
                >
                  {totalCars} vehicles
                </Badge>
              </div>

              {/* --- UPDATED SUBHEADING --- */}
              <div className="text-base text-slate-600 leading-relaxed space-y-2">
                <p>
                  Welcome to Lagos! Don’t let the tin-can Ubers humble you. In
                  December, those apps stay on “no cars available” — and when
                  one appears, it’s overpriced and trapped in disrespectful
                  traffic.
                </p>
                <p className="font-medium text-slate-800">
                  A private daily driver is the only way to move. If you’re
                  going to spend 5.53 avg hours a day in traffic, at least be
                  comfortable. Don’t believe me? Ask anybody. Literally.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs and View Controls */}
          <Tabs
            value={filterType}
            onValueChange={handleFilterChange}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <TabsList className="inline-flex h-11 items-center justify-start rounded-xl bg-slate-100 p-1 text-slate-600 w-full sm:w-auto">
                <TabsTrigger
                  value="all"
                  className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  All Vehicles
                </TabsTrigger>
                <TabsTrigger
                  value="suv"
                  className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  SUVs
                </TabsTrigger>
                <TabsTrigger
                  value="sedan"
                  className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  Sedans
                </TabsTrigger>
              </TabsList>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-9 px-3 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-9 px-3 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <TabsContent value={filterType} className="mt-8">
              <div className="min-h-[400px]">
                {isLoading && <CarGridSkeleton />}

                {error && !isLoading && (
                  <ErrorState
                    title="System unavailable"
                    message="Unable to retrieve vehicle data at this time."
                    onRetry={() => refetch()}
                  />
                )}

                {!isLoading && !error && carsResponse && (
                  <>
                    {carsResponse.data.length === 0 ? (
                      <EmptyState
                        title="No inventory matches"
                        onAction={() => handleFilterChange('all')}
                      />
                    ) : (
                      <>
                        {/* Results Count */}
                        <div className="mb-6 flex items-center justify-between">
                          <p className="text-sm text-slate-600">
                            Showing{' '}
                            <span className="font-medium text-slate-900">
                              {carsResponse.data.length}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium text-slate-900">
                              {totalCars}
                            </span>{' '}
                            vehicles
                          </p>
                          {isFetching && !isLoading && (
                            <Badge variant="outline" className="gap-2">
                              <div className="h-2 w-2 rounded-full bg-slate-900 animate-pulse" />
                              Updating...
                            </Badge>
                          )}
                        </div>

                        {/* Car Grid */}
                        <div
                          className={`grid gap-6 ${
                            viewMode === 'grid'
                              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                              : 'grid-cols-1'
                          }`}
                        >
                          {carsResponse.data.map((car, index) => (
                            <motion.div
                              key={car.id}
                              initial="hidden"
                              animate="show"
                              variants={FADE_ANIMATION}
                              transition={{ delay: index * 0.05 }}
                            >
                              <CarCard
                                car={car}
                                onSelect={handleCarSelect}
                                className="h-full hover:shadow-xl transition-shadow duration-300"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}

                    {carsResponse.data.length > 0 && (
                      <div className="mt-12 pt-8 border-t border-slate-200">
                        <Pagination
                          currentPage={carsResponse.meta.currentPage}
                          totalPages={carsResponse.meta.totalPages}
                          onPageChange={handlePageChange}
                          hasNext={carsResponse.meta.hasNextPage}
                          hasPrev={carsResponse.meta.hasPreviousPage}
                          isLoading={isFetching}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
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
