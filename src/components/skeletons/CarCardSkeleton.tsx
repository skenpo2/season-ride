import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const CarCardSkeleton = () => {
  return (
    <Card className="group border-0 shadow-md bg-white rounded-2xl overflow-hidden ring-1 ring-slate-200">
      <CardHeader className="p-0 relative">
        <div className="w-full aspect-4/3 bg-slate-200 animate-pulse" />
      </CardHeader>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
          </div>
          <div className="space-y-1">
            <div className="h-5 bg-slate-200 rounded animate-pulse w-20" />
            <div className="h-3 bg-slate-200 rounded animate-pulse w-12 ml-auto" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 bg-slate-200 rounded-lg animate-pulse"
            />
          ))}
        </div>

        <div className="h-10 bg-slate-200 rounded animate-pulse mt-4" />
      </CardContent>
    </Card>
  );
};
