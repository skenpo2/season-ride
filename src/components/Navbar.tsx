const VOYA_DARK_BG = 'bg-[#050B14]';

import logo from '../assets/Voya_logo.svg';

export const Navbar = () => (
  <nav
    className={`${VOYA_DARK_BG} border-b border-slate-800 sticky top-0 z-50`}
  >
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
      <div className="flex items-center gap-4">
        {/* Logo Section */}
        <div className="relative flex items-center">
          <img src={logo} alt="Voya Logo" className="h-8 w-auto" />
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-800 mx-2 hidden sm:block"></div>

        {/* Private Daily Driver Badge */}
        <div className="hidden sm:block border border-slate-600 text-slate-200 px-4 py-1.5 rounded-full text-sm font-medium">
          Private Daily Driver
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4"></div>
    </div>
  </nav>
);
