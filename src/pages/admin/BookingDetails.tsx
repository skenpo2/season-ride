// src/pages/admin/BookingDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useBookingDetail } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Car as CarIcon,
  CreditCard,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { ErrorState } from '@/components/ErrorState';

export const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: booking,
    isLoading,
    error,
    refetch,
  } = useBookingDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <ErrorState
        title="Failed to load booking details"
        message="We couldn't load the booking details. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    if (!status) return 'bg-slate-50 text-slate-700 border-slate-200';
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'refunded':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/admin/bookings')}
            className="border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Booking Details
            </h1>
            <p className="text-slate-600 mt-1">ID: {booking.id}</p>
          </div>
        </div>
        <Badge className={getStatusColor(booking.status)}>
          {booking.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="font-medium text-slate-900">
                  {booking.customer.firstName} {booking.customer.lastName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </p>
                <p className="font-medium text-slate-900">
                  {booking.customer.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </p>
                <p className="font-medium text-slate-900">
                  {booking.customer.phone}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Pickup Location
                </p>
                <p className="font-medium text-slate-900">
                  {booking.baseLocation}
                </p>
              </div>
            </div>
          </div>

          {/* Car Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CarIcon className="w-5 h-5" />
              Vehicle Information
            </h2>
            <div className="flex gap-4">
              <div className="w-32 h-24 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={booking.car.images[0]}
                  alt={booking.car.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {booking.car.name}
                </h3>
                <p className="text-sm text-slate-500 mb-2">
                  {booking.car.type} • {booking.car.features.year}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-xs border-slate-200"
                  >
                    {booking.car.features.seats} Seats
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-xs border-slate-200"
                  >
                    {booking.car.features.fuel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-xs border-slate-200"
                  >
                    {booking.car.features.transmission || 'Auto'}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Price per day</p>
                <p className="text-lg font-bold text-slate-900">
                  ₦{booking.car.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Dates */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Dates
            </h2>
            <div className="space-y-3">
              {booking.dates.map((bookingDate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {formatDate(bookingDate.date)}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {bookingDate.time}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-white border-slate-200"
                  >
                    ₦{booking.car.price.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          {booking.payment && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Payment Method</p>
                  <p className="font-medium text-slate-900 capitalize">
                    {booking.payment.paymentMethod}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Payment Status</p>
                  <Badge
                    className={getPaymentStatusColor(booking.payment.status)}
                  >
                    {booking.payment.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="font-medium text-slate-900">
                    {booking.payment.currency === 'NGN' ? '₦' : '$'}
                    {booking.payment.amount.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Payment Date</p>
                  <p className="font-medium text-slate-900">
                    {formatDateTime(booking.payment.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Booking Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Booking Created</span>
                <span className="font-medium text-slate-900">
                  {formatDateTime(booking.createdAt)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Number of Days</span>
                <span className="font-medium text-slate-900">
                  {booking.dates.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Price per Day</span>
                <span className="font-medium text-slate-900">
                  ₦{booking.car.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">
                  ₦{booking.totalAmount.toLocaleString()}
                </span>
              </div>
              {booking.discountAmount && booking.discountAmount > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Discount Applied
                    </span>
                    <span className="font-medium text-green-600">
                      -₦{booking.discountAmount.toLocaleString()}
                    </span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">
                  Total Amount
                </span>
                <span className="font-bold text-xl text-slate-900">
                  ₦{booking.finalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {booking.status === 'completed' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Booking completed successfully
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-slate-200"
                onClick={() => window.print()}
              >
                Print Details
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-200"
                onClick={() =>
                  (window.location.href = `mailto:${booking.customer.email}`)
                }
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Customer
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-200"
                onClick={() =>
                  (window.location.href = `tel:${booking.customer.phone}`)
                }
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
