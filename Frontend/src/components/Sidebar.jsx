import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, MessageSquare, Settings, LogOut, Plus, Users as GroupsIcon, Search, UserCircle, User, Sparkles, Bell, X, ShieldCheck } from "lucide-react";
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
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

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
    return idNum % 2 === 0 ? "/avatar_boy.png?v=3" : "/avatar_girl.png?v=3";
  };

  const filteredItems = (
    activeTab === "chats" ? (users || []) : 
    activeTab === "groups" ? (groups || []) : 
    (allUsers || [])
  ).filter(item => {
    const name = activeTab === "groups" ? item.name : item.username;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col bg-[#0a0a0a] border-r border-white/5 transition-all">
      
      {/* Interactive Top Header - Direct Profile Access */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-8">
           <Link to="/profile" className="flex items-center gap-3 group transition-transform active:scale-95">
              <div className="size-11 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-white/20 transition-all">
                 <img 
                  src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length-1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 4) + 1}.png?v=3`)} 
                  className="w-full h-full object-cover" 
                 />
              </div>
              <div className="hidden lg:block">
                 <p className="text-[10px] font-black text-white uppercase tracking-tighter group-hover:text-gray-300">Identity Center</p>
                 <div className="flex items-center gap-1.5">
                    <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{authUser?.username}</span>
                 </div>
              </div>
           </Link>
           <div className="flex items-center gap-2">
             {friendRequests.length > 0 && (
               <div className="relative cursor-pointer" onClick={() => setActiveTab("discover")}>
                  <Bell size={18} className="text-gray-500 hover:text-white transition-colors" />
                  <span className="absolute -top-1 -right-1 size-3.5 bg-red-500 text-[7px] font-black flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                     {friendRequests.length}
                  </span>
               </div>
             )}
             <Link to="/settings" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-gray-500 hover:text-white">
                <Settings size={18} />
             </Link>
           </div>
        </div>

        <div className="flex p-1 bg-white/[0.03] rounded-xl mb-4 border border-white/5">
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
            placeholder={`Search Sphere...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.01] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-[10px] focus:outline-none focus:border-white/10 transition-all placeholder:text-gray-800 font-bold"
           />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar py-4">
        {activeTab === "discover" && friendRequests.length > 0 && (
           <div className="mb-6 space-y-2">
              <p className="px-3 text-[8px] font-black uppercase tracking-[0.2em] text-red-500">Awaiting Signal</p>
              {friendRequests.map(req => (
                <div key={req._id} className="p-3 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in zoom-in-95">
                   <div className="size-8 rounded-lg overflow-hidden border border-red-500/20">
                      <img 
                        src={req.sender?.profilePicture || (req.sender?._id?.charCodeAt(req.sender?._id.length-1) % 2 === 0 ? `/boy_${(req.sender?._id?.charCodeAt(req.sender?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(req.sender?._id?.charCodeAt(req.sender?._id.length-1) % 4) + 1}.png?v=3`)} 
                        className="w-full h-full object-cover" 
                      />
                   </div>
                   <p className="flex-1 text-[10px] font-black text-white truncate uppercase">{req.sender?.username}</p>
                   <div className="flex gap-1">
                      <button onClick={() => respondToRequest(req._id, "accepted")} className="p-1.5 bg-green-500 text-black rounded-lg hover:scale-110"><Plus size={10} strokeWidth={4} /></button>
                      <button onClick={() => respondToRequest(req._id, "rejected")} className="p-1.5 bg-white/10 text-white rounded-lg hover:scale-110"><X size={10} strokeWidth={4} /></button>
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
              <button
                 key={item._id}
                 onClick={() => activeTab === "discover" ? null : (activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item))}
                 className={`w-full p-2.5 flex items-center gap-4 rounded-xl transition-all relative group ${isSelected ? "bg-white/5" : "hover:bg-white/[0.02]"}`}
              >
                 {isSelected && <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full" style={{ backgroundColor: themeColor }} />}
                 
                 <div className="relative flex-shrink-0">
                   <div className={`size-11 rounded-xl overflow-hidden border transition-all ${isSelected ? "border-white/20 shadow-2xl" : "border-white/5"}`}>
                      <img 
                        src={activeTab === "groups" ? (item.groupImage || "/favicon.svg") : (item.profilePicture || (item?._id?.charCodeAt(item?._id.length-1) % 2 === 0 ? `/boy_${(item?._id?.charCodeAt(item?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(item?._id?.charCodeAt(item?._id.length-1) % 4) + 1}.png?v=3`))} 
                        className="w-full h-full object-cover" 
                      />
                   </div>
                   {online && <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full" />}
                 </div>

                 <div className="hidden lg:block flex-1 min-w-0 text-left">
                    <div className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                       {activeTab === "groups" ? item.name : item.username}
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-700 truncate mt-0.5">
                       {activeTab === "discover" ? item.email : (online ? "Pulse Active" : "Encrypted")}
                    </div>
                 </div>

                 {activeTab === "discover" && (
                   <button onClick={() => sendFriendRequest(item._id)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"><Plus size={14} /></button>
                 )}
              </button>
            );
         })
        ) : (
          <div className="py-20 text-center opacity-10">
             <Search size={28} className="mx-auto mb-4" />
             <p className="text-[9px] font-black uppercase tracking-widest">No nodes found</p>
          </div>
        )}
      </div>

      {/* Compact Status Footer */}
      <div className="p-6 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <ShieldCheck size={14} style={{ color: themeColor }} />
               <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Secure Node</span>
            </div>
            <button onClick={logout} className="text-[8px] font-black uppercase tracking-widest text-red-900 hover:text-red-500 transition-colors">
               Disconnect
            </button>
         </div>
      </div>

    </aside>
  );
};

export default Sidebar;
