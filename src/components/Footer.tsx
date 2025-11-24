// src/components/Footer.tsx
const VOYA_DARK_BG = 'bg-[#050B14]';

export const Footer = () => (
  <footer className={`${VOYA_DARK_BG} border-t border-slate-800 py-6 mt-auto`}>
    <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-end items-center gap-4">
      <span className="text-slate-400 text-sm">In partnership with</span>
      <div className="flex items-center gap-1">
        <span className="text-white font-bold text-xl tracking-widest">
          LAGRIDE
        </span>
        {/* Simulating the colored squares logo */}
        <div className="grid grid-cols-2 gap-0.5 ml-1">
          <div className="w-1.5 h-1.5 bg-red-500"></div>
          <div className="w-1.5 h-1.5 bg-yellow-500"></div>
          <div className="w-1.5 h-1.5 bg-blue-500"></div>
          <div className="w-1.5 h-1.5 bg-green-500"></div>
        </div>
      </div>
    </div>
  </footer>
);
