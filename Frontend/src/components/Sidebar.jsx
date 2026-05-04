import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { 
  MessageSquare, Settings, LogOut, Plus, 
  Search, Bell, Layers, CheckCheck, Filter, 
  CircleDashed, Users, UserPlus, Trash2
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
    
    if (typeof subscribeToEvents === 'function') {
        subscribeToEvents();
    }
    
    return () => {
        if (typeof unsubscribeFromEvents === 'function') {
            unsubscribeFromEvents();
        }
    };
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
    <aside className="h-full flex bg-[#0c0c0c] border-r border-white/5 transition-all w-full lg:w-[460px] overflow-hidden">
      
      {/* 1. Far Left Vertical Navigation Bar (The Strip) */}
      <div className="w-[60px] bg-[#1a1a1a] flex flex-col items-center py-6 gap-6 border-r border-white/5">
         <div className="flex flex-col items-center gap-6 flex-1">
            <button 
              onClick={() => setActiveTab("chats")}
              className={`p-3 rounded-xl transition-all ${activeTab === "chats" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
               <MessageSquare size={22} />
            </button>
            <button 
              onClick={() => setActiveTab("groups")}
              className={`p-3 rounded-xl transition-all ${activeTab === "groups" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
               <Users size={22} />
            </button>
            <button 
              onClick={() => setActiveTab("discover")}
              className={`p-3 rounded-xl transition-all ${activeTab === "discover" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
               <UserPlus size={22} />
            </button>
            <div className="h-[1px] w-8 bg-white/5" />
            <button className="p-3 text-gray-500 hover:text-gray-300 transition-all"><CircleDashed size={22} /></button>
            <button className="p-3 text-gray-500 hover:text-gray-300 transition-all"><Layers size={22} /></button>
         </div>

         <div className="flex flex-col items-center gap-6">
            {friendRequests.length > 0 && (
              <button onClick={() => setActiveTab("discover")} className="relative p-3 text-gray-500 hover:text-white transition-colors">
                 <Bell size={22} />
                 <span className="absolute top-2 right-2 size-4 bg-red-500 text-[8px] font-black flex items-center justify-center rounded-full border-2 border-[#1a1a1a]">{friendRequests.length}</span>
              </button>
            )}
            <Link to="/settings" className="p-3 text-gray-500 hover:text-white transition-colors">
               <Settings size={22} />
            </Link>
            <Link to="/profile" className="mb-2">
               <div className="size-9 rounded-full overflow-hidden border border-white/10 shadow-lg active:scale-90 transition-transform">
                  <img 
                    src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length-1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 4) + 1}.png?v=3`)} 
                    className="w-full h-full object-cover" 
                  />
               </div>
            </Link>
         </div>
      </div>

      {/* 2. Main Chat List Area */}
      <div className="flex-1 flex flex-col bg-[#121212]">
         
         {/* List Header */}
         <div className="p-4 flex items-center justify-between border-b border-white/5">
            <h1 className="text-xl font-bold text-white capitalize">{activeTab}</h1>
            <div className="flex gap-4">
               <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><LogOut size={18} /></button>
            </div>
         </div>

         {/* Search Area */}
         <div className="p-3">
            <div className="relative group">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
               <input 
                 type="text"
                 placeholder="Search or start new chat"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-[#1e1e1e] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none placeholder:text-gray-600"
               />
            </div>
         </div>

         {/* Contacts List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredItems.length > 0 ? (
               filteredItems.map((item) => {
                  const isSelected = activeTab === "chats" ? selectedUser?._id === item._id : selectedGroup?._id === item._id;
                  const online = activeTab === "chats" ? isOnline(item._id) : false;
                  const lastMsg = item.lastMessage;

                  return (
                     <button
                        key={item._id}
                        onClick={() => activeTab === "discover" ? null : (activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item))}
                        className={`w-full p-3.5 flex items-center gap-4 transition-all relative ${
                        isSelected ? "bg-white/[0.07]" : "hover:bg-white/[0.03]"
                        } border-b border-white/[0.02]`}
                     >
                        <div className="relative flex-shrink-0">
                        <div className="size-12 rounded-full overflow-hidden border border-white/5">
                           <img src={getAvatarSrc(item)} className="w-full h-full object-cover" />
                        </div>
                        {online && (
                           <div className="absolute bottom-0 right-0.5 size-3 bg-green-500 border-2 border-[#121212] rounded-full" />
                        )}
                        </div>

                        <div className="flex-1 min-w-0 text-left py-1">
                           <div className="flex items-center justify-between mb-0.5">
                              <h3 className={`text-[14px] font-semibold truncate ${isSelected ? "text-white" : "text-gray-200"}`}>
                                 {activeTab === "groups" ? item.name : item.username}
                              </h3>
                              <span className="text-[10px] text-gray-500">
                                 {formatTime(lastMsg?.createdAt)}
                              </span>
                           </div>
                           
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                 {activeTab === "chats" && lastMsg && lastMsg.senderId === authUser?._id && (
                                    <CheckCheck size={14} className={lastMsg.isSeen ? "text-blue-500" : "text-gray-600"} />
                                 )}
                                 <p className={`text-[13px] truncate ${isSelected ? "text-gray-400" : (lastMsg?.isSeen === false && lastMsg?.senderId !== authUser?._id ? "text-white font-bold" : "text-gray-500")}`}>
                                    {activeTab === "groups" && lastMsg && (
                                       <span className="font-bold text-gray-400 mr-1">{lastMsg.senderName}:</span>
                                    )}
                                    {lastMsg?.image ? "Photo" : (lastMsg?.text || "Start a conversation")}
                                 </p>
                              </div>
                              {lastMsg?.isSeen === false && lastMsg?.senderId !== authUser?._id && (
                                 <div className="size-5 bg-green-500 text-black text-[9px] font-black rounded-full flex items-center justify-center ml-2">
                                    1
                                 </div>
                              )}
                           </div>
                        </div>
                     </button>
                  );
               })
            ) : (
               <div className="py-20 text-center opacity-10">
                  <MessageSquare size={48} className="mx-auto mb-4" />
                  <p className="text-xs font-bold">No results found</p>
               </div>
            )}
         </div>
      </div>

    </aside>
  );
};

export default Sidebar;
