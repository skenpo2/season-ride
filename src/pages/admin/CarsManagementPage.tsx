import { useState } from 'react';
import { useAdminCars, useDeleteCar } from '@/hooks/useAdmin';
import { Pagination } from '@/components/Pagination';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Loader2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CarsManagementPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 12;

  const {
    data: carsResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useAdminCars({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    type: 'all',
  });

  console.log(carsResponse);

  const deleteCar = useDeleteCar();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCar.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'unavailable':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'maintenance':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load cars"
        message="We couldn't load the cars. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cars</h1>
          <p className="text-slate-600 mt-2">
            {carsResponse?.meta
              ? `Showing ${carsResponse.data.length} of ${carsResponse.meta.totalItems} cars`
              : 'Manage your vehicle fleet'}
          </p>
        </div>
        <Button
          onClick={() => navigate('/admin/cars/new')}
          className="bg-slate-900 text-white hover:bg-slate-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Car
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>CarName</TableHead>
                <TableHead>No. of Seats</TableHead>
                <TableHead>Price per day(₦)</TableHead>
                <TableHead>Car Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carsResponse?.data.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="font-medium">{car.name}</TableCell>
                  <TableCell>{car.features.seats}</TableCell>
                  <TableCell>{car.price.toLocaleString()}</TableCell>
                  <TableCell className="lowercase">{car.type}</TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(
                        car.available ? 'available' : 'unavailable'
                      )}
                    >
                      {car.available ? 'available' : 'unavailable'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(car.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Loading Overlay */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
          </div>
        )}
      </div>

      {/* Pagination */}
      {carsResponse && (
        <Pagination
          currentPage={carsResponse.meta.currentPage}
          totalPages={carsResponse.meta.totalPages}
          onPageChange={handlePageChange}
          hasNext={carsResponse.meta.hasNextPage}
          hasPrev={carsResponse.meta.hasPreviousPage}
          isLoading={isFetching}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the car
              from your fleet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
