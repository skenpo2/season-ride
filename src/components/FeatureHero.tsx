// src/components/FeatureHero.tsx
import { useState, useEffect } from 'react';
import { useFeaturedCar } from '@/hooks/useCar';
import { HeroSkeleton } from '@/components/skeletons/HeroSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Users, Fuel, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { type Car } from '@/types/carTypes';

interface FeatureHeroProps {
  onBook: (car: Car) => void;
}

export const FeatureHero = ({ onBook }: FeatureHeroProps) => {
  const { data: car, isLoading, error, refetch } = useFeaturedCar();
  const [currIndex, setCurrIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  console.log(car);

  useEffect(() => {
    if (!car || isHovered) return;
    const interval = setInterval(() => {
      setCurrIndex((prev) => (prev + 1) % car.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [car, isHovered]);

  if (isLoading) return <HeroSkeleton />;

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto mb-12 px-4 sm:px-6 lg:px-8 pt-8">
        <ErrorState
          title="Unable to load featured vehicle"
          message="We couldn't load the featured vehicle. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="w-full max-w-7xl mx-auto mb-12 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-slate-800">
        <div className="grid lg:grid-cols-2 gap-0 h-full">
          {/* Left: Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 text-sm font-medium w-fit mb-6 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
              <span>Featured Vehicle</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
              {car.name}
            </h1>

            <div className="flex flex-wrap gap-4 mb-8 text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                <Users className="w-4 h-4" /> {car.features.seats} Seats
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                <Fuel className="w-4 h-4" /> {car.features.fuel}
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
                <Calendar className="w-4 h-4" /> {car.features.year}
              </div>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <div className="text-4xl font-bold text-white">
                ₦{car.price.toLocaleString()}
              </div>
              <div className="text-slate-400 pb-1">/ day</div>
            </div>

            <Button
              onClick={() => onBook(car)}
              size="lg"
              className="w-fit bg-white text-black hover:bg-slate-200 border-none rounded-full px-8 h-12 text-lg font-medium transition-all"
            >
              Book Now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Right: Carousel */}
          <div
            className="relative h-[300px] lg:h-[500px] w-full overflow-hidden bg-slate-900"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {car.images.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  idx === currIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={img}
                  alt={`${car.name} view ${idx + 1}`}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-l"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
