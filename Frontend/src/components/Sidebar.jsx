import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Settings, User, LogOut, Loader2, MoreVertical, UserPlus, Search, Check, X, ArrowLeft, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { 
    getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading,
    searchUsers, searchResults = [], isSearching, sendFriendRequest,
    getPendingRequests, pendingRequests = [], respondToRequest
  } = useChatStore();
  
  const { authUser, logout } = useAuthStore();
  
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequests, setShowRequests] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);

  useEffect(() => {
    getUsers();
    getPendingRequests();
  }, [getUsers, getPendingRequests]);

  useEffect(() => {
    if (showAddFriend) {
        searchUsers(""); 
    }
  }, [showAddFriend, searchUsers]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  if (isUsersLoading) {
    return (
      <aside className="h-full w-20 lg:w-80 border-r border-white/5 flex flex-col items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="size-8 animate-spin text-[#bef264]" />
      </aside>
    );
  }

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-white/5 flex flex-col transition-all duration-300 bg-[#0a0a0a] relative">
      
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d]">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={authUser?.profilePicture || "/avatar.png"}
            alt="Me"
            className="size-10 rounded-full border border-[#bef264]/20 object-cover flex-shrink-0"
          />
          <div className="hidden lg:block overflow-hidden">
            <h2 className="font-bold text-white text-sm truncate">{authUser?.username || "Guest"}</h2>
            <p className="text-[10px] text-[#bef264] font-bold uppercase tracking-wider">Online</p>
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          {pendingRequests?.length > 0 && (
            <button 
              onClick={() => setShowRequests(!showRequests)}
              className="p-2 bg-[#bef264]/10 rounded-full text-[#bef264] relative animate-pulse"
            >
              <Users size={18} />
              <span className="absolute -top-1 -right-1 size-4 bg-[#bef264] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingRequests.length}
              </span>
            </button>
          )}

          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 w-48 bg-[#141414] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#bef264] hover:text-black transition-colors" onClick={() => setShowMenu(false)}>
                <User size={16} /> Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#bef264] hover:text-black transition-colors" onClick={() => setShowMenu(false)}>
                <Settings size={16} /> Settings
              </Link>
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-[#bef264] hover:text-black transition-colors"
                onClick={() => { setShowMenu(false); setShowAddFriend(true); }}
              >
                <UserPlus size={16} /> Add Friend
              </button>
              <div className="h-[1px] bg-white/5 my-1" />
              <button onClick={() => { setShowMenu(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Friend View */}
      {showAddFriend && (
        <div className="absolute inset-0 bg-[#0a0a0a] z-50 flex flex-col animate-in slide-in-from-left duration-300">
           <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-[#0d0d0d]">
              <button onClick={() => { setShowAddFriend(false); setSearchQuery(""); }} className="text-gray-400 hover:text-[#bef264] transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h3 className="font-bold text-white uppercase tracking-widest text-sm">Add New Friend</h3>
           </div>
           
           <div className="p-4">
              <div className="relative group">
                <Search className="absolute left-3 top-2.5 size-4 text-gray-600" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  className="w-full bg-[#111] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#bef264]/50 transition-all text-white"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar">
              <p className="px-5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {searchQuery ? "Search Results" : "Suggested People"}
              </p>
              
              {isSearching ? (
                <div className="p-10 text-center"><Loader2 className="size-8 animate-spin text-[#bef264] mx-auto" /></div>
              ) : (
                <div className="space-y-1">
                  {searchResults?.map(user => (
                    <div key={user?._id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                       <div className="flex items-center gap-3">
                          <img src={user?.profilePicture || "/avatar.png"} className="size-10 rounded-xl border border-white/10" alt="" />
                          <div className="text-left">
                            <div className="text-sm font-bold text-white">{user?.username}</div>
                            <div className="text-[10px] text-gray-500 truncate max-w-[120px]">{user?.email}</div>
                          </div>
                       </div>
                       <button 
                        onClick={() => sendFriendRequest(user?._id)}
                        className="p-2 bg-[#bef264]/10 text-[#bef264] rounded-xl hover:bg-[#bef264] hover:text-black transition-all"
                       >
                         <UserPlus size={18} />
                       </button>
                    </div>
                  ))}
                  {(!searchResults || searchResults.length === 0) && <div className="p-10 text-center text-gray-500 text-sm italic">No users found.</div>}
                </div>
              )}
           </div>
        </div>
      )}

      {/* Pending Requests View */}
      {showRequests && (
        <div className="absolute inset-0 top-0 bg-[#0a0a0a] z-50 flex flex-col animate-in slide-in-from-right duration-300">
           <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d]">
              <div className="flex items-center gap-3">
                 <Users className="text-[#bef264]" size={20} />
                 <h3 className="font-bold text-white uppercase tracking-widest text-sm">Friend Requests</h3>
              </div>
              <button onClick={() => setShowRequests(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
           </div>
           <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
              {pendingRequests?.map((req) => (
                <div key={req?._id} className="bg-[#141414] p-3 rounded-2xl flex items-center justify-between border border-white/5">
                   <div className="flex items-center gap-3 overflow-hidden">
                      <img src={req?.sender?.profilePicture || "/avatar.png"} className="size-10 rounded-xl" alt="" />
                      <div className="text-left overflow-hidden">
                        <span className="text-sm font-bold text-white block truncate">{req?.sender?.username || "Unknown"}</span>
                        <span className="text-[10px] text-gray-500">wants to connect</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => respondToRequest(req?._id, "accepted")} className="p-2 bg-[#bef264] text-black rounded-lg hover:scale-105 transition-transform"><Check size={16} /></button>
                      <button onClick={() => respondToRequest(req?._id, "rejected")} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><X size={16} /></button>
                   </div>
                </div>
              ))}
              {(!pendingRequests || pendingRequests.length === 0) && (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                   <Bell size={40} className="opacity-20" />
                   <p className="italic text-sm">No pending requests</p>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
        <div className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden lg:block">Messages</div>
        
        {users?.map((user) => (
          <button
            key={user?._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-4 flex items-center gap-3
              hover:bg-white/5 transition-all relative
              ${selectedUser?._id === user?._id ? "bg-[#bef264]/5" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user?.profilePicture || "/avatar.png"}
                alt={user?.username}
                className="size-12 object-cover rounded-2xl border border-white/5 shadow-lg"
              />
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-white truncate text-sm">{user?.username}</span>
                <span className="text-[10px] text-gray-600 italic">Connected</span>
              </div>
              <div className="text-xs text-gray-500 truncate italic">Available</div>
            </div>
          </button>
        ))}

        {(!users || users.length === 0) && (
          <div className="text-center text-gray-500 py-10 hidden lg:block text-sm italic px-4 space-y-4">
            <div className="size-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
               <UserPlus className="size-8 opacity-20" />
            </div>
            <p>Your contact list is empty.<br />Click 'Add Friend' to find people.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
