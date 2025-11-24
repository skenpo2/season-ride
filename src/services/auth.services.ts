import { api } from '@/lib/axios';
import type { LoginCredentials, LoginResponse, Admin } from '@/types/carTypes';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  /**
   * Login admin user
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/admin/login',
      credentials
    );

    // Extract the actual data from the wrapper
    const loginData = response.data.data;

    // Store token and user data
    if (loginData.token) {
      localStorage.setItem('admin_token', loginData.token);
      localStorage.setItem('admin_user', JSON.stringify(loginData.admin));
    }

    return loginData;
  },

  /**
   * Logout admin user
   */
  logout: (): void => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },

  /**
   * Get current admin user
   */
  getCurrentAdmin: (): Admin | null => {
    const adminData = localStorage.getItem('admin_user');
    return adminData ? JSON.parse(adminData) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin_token');
  },

  /**
   * Get auth token
   */
  getToken: (): string | null => {
    return localStorage.getItem('admin_token');
  },
};
