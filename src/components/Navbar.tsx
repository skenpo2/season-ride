import { Button } from '@/components/ui/button';
import { MessageCircleQuestion } from 'lucide-react';
import logo from '../assets/Voya_logo.svg';

const VOYA_DARK_BG = 'bg-[#050B14]';
const SUPPORT_PHONE = '2348149696918';

export const Navbar = () => (
  <nav
    className={`${VOYA_DARK_BG} border-b border-slate-800 sticky top-0 z-50`}
  >
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
      <div className="flex items-center gap-4">
        {/* Logo Section - Reduced size to h-8 */}
        <div className="relative flex items-center">
          <img src={logo} alt="Voya" className="h-8 w-auto object-contain" />
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-800 mx-2 hidden sm:block"></div>

        {/* Private Daily Driver Badge */}
        <div className="hidden sm:block border border-slate-600 text-slate-200 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
          Private Daily Driver
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Support Action */}
        <a
          href={`https://wa.me/${SUPPORT_PHONE}?text=Hello Voya Team, I have an inquiry about a booking.`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="ghost"
            className="text-slate-300 hover:text-white hover:bg-slate-800/50 gap-2.5 transition-colors"
          >
            <MessageCircleQuestion className="w-5 h-5 text-[#00E599]" />
            <span className="font-medium hidden sm:inline">
              Concierge Support
            </span>
            <span className="font-medium sm:hidden">Support</span>
          </Button>
        </a>
      </div>
    </div>
  </nav>
);
