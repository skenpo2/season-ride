import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useCreateBooking } from '@/hooks/useCar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Users,
  Fuel,
  Mail,
  MessageCircle,
  MapPin,
  Calendar as CalendarIcon,
  AlertCircle,
  Loader2,
  Clock,
  X,
} from 'lucide-react';
import type {
  Car,
  BookingFormData,
  FormErrors,
  BookingDate,
} from '@/types/carTypes';

interface BookingFormProps {
  car: Car;
  onSuccess?: () => void;
}

export const BookingForm = ({ car, onSuccess }: BookingFormProps) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    pickup: '',
  });

  // --- DATE/TIME STATE ---
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('8am');
  // ---------------------------

  const createBooking = useCreateBooking();

  // Clear date errors if user selects dates
  useEffect(() => {
    if (selectedDates.length > 0 && errors.dates) {
      setErrors((prev) => ({ ...prev, dates: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDates]);

  const calculateTotalAmount = () => {
    return selectedDates.length * car.price;
  };

  // Helper to convert state to API payload format
  const getFormattedBookingDates = (): BookingDate[] => {
    // Sort dates chronologically
    const sortedDates = [...selectedDates].sort(
      (a, b) => a.getTime() - b.getTime()
    );

    return sortedDates.map((date) => ({
      date: format(date, 'yyyy-MM-dd'),
      time: selectedTime,
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.whatsapp.trim())
      newErrors.whatsapp = 'Phone number is required';
    if (!formData.pickup.trim())
      newErrors.pickup = 'Pickup location is required';

    // Validate dates
    if (selectedDates.length === 0) {
      newErrors.dates = 'Please select at least one date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const validDatesPayload = getFormattedBookingDates();

    const bookingData: BookingFormData = {
      ...formData,
      carId: car.id,
      paymentMethod: 'paystack', // Hardcoded to paystack
      dates: validDatesPayload,
    };

    console.log('Submitting Payload:', bookingData);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await createBooking.mutateAsync(bookingData);

      const responseData = response?.data || response;
      const paymentData = responseData?.data?.payment || responseData?.payment;

      if (paymentData?.authorizationUrl) {
        setIsRedirecting(true);
        window.location.href = paymentData.authorizationUrl;
        return;
      }

      onSuccess?.();
    } catch (error) {
      console.error('Booking failed:', error);
      setIsRedirecting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const removeDate = (dateToRemove: Date) => {
    const newDates = selectedDates.filter(
      (d) => d.getTime() !== dateToRemove.getTime()
    );
    setSelectedDates(newDates);
  };

  const totalAmount = calculateTotalAmount();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Car Summary */}
      <div className="flex flex-col md:flex-row gap-6 items-start p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="w-full md:w-1/3 rounded-lg overflow-hidden shadow-sm">
          <img
            src={car.images[0]}
            alt={car.name}
            className="w-full h-24 object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900">{car.name}</h3>
          <p className="text-sm text-slate-500 mb-2">
            {car.type} • {car.features.year}
          </p>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="bg-white text-xs font-normal border-slate-200 text-slate-700"
            >
              <Users className="w-3 h-3 mr-1" /> {car.features.seats}
            </Badge>
            <Badge
              variant="outline"
              className="bg-white text-xs font-normal border-slate-200 text-slate-700"
            >
              <Fuel className="w-3 h-3 mr-1" /> {car.features.fuel}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-900">
            ₦{car.price.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">per day</div>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Form Fields */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className={errors.firstName ? 'text-red-500' : 'text-slate-700'}
            >
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              className={`h-11 bg-white ${
                errors.firstName
                  ? 'border-red-500 focus-visible:ring-red-500 bg-red-50'
                  : 'border-slate-200'
              }`}
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.firstName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className={errors.lastName ? 'text-red-500' : 'text-slate-700'}
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              className={`h-11 bg-white ${
                errors.lastName
                  ? 'border-red-500 focus-visible:ring-red-500 bg-red-50'
                  : 'border-slate-200'
              }`}
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className={errors.email ? 'text-red-500' : 'text-slate-700'}
          >
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className={`pl-9 h-11 bg-white ${
                errors.email
                  ? 'border-red-500 focus-visible:ring-red-500 bg-red-50'
                  : 'border-slate-200'
              }`}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="whatsapp"
            className={errors.whatsapp ? 'text-red-500' : 'text-slate-700'}
          >
            WhatsApp Number
          </Label>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+234 800 000 0000"
              className={`pl-9 h-11 bg-white ${
                errors.whatsapp
                  ? 'border-red-500 focus-visible:ring-red-500 bg-red-50'
                  : 'border-slate-200'
              }`}
              value={formData.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
            />
          </div>
          {errors.whatsapp && (
            <p className="text-xs text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.whatsapp}
            </p>
          )}
        </div>

        {/* --- DATE & TIME SELECTION --- */}
        <div className="space-y-4 pt-2">
          <Label className={errors.dates ? 'text-red-500' : 'text-slate-700'}>
            Select Dates & Pickup Time
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Global Time Selector */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500 ml-1">
                Pickup Time (All Dates)
              </label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="h-11 bg-white border-slate-200 w-full">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8am">8:00 AM</SelectItem>
                  <SelectItem value="9am">9:00 AM</SelectItem>
                  <SelectItem value="10am">10:00 AM</SelectItem>
                  <SelectItem value="12pm">12:00 PM</SelectItem>
                  <SelectItem value="2pm">2:00 PM</SelectItem>
                  <SelectItem value="4pm">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Multi-Date Selector */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500 ml-1">Dates</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full h-11 justify-start text-left font-normal bg-white',
                      selectedDates.length === 0 && 'text-muted-foreground',
                      errors.dates
                        ? 'border-red-500 focus-visible:ring-red-500 bg-red-50'
                        : 'border-slate-200'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDates.length > 0 ? (
                      <span>{selectedDates.length} date(s) selected</span>
                    ) : (
                      <span>Pick dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="multiple"
                    max={7}
                    selected={selectedDates}
                    // FIX IS HERE: Default to empty array if undefined
                    onSelect={(dates) => setSelectedDates(dates ?? [])}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Selected Date Badges */}
          {selectedDates.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              {selectedDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-white border-slate-200 text-slate-700 py-1 pl-2 pr-1 gap-1"
                  >
                    {format(date, 'MMM dd')}
                    <button
                      onClick={() => removeDate(date)}
                      className="ml-1 hover:bg-slate-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                    </button>
                  </Badge>
                ))}
            </div>
          )}

          {errors.dates && (
            <p className="text-xs text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.dates}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="pickup"
            className={errors.pickup ? 'text-red-500' : 'text-slate-700'}
          >
            Pickup Address
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              id="pickup"
              placeholder="Enter pickup location"
              className={`pl-9 h-11 bg-white ${
                errors.pickup
                  ? 'border-red-500 focus-visible:ring-red-500 bg-red-50'
                  : 'border-slate-200'
              }`}
              value={formData.pickup}
              onChange={(e) => handleChange('pickup', e.target.value)}
            />
          </div>
          {errors.pickup && (
            <p className="text-xs text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.pickup}
            </p>
          )}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">
            Subtotal ({selectedDates.length} day
            {selectedDates.length !== 1 ? 's' : ''})
          </span>
          <span className="font-medium text-slate-900">
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="h-px bg-slate-200" />
        <div className="flex justify-between">
          <span className="font-semibold text-slate-900">Total</span>
          <span className="font-bold text-xl text-slate-900">
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {createBooking.isError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Failed to create booking. Please try again.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={createBooking.isPending || isRedirecting}
          className="w-full h-12 text-lg font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Redirecting to Paystack...
            </>
          ) : createBooking.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₦${totalAmount.toLocaleString()}`
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-3">
          By clicking pay, you agree to our terms of service.
        </p>
      </div>
    </div>
  );
};
