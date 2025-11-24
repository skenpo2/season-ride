import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  MapPin,
  CarFront,
  Home,
  Download,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// --- 1. TYPE DEFINITIONS ---

interface BookingDate {
  date: string | Date;
  time: string;
}

interface CarDetails {
  name: string;
  type: string;
  color: string;
  images: string[];
}

interface BookingDetails {
  pickup: string;
  dates: BookingDate[];
  carId: CarDetails;
}

interface ReceiptDetails {
  reference: string;
  amount: number;
  method: string;
  date: string;
  customerEmail: string;
}

interface PaymentVerifyResponse {
  status: 'completed' | 'failed' | 'pending';
  booking: BookingDetails;
  receipt: ReceiptDetails;
}

// --- 2. API HOOK ---

const useVerifyPayment = (reference: string | null) => {
  return useQuery<PaymentVerifyResponse>({
    queryKey: ['verify-payment', reference],
    queryFn: async () => {
      // Calls backend: GET /payments/verify?reference=...
      const { data } = await axios.get<{ data: PaymentVerifyResponse }>(
        `https://voya-season-backend.onrender.com/api/payments/verify?reference=${reference}`
      );
      return data.data;
    },
    enabled: !!reference,
    retry: 1,
    staleTime: 0, // Always fetch fresh status
  });
};

// --- 3. COMPONENT ---

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Paystack sends either 'reference' or 'trxref' in the URL
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  const { data, isLoading, isError } = useVerifyPayment(reference);

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 border-t-4 border-slate-900 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-t-4 border-slate-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-slate-900" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Verifying Transaction
            </h2>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Please wait while we confirm your payment with Paystack...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR / FAILED STATE ---
  if (isError || !data || data.status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 shadow-xl border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-300">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Payment Failed
            </h1>
            <p className="text-slate-500">
              {data?.status === 'failed'
                ? 'The transaction was declined by the payment provider.'
                : "We couldn't verify your payment details at this moment."}
            </p>
            <div className="bg-slate-100 py-2 px-4 rounded text-xs font-mono text-slate-600 mt-2">
              Ref: {reference}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate(-1)}
              className="w-full bg-slate-900 hover:bg-slate-800"
            >
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Contact Support
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // --- SUCCESS STATE ---
  const { booking, receipt } = data;
  const car = booking.carId;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-700">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Booking Confirmed!
          </h1>
          <p className="text-slate-500">
            Reference:{' '}
            <span className="font-mono text-slate-900">
              {receipt.reference}
            </span>
          </p>
        </div>

        {/* Digital Ticket */}
        <Card className="bg-white overflow-hidden shadow-2xl border-0 rounded-2xl relative">
          {/* Top Pattern */}
          <div className="h-3 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 w-full" />

          <div className="p-6 md:p-8 space-y-8">
            {/* 1. Amount & Payment Info */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Paid</p>
                <h2 className="text-3xl font-bold text-slate-900">
                  ₦{receipt.amount.toLocaleString()}
                </h2>
                <div className="flex items-center mt-2 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full w-fit">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Paid via {receipt.method}
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-slate-500 mb-1">Date</p>
                <p className="font-medium text-slate-900">
                  {format(new Date(receipt.date), 'PP')}
                </p>
              </div>
            </div>

            {/* 2. Car Details */}
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-24 h-16 bg-white rounded-lg overflow-hidden shrink-0 shadow-sm">
                {car?.images?.[0] ? (
                  <img
                    src={car.images[0]}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CarFront className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  {car?.name || 'Car Details'}
                </h3>
                <p className="text-sm text-slate-500">
                  {car?.type} • {car?.color}
                </p>
              </div>
            </div>

            {/* 3. Itinerary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium uppercase tracking-wider">
                  <MapPin className="w-4 h-4" /> Pickup Location
                </div>
                <p className="text-slate-900 font-semibold pl-6">
                  {booking.pickup}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium uppercase tracking-wider">
                  <Calendar className="w-4 h-4" /> Reserved Dates
                </div>
                <div className="pl-6 space-y-1">
                  {booking.dates.map((d, i) => (
                    <p key={i} className="text-slate-900 font-medium">
                      {format(new Date(d.date), 'EEE, MMM d')}
                      <span className="text-slate-400 font-normal text-sm ml-2">
                        ({d.time})
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="bg-slate-50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100">
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-slate-900"
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none bg-white"
              >
                <Download className="w-4 h-4 mr-2" /> Receipt
              </Button>
              <Button
                className="flex-1 sm:flex-none bg-slate-900 text-white hover:bg-slate-800"
                onClick={() => navigate('/bookings')}
              >
                View Bookings
              </Button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-400 max-w-sm mx-auto">
          A confirmation email has been sent to{' '}
          <span className="text-slate-600">{receipt.customerEmail}</span>. Need
          help? Contact support at help@voya.app
        </p>
      </div>
    </div>
  );
}
