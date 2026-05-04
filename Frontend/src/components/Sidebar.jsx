import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, MessageSquare, Settings, LogOut, Plus, Users as GroupsIcon, Search, UserCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { 
    getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading,
    getGroups, groups = [], selectedGroup, setSelectedGroup, isGroupsLoading,
    createGroup
  } = useChatStore();
  
  const { authUser, logout, onlineUsers = [] } = useAuthStore();
  const { themeColor } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState("chats");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

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

  const filteredItems = (activeTab === "chats" ? (users || []) : (groups || [])).filter(item => {
    const name = activeTab === "chats" ? item.username : item.name;
    return name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const isOnline = (userId) => onlineUsers.includes(userId);

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col bg-[#0a0a0a] border-r border-white/5 transition-all">
      
      {/* Brand Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-8">
           <div className="size-10 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-black/40" style={{ backgroundColor: themeColor }}>
              <MessageSquare size={20} fill="currentColor" />
           </div>
           <div className="hidden lg:block">
              <h1 className="text-lg font-black text-white uppercase tracking-tighter">Sphere</h1>
              <div className="h-1 w-6 rounded-full" style={{ backgroundColor: themeColor }} />
           </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/[0.03] rounded-xl mb-4 border border-white/5">
           <button 
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              activeTab === "chats" ? "bg-white/10 text-white shadow-xl" : "text-gray-500 hover:text-gray-300"
            }`}
           >
             <User size={12} />
             <span className="hidden lg:block">Personal</span>
           </button>
           <button 
            onClick={() => setActiveTab("groups")}
            className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              activeTab === "groups" ? "bg-white/10 text-white shadow-xl" : "text-gray-500 hover:text-gray-300"
            }`}
           >
             <GroupsIcon size={12} />
             <span className="hidden lg:block">Groups</span>
           </button>
        </div>

        {/* Search */}
        <div className="relative mb-2 hidden lg:block">
           <Search size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
           <input 
            type="text"
            placeholder="Search Sphere..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.01] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-[10px] focus:outline-none focus:border-white/10 transition-all placeholder:text-gray-800 font-bold"
           />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar py-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isSelected = activeTab === "chats" ? selectedUser?._id === item._id : selectedGroup?._id === item._id;
            const online = activeTab === "chats" ? isOnline(item._id) : false;

            return (
              <button
                 key={item._id}
                 onClick={() => activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item)}
                 className={`w-full p-2.5 flex items-center gap-4 rounded-xl transition-all relative group ${
                   isSelected ? "bg-white/5" : "hover:bg-white/[0.02]"
                 }`}
              >
                 {isSelected && <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full" style={{ backgroundColor: themeColor }} />}
                 
                 <div className="relative flex-shrink-0">
                   <div className={`size-11 rounded-xl overflow-hidden border transition-all ${isSelected ? "border-white/20 shadow-2xl" : "border-white/5"}`}>
                      {item.profilePicture || item.groupImage ? (
                        <img 
                          src={activeTab === "chats" ? item.profilePicture : item.groupImage} 
                          className="w-full h-full object-cover" 
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-white/5 items-center justify-center text-gray-500 ${item.profilePicture || item.groupImage ? "hidden" : "flex"}`}>
                        {activeTab === "chats" ? <UserCircle size={20} /> : <GroupsIcon size={18} />}
                      </div>
                   </div>
                   {online && <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full" />}
                 </div>

                 <div className="hidden lg:block flex-1 min-w-0 text-left">
                    <div className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                       {activeTab === "chats" ? item.username : item.name}
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-700 truncate mt-0.5">
                       {online ? "Active Now" : (activeTab === "chats" ? "Encrypted" : `${item.members?.length || 0} Members`)}
                    </div>
                 </div>
              </button>
            );
         })
        ) : (
          <div className="py-20 text-center opacity-10">
             <Search size={28} className="mx-auto mb-4" />
             <p className="text-[9px] font-black uppercase tracking-widest">Sphere is empty</p>
          </div>
        )}
      </div>

      {/* Footer Area */}
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
            <div className="size-9 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
               {authUser?.profilePicture ? (
                 <img src={authUser.profilePicture} className="w-full h-full object-cover" />
               ) : (
                 <UserCircle size={18} className="text-gray-500" />
               )}
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
               <p className="text-[10px] font-black text-white truncate uppercase tracking-tight">{authUser?.username}</p>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`size-1.5 rounded-full ${onlineUsers.includes(authUser?._id) ? "bg-green-500 animate-pulse" : "bg-gray-700"}`} />
                  <span className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-600">
                    {onlineUsers.includes(authUser?._id) ? "Online" : "Connecting..."}
                  </span>
               </div>
            </div>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
