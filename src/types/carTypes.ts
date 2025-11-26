export interface CarFeatures {
  seats: number;
  fuel: string;
  duration: string;
  year: number;
  transmission?: string;
}

export interface Car {
  id: string;
  name: string;
  price: number;
  type: 'SUV' | 'Sedan' | 'Van';
  images: string[];
  features: CarFeatures;
  rating?: number;
  trips?: number;
  available?: boolean;
  amenities: string[];
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedCarsResponse {
  data: Car[];
  meta: PaginationMeta;
}

export interface CarsQueryParams {
  page: number;
  limit: number;
  type?: string;
}

export interface BookingResponse {
  id: string;
  status: 'pending' | 'confirmed' | 'rejected';
  message: string;
  booking: BookingFormData;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  whatsapp?: string;
  pickup?: string;
  dates?: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface Booking {
  id: string;
  customerEmail: string;
  customerPhone: string;
  baseLocation: string;
  startingTime: string;
  status: 'pending' | 'completed' | 'cancelled';
  carId: string;
  carName?: string;
  pickupDate: string;
  createdAt: string;
}

export interface PaginatedBookingsResponse {
  data: Booking[];
  meta: PaginationMeta;
}

export interface BookingDate {
  date: string; // YYYY-MM-DD format
  time: string; // e.g., "8am", "9am"
}

export interface DiscountCode {
  code: string;
  discountAmount: number;
  discountPercentage?: number;
  message: string;
  isValid: boolean;
}

export interface DiscountVerificationRequest {
  code: string;
  carId: string;
  dates: BookingDate[];
  totalAmount: number;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  pickup: string;
  dates: BookingDate[]; // Changed from single date/time to array
  carId: string;
  paymentMethod: 'stripe' | 'paystack';
  discountCode?: string;
  discountAmount?: number;
}

export interface BookingDetail extends Booking {
  car: Car;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  dates: BookingDate[];
  payment?: Payment;
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  whatsapp?: string;
  pickup?: string;
  dates?: string;
  discountCode?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'paystack';
  customerEmail: string;
  createdAt: string;
}

export interface PaginatedPaymentsResponse {
  data: Payment[];
  meta: PaginationMeta;
}

// src/types/car.types.ts

export interface CarFormData {
  name: string;
  year: number;
  fuel: string;
  seats: number;
  price: number;
  status: 'available' | 'unavailable' | 'maintenance';
  type: 'SUV' | 'Sedan' | 'Van';
  amenities: string[];
  images: (File | string)[];
  transmission?: string;
  duration?: string;
}
export interface CarUpdateData extends Partial<CarFormData> {
  id: string;
}

export interface IError {
  message: string;
  code?: string;
}
