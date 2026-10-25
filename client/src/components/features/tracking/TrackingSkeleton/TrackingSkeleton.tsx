import React from "react";

export interface TrackingSkeletonProps {
  className?: string;
}

export const TrackingSkeleton: React.FC<TrackingSkeletonProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`space-y-6 sm:space-y-8 animate-pulse ${className}`}
      data-testid="tracking-skeleton"
    >
      {/* Timeline skeleton */}
      <div className="bg-white/90 border border-stone-200/80 rounded-2xl p-6 sm:p-8">
        <div className="h-6 w-48 bg-stone-200 rounded-md mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2.5">
              <div className="w-11 h-11 rounded-full bg-stone-200" />
              <div className="h-4 w-20 bg-stone-200 rounded" />
              <div className="h-3 w-16 bg-stone-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Order card skeleton */}
      <div className="bg-white/90 border border-stone-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-stone-100">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-stone-200 rounded" />
            <div className="h-8 w-44 bg-stone-300 rounded" />
          </div>
          <div className="h-6 w-32 bg-stone-200 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-stone-200 rounded" />
            <div className="h-6 w-40 bg-stone-200 rounded" />
            <div className="h-4 w-32 bg-stone-100 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-24 bg-stone-200 rounded" />
            <div className="h-6 w-48 bg-stone-200 rounded" />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-stone-100">
          <div className="h-16 w-full bg-stone-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
