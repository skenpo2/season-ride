import { api } from '@/lib/axios';
import type {
  Car,
  CarFormData,
  CarUpdateData,
  PaginatedCarsResponse,
  PaginatedBookingsResponse,
  PaginatedPaymentsResponse,
  CarsQueryParams,
  Booking,
  Payment,
  BookingDetail,
} from '@/types/carTypes';

export const adminService = {
  // ===== CAR MANAGEMENT =====

  /**
   * Get all cars (admin view with pagination)
   */
  getCars: async (params: CarsQueryParams): Promise<PaginatedCarsResponse> => {
    const response = await api.get<PaginatedCarsResponse>('/admin/cars', {
      params,
    });
    return response.data;
  },

  /**
   * Create new car
   */
  createCar: async (data: CarFormData): Promise<Car> => {
    const formData = new FormData();

    // Append text fields
    Object.keys(data).forEach((key) => {
      if (key !== 'images' && key !== 'amenities') {
        formData.append(key, String(data[key as keyof CarFormData]));
      }
    });

    // Append amenities
    data.amenities.forEach((amenity) => {
      formData.append('amenities[]', amenity);
    });

    // Append images (max 3)
    if (data.images && Array.isArray(data.images)) {
      data.images.slice(0, 3).forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }

    const response = await api.post<{ data: Car }>('/admin/cars', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Update car
   */
  updateCar: async (data: CarUpdateData): Promise<Car> => {
    const { id, ...updateData } = data;
    const formData = new FormData();

    Object.keys(updateData).forEach((key) => {
      if (key !== 'images' && key !== 'amenities') {
        const value = updateData[key as keyof Omit<CarUpdateData, 'id'>];
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      }
    });

    if (updateData.amenities) {
      updateData.amenities.forEach((amenity) => {
        formData.append('amenities[]', amenity);
      });
    }

    if (updateData.images && Array.isArray(updateData.images)) {
      updateData.images.slice(0, 3).forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image);
        }
      });
    }

    const response = await api.put<{ data: Car }>(
      `/admin/cars/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Delete car
   */
  deleteCar: async (id: string): Promise<void> => {
    await api.delete(`/admin/cars/${id}`);
  },

  // ===== BOOKINGS MANAGEMENT =====

  /**
   * Get all bookings with pagination
   */
  getBookings: async (params: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<PaginatedBookingsResponse> => {
    const response = await api.get<PaginatedBookingsResponse>(
      '/admin/bookings',
      {
        params,
      }
    );
    return response.data;
  },

  /**
   * Update booking status
   */
  updateBookingStatus: async (
    id: string,
    status: 'pending' | 'completed' | 'cancelled'
  ): Promise<Booking> => {
    const response = await api.patch<{ data: Booking }>(
      `/admin/bookings/${id}/status`,
      {
        status,
      }
    );
    return response.data.data;
  },

  /**
   * Delete booking
   */
  deleteBooking: async (id: string): Promise<void> => {
    await api.delete(`/admin/bookings/${id}`);
  },

  // ===== PAYMENTS MANAGEMENT =====

  /**
   * Get all payments with pagination
   */
  getPayments: async (params: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<PaginatedPaymentsResponse> => {
    const response = await api.get<PaginatedPaymentsResponse>(
      '/admin/payments',
      {
        params,
      }
    );
    return response.data;
  },

  /**
   * Update payment status
   */
  updatePaymentStatus: async (
    id: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded'
  ): Promise<Payment> => {
    const response = await api.patch<{ data: Payment }>(
      `/admin/payments/${id}/status`,
      {
        status,
      }
    );
    return response.data.data;
  },

  getBookingDetail: async (id: string): Promise<BookingDetail> => {
    const response = await api.get<{ data: BookingDetail }>(
      `/admin/bookings/${id}`
    );
    return response.data.data;
  },
};
