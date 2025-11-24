export const CarCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm h-[400px] animate-pulse">
    {/* Image Placeholder */}
    <div className="h-48 bg-slate-200 w-full" />
    {/* Content Placeholder */}
    <div className="p-5 space-y-4">
      <div className="flex justify-between">
        <div className="h-6 bg-slate-200 w-1/2 rounded" />
        <div className="h-6 bg-slate-200 w-1/4 rounded" />
      </div>
      {/* Badges */}
      <div className="flex gap-2">
        <div className="h-5 bg-slate-200 w-16 rounded-full" />
        <div className="h-5 bg-slate-200 w-16 rounded-full" />
        <div className="h-5 bg-slate-200 w-16 rounded-full" />
      </div>
      {/* Button */}
      <div className="h-10 bg-slate-200 w-full rounded mt-4" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse border-b border-slate-100">
    <td className="p-4">
      <div className="h-4 bg-slate-200 w-32 rounded" />
    </td>
    <td className="p-4">
      <div className="h-4 bg-slate-200 w-10 mx-auto rounded" />
    </td>
    <td className="p-4">
      <div className="h-4 bg-slate-200 w-20 mx-auto rounded" />
    </td>
    <td className="p-4">
      <div className="h-4 bg-slate-200 w-16 mx-auto rounded" />
    </td>
    <td className="p-4">
      <div className="h-6 bg-slate-200 w-20 mx-auto rounded-full" />
    </td>
    <td className="p-4">
      <div className="h-4 bg-slate-200 w-8 mx-auto rounded" />
    </td>
  </tr>
);
