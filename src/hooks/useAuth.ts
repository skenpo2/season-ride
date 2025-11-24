// src/hooks/useAuth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.services';
import { type LoginCredentials } from '@/types/carTypes';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      // Store token and admin data
      console.log(data);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['admin'] });

      // Navigate to admin dashboard
      navigate('/admin/bookings');
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    authService.logout();
    queryClient.clear();
    navigate('/admin/login');
  };
};

export const useCurrentAdmin = () => {
  return authService.getCurrentAdmin();
};

export const useIsAuthenticated = () => {
  return authService.isAuthenticated();
};
