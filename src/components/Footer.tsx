import { Link } from 'react-router-dom';

const VOYA_DARK_BG = 'bg-[#050B14]';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`${VOYA_DARK_BG} border-t border-slate-800/50 py-8 mt-auto`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          {/* Left Side: Copyright & Legal */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span className="text-slate-500 text-sm">
              &copy; {currentYear} Voya. All rights reserved.
            </span>

            <div className="flex items-center gap-6">
              <Link
                to="/terms"
                className="text-slate-400 hover:text-[#00E599] text-sm transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/privacy"
                className="text-slate-400 hover:text-[#00E599] text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Right Side: Partnership */}
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs uppercase tracking-wider font-medium">
              In partnership with
            </span>
            <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity select-none">
              <span className="text-white font-bold text-lg tracking-widest">
                LAGRIDE
              </span>
              {/* Simulating the colored squares logo */}
              <div className="grid grid-cols-2 gap-0.5 ml-0.5">
                <div className="w-1 h-1 bg-red-500 rounded-[1px]"></div>
                <div className="w-1 h-1 bg-yellow-500 rounded-[1px]"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-[1px]"></div>
                <div className="w-1 h-1 bg-green-500 rounded-[1px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
