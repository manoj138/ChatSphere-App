import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-[420px] border-r border-primary flex transition-all duration-500 bg-secondary">
      
      {/* Navigation Strip Skeleton */}
      <div className="w-[70px] border-r border-primary flex flex-col items-center py-6 gap-8">
         <div className="size-10 bg-surface rounded-xl animate-pulse" />
         <div className="size-10 bg-surface rounded-xl animate-pulse" />
         <div className="size-10 bg-surface rounded-xl animate-pulse" />
         <div className="mt-auto mb-4 size-10 bg-surface rounded-full animate-pulse" />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="p-6 border-b border-primary">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-24 bg-surface rounded-lg animate-pulse" />
              <div className="h-2 w-32 bg-surface rounded-full animate-pulse opacity-40" />
            </div>
            <div className="size-10 bg-surface rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="px-6 py-4">
           <div className="h-10 w-full bg-surface rounded-full animate-pulse" />
        </div>

        {/* Skeleton Contacts */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {skeletonContacts.map((_, idx) => (
            <div key={idx} className="w-full p-3 flex items-center gap-4">
              {/* Avatar skeleton */}
              <div className="size-14 bg-surface rounded-[1.2rem] animate-pulse flex-shrink-0" />

              {/* User info skeleton */}
              <div className="flex-1 text-left space-y-2">
                <div className="flex justify-between items-center">
                   <div className="h-4 w-32 bg-surface rounded-md animate-pulse" />
                   <div className="h-2 w-8 bg-surface rounded-md animate-pulse opacity-30" />
                </div>
                <div className="h-3 w-48 bg-surface rounded-md animate-pulse opacity-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
