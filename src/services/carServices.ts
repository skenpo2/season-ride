import { api } from '@/lib/axios';
import type {
  Car,
  BookingFormData,
  BookingResponse,
  DiscountVerificationRequest,
  DiscountCode,
  PaginatedCarsResponse,
  CarsQueryParams,
} from '@/types/carTypes';

// API Response wrapper type
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
}

// API Car type (from backend)
interface ApiCar {
  id: string;
  name: string;
  price: number;
  type: 'SUV' | 'Sedan' | 'Van';
  images: string[];
  features: {
    seats: number;
    fuel: string;
    duration: string;
    year: number;
    transmission?: string;
  };
  rating?: number;
  trips?: number;
  available?: boolean;
  status?: string;
  amenities?: string[];
}

// Transform function
const transformCar = (apiCar: ApiCar): Car => {
  return {
    id: apiCar.id,
    name: apiCar.name,
    price: apiCar.price,
    type: apiCar.type,
    images: apiCar.images,
    features: apiCar.features,
    rating: apiCar.rating,
    trips: apiCar.trips,
    available: apiCar.available,
  };
};

export const carService = {
  /**
   * Get paginated cars list
   */
  getCars: async (params: CarsQueryParams): Promise<PaginatedCarsResponse> => {
    const queryParams: Record<string, string | number> = {
      page: params.page,
      limit: params.limit,
    };

    if (params.type && params.type !== 'all') {
      queryParams.type = params.type;
    }

    const response = await api.get<ApiResponse<ApiCar[]>>('/cars', {
      params: queryParams,
    });

    // Transform _id to id for all cars
    const transformedCars = response.data.data.map(transformCar);

    return {
      data: transformedCars,
      meta: response.data.meta,
    };
  },

  /**
   * Get single car by ID
   */
  getCar: async (id: string): Promise<Car> => {
    const response = await api.get<ApiResponse<ApiCar>>(`/cars/${id}`);
    return transformCar(response.data.data);
  },

  /**
   * Get featured/random car
   */
  getFeaturedCar: async (): Promise<Car> => {
    const response = await api.get<ApiResponse<ApiCar>>('/cars/featured');
    return transformCar(response.data.data);
  },

  /**
   * Verify discount code
   */
  verifyDiscount: async (
    data: DiscountVerificationRequest
  ): Promise<DiscountCode> => {
    const response = await api.post<ApiResponse<DiscountCode>>(
      '/discounts/verify',
      data
    );
    return response.data.data;
  },

  /**
   * Create booking with multiple dates
   */
  createBooking: async (data: BookingFormData): Promise<BookingResponse> => {
    const response = await api.post<ApiResponse<BookingResponse>>(
      '/bookings',
      data
    );
    return response.data.data;
  },
};
