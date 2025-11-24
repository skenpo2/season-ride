import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  FileText,
  Car as CarIcon,
  Upload,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import { useState } from 'react';

const VOYA_DARK_BG = 'bg-[#050B14]';
const VOYA_TEAL = 'text-[#00E599]';
const VOYA_TEAL_BORDER = 'border-[#00E599]';

export const AdminLayout = () => {
  const location = useLocation();
  const logout = useLogout();
  // const admin = useCurrentAdmin();
  // const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Bookings', href: '/admin/bookings', icon: FileText },
    { name: 'Car Management', href: '/admin/cars', icon: CarIcon },
    { name: 'Car Upload', href: '/admin/cars/new', icon: Upload },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav
        className={`${VOYA_DARK_BG} border-b border-slate-800 sticky top-0 z-50`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={`border ${VOYA_TEAL_BORDER}/30 ${VOYA_TEAL} text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider`}
                >
                  Beta
                </div>
                <div className="text-white text-xl font-light tracking-widest mt-1">
                  V<span className="font-normal">O</span>YA
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? `${VOYA_TEAL} bg-emerald-900/20`
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white font-medium">
                  {'A'}
                </div>
                <span className="text-slate-300 text-sm hidden lg:block">
                  {'Admin'}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-slate-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-800">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? `${VOYA_TEAL} bg-emerald-900/20`
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
