import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-white/5 flex flex-col transition-all duration-300 bg-[#0a0a0a]">
      {/* Header Skeleton */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-5 w-24 bg-white/5 rounded-lg animate-pulse hidden lg:block" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex px-4 gap-2 my-4">
        <div className="flex-1 h-10 bg-white/5 rounded-xl animate-pulse" />
        <div className="flex-1 h-10 bg-white/5 rounded-xl animate-pulse" />
      </div>

      {/* Skeleton Contacts */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="size-12 bg-white/5 rounded-xl animate-pulse" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="h-4 w-32 bg-white/5 rounded-md animate-pulse mb-2" />
              <div className="h-3 w-16 bg-white/5 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
