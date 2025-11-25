import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CarsPage } from '@/pages/CarsPage';
// import { NotFoundPage } from '@/pages/NotFoundPage';

// Admin Pages
import { LoginPage } from '@/pages/admin/LoginPage';
import { BookingsPage } from '@/pages/admin/BookingPage';
import { BookingDetailPage } from '@/pages/admin/BookingDetails'; // Add this
import { CarsManagementPage } from '@/pages/admin/CarsManagementPage';
import { CarUploadPage } from '@/pages/admin/CarUploadPage';
import { PaymentsPage } from '@/pages/admin/PaymentsPage';
import PaymentStatusPage from './pages/PaymentStatus';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route index element={<CarsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>
        <Route path="/payment/status" element={<PaymentStatusPage />} />

        {/* Admin Login (No Layout) */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/bookings" replace />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/:id" element={<BookingDetailPage />} />{' '}
          <Route path="cars" element={<CarsManagementPage />} />
          <Route path="cars/new" element={<CarUploadPage />} />
          <Route path="cars/edit/:id" element={<CarUploadPage />} />
          <Route path="payments" element={<PaymentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
