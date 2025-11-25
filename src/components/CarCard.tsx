import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardCarousel } from './CardCarousel';
import { Users, Fuel, ArrowUpRight } from 'lucide-react';
import { type Car } from '@/types/carTypes';
import { cn } from '@/lib/utils';

// Using the brand color for subtle accents or primary actions
// const VOYA_TEAL = '#00E599';

interface CarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
  className?: string;
}

export const CarCard = ({ car, onSelect, className }: CarCardProps) => {
  return (
    <Card
      className={cn(
        'group flex flex-col h-full bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-lg',
        className
      )}
    >
      {/* Image Area - Clean, no overlays for corporate look */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
          <CardCarousel images={car.images} />
        </div>
      </div>

      {/* Content Body */}
      <CardContent className="flex flex-col flex-1 p-5">
        {/* Header Section: Kicker & Title */}
        <div className="mb-4">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1 block">
            {car.type}
          </span>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg text-slate-900 leading-tight">
              {car.name}
            </h3>
            {/* Optional: Rating could go here if needed, but keeping it clean */}
          </div>
        </div>

        {/* Specs Grid - Minimalist */}
        <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-t border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-500">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium uppercase">
                Capacity
              </span>
              <span className="text-sm font-medium text-slate-700">
                {car.features.seats} Seats
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-500">
              <Fuel className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium uppercase">
                Fuel Type
              </span>
              <span className="text-sm font-medium text-slate-700 capitalize">
                {car.features.fuel}
              </span>
            </div>
          </div>
        </div>

        {/* Footer: Price & Action */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Daily Rate</span>
            <span className="text-lg font-bold text-slate-900">
              ₦{car.price.toLocaleString()}
            </span>
          </div>

          <Button
            onClick={() => onSelect(car)}
            className="group/btn relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white shadow-none rounded-md px-6 h-10 transition-all"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm font-medium">
              Book Now{' '}
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-[#00E599] opacity-0 group-hover/btn:opacity-10 transition-opacity" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
