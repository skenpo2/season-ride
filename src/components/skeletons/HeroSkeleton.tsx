// src/components/skeletons/HeroSkeleton.tsx
export const HeroSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto mb-12 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-slate-800">
        <div className="grid lg:grid-cols-2 gap-0 h-full">
          {/* Left Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
            <div className="h-8 bg-slate-800 rounded-full animate-pulse w-40" />
            <div className="space-y-3">
              <div className="h-12 bg-slate-800 rounded animate-pulse w-full" />
              <div className="h-12 bg-slate-800 rounded animate-pulse w-3/4" />
            </div>
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-800 rounded animate-pulse w-24"
                />
              ))}
            </div>
            <div className="h-16 bg-slate-800 rounded animate-pulse w-48" />
            <div className="h-12 bg-slate-800 rounded-full animate-pulse w-40" />
          </div>

          {/* Right Image */}
          <div className="h-[300px] lg:h-[500px] bg-slate-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
