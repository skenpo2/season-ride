import React, { useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { toPng } from 'html-to-image';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  MapPin,
  CarFront,
  Home,
  Download,
  MessageCircle,
  Mail,
  Info,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const apiUrl = import.meta.env.VITE_API_URL;

// --- TYPE DEFINITIONS ---
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

// New Interface for Breakdown
interface BookingBreakdown {
  dailyRate: number;
  totalDays: number;
  subtotal: number;
  urgencyFee: number;
  shortNoticeFee: number;
  discountAmount: number;
}

interface ReceiptDetails {
  reference: string;
  amount: number;
  method: string;
  date: string;
  customerEmail: string;
  breakdown?: BookingBreakdown;
}

interface PaymentVerifyResponse {
  status: 'completed' | 'failed' | 'pending';
  booking: BookingDetails;
  receipt: ReceiptDetails;
}

// --- API HOOK ---
const useVerifyPayment = (reference: string | null) => {
  return useQuery<PaymentVerifyResponse>({
    queryKey: ['verify-payment', reference],
    queryFn: async () => {
      const { data } = await axios.get<{ data: PaymentVerifyResponse }>(
        `${apiUrl}/payments/verify?reference=${reference}`
      );
      return data.data;
    },
    enabled: !!reference,
    retry: 1,
    staleTime: 0,
  });
};

// --- COMPONENT ---
export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const { data, isLoading, isError } = useVerifyPayment(reference);

  // --- HANDLERS ---
  const handleDownloadReceipt = async () => {
    if (receiptRef.current === null) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `VOYA-Receipt-${data?.receipt.reference}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download receipt', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWhatsAppSupport = () => {
    const ref = data?.receipt.reference || reference || 'Unknown';
    const message = `Hello Voya Support, I have an inquiry regarding my booking. Payment Reference: ${ref}`;
    const url = `https://wa.me/2348149696918?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank');
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">
          Verifying payment...
        </p>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (isError || !data || data.status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-sm w-full p-6 text-center space-y-6 shadow-lg border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-900">Payment Failed</h1>
            <p className="text-slate-500 text-sm">
              We couldn't verify this transaction.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => navigate(-1)}
              className="w-full bg-slate-900"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={handleWhatsAppSupport}
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
              Chat Support
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // --- SUCCESS STATE ---
  const { booking, receipt } = data;
  const car = booking.carId;
  const breakdown = receipt.breakdown;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-5 animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
            <CheckCircle2 className="w-7 h-7 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Booking Confirmed!
          </h1>
        </div>

        {/* Digital Ticket Card */}
        <Card className="bg-white overflow-hidden shadow-xl border-0 rounded-2xl">
          {/* --- CAPTURE AREA START --- */}
          <div ref={receiptRef} className="bg-white">
            <div className="h-2 bg-slate-900 w-full" />

            {/* Ticket Header */}
            <div className="px-6 pt-6 pb-0 flex justify-between items-center">
              <span className="text-lg font-bold tracking-tighter text-slate-900">
                VOYA
              </span>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 border border-slate-200 px-2 py-0.5 rounded">
                Receipt
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Amount & Breakdown Section */}
              <div className="border-b border-slate-100 pb-5">
                <p className="text-xs text-center text-slate-400 uppercase tracking-wide mb-1">
                  Total Paid
                </p>
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
                  ₦{receipt.amount.toLocaleString()}
                </h2>

                {/* --- NEW: Fee Breakdown --- */}
                {breakdown && (
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-xs sm:text-sm">
                    {/* Base Rate */}
                    <div className="flex justify-between text-slate-600">
                      <span>Rate (x{breakdown.totalDays} days)</span>
                      <span className="font-medium">
                        ₦{breakdown.subtotal.toLocaleString()}
                      </span>
                    </div>

                    {/* Urgency Fee */}
                    {breakdown.urgencyFee > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span className="flex items-center gap-1">
                          <Info className="w-3 h-3" /> Urgency Fee
                        </span>
                        <span className="font-medium">
                          ₦{breakdown.urgencyFee.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Short Notice Fee */}
                    {breakdown.shortNoticeFee > 0 && (
                      <div className="flex justify-between text-red-700">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Express Fee
                        </span>
                        <span className="font-medium">
                          ₦{breakdown.shortNoticeFee.toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Discount */}
                    {breakdown.discountAmount > 0 && (
                      <div className="flex justify-between text-green-700">
                        <span>Discount</span>
                        <span className="font-medium">
                          -₦{breakdown.discountAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-center text-xs text-slate-400 mt-3">
                  Paid via {receipt.method} •{' '}
                  {format(new Date(receipt.date), 'MMM d, yyyy h:mm a')}
                </div>
              </div>

              {/* Car Info */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="w-16 h-12 bg-white rounded overflow-hidden shrink-0 border border-slate-200">
                  {car?.images?.[0] ? (
                    <img
                      src={car.images[0]}
                      alt={car.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CarFront className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {car?.name || 'Car Details'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {car?.color} • {car?.type}
                  </p>
                </div>
              </div>

              {/* Itinerary */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Pickup
                    </p>
                    <p className="text-sm text-slate-900 font-medium leading-tight">
                      {booking.pickup}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      Date & Time
                    </p>
                    <div className="text-sm text-slate-900 font-medium">
                      {booking.dates.map((d, i) => (
                        <div key={i}>
                          {format(new Date(d.date), 'EEE, MMM d')}{' '}
                          <span className="text-slate-400">at</span> {d.time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
              <p className="text-[10px] text-slate-400 font-mono">
                REF: {receipt.reference}
              </p>
              <div className="flex items-center text-[10px] text-green-700 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
              </div>
            </div>
          </div>
          {/* --- CAPTURE AREA END --- */}

          {/* Action Buttons */}
          <div className="bg-white p-5 space-y-3 border-t border-slate-100">
            <Button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white"
              onClick={handleDownloadReceipt}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isDownloading ? 'Saving...' : 'Download Receipt'}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 mr-2" /> Home
              </Button>
              <Button
                variant="outline"
                className="w-full border-green-200 hover:bg-green-50 text-green-700 hover:text-green-800"
                onClick={handleWhatsAppSupport}
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Support
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer Contact Info */}
        <div className="text-center space-y-1">
          <p className="text-xs text-slate-400">Need changes? Email us at</p>
          <a
            href="mailto:operations@voyaapp.co"
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Mail className="w-3 h-3" /> operations@voyaapp.co
          </a>
        </div>
      </div>
    </div>
  );
}
