// src/components/BookingSheetDrawer.tsx
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Car as CarIcon } from 'lucide-react';
import { BookingForm } from './BookingForm';
import { type Car } from '@/types/carTypes';

interface BookingSheetDrawerProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingSheetDrawer = ({
  car,
  isOpen,
  onClose,
}: BookingSheetDrawerProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSuccess = () => {
    // Show success message
    alert('Booking request submitted successfully! We will contact you soon.');
    onClose();
  };

  if (!car) return null;

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[95vh] px-4 bg-white text-slate-900">
          <DrawerHeader className="px-0">
            <DrawerTitle>Complete Request</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto pb-8 px-1">
            <BookingForm car={car} onSuccess={handleSuccess} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[540px] overflow-y-auto p-0 border-l border-slate-200 shadow-2xl bg-white text-slate-900"
      >
        <SheetHeader className="sticky top-0 bg-white/90 backdrop-blur-md z-20 border-b border-slate-200 px-6 py-4">
          <SheetTitle className="flex items-center gap-2 text-xl text-slate-900">
            <CarIcon className="w-5 h-5" /> Booking Request
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 py-8 pb-24">
          <BookingForm car={car} onSuccess={handleSuccess} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
