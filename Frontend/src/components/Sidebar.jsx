import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { 
  Users, MessageSquare, Settings, LogOut, Plus, 
  Users as GroupsIcon, Search, Sparkles, Bell, 
  ShieldCheck, Zap, Layers, ChevronRight, X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { 
    getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading,
    getGroups, groups = [], selectedGroup, setSelectedGroup, isGroupsLoading,
    createGroup
  } = useChatStore();
  
  const { 
    getAllUsers, allUsers = [], getFriendRequests, friendRequests = [], 
    sendFriendRequest, respondToRequest
  } = useFriendStore();

  const { authUser, logout, onlineUsers = [] } = useAuthStore();
  const { themeColor } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    getUsers();
    getGroups();
    getFriendRequests();
  }, [getUsers, getGroups, getFriendRequests]);

  useEffect(() => {
    if (activeTab === "discover") getAllUsers();
  }, [activeTab, getAllUsers]);

  const isOnline = (userId) => onlineUsers.includes(userId);

  const getAvatarSrc = (item) => {
    const photo = activeTab === "groups" ? item.groupImage : item.profilePicture;
    if (photo) return photo;
    if (activeTab === "groups") return "/favicon.svg"; 
    const idNum = item._id ? item._id.charCodeAt(item._id.length - 1) : 0;
    return idNum % 2 === 0 ? `/boy_${(idNum % 5) + 1}.png?v=3` : `/girl_${(idNum % 4) + 1}.png?v=3`;
  };

  const filteredItems = (
    activeTab === "chats" ? (users || []) : 
    activeTab === "groups" ? (groups || []) : 
    (allUsers || [])
  ).filter(item => {
    const name = activeTab === "groups" ? item.name : item.username;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return toast.error("Group name required");
    await createGroup({ name: groupName, members: [] });
    setShowCreateGroup(false);
    setGroupName("");
  };

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col bg-[#050505] border-r border-white/[0.03] transition-all relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -left-24 size-48 blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: themeColor }} />

      {/* Identity Command Center */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
           <Link to="/profile" className="flex items-center gap-4 group">
              <div className="relative">
                 <div className="size-12 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-white/20 transition-all shadow-2xl relative z-10">
                    <img 
                      src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length-1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 4) + 1}.png?v=3`)} 
                      className="w-full h-full object-cover" 
                    />
                 </div>
                 <div className="absolute -inset-1 rounded-[1.2rem] blur-sm opacity-0 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: themeColor }} />
              </div>
              <div className="hidden lg:block">
                 <h2 className="text-xs font-black text-white uppercase tracking-tighter">System Core</h2>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-0.5">{authUser?.username}</p>
              </div>
           </Link>
           <div className="flex gap-2">
              <button onClick={() => setShowCreateGroup(true)} className="p-2.5 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl border border-white/5 transition-all text-gray-400 hover:text-white">
                 <Plus size={18} />
              </button>
           </div>
        </div>

        {/* Triple-Navigation Bar */}
        <div className="flex p-1 bg-white/[0.02] rounded-2xl border border-white/5 mb-6 relative z-10">
           {["chats", "groups", "discover"].map((tab) => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                activeTab === tab 
                ? "bg-white/[0.08] text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5" 
                : "text-gray-600 hover:text-gray-400"
              }`}
             >
               {tab === "chats" && <MessageSquare size={12} />}
               {tab === "groups" && <Layers size={12} />}
               {tab === "discover" && <Sparkles size={12} />}
               <span className="hidden lg:block">{tab}</span>
             </button>
           ))}
        </div>

        {/* Search Matrix */}
        <div className="relative group hidden lg:block mb-2">
           <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-white transition-colors" />
           <input 
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.01] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-[10px] focus:outline-none focus:border-white/10 transition-all placeholder:text-gray-800 font-bold tracking-widest uppercase"
           />
        </div>
      </div>

      {/* Dynamic Sector List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar py-2">
        {activeTab === "discover" && friendRequests.length > 0 && (
           <div className="mb-8 px-2 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                 <Zap size={12} className="text-red-500" />
                 <p className="text-[8px] font-black uppercase tracking-[0.3em] text-red-500">Signal Authorization Required</p>
              </div>
              {friendRequests.map(req => (
                <div key={req._id} className="p-4 bg-red-500/[0.03] border border-red-500/10 rounded-[1.5rem] flex items-center justify-between gap-4 animate-in fade-in slide-in-from-left-4">
                   <div className="size-10 rounded-xl overflow-hidden border border-red-500/20 shadow-lg">
                      <img 
                        src={req.sender?.profilePicture || (req.sender?._id?.charCodeAt(req.sender?._id.length-1) % 2 === 0 ? `/boy_${(req.sender?._id?.charCodeAt(req.sender?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(req.sender?._id?.charCodeAt(req.sender?._id.length-1) % 4) + 1}.png?v=3`)} 
                        className="w-full h-full object-cover" 
                      />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-white truncate uppercase tracking-tight">{req.sender?.username}</p>
                      <p className="text-[7px] font-bold text-red-900 uppercase mt-0.5">Incoming Request</p>
                   </div>
                   <div className="flex gap-1.5">
                      <button onClick={() => respondToRequest(req._id, "accepted")} className="p-2 bg-green-500 text-black rounded-xl hover:scale-110 active:scale-95 transition-all"><Plus size={12} strokeWidth={4} /></button>
                      <button onClick={() => respondToRequest(req._id, "rejected")} className="p-2 bg-white/5 text-white rounded-xl hover:scale-110 active:scale-95 transition-all"><X size={12} strokeWidth={4} /></button>
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
              <div key={item._id} className="relative">
                <button
                   onClick={() => activeTab === "discover" ? null : (activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item))}
                   className={`w-full p-3.5 flex items-center gap-4 rounded-2xl transition-all relative group ${
                     isSelected ? "bg-white/[0.04] shadow-2xl border border-white/5" : "hover:bg-white/[0.01]"
                   }`}
                >
                   {isSelected && (
                     <div className="absolute left-1 top-1/4 h-1/2 w-1 rounded-full blur-[2px]" style={{ backgroundColor: themeColor }} />
                   )}
                   
                   <div className="relative flex-shrink-0">
                     <div className={`size-12 rounded-[1.2rem] overflow-hidden border transition-all duration-500 ${
                       isSelected ? "border-white/20 scale-110 rotate-3 shadow-xl" : "border-white/5 group-hover:scale-105"
                     }`}>
                        <img 
                          src={getAvatarSrc(item)} 
                          className="w-full h-full object-cover" 
                        />
                     </div>
                     {online && (
                       <div className="absolute -bottom-1 -right-1 size-4 bg-[#050505] rounded-full p-0.5">
                          <div className="size-full bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                       </div>
                     )}
                   </div>

                   <div className="hidden lg:block flex-1 min-w-0 text-left">
                      <div className={`text-[11px] font-black uppercase tracking-tight truncate ${isSelected ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
                         {activeTab === "groups" ? item.name : item.username}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                         <div className={`size-1 rounded-full ${online ? "bg-green-500" : "bg-gray-800"}`} />
                         <span className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-700 truncate">
                            {activeTab === "discover" ? item.email : (online ? "Signal Active" : "Link Established")}
                         </span>
                      </div>
                   </div>

                   {activeTab === "discover" ? (
                     <button 
                      onClick={() => sendFriendRequest(item._id)} 
                      className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all group-hover:scale-110"
                      style={{ color: themeColor }}
                     >
                        <Plus size={16} strokeWidth={3} />
                     </button>
                   ) : (
                     <ChevronRight size={14} className={`text-gray-800 group-hover:text-gray-500 transition-all ${isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
                   )}
                </button>
              </div>
            );
         })
        ) : (
          <div className="py-32 text-center flex flex-col items-center opacity-20">
             <Layers size={40} className="mb-4 text-gray-800" />
             <p className="text-[9px] font-black uppercase tracking-[0.4em]">Sector Empty</p>
          </div>
        )}
      </div>

      {/* Status Matrix Footer */}
      <div className="p-6 mt-auto border-t border-white/[0.03] bg-black/60 backdrop-blur-2xl">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="size-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: themeColor }} />
               <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-600">Encrypted Connection</p>
            </div>
            <button 
              onClick={logout} 
              className="p-2 bg-red-500/[0.03] border border-red-500/10 rounded-xl text-red-900 hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
               <LogOut size={16} />
            </button>
         </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
           <div className="bg-[#0a0a0a] w-full max-w-sm rounded-[3rem] border border-white/10 p-10 space-y-8 shadow-[0_0_100px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between">
                 <h3 className="font-black uppercase tracking-tighter text-2xl">New Sphere</h3>
                 <button onClick={() => setShowCreateGroup(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-all"><X size={20} /></button>
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-2">Sphere Name</p>
                 <input 
                  className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:outline-none focus:border-white/10 transition-all" 
                  placeholder="Enter community name..." 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                 />
              </div>
              <button 
                onClick={handleCreateGroup} 
                className="w-full py-5 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-black" 
                style={{ backgroundColor: themeColor }}
              >
                Launch Sphere
              </button>
           </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
