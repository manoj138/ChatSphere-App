import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, MessageSquare, Settings, LogOut, Plus, Users as GroupsIcon, Search, UserCircle, User, Sparkles, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { 
    getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading,
    getGroups, groups = [], selectedGroup, setSelectedGroup, isGroupsLoading,
    createGroup
  } = useChatStore();
  
  const { 
    getAllUsers, allUsers = [], getFriendRequests, friendRequests = [], 
    sendFriendRequest, respondToRequest, isUsersLoading: isDiscoverLoading 
  } = useFriendStore();

  const { authUser, logout, onlineUsers = [] } = useAuthStore();
  const { themeColor } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState("chats"); // chats, groups, discover
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
    getGroups();
    getFriendRequests();
  }, [getUsers, getGroups, getFriendRequests]);

  useEffect(() => {
    if (activeTab === "discover") getAllUsers();
  }, [activeTab, getAllUsers]);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      toast.error("Group name and members required");
      return;
    }
    await createGroup({ name: groupName, members: selectedMembers });
    setShowCreateGroup(false);
    setGroupName("");
    setSelectedMembers([]);
  };

  const filteredItems = (
    activeTab === "chats" ? (users || []) : 
    activeTab === "groups" ? (groups || []) : 
    (allUsers || [])
  ).filter(item => {
    const name = activeTab === "chats" ? item.username : activeTab === "groups" ? item.name : item.username;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const isOnline = (userId) => onlineUsers.includes(userId);

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col bg-[#0a0a0a] border-r border-white/5 transition-all">
      
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-black/40" style={{ backgroundColor: themeColor }}>
                 <MessageSquare size={20} fill="currentColor" />
              </div>
              <h1 className="text-lg font-black text-white uppercase tracking-tighter hidden lg:block">Sphere</h1>
           </div>
           {friendRequests.length > 0 && (
             <div className="relative group cursor-pointer" onClick={() => setActiveTab("discover")}>
                <Bell size={20} className="text-gray-500 group-hover:text-white" />
                <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-[8px] font-black flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                   {friendRequests.length}
                </span>
             </div>
           )}
        </div>

        {/* Triple Tab Switcher */}
        <div className="flex p-1 bg-white/[0.03] rounded-xl mb-4 border border-white/5 overflow-x-auto no-scrollbar">
           {["chats", "groups", "discover"].map((tab) => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[60px] py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab ? "bg-white/10 text-white shadow-xl" : "text-gray-500 hover:text-gray-300"
              }`}
             >
               {tab === "chats" && <User size={12} />}
               {tab === "groups" && <GroupsIcon size={12} />}
               {tab === "discover" && <Sparkles size={12} />}
               <span className="hidden lg:block">{tab}</span>
             </button>
           ))}
        </div>

        <div className="relative mb-2 hidden lg:block">
           <Search size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
           <input 
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.01] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-[10px] focus:outline-none focus:border-white/10 transition-all placeholder:text-gray-800 font-bold"
           />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar py-4">
        {/* Friend Requests Section in Discover */}
        {activeTab === "discover" && friendRequests.length > 0 && (
           <div className="mb-6 space-y-2">
              <p className="px-3 text-[8px] font-black uppercase tracking-[0.2em] text-red-500">Pending Authorization</p>
              {friendRequests.map(req => (
                <div key={req._id} className="p-3 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between gap-3">
                   <img src={req.sender?.profilePicture || "/avatar.png"} className="size-8 rounded-lg border border-red-500/20" />
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-white truncate uppercase">{req.sender?.username}</p>
                   </div>
                   <div className="flex gap-1">
                      <button onClick={() => respondToRequest(req._id, "accepted")} className="p-1.5 bg-green-500 text-black rounded-lg hover:scale-110 transition-transform">
                         <Plus size={12} strokeWidth={4} />
                      </button>
                      <button onClick={() => respondToRequest(req._id, "rejected")} className="p-1.5 bg-white/10 text-white rounded-lg hover:scale-110 transition-transform">
                         <X size={12} strokeWidth={4} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        )}

        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isSelected = activeTab === "chats" ? selectedUser?._id === item._id : selectedGroup?._id === item._id;
            const online = activeTab === "chats" ? isOnline(item._id) : false;

            return (
              <div key={item._id} className="relative group">
                <button
                   onClick={() => activeTab === "discover" ? null : (activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item))}
                   className={`w-full p-2.5 flex items-center gap-4 rounded-xl transition-all relative ${
                     isSelected ? "bg-white/5" : "hover:bg-white/[0.02]"
                   } ${activeTab === "discover" ? "cursor-default" : ""}`}
                >
                   {isSelected && <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full" style={{ backgroundColor: themeColor }} />}
                   
                   <div className="relative flex-shrink-0">
                     <div className={`size-11 rounded-xl overflow-hidden border transition-all ${isSelected ? "border-white/20 shadow-2xl" : "border-white/5"}`}>
                        <img 
                          src={(activeTab === "groups" ? item.groupImage : item.profilePicture) || "/avatar.png"} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.target.src = "/avatar.png" }}
                        />
                     </div>
                     {online && <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full" />}
                   </div>

                   <div className="hidden lg:block flex-1 min-w-0 text-left">
                      <div className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                         {activeTab === "groups" ? item.name : item.username}
                      </div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-gray-700 truncate mt-0.5">
                         {activeTab === "discover" ? item.email : (online ? "Active Now" : "Encrypted Node")}
                      </div>
                   </div>

                   {activeTab === "discover" && (
                     <button 
                      onClick={() => sendFriendRequest(item._id)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white"
                     >
                        <Plus size={14} />
                     </button>
                   )}
                </button>
              </div>
            );
         })
        ) : (
          <div className="py-20 text-center opacity-10">
             <Search size={28} className="mx-auto mb-4" />
             <p className="text-[9px] font-black uppercase tracking-widest">Empty Sector</p>
          </div>
        )}
      </div>

      <div className="p-4 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md">
         <div className="grid grid-cols-3 gap-2 mb-4">
            <Link to="/profile" className="flex flex-col items-center justify-center p-2 bg-white/[0.02] rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
               <UserCircle size={16} className="text-gray-600 group-hover:text-white transition-colors" />
               <span className="text-[7px] font-black uppercase tracking-widest mt-1 text-gray-700 group-hover:text-gray-500">Profile</span>
            </Link>
            <Link to="/settings" className="flex flex-col items-center justify-center p-2 bg-white/[0.02] rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
               <Settings size={16} className="text-gray-600 group-hover:text-white transition-colors" />
               <span className="text-[7px] font-black uppercase tracking-widest mt-1 text-gray-700 group-hover:text-gray-500">Config</span>
            </Link>
            <button onClick={logout} className="flex flex-col items-center justify-center p-2 bg-red-500/[0.02] rounded-xl border border-red-500/10 hover:bg-red-500/10 transition-all group">
               <LogOut size={16} className="text-red-900 group-hover:text-red-500 transition-colors" />
               <span className="text-[7px] font-black uppercase tracking-widest mt-1 text-red-900 group-hover:text-red-500">Exit</span>
            </button>
         </div>

         <div className="flex items-center gap-3 p-2.5 bg-white/5 rounded-xl border border-white/5">
            <img src={authUser?.profilePicture || "/avatar.png"} className="size-9 rounded-lg object-cover border border-white/10" alt="" />
            <div className="hidden lg:block flex-1 min-w-0">
               <p className="text-[10px] font-black text-white truncate uppercase tracking-tight">{authUser?.username}</p>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`size-1.5 rounded-full ${onlineUsers.includes(authUser?._id) ? "bg-green-500 animate-pulse" : "bg-gray-700"}`} />
                  <span className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-600">Verified Node</span>
               </div>
            </div>
         </div>
      </div>

      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-[#0f0f0f] w-full max-w-sm rounded-[2.5rem] border border-white/10 p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="font-black uppercase tracking-tighter text-xl">New Community</h3>
                 <button onClick={() => setShowCreateGroup(false)} className="p-2 hover:bg-white/5 rounded-xl"><X size={18} /></button>
              </div>
              <input 
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none" 
                placeholder="Name your sphere..." 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar">
                 {users.map(u => (
                    <div 
                     key={u._id} 
                     onClick={() => setSelectedMembers(prev => prev.includes(u._id) ? prev.filter(id => id !== u._id) : [...prev, u._id])}
                     className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                       selectedMembers.includes(u._id) ? "border-white/20 bg-white/10" : "bg-white/5 border-transparent"
                     }`}
                    >
                       <img src={u.profilePicture || "/avatar.png"} className="size-8 rounded-lg" />
                       <span className="text-xs font-bold">{u.username}</span>
                    </div>
                 ))}
              </div>
              <button onClick={handleCreateGroup} className="w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg" style={{ backgroundColor: themeColor, color: "#000" }}>Establish Sphere</button>
           </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
