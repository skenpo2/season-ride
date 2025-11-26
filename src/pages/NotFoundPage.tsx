import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100">
            <FileQuestion className="w-12 h-12 text-slate-900" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-slate-900 tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-slate-800">
            Page not found
          </h2>
          <p className="text-slate-500">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or doesn't exist.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link to="/">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
