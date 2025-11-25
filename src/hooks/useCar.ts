import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { carService } from '@/services/carServices';
import type {
  CarsQueryParams,
  Car,
  BookingFormData,
  DiscountVerificationRequest,
} from '@/types/carTypes';

// Query Keys Factory
export const carKeys = {
  all: ['cars'] as const,
  lists: () => [...carKeys.all, 'list'] as const,
  list: (params: CarsQueryParams) => [...carKeys.lists(), params] as const,
  details: () => [...carKeys.all, 'detail'] as const,
  detail: (id: string) => [...carKeys.details(), id] as const,
  featured: () => [...carKeys.all, 'featured'] as const,
};

/**
 * Hook to fetch paginated cars
 * Each filter constructs a different URL
 */
export const useCars = (params: CarsQueryParams) => {
  return useQuery({
    queryKey: carKeys.list(params),
    queryFn: () => carService.getCars(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cache time)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch single car
 */
export const useCar = (
  id: string,
  options?: Omit<UseQueryOptions<Car>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: carKeys.detail(id),
    queryFn: () => carService.getCar(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch featured car
 */
export const useFeaturedCar = () => {
  return useQuery({
    queryKey: carKeys.featured(),
    queryFn: carService.getFeaturedCar,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useVerifyDiscount = () => {
  return useMutation({
    mutationFn: (data: DiscountVerificationRequest) =>
      carService.verifyDiscount(data),
  });
};

/**
 * Hook to create booking
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingFormData) => carService.createBooking(data),
    onSuccess: (data) => {
      // Invalidate cars list to reflect availability changes
      queryClient.invalidateQueries({ queryKey: carKeys.lists() });

      // Update the specific car's availability
      queryClient.invalidateQueries({
        queryKey: carKeys.detail(data.booking.carId),
      });
    },
  });
};
