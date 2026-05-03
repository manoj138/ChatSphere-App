import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Settings, User, LogOut, Loader2, MoreVertical, UserPlus, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { authUser, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) {
    return (
      <aside className="h-full w-20 lg:w-80 border-r border-white/5 flex flex-col items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="size-8 animate-spin text-[#bef264]" />
      </aside>
    );
  }

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-white/5 flex flex-col transition-all duration-300 bg-[#0a0a0a] relative">
      
      {/* Sidebar Header - Current User Profile */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d]">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={authUser?.profilePicture || "/avatar.png"}
            alt="Me"
            className="size-10 rounded-full border border-[#bef264]/20 object-cover flex-shrink-0"
          />
          <div className="hidden lg:block overflow-hidden">
            <h2 className="font-bold text-white text-sm truncate">{authUser?.username}</h2>
            <p className="text-[10px] text-[#bef264] font-bold uppercase tracking-wider">My Profile</p>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
          >
            <MoreVertical size={20} />
          </button>

          {/* 3-Dots Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#141414] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#bef264] hover:text-black transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <User size={16} /> Profile
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#bef264] hover:text-black transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <Settings size={16} /> Settings
              </Link>
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#bef264] hover:text-black transition-colors"
                onClick={() => { setShowMenu(false); /* Request logic later */ }}
              >
                <UserPlus size={16} /> Add Friend
              </button>
              <div className="h-[1px] bg-white/5 my-1" />
              <button 
                onClick={() => { setShowMenu(false); logout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Contacts Bar */}
      <div className="p-4 hidden lg:block">
        <div className="relative group">
           <input 
            type="text" 
            placeholder="Search or start new chat" 
            className="w-full bg-[#111] border border-white/5 rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-[#bef264]/50 transition-all text-white placeholder-gray-600"
           />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
        <div className="px-5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden lg:block">Recent Chats</div>
        
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-white/5 transition-all relative
              ${selectedUser?._id === user._id ? "bg-[#bef264]/5" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.username}
                className="size-12 object-cover rounded-2xl border border-white/5 shadow-lg"
              />
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-white truncate text-sm">{user.username}</span>
                <span className="text-[10px] text-gray-600">12:45 PM</span>
              </div>
              <div className="text-xs text-gray-500 truncate italic">How are you doing today?</div>
            </div>
          </button>
        ))}

        {users.length === 0 && (
          <div className="text-center text-gray-500 py-10 hidden lg:block text-sm italic px-4">
            No active conversations. Start by searching for a friend.
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
