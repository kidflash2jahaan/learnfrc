import { Skeleton } from "@/components/ui/skeleton";

export default function LessonLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-72 max-w-full" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="mt-3 h-5 w-full max-w-xl" />
          <Skeleton className="mt-6 h-12 w-64" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        <Skeleton className="hidden h-96 rounded-2xl lg:block" />
      </div>
    </div>
  );
}
