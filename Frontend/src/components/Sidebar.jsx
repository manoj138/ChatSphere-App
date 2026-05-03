import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Settings, User, LogOut, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { authUser, logout } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) {
    return (
      <aside className="h-full w-20 lg:w-72 border-r border-white/5 flex flex-col items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="size-8 animate-spin text-[#bef264]" />
      </aside>
    );
  }

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-white/5 flex flex-col transition-all duration-300 bg-[#0a0a0a]">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-white/5 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-[#bef264]/10 flex items-center justify-center">
          <Users className="size-6 text-[#bef264]" />
        </div>
        <span className="font-bold text-xl hidden lg:block tracking-tight text-white">Contacts</span>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-1 custom-scrollbar">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-white/5 transition-all relative group
              ${selectedUser?._id === user._id ? "bg-[#bef264]/10 border-r-2 border-[#bef264]" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.username}
                className="size-12 object-cover rounded-xl border border-white/10"
              />
              {/* Online status placeholder */}
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
            </div>

            {/* User Info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-bold text-white truncate">{user.username}</div>
              <div className="text-xs text-gray-500 truncate italic">Ready to chat</div>
            </div>
          </button>
        ))}

        {users.length === 0 && (
          <div className="text-center text-gray-500 py-10 hidden lg:block">No contacts found</div>
        )}
      </div>

      {/* Sidebar Footer - Actions */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link 
          to="/profile" 
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-[#bef264] group"
        >
          <User className="size-6" />
          <span className="hidden lg:block font-bold text-sm">Profile</span>
        </Link>
        <Link 
          to="/settings" 
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-[#bef264] group"
        >
          <Settings className="size-6" />
          <span className="hidden lg:block font-bold text-sm">Settings</span>
        </Link>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-all text-gray-400 hover:text-red-500 group"
        >
          <LogOut className="size-6" />
          <span className="hidden lg:block font-bold text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
