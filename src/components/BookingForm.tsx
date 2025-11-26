import { useState, useEffect, useMemo } from 'react';
import {
  format,
  isToday,
  set,
  differenceInMinutes,
  startOfDay,
} from 'date-fns';
import { useCreateBooking } from '@/hooks/useCar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  Calendar as CalendarIcon,
  Loader2,
  Clock,
  X,
  ShieldCheck,
  Info,
  Zap,
  Check,
} from 'lucide-react';
import type { Car, FormErrors, BookingDate } from '@/types/carTypes';

interface BookingFormProps {
  car: Car;
  onSuccess?: () => void;
}

const URGENCY_FEE = 50000;
const SHORT_NOTICE_FEE = 50000;

const TIME_OPTIONS = [
  { label: '6am', hour: 6 },
  { label: '7am', hour: 7 },
  { label: '8am', hour: 8 },
  { label: '9am', hour: 9 },
  { label: '10am', hour: 10 },
  { label: '11am', hour: 11 },
  { label: '12 noon', hour: 12 },
  { label: '1pm', hour: 13 },
  { label: '2pm', hour: 14 },
  { label: '3pm', hour: 15 },
  { label: '4pm', hour: 16 },
  { label: '5pm', hour: 17 },
  { label: '6pm', hour: 18 },
  { label: '7pm', hour: 19 },
  { label: '8pm', hour: 20 },
  { label: '9pm', hour: 21 },
  { label: '10pm', hour: 22 },
  { label: '11pm', hour: 23 },
  { label: '12am (Midnight)', hour: 24 },
];

export const BookingForm = ({ car, onSuccess }: BookingFormProps) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    pickup: '',
  });

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>('9');
  const [acceptUrgency, setAcceptUrgency] = useState(false);
  const [isShortNotice, setIsShortNotice] = useState(false);

  const createBooking = useCreateBooking();

  useEffect(() => {
    const checkTimeLogic = () => {
      if (selectedDates.length === 0) {
        setIsShortNotice(false);
        return;
      }

      const sortedDates = [...selectedDates].sort(
        (a, b) => a.getTime() - b.getTime()
      );
      const firstDate = sortedDates[0];

      if (isToday(firstDate)) {
        if (acceptUrgency) {
          const now = new Date();
          const hourInt = parseInt(selectedHour);
          let pickupDateTime: Date;

          if (hourInt === 24) {
            pickupDateTime = set(firstDate, {
              hours: 0,
              minutes: 0,
              seconds: 0,
            });
            pickupDateTime.setDate(pickupDateTime.getDate() + 1);
          } else {
            pickupDateTime = set(firstDate, {
              hours: hourInt,
              minutes: 0,
              seconds: 0,
            });
          }

          const diffMinutes = differenceInMinutes(pickupDateTime, now);
          if (diffMinutes < 90) {
            setIsShortNotice(true);
          } else {
            setIsShortNotice(false);
          }
        } else {
          setIsShortNotice(false);
        }
      } else {
        setIsShortNotice(false);
      }
    };

    checkTimeLogic();
  }, [selectedDates, selectedHour, acceptUrgency]);

  const calculation = useMemo(() => {
    const days = selectedDates.length;
    const subtotal = days * car.price;

    const hasToday = selectedDates.some((d) => isToday(d));
    const urgencyCost = acceptUrgency && hasToday ? URGENCY_FEE : 0;
    const shortNoticeCost = isShortNotice ? SHORT_NOTICE_FEE : 0;

    const total = subtotal + urgencyCost + shortNoticeCost;

    return { days, subtotal, urgencyCost, shortNoticeCost, total };
  }, [selectedDates, car.price, acceptUrgency, isShortNotice]);

  const getFormattedBookingDates = (): BookingDate[] => {
    const sortedDates = [...selectedDates].sort(
      (a, b) => a.getTime() - b.getTime()
    );

    const hourInt = parseInt(selectedHour);
    const timeString = hourInt === 24 ? '00:00' : `${hourInt}:00`;

    return sortedDates.map((date) => ({
      date: format(date, 'yyyy-MM-dd'),
      time: timeString,
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Required';
    else if (!emailRegex.test(formData.email))
      newErrors.email = 'Invalid email';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Required';
    if (!formData.pickup.trim()) newErrors.pickup = 'Required';
    if (selectedDates.length === 0) newErrors.dates = 'Select dates';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const validDatesPayload = getFormattedBookingDates();

    const payload = {
      ...formData,
      carId: car.id,
      paymentMethod: 'paystack',
      dates: validDatesPayload,
      metadata: {
        agreedToUrgencyFee: calculation.urgencyCost > 0,
        isShortNotice: calculation.shortNoticeCost > 0,
        clientCalculatedTotal: calculation.total,
        selectedHourValue: parseInt(selectedHour),
        totalDays: calculation.days,
      },
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await createBooking.mutateAsync(payload as any);
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
    if (errors[field as keyof FormErrors])
      setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const removeDate = (dateToRemove: Date) => {
    const newDates = selectedDates.filter(
      (d) => d.getTime() !== dateToRemove.getTime()
    );
    setSelectedDates(newDates);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Car Summary Card */}
      <div className="flex flex-col md:flex-row gap-5 items-start p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden shadow-inner shrink-0 bg-slate-100 border border-slate-100">
          <img
            src={car.images[0]}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-4 w-full">
          {/* Header Row */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] px-1.5 h-5">
                  {car.type}
                </Badge>
                <span className="text-xs text-slate-500 font-medium">
                  {car.features.year}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-none">
                {car.name}
              </h3>
            </div>

            <div className="text-right hidden md:block">
              <div className="text-lg font-bold text-slate-900">
                ₦{car.price.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">per day</div>
            </div>
          </div>

          {/* Specs Row */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-slate-50 text-slate-600 font-medium border-slate-200"
            >
              <Users className="w-3 h-3 mr-1.5 text-slate-400" />{' '}
              {car.features.seats} Seats
            </Badge>
            <Badge
              variant="outline"
              className="bg-slate-50 text-slate-600 font-medium border-slate-200"
            >
              <Fuel className="w-3 h-3 mr-1.5 text-slate-400" />{' '}
              {car.features.fuel}
            </Badge>
            {car.features.duration && (
              <Badge
                variant="outline"
                className="bg-slate-50 text-slate-600 font-medium border-slate-200"
              >
                <Clock className="w-3 h-3 mr-1.5 text-slate-400" />{' '}
                {car.features.duration}
              </Badge>
            )}
          </div>

          {/* --- AMENITIES: VISIBLE & CATCHY --- */}
          {car.amenities &&
            car.amenities.length > 0 &&
            car.amenities[0] !== '' && (
              <div className="pt-3 mt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  Amenities / features in this car
                </p>
                <div className="flex flex-wrap gap-2">
                  {car.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm"
                    >
                      <div className="bg-green-500 rounded-full p-0.5 mr-2 shrink-0">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 capitalize leading-none">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Input Fields */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-500 bg-red-50' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={errors.lastName ? 'border-red-500 bg-red-50' : ''}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-red-500 bg-red-50' : ''}
          />
        </div>

        <div className="space-y-2">
          <Label>WhatsApp</Label>
          <Input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => handleChange('whatsapp', e.target.value)}
            className={errors.whatsapp ? 'border-red-500 bg-red-50' : ''}
          />
        </div>

        {/* --- URGENCY CHECKBOX --- */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="urgency"
              checked={acceptUrgency}
              onCheckedChange={(checked) => {
                setAcceptUrgency(checked === true);
                if (checked === false) {
                  const newDates = selectedDates.filter((d) => !isToday(d));
                  setSelectedDates(newDates);
                }
              }}
              className="mt-1 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
            />
            <div className="space-y-1">
              <Label
                htmlFor="urgency"
                className="text-amber-900 font-semibold cursor-pointer"
              >
                I need the car for today
              </Label>
              <p className="text-xs text-amber-700">
                Bookings less than 24 hours in advance attract a ₦
                {URGENCY_FEE.toLocaleString()} urgency fee.
              </p>
            </div>
          </div>
        </div>

        {/* --- DATE & TIME SELECTOR --- */}
        <div className="space-y-4 pt-2">
          <Label className={errors.dates ? 'text-red-500' : 'text-slate-700'}>
            Select Dates & Pickup Time
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Time Selector */}
            <div className="space-y-1">
              <label className="text-xs text-slate-500 ml-1">Pickup Time</label>
              <Select value={selectedHour} onValueChange={setSelectedHour}>
                <SelectTrigger className="h-11 bg-white border-slate-200 w-full">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={time.hour} value={time.hour.toString()}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Date Selector */}
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
                        ? 'border-red-500 bg-red-50'
                        : 'border-slate-200'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDates.length > 0
                      ? `${selectedDates.length} date(s)`
                      : 'Pick dates'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={(dates) => {
                      const newDates = dates ?? [];
                      setSelectedDates(newDates);
                      if (newDates.length > 0 && errors.dates) {
                        setErrors((prev) => ({ ...prev, dates: undefined }));
                      }
                    }}
                    disabled={(date) => {
                      if (acceptUrgency) {
                        return date < startOfDay(new Date());
                      } else {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(0, 0, 0, 0);
                        return date < tomorrow;
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Short Notice Alert */}
          {isShortNotice && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 animate-in slide-in-from-top-2">
              <Zap className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block mb-1">
                  Express Processing Fee Applies
                </span>
                Your pickup time is less than 90 minutes from now. An additional{' '}
                <span className="font-bold">
                  ₦{SHORT_NOTICE_FEE.toLocaleString()}
                </span>{' '}
                fee has been added.
              </div>
            </div>
          )}

          {/* Selected Date Badges */}
          {selectedDates.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              {selectedDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-white border-slate-200 text-slate-700 gap-1"
                  >
                    {format(date, 'MMM dd')}
                    <button
                      onClick={() => removeDate(date)}
                      className="hover:bg-slate-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                    </button>
                  </Badge>
                ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Pickup Address</Label>
          <Input
            value={formData.pickup}
            onChange={(e) => handleChange('pickup', e.target.value)}
            className={errors.pickup ? 'border-red-500 bg-red-50' : ''}
            placeholder="Enter full address"
          />
        </div>
      </div>

      {/* --- PAYMENT SUMMARY --- */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl space-y-4 shadow-xl">
        <h4 className="font-semibold text-lg flex items-center gap-2">
          Payment Summary
        </h4>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center text-slate-300">
            <span>Daily Rate (x{calculation.days})</span>
            <span>₦{calculation.subtotal.toLocaleString()}</span>
          </div>

          {calculation.urgencyCost > 0 && (
            <div className="flex justify-between items-center text-amber-400">
              <span className="flex items-center gap-1.5">
                <Info className="w-3 h-3" /> Urgency Fee (24h)
              </span>
              <span>₦{calculation.urgencyCost.toLocaleString()}</span>
            </div>
          )}

          {calculation.shortNoticeCost > 0 && (
            <div className="flex justify-between items-center text-red-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> Express Fee (90m)
              </span>
              <span>₦{calculation.shortNoticeCost.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="h-px bg-slate-700" />

        <div className="flex justify-between items-end">
          <span className="font-semibold text-slate-100">Total Payable</span>
          <span className="font-bold text-2xl text-white">
            ₦{calculation.total.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-400 border border-slate-700">
            <ShieldCheck className="w-3 h-3 text-green-500" />
            <span>Secured by Paystack</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={createBooking.isPending || isRedirecting}
        className="w-full h-12 text-lg font-medium bg-slate-900 text-white hover:bg-slate-800"
      >
        {isRedirecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...
          </>
        ) : createBooking.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
          </>
        ) : (
          `Pay ₦${calculation.total.toLocaleString()}`
        )}
      </Button>
      <p className="text-xs text-center text-slate-500 px-4">
        By processing this payment, you agree to our{' '}
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2 hover:text-slate-800 transition-colors cursor-pointer"
        >
          Terms & Conditions
        </a>
        .
      </p>
    </div>
  );
};
