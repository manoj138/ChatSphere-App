import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { 
  Users, MessageSquare, Settings, LogOut, Plus, 
  Search, Sparkles, Bell, Layers, CheckCheck, Filter, MoreVertical
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
    
    // Check if function exists before calling to prevent crash
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
    <aside className="h-full flex flex-col bg-[#0b0b0b] border-r border-white/5 transition-all w-full lg:w-[400px]">
      
      {/* Premium Sidebar Header */}
      <div className="bg-[#121212] p-4 flex items-center justify-between border-b border-white/5">
         <Link to="/profile" className="flex items-center gap-3 active:scale-95 transition-transform">
            <div className="size-10 rounded-full overflow-hidden border border-white/10 shadow-lg">
               <img 
                src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length-1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 4) + 1}.png?v=3`)} 
                className="w-full h-full object-cover" 
               />
            </div>
         </Link>
         
         <div className="flex items-center gap-4 text-gray-400">
            {friendRequests.length > 0 && (
              <button onClick={() => setActiveTab("discover")} className="relative p-1 hover:text-white transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-0 right-0 size-4 bg-red-500 text-[8px] font-black flex items-center justify-center rounded-full border-2 border-[#121212]">{friendRequests.length}</span>
              </button>
            )}
            <button className="hover:text-white transition-colors"><Layers size={20} /></button>
            <button className="hover:text-white transition-colors"><MessageSquare size={20} /></button>
            <button onClick={logout} className="hover:text-red-500 transition-colors"><LogOut size={20} /></button>
         </div>
      </div>

      {/* Search & Filter Area */}
      <div className="p-3 space-y-3">
         <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e1e1e] border-none rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none placeholder:text-gray-600 transition-all"
            />
         </div>

         {/* Tab Switcher - WhatsApp Web Style */}
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {["chats", "groups", "discover"].map((tab) => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                  activeTab === tab 
                  ? "bg-white/10 text-white border-white/20" 
                  : "bg-transparent text-gray-500 border-transparent hover:bg-white/5"
                }`}
               >
                 {tab}
               </button>
            ))}
            <button className="ml-auto text-gray-600 hover:text-white transition-colors"><Filter size={16} /></button>
         </div>
      </div>

      {/* WhatsApp Style List */}
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
                 className={`w-full p-4 flex items-center gap-4 transition-all relative ${
                   isSelected ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"
                 } border-b border-white/[0.02]`}
              >
                 <div className="relative flex-shrink-0">
                   <div className="size-14 rounded-full overflow-hidden border border-white/5 shadow-md">
                      <img src={getAvatarSrc(item)} className="w-full h-full object-cover" />
                   </div>
                   {online && (
                     <div className="absolute bottom-1 right-0 size-3.5 bg-green-500 border-2 border-[#0b0b0b] rounded-full" />
                   )}
                 </div>

                 <div className="flex-1 min-w-0 text-left py-1">
                    <div className="flex items-center justify-between mb-0.5">
                       <h3 className={`text-[15px] font-semibold truncate ${isSelected ? "text-white" : "text-gray-200"}`}>
                          {activeTab === "groups" ? item.name : item.username}
                       </h3>
                       <span className="text-[10px] text-gray-500 font-medium">
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
                         <div className="size-5 bg-green-500 text-[#0b0b0b] text-[9px] font-black rounded-full flex items-center justify-center ml-2 shadow-lg shadow-green-500/20">
                            1
                         </div>
                       )}
                    </div>
                 </div>

                 {activeTab === "discover" && (
                   <button onClick={() => sendFriendRequest(item._id)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white">
                      <Plus size={20} />
                   </button>
                 )}
              </button>
            );
         })
        ) : (
          <div className="py-20 text-center opacity-10">
             <MessageSquare size={48} className="mx-auto mb-4" />
             <p className="text-xs font-bold uppercase tracking-widest">No conversations found</p>
          </div>
        )}
      </div>

      {/* Signal Status Footer */}
      <div className="p-3 bg-[#121212] border-t border-white/5">
         <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">Secure Network: Active</span>
         </div>
      </div>

    </aside>
  );
};

export default Sidebar;
