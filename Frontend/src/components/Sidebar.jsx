import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { 
  MessageSquare, Settings, LogOut, Plus, 
  Search, Bell, Layers, CheckCheck, 
  CircleDashed, Users, UserPlus, Sparkles, ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { 
    getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading,
    getGroups, groups = [], selectedGroup, setSelectedGroup, isGroupsLoading,
    subscribeToEvents, unsubscribeFromEvents
  } = useChatStore();
  
  const { 
    getAllUsers, allUsers = [], getFriendRequests, friendRequests = [], 
    sendFriendRequest, respondToRequest
  } = useFriendStore();

  const { authUser, logout, onlineUsers = [] } = useAuthStore();
  const { themeColor } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
    getGroups();
    getFriendRequests();
    if (typeof subscribeToEvents === 'function') subscribeToEvents();
    return () => { if (typeof unsubscribeFromEvents === 'function') unsubscribeFromEvents(); };
  }, [getUsers, getGroups, getFriendRequests, subscribeToEvents, unsubscribeFromEvents]);

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

  const formatTime = (date) => {
    if (!date) return "";
    const msgDate = new Date(date);
    const now = new Date();
    if (msgDate.toDateString() === now.toDateString()) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
    <aside className="h-full flex bg-[#080808] border-r border-white/5 transition-all w-full lg:w-[420px] overflow-hidden select-none">
      
      {/* 1. Precise Vertical Navigation Strip */}
      <div className="w-[75px] bg-[#0c0c0c] flex flex-col items-center py-8 gap-10 border-r border-white/5 relative z-20">
         <div className="flex flex-col items-center gap-6 flex-1 w-full">
            {[
              { id: "chats", icon: MessageSquare, label: "Chats" },
              { id: "groups", icon: Users, label: "Groups" },
              { id: "discover", icon: UserPlus, label: "Find" }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative w-full flex justify-center py-2 transition-all duration-300 group ${
                  activeTab === tab.id ? "text-white" : "text-gray-600 hover:text-gray-400"
                }`}
              >
                 <tab.icon size={24} className={`${activeTab === tab.id ? "scale-110" : "scale-100 group-hover:scale-110"} transition-transform`} />
                 {activeTab === tab.id && (
                   <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full shadow-[0_0_15px_rgba(255,255,255,0.4)]" style={{ backgroundColor: themeColor }} />
                 )}
              </button>
            ))}
            <div className="h-[1px] w-8 bg-white/5 my-2" />
            <button className="text-gray-700 hover:text-gray-400 transition-all hover:scale-110"><CircleDashed size={24} /></button>
            <button className="text-gray-700 hover:text-gray-400 transition-all hover:scale-110"><Sparkles size={24} /></button>
         </div>

         <div className="flex flex-col items-center gap-8 w-full">
            <Link to="/settings" className="text-gray-700 hover:text-white transition-all hover:rotate-90 duration-500">
               <Settings size={24} />
            </Link>
            <Link to="/profile" className="mb-2 group relative flex justify-center w-full">
               <div className="size-11 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-white/20 transition-all p-0.5 shadow-2xl">
                  <img 
                    src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length-1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 4) + 1}.png?v=3`)} 
                    className="w-full h-full object-cover rounded-full" 
                  />
               </div>
               <div className="absolute -inset-1 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: themeColor }} />
            </Link>
         </div>
      </div>

      {/* 2. Main Identity List Section */}
      <div className="flex-1 flex flex-col bg-[#0e0e0e] relative overflow-hidden">
         {/* List Header */}
         <div className="p-7 flex items-center justify-between relative z-10">
            <div>
               <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{activeTab}</h1>
               <p className="text-[8px] font-bold text-gray-700 uppercase tracking-[0.4em] mt-1.5">Authorized Node: Active</p>
            </div>
            <button onClick={logout} className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl text-gray-500 hover:text-red-500 transition-all">
               <LogOut size={18} />
            </button>
         </div>

         {/* Search Bar - More Refined */}
         <div className="px-6 pb-6 relative z-10">
            <div className="relative group">
               <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-white transition-colors" />
               <input 
                 type="text"
                 placeholder={`SCAN ${activeTab}...`}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-14 pr-6 text-[10px] text-white focus:outline-none focus:bg-white/[0.04] focus:border-white/10 transition-all placeholder:text-gray-800 font-black tracking-[0.2em] uppercase"
               />
            </div>
         </div>

         {/* Refined Contacts List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            {filteredItems.length > 0 ? (
               filteredItems.map((item) => {
                  const isSelected = activeTab === "chats" ? selectedUser?._id === item._id : selectedGroup?._id === item._id;
                  const online = activeTab === "chats" ? isOnline(item._id) : false;
                  const lastMsg = item.lastMessage;

                  return (
                     <button
                        key={item._id}
                        onClick={() => activeTab === "discover" ? null : (activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item))}
                        className={`w-full px-6 py-4 flex items-center gap-4 transition-all duration-300 relative group ${
                        isSelected ? "bg-white/[0.06]" : "hover:bg-white/[0.02]"
                        }`}
                     >
                        <div className="relative flex-shrink-0">
                           <div className={`size-14 rounded-2xl overflow-hidden border transition-all duration-500 ${
                              isSelected ? "border-white/20 scale-105" : "border-white/5"
                           }`}>
                              <img src={getAvatarSrc(item)} className="w-full h-full object-cover" />
                           </div>
                           {online && (
                              <div className="absolute -bottom-1 -right-1 size-4 bg-[#0e0e0e] rounded-full p-0.5">
                                 <div className="size-full bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                              </div>
                           )}
                        </div>

                        <div className="flex-1 min-w-0 text-left">
                           <div className="flex items-center justify-between mb-1">
                              <h3 className={`text-[13px] font-black uppercase tracking-tight truncate ${isSelected ? "text-white" : "text-gray-200"}`}>
                                 {activeTab === "groups" ? item.name : item.username}
                              </h3>
                              <span className="text-[9px] text-gray-700 font-black uppercase tracking-widest ml-2">
                                 {formatTime(lastMsg?.createdAt)}
                              </span>
                           </div>
                           
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                 {activeTab === "chats" && lastMsg && lastMsg.senderId === authUser?._id && (
                                    <CheckCheck size={14} className={lastMsg.isSeen ? "text-blue-500" : "text-gray-800"} />
                                 )}
                                 <p className={`text-[11px] truncate leading-tight ${isSelected ? "text-gray-400" : (lastMsg?.isSeen === false && lastMsg?.senderId !== authUser?._id ? "text-white font-black" : "text-gray-600")}`}>
                                    {activeTab === "groups" && lastMsg && (
                                       <span className="font-black text-gray-500 mr-1">{lastMsg.senderName}:</span>
                                    )}
                                    {lastMsg?.image ? "Received Image" : (lastMsg?.text || "Establish Signal...")}
                                 </p>
                              </div>
                              {lastMsg?.isSeen === false && lastMsg?.senderId !== authUser?._id && (
                                 <div className="size-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)] ml-2" style={{ backgroundColor: themeColor }} />
                              )}
                           </div>
                        </div>
                     </button>
                  );
               })
            ) : (
               <div className="py-32 text-center opacity-10 flex flex-col items-center">
                  <Layers size={48} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Data Nodes</p>
               </div>
            )}
         </div>
      </div>

    </aside>
  );
};

export default Sidebar;
