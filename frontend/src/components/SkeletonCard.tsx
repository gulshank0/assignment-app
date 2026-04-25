interface SkeletonCardProps {
  count?: number;
}

function SingleSkeleton() {
  return (
    <div className="glass rounded-xl p-5 space-y-4">
      {/* Header skeleton */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-3/5 rounded" />
          <div className="skeleton h-4 w-2/5 rounded" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>

      {/* Meta skeleton */}
      <div className="flex gap-4">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
      </div>

      {/* Actions skeleton */}
      <div className="flex gap-3 pt-3 border-t border-white/5">
        <div className="skeleton h-7 w-14 rounded-lg" />
        <div className="skeleton h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export default function SkeletonCard({ count = 6 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SingleSkeleton key={i} />
      ))}
    </>
  );
}
