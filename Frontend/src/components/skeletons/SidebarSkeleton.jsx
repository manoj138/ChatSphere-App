const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-full lg:w-[380px] xl:w-[420px] border-r border-primary/5 flex transition-all duration-500 bg-surface/40 backdrop-blur-3xl">
      
      {/* Navigation Strip Skeleton */}
      <div className="w-[76px] border-r border-primary/5 hidden lg:flex flex-col items-center py-6 gap-8 bg-surface/60">
         <div className="size-11 bg-primary/10 rounded-2xl animate-pulse" />
         <div className="size-11 bg-primary/10 rounded-2xl animate-pulse" />
         <div className="size-11 bg-primary/10 rounded-2xl animate-pulse" />
         <div className="mt-auto mb-4 size-11 bg-primary/10 rounded-2xl animate-pulse" />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-4 w-16 bg-primary/10 rounded-lg animate-pulse" />
              <div className="h-6 w-32 bg-primary/10 rounded-xl animate-pulse" />
            </div>
            <div className="size-10 bg-primary/10 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="px-5 py-4">
           <div className="h-12 w-full bg-primary/10 rounded-2xl animate-pulse" />
        </div>

        {/* Skeleton Contacts */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 custom-scrollbar">
          {skeletonContacts.map((_, idx) => (
            <div key={idx} className="w-full p-4 flex items-center gap-4">
              {/* Avatar skeleton */}
              <div className="size-12 bg-primary/10 rounded-2xl animate-pulse flex-shrink-0" />

              {/* User info skeleton */}
              <div className="flex-1 text-left space-y-2">
                <div className="flex justify-between items-center">
                   <div className="h-4 w-24 bg-primary/10 rounded-md animate-pulse" />
                   <div className="h-2 w-12 bg-primary/10 rounded-md animate-pulse opacity-30" />
                </div>
                <div className="h-3 w-40 bg-primary/10 rounded-md animate-pulse opacity-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
