import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardCarousel } from './CardCarousel';
import { Users, Fuel, Gauge, Star, Heart, ArrowRight } from 'lucide-react';
import { type Car } from '@/types/carTypes';
import { cn } from '@/lib/utils';

const VOYA_TEAL = 'text-[#00E599]';

interface CarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
  className?: string;
}

export const CarCard = ({ car, onSelect, className }: CarCardProps) => {
  return (
    <Card
      className={cn(
        'group relative flex flex-col h-full border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 rounded-2xl overflow-hidden bg-white',
        className
      )}
    >
      {/* Image Header */}
      <CardHeader className="p-0 relative overflow-hidden aspect-[4/3]">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
          <CardCarousel images={car.images} />
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm font-semibold px-3 py-1 border-white/20 hover:bg-white">
            {car.type}
          </Badge>
        </div>

        {/* Like Button */}
        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
          <Heart className="w-4 h-4" />
        </button>
      </CardHeader>

      {/* Content Body */}
      <CardContent className="flex-1 flex flex-col p-5">
        {/* Title & Rating Row */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1 tracking-tight">
            {car.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-slate-700">
              {car.rating || 5.0}
            </span>
            <span className="text-[10px] text-slate-400">
              ({car.trips || 0})
            </span>
          </div>
        </div>

        {/* Price Tag */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold ${VOYA_TEAL}`}>
              ₦{car.price.toLocaleString()}
            </span>
            <span className="text-sm text-slate-400 font-medium">/ day</span>
          </div>
        </div>

        <Separator className="mb-4 bg-slate-100" />

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                Seats
              </span>
            </div>
            <span className="text-sm font-medium text-slate-700">
              {car.features.seats} Adults
            </span>
          </div>

          <div className="flex flex-col gap-1 border-l border-slate-100 pl-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Gauge className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                Trans
              </span>
            </div>
            <span className="text-sm font-medium text-slate-700 truncate">
              {car.features.transmission || 'Auto'}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-l border-slate-100 pl-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Fuel className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                Fuel
              </span>
            </div>
            <span className="text-sm font-medium text-slate-700 capitalize">
              {car.features.fuel}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <Button
            onClick={() => onSelect(car)}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 h-11 rounded-xl font-semibold shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all"
          >
            Book Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
