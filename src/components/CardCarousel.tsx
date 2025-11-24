import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardCarouselProps {
  images: string[];
}

export const CardCarousel = ({ images }: CardCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 group">
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            loading="lazy"
            alt={`Car view ${idx + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={prev}
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur text-slate-900 hover:bg-white border-0 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={next}
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/80 backdrop-blur text-slate-900 hover:bg-white border-0 shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all shadow-sm ${
                  idx === currentIndex ? 'bg-white w-5' : 'bg-white/50 w-1.5'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
