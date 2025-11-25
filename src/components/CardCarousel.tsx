import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="relative w-full h-full group bg-slate-200">
      <div
        className="flex h-full transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            loading="lazy"
            alt={`Vehicle view ${idx + 1}`}
            className="w-full h-full object-cover shrink-0"
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              onClick={prev}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-[2px]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={next}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-[2px]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Very subtle indicator dots */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-1 rounded-full transition-all duration-300 shadow-sm',
                  idx === currentIndex
                    ? 'bg-white w-4 opacity-100'
                    : 'bg-white/60 w-1 opacity-60'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
