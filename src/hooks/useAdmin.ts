// src/hooks/useAdmin.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { adminService } from '@/services/admin.services';
import type {
  CarFormData,
  CarUpdateData,
  CarsQueryParams,
} from '@/types/carTypes';

// Query Keys
export const adminKeys = {
  cars: ['admin', 'cars'] as const,
  carsList: (params: CarsQueryParams) =>
    [...adminKeys.cars, 'list', params] as const,
  bookings: ['admin', 'bookings'] as const,
  bookingsList: (params: { page: number; limit: number; status?: string }) =>
    [...adminKeys.bookings, 'list', params] as const,
  payments: ['admin', 'payments'] as const,
  paymentsList: (params: { page: number; limit: number; status?: string }) =>
    [...adminKeys.payments, 'list', params] as const,

  bookingDetail: (id: string) => [...adminKeys.bookings, 'detail', id] as const,
};

// ===== CAR MANAGEMENT HOOKS =====

export const useAdminCars = (params: CarsQueryParams) => {
  return useQuery({
    queryKey: adminKeys.carsList(params),
    queryFn: () => adminService.getCars(params),
    placeholderData: keepPreviousData,
    staleTime: 3 * 60 * 1000,
  });
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CarFormData) => adminService.createCar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.cars });
    },
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CarUpdateData) => adminService.updateCar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.cars });
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteCar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.cars });
    },
  });
};

// ===== BOOKINGS MANAGEMENT HOOKS =====

export const useAdminBookings = (params: {
  page: number;
  limit: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: adminKeys.bookingsList(params),
    queryFn: () => adminService.getBookings(params),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'pending' | 'completed' | 'cancelled';
    }) => adminService.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.bookings });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.bookings });
    },
  });
};

// ===== PAYMENTS MANAGEMENT HOOKS =====

export const useAdminPayments = (params: {
  page: number;
  limit: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: adminKeys.paymentsList(params),
    queryFn: () => adminService.getPayments(params),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'pending' | 'completed' | 'failed' | 'refunded';
    }) => adminService.updatePaymentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.payments });
    },
  });
};
export const useBookingDetail = (id: string) => {
  return useQuery({
    queryKey: adminKeys.bookingDetail(id),
    queryFn: () => adminService.getBookingDetail(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};
