import { LoadingCard, Skeleton } from "@/components/cos/ui";

/** Route-level loading state shared by every /cos screen. */
export default function CosLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingCard key={index} rows={2} />
        ))}
      </div>
      <LoadingCard rows={6} />
    </div>
  );
}
