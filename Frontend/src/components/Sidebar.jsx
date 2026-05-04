import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, MessageSquare, Settings, LogOut, Plus, Users as GroupsIcon, ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { 
    getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading,
    getGroups, groups = [], selectedGroup, setSelectedGroup, isGroupsLoading,
    createGroup
  } = useChatStore();
  
  const { authUser, logout } = useAuthStore();
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

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col bg-[#0a0a0a] transition-all border-r border-white/5">
      {/* Brand & Stats */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl flex items-center justify-center text-black shadow-lg" style={{ backgroundColor: themeColor }}>
                 <MessageSquare size={22} fill="currentColor" />
              </div>
              <h1 className="text-xl font-black text-white uppercase tracking-tighter hidden lg:block">Sphere</h1>
           </div>
           <Link to="/settings" className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white">
              <Settings size={20} />
           </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/5 rounded-2xl mb-4">
           <button 
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              activeTab === "chats" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
           >
             <Users size={14} />
             <span className="hidden lg:block">Chats</span>
           </button>
           <button 
            onClick={() => setActiveTab("groups")}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              activeTab === "groups" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
           >
             <GroupsIcon size={14} />
             <span className="hidden lg:block">Groups</span>
           </button>
        </div>

        {/* Search */}
        <div className="relative mb-2">
           <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
           <input 
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-white/10 transition-all placeholder:text-gray-700 font-bold"
           />
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar pb-6">
        <div className="flex items-center justify-between px-3 py-2">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
              {activeTab === "chats" ? `Contacts (${users?.length || 0})` : `Groups (${groups?.length || 0})`}
           </span>
           {activeTab === "groups" && (
             <button onClick={() => setShowCreateGroup(true)} className="p-1.5 hover:bg-white/5 rounded-lg text-accent" style={{ color: themeColor }}>
               <Plus size={16} />
             </button>
           )}
        </div>

        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isSelected = activeTab === "chats" ? selectedUser?._id === item._id : selectedGroup?._id === item._id;
            return (
              <button
                 key={item._id}
                 onClick={() => activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item)}
                 className={`w-full p-3 flex items-center gap-4 rounded-2xl transition-all relative group ${
                   isSelected ? "bg-white/5" : "hover:bg-white/[0.02]"
                 }`}
              >
                 {isSelected && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" style={{ backgroundColor: themeColor }} />}
                 
                 <div className="relative flex-shrink-0">
                   <div className={`size-11 rounded-2xl overflow-hidden border transition-all ${isSelected ? "border-white/20 shadow-lg shadow-white/5" : "border-white/5"}`}>
                      {activeTab === "chats" ? (
                        <img src={item.profilePicture || "/avatar.png"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500">
                          {item.groupImage ? <img src={item.groupImage} className="w-full h-full object-cover" /> : <GroupsIcon size={18} />}
                        </div>
                      )}
                   </div>
                   {activeTab === "chats" && <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full" />}
                 </div>

                 <div className="hidden lg:block flex-1 min-w-0 text-left">
                    <div className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
                       {activeTab === "chats" ? item.username : item.name}
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-gray-600 truncate mt-0.5">
                       {activeTab === "chats" ? "End-to-End Encrypted" : `${item.members?.length || 0} Members`}
                    </div>
                 </div>
              </button>
            );
         })
        ) : (
          <div className="py-10 text-center space-y-3 opacity-20">
             <Search size={24} className="mx-auto" />
             <p className="text-[9px] font-black uppercase tracking-widest">No results found</p>
          </div>
        )}
      </div>

      {/* Footer Profile */}
      <div className="p-4 mt-auto border-t border-white/5 bg-black/20">
         <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
            <img src={authUser?.profilePicture || "/avatar.png"} className="size-9 rounded-xl object-cover border border-white/10" alt="" />
            <div className="hidden lg:block flex-1 min-w-0">
               <p className="text-xs font-black text-white truncate uppercase tracking-tight">{authUser?.username}</p>
               <button onClick={logout} className="text-[9px] font-black uppercase text-red-500 hover:text-red-400 tracking-[0.2em] mt-0.5">Logout Session</button>
            </div>
            <Link to="/profile" className="p-2 hover:bg-white/10 rounded-xl text-gray-500 transition-colors hidden lg:block">
               <Settings size={16} />
            </Link>
         </div>
      </div>

      {/* Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-[#0f0f0f] w-full max-w-sm rounded-[2.5rem] border border-white/10 shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="font-black uppercase tracking-tighter text-xl">New Group</h3>
                 <button onClick={() => setShowCreateGroup(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors"><X size={20} /></button>
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
                       selectedMembers.includes(u._id) ? "border-[#bef264]/40 bg-[#bef264]/10" : "bg-white/5 border-transparent"
                     }`}
                    >
                       <img src={u.profilePicture || "/avatar.png"} className="size-8 rounded-lg" />
                       <span className="text-xs font-bold">{u.username}</span>
                    </div>
                 ))}
              </div>
              <button 
               onClick={handleCreateGroup}
               className="w-full py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg active:scale-95 transition-all"
               style={{ backgroundColor: themeColor, color: "#000" }}
              >
                Create Community
              </button>
           </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
