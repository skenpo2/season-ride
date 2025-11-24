import { useState } from 'react';
import {
  useAdminBookings,
  useUpdateBookingStatus,
  useDeleteBooking,
} from '@/hooks/useAdmin';
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
import { MoreHorizontal, Loader2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BookingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();
  const {
    data: bookings,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useAdminBookings({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const updateStatus = useUpdateBookingStatus();
  const deleteBooking = useDeleteBooking();

  console.log(bookings);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusChange = async (
    id: string,
    status: 'pending' | 'completed' | 'cancelled'
  ) => {
    await updateStatus.mutateAsync({ id, status });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBooking.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'cancelled':
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
        title="Failed to load bookings"
        message="We couldn't load the bookings. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
        <p className="text-slate-600 mt-2">
          {bookings?.meta
            ? `Showing ${bookings.data.length} of ${bookings.meta.totalItems} bookings`
            : 'Manage all customer bookings'}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Customer Email</TableHead>
                <TableHead>Customer Phone</TableHead>
                <TableHead>Base Location</TableHead>
                <TableHead>Starting Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.data.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.customerEmail}
                  </TableCell>
                  <TableCell>{booking.customerPhone}</TableCell>
                  <TableCell>{booking.baseLocation}</TableCell>
                  <TableCell>{booking.startingTime}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
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
                          onClick={() =>
                            navigate(`/admin/bookings/${booking.id}`)
                          }
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(booking.id, 'pending')
                          }
                        >
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(booking.id, 'completed')
                          }
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(booking.id, 'cancelled')
                          }
                        >
                          Mark as Cancelled
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(booking.id)}
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
      {bookings && (
        <Pagination
          currentPage={bookings.meta.currentPage}
          totalPages={bookings.meta.totalPages}
          onPageChange={handlePageChange}
          hasNext={bookings.meta.hasNextPage}
          hasPrev={bookings.meta.hasPreviousPage}
          isLoading={isFetching}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              booking.
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
