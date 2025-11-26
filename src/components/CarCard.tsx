import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CardCarousel } from './CardCarousel';
import { Users, Fuel, ArrowUpRight, Clock } from 'lucide-react';
import { type Car } from '@/types/carTypes';
import { cn } from '@/lib/utils';

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
      {/* Image Area */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
          <CardCarousel images={car.images} />
        </div>
        {/* Year badge removed from here */}
      </div>

      {/* Content Body */}
      <CardContent className="flex flex-col flex-1 p-5">
        {/* Header Section */}
        <div className="mb-4">
          {/* Year is now placed here next to the type */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {car.type}
            </span>
            <span className="text-[11px] font-bold tracking-wider text-slate-300">
              •
            </span>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {car.features.year}
            </span>
          </div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg text-slate-900 leading-tight">
              {car.name}
            </h3>
          </div>
        </div>

        {/* Specs Grid - 3 columns */}
        <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-t border-b border-slate-100">
          {/* 1. Capacity */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase">Seats</span>
            </div>
            <span className="text-sm font-medium text-slate-700">
              {car.features.seats}
            </span>
          </div>

          {/* 2. Fuel */}
          <div className="flex flex-col gap-1 border-l border-slate-100 pl-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Fuel className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase">Fuel</span>
            </div>
            <span className="text-sm font-medium text-slate-700 capitalize truncate">
              {car.features.fuel}
            </span>
          </div>

          {/* 3. Duration */}
          <div className="flex flex-col gap-1 border-l border-slate-100 pl-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase">
                Duration
              </span>
            </div>
            <span className="text-sm font-medium text-slate-700 capitalize truncate">
              {car.features.duration}
            </span>
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
            className="group/btn relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white shadow-none rounded-md px-5 h-10 transition-all"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm font-medium">
              Book
              <ArrowUpRight className="w-4 h-4 opacity-70 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
