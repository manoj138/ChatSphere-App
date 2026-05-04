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
    return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    <aside className="h-full flex bg-[#080808] border-r border-white/5 transition-all w-full lg:w-[420px] overflow-hidden select-none font-sans">

      {/* 1. Exact Vertical Strip from Photo */}
      <div className="w-[70px] bg-[#080808] flex flex-col items-center py-6 gap-8 border-r border-white/5 relative z-20">
        <div className="flex flex-col items-center gap-8 flex-1 w-full">
          {/* Active Icon with Background like Photo */}
          <button
            onClick={() => setActiveTab("chats")}
            className={`p-3 rounded-xl transition-all ${activeTab === "chats" ? "bg-white/[0.08] text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            <MessageSquare size={22} fill={activeTab === "chats" ? "currentColor" : "none"} />
          </button>
          <button onClick={() => setActiveTab("groups")} className={`p-1 transition-all ${activeTab === "groups" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}>
            <Users size={22} />
          </button>
          <button onClick={() => setActiveTab("discover")} className={`p-1 transition-all ${activeTab === "discover" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}>
            <UserPlus size={22} />
          </button>
          <div className="h-[1px] w-8 bg-white/5" />
          <button className="text-gray-700 hover:text-gray-300 transition-all"><CircleDashed size={22} /></button>
          <button className="text-gray-700 hover:text-gray-300 transition-all"><Sparkles size={22} /></button>
        </div>

        <div className="flex flex-col items-center gap-8 w-full">
          <Link to="/settings" className="text-gray-700 hover:text-white transition-all">
            <Settings size={22} />
          </Link>
          <Link to="/profile" className="mb-2">
            <div className="size-10 rounded-full overflow-hidden border border-white/10 shadow-lg">
              <img
                src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length - 1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 4) + 1}.png?v=3`)}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* 2. Chat List Area matching Photo */}
      <div className="flex-1 flex flex-col bg-[#080808]">

        {/* Minimalist Header */}
        <div className="p-6 pb-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">CHATS</h1>
            <p className="text-[8px] font-bold text-gray-700 uppercase tracking-[0.4em] mt-1">AUTHORIZED NODE: ACTIVE</p>
          </div>
          <button onClick={logout} className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-gray-500 hover:text-red-500 transition-all active:scale-90">
            <LogOut size={18} />
          </button>
        </div>

        {/* Search Pill */}
        <div className="px-6 py-4">
          <div className="relative group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
            <input
              type="text"
              placeholder="SCAN CHATS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-full py-2 pl-10 pr-4 text-[9px] text-white focus:outline-none placeholder:text-gray-800 font-black tracking-widest uppercase"
            />
          </div>
        </div>

        {/* Contact Items - Exact Match to Photo */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isSelected = activeTab === "chats" ? selectedUser?._id === item._id : selectedGroup?._id === item._id;
              const online = activeTab === "chats" ? isOnline(item._id) : false;
              const lastMsg = item.lastMessage;

              return (
                <button
                  key={item._id}
                  onClick={() => activeTab === "discover" ? null : (activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item))}
                  className={`w-full px-6 py-3 flex items-center gap-4 transition-all relative ${isSelected ? "bg-white/[0.03]" : "hover:bg-white/[0.01]"
                    }`}
                >
                  {/* Avatar Square Rounded like Photo */}
                  <div className="relative flex-shrink-0">
                    <div className="size-14 rounded-[1.2rem] overflow-hidden border border-white/5 shadow-xl">
                      <img src={getAvatarSrc(item)} className="w-full h-full object-cover" />
                    </div>
                    {online && (
                      <div className="absolute -bottom-0.5 -right-0.5 size-4 bg-[#080808] rounded-full p-0.5">
                        <div className="size-full bg-green-500 rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Name & Message logic like Photo */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-[13px] font-black uppercase text-white tracking-tight truncate">
                        {activeTab === "groups" ? item.name : item.username}
                      </h3>
                      <span className="text-[9px] text-gray-700 font-black uppercase tracking-widest ml-2">
                        {formatTime(lastMsg?.createdAt) || "09:59 AM"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeTab === "chats" && (
                        <CheckCheck size={14} className={lastMsg?.isSeen ? "text-blue-500" : "text-blue-500"} />
                      )}
                      <p className="text-[11px] truncate text-gray-600 font-medium">
                        {lastMsg?.text || "Establish Signal... 😊"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-20 text-center opacity-5">
              <MessageSquare size={40} className="mx-auto" />
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
