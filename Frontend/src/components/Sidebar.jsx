import { useEffect, useState, memo, useMemo } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useFriend } from "../context/FriendContext";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import {
  MessageSquare, Settings, LogOut, Plus,
  Search, CheckCheck, Users, UserPlus, Sun, Moon
} from "lucide-react";
import { Link } from "react-router-dom";
import CreateGroupModal from "./CreateGroupModal";
import ConfirmationModal from "./ConfirmationModal";

const SidebarItem = memo(({ 
  item, 
  activeTab, 
  isSelected, 
  online, 
  themeColor, 
  isLightMode,
  setSelectedUser, 
  setSelectedGroup
}) => {
  const getAvatarSrc = () => {
    let photo;
    if (activeTab === "groups") photo = item.groupImage;
    else if (activeTab === "requests") photo = item.requestType === "incoming" ? item.sender?.profilePicture : item.receiver?.profilePicture;
    else photo = item.profilePicture;

    if (photo) return photo;
    if (activeTab === "groups") return "/favicon.svg";
    
    const userItem = activeTab === "requests" ? (item.requestType === "incoming" ? item.sender : item.receiver) : item;
    const idNum = userItem?._id ? userItem._id.charCodeAt(userItem._id.length - 1) : 0;
    return idNum % 2 === 0 ? `/boy_${(idNum % 5) + 1}.png?v=3` : `/girl_${(idNum % 4) + 1}.png?v=3`;
  };

  const formatTime = (date) => {
    if (!date) return "";
    const msgDate = new Date(date);
    return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const lastMsg = item.lastMessage;

  return (
    <button
      onClick={() => {
        if (activeTab === "discover" || activeTab === "requests") return;
        activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item);
      }}
      className={`relative flex w-full items-center gap-3 px-4 py-3.5 transition-all active:scale-[0.98] sm:gap-4 sm:px-6 ${
        isSelected 
          ? (isLightMode ? "bg-black/5 shadow-sm ring-1 ring-black/5" : "bg-white/10 shadow-md ring-1 ring-white/10") 
          : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className={`size-12 overflow-hidden rounded-2xl bg-white shadow-lg transition-all ${isSelected ? "ring-2 ring-accent ring-offset-2 scale-105" : "ring-1 ring-black/5"}`}>
          <img src={getAvatarSrc()} loading="lazy" className="size-full object-cover" />
        </div>
        {online && (
          <div className="absolute -bottom-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-white shadow-md">
            <div className="size-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className={`truncate text-sm font-bold tracking-tight text-primary`}>
            {activeTab === "groups" ? item.name : (activeTab === "requests" ? (item.requestType === "incoming" ? item.sender?.username : item.receiver?.username) : item.username)}
          </h3>
          {activeTab !== "discover" && activeTab !== "requests" && (
            <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                {formatTime(lastMsg?.createdAt) || "NEW"}
              </span>
              {item.unreadCount > 0 && (
                <span 
                  className="flex size-4.5 items-center justify-center rounded-lg text-[9px] font-bold text-black shadow-md"
                  style={{ backgroundColor: themeColor }}
                >
                  {item.unreadCount}
                </span>
              )}
            </div>
          )}
          {activeTab === "requests" && (
            <span className={`rounded-lg px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${item.requestType === "incoming" ? "bg-blue-500/10 text-blue-500" : "bg-orange-500/10 text-orange-500"}`}>
              {item.requestType}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-1.5 min-w-0">
            {activeTab === "chats" && lastMsg && (
              <CheckCheck size={13} className={lastMsg?.isSeen ? "text-accent" : "text-gray-300"} strokeWidth={3} />
            )}
            <p className={`truncate text-[12px] font-medium text-gray-400`}>
              {activeTab === "discover" ? (item.email || "Available to chat") : (activeTab === "requests" ? (item.requestType === "incoming" ? (item.sender?.email || "Wants to connect") : (item.receiver?.email || "Request sent")) : (lastMsg ? (activeTab === "groups" ? `${lastMsg.senderName || "Someone"}: ${lastMsg.text}` : lastMsg.text) : "Ready for connection"))}
            </p>
          </div>
        </div>
      </div>
      {isSelected && activeTab !== "discover" && activeTab !== "requests" && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full shadow-lg" style={{ backgroundColor: themeColor }} />
      )}
    </button>
  );
});

const Sidebar = () => {
  const {
    getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading,
    getGroups, groups = [], selectedGroup, setSelectedGroup, isGroupsLoading,
  } = useChat();

  const {
    getAllUsers, allUsers = [], getFriendRequests, friendRequests = []
  } = useFriend();

  const { authUser, logout, onlineUsers = [] } = useAuth();
  const { themeColor, isLightMode, toggleThemeMode } = useTheme();

  const [activeTab, setActiveTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (authUser) {
      getUsers();
    getGroups();
    getFriendRequests();
    }
  }, [getUsers, getGroups, getFriendRequests, authUser]);

  useEffect(() => {
    if (activeTab === "discover") getAllUsers();
  }, [activeTab, getAllUsers]);

  const isOnline = (userId) => onlineUsers.includes(userId);

  const filteredItems = useMemo(() => {
    const items = (
      activeTab === "chats" ? (users || []) :
      activeTab === "groups" ? (groups || []) :
      activeTab === "requests" ? [
        ...(friendRequests?.incoming || []).map(r => ({ ...r, requestType: "incoming" })),
        ...(friendRequests?.outgoing || []).map(r => ({ ...r, requestType: "outgoing" }))
      ] :
      (allUsers || [])
    );
    return items.filter((item) => {
      const name = activeTab === "groups" ? item.name : 
                   (activeTab === "requests" ? (item.requestType === "incoming" ? item.sender?.username : item.receiver?.username) : item.username);
      return name?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [activeTab, users, groups, friendRequests, allUsers, searchQuery]);

  const hasUnreadChats = (users || []).some(u => u.unreadCount > 0);
  const hasUnreadGroups = (groups || []).some(g => g.unreadCount > 0);
  const totalRequests = (friendRequests?.incoming?.length || 0);

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="glass-panel relative flex h-[100dvh] w-full overflow-hidden font-sans transition-all duration-500 select-none lg:h-full lg:w-[380px] xl:w-[420px]">

      {/* Desktop Navigation Strip */}
      <div className={`relative z-20 hidden h-full w-[76px] flex-col items-center gap-6 border-r transition-all duration-500 ${isLightMode ? "border-black/5 bg-white/40 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]" : "border-white/10 bg-black/20"} py-6 lg:flex`}>
        <div className="absolute inset-x-3 top-3 h-20 rounded-2xl opacity-20 blur-3xl" style={{ backgroundColor: themeColor }} />
        <div className="flex flex-col items-center gap-6 flex-1 w-full">
          <button
            onClick={() => setActiveTab("chats")}
            className={`group relative rounded-xl p-3 transition-all hover:scale-110 active:scale-95 ${activeTab === "chats" ? "bg-accent text-black shadow-2xl" : "text-gray-400 hover:text-accent"}`}
          >
            <MessageSquare size={22} fill={activeTab === "chats" ? "currentColor" : "none"} />
            {hasUnreadChats && activeTab !== "chats" && (
              <div className="absolute right-2 top-2 size-2.5 rounded-full ring-2 ring-white animate-pulse" style={{ backgroundColor: themeColor }} />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("groups")} 
            className={`group relative rounded-xl p-3 transition-all hover:scale-110 active:scale-95 ${activeTab === "groups" ? "bg-accent text-black shadow-2xl" : "text-gray-400 hover:text-accent"}`}
          >
            <Users size={22} fill={activeTab === "groups" ? "currentColor" : "none"} />
            {hasUnreadGroups && activeTab !== "groups" && (
              <div className="absolute right-2 top-2 size-2.5 rounded-full ring-2 ring-white animate-pulse" style={{ backgroundColor: themeColor }} />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("discover")} 
            className={`group rounded-xl p-3 transition-all hover:scale-110 active:scale-95 ${activeTab === "discover" ? "bg-accent text-black shadow-2xl" : "text-gray-400 hover:text-accent"}`}
          >
            <Search size={22} />
          </button>
          <button 
            onClick={() => setActiveTab("requests")} 
            className={`group relative rounded-xl p-3 transition-all hover:scale-110 active:scale-95 ${activeTab === "requests" ? "bg-accent text-black shadow-2xl" : "text-gray-400 hover:text-accent"}`}
          >
            <UserPlus size={22} />
            {totalRequests > 0 && (
              <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-lg bg-red-500 text-[9px] font-black text-white ring-2 ring-white shadow-xl">
                {totalRequests}
              </div>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center gap-5 w-full">
          <button
            onClick={toggleThemeMode}
            className={`rounded-xl p-3 transition-all hover:shadow-2xl active:scale-95 ${isLightMode ? "text-gray-400 hover:bg-white hover:text-accent" : "text-primary/60 hover:bg-accent/10 hover:text-accent"}`}
          >
            {isLightMode ? <Moon size={22} /> : <Sun size={22} />}
          </button>
          <Link to="/settings" className={`rounded-xl p-3 transition-all hover:shadow-2xl active:scale-95 ${isLightMode ? "text-gray-400 hover:bg-white hover:text-accent" : "text-primary/60 hover:bg-accent/10 hover:text-accent"}`}>
            <Settings size={22} />
          </Link>
          <Link to="/profile" className="mb-4">
            <div className="group size-11 overflow-hidden rounded-2xl bg-white shadow-2xl transition-all hover:scale-110 ring-2 ring-white">
              <img
                src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length - 1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 4) + 1}.png?v=3`)}
                className="size-full object-cover"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex flex-1 flex-col bg-transparent">
        <div className="sticky top-0 z-20 bg-white/60 px-5 pb-5 pt-5 backdrop-blur-3xl lg:hidden">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-primary">
                  {activeTab === "chats" ? "ChatSphere" : activeTab === "groups" ? "Groups" : activeTab === "discover" ? "Search" : "Requests"}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-60">{onlineUsers.length} Online Users</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link to="/profile" className="size-10 overflow-hidden rounded-xl bg-bg-secondary shadow-xl ring-2 ring-primary/10 transition-all active:scale-95">
                <img
                  src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length - 1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 4) + 1}.png?v=3`)}
                  className="size-full object-cover"
                />
              </Link>
              <Link to="/settings" className="flex size-10 items-center justify-center rounded-xl bg-bg-secondary text-primary/40 shadow-lg transition-all active:scale-90 hover:text-accent">
                <Settings size={18} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveTab("chats")}
              className={`group flex flex-col items-center justify-center rounded-xl py-3 transition-all ${activeTab === "chats" ? "bg-white text-accent shadow-2xl ring-1 ring-black/5" : "text-gray-400"}`}
            >
              <MessageSquare size={18} fill={activeTab === "chats" ? "currentColor" : "none"} />
              <span className="mt-1.5 text-[8px] font-bold uppercase tracking-widest">Chats</span>
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`group flex flex-col items-center justify-center rounded-xl py-3 transition-all ${activeTab === "groups" ? "bg-white text-accent shadow-2xl ring-1 ring-black/5" : "text-gray-400"}`}
            >
              <Users size={18} fill={activeTab === "groups" ? "currentColor" : "none"} />
              <span className="mt-1.5 text-[8px] font-bold uppercase tracking-widest">Groups</span>
            </button>
            <button
              onClick={() => setActiveTab("discover")}
              className={`group flex flex-col items-center justify-center rounded-xl py-3 transition-all ${activeTab === "discover" ? "bg-white text-accent shadow-2xl ring-1 ring-black/5" : "text-gray-400"}`}
            >
              <Search size={18} />
              <span className="mt-1.5 text-[8px] font-bold uppercase tracking-widest">Global</span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`group relative flex flex-col items-center justify-center rounded-xl py-3 transition-all ${activeTab === "requests" ? "bg-white text-accent shadow-2xl ring-1 ring-black/5" : "text-gray-400"}`}
            >
              <UserPlus size={18} />
              <span className="mt-1.5 text-[8px] font-bold uppercase tracking-widest">Requests</span>
              {totalRequests > 0 && (
                <div className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-md bg-red-500 text-[8px] font-black text-white ring-2 ring-white">
                  {totalRequests}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Minimalist Header */}
        <div className={`sticky top-0 z-20 hidden h-[72px] items-center justify-between gap-3 px-5 py-4 transition-all duration-500 lg:flex ${isLightMode ? "bg-white/60" : "bg-black/40"} backdrop-blur-3xl`}>
          <div>

              <h1 className="text-xl font-bold tracking-tight text-primary leading-none">
                {activeTab === "chats" ? "ChatSphere" : activeTab === "groups" ? "Groups" : activeTab === "discover" ? "Discover" : "Requests"}
              </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {activeTab === "groups" && (
              <button 
                onClick={() => setIsCreateGroupOpen(true)}
                className="flex size-10 items-center justify-center rounded-xl bg-white text-accent shadow-xl ring-1 ring-black/5 transition-all hover:scale-110 active:scale-90"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            )}
            <button onClick={() => setShowLogoutConfirm(true)} className="flex size-10 items-center justify-center rounded-xl bg-red-500/5 text-red-400 shadow-md ring-1 ring-red-500/10 transition-all hover:bg-red-500 hover:text-white hover:shadow-xl active:scale-90">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Search Pill */}
        <div className="sticky top-[140px] z-20 bg-transparent px-5 pb-3 pt-3 lg:top-[72px]">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Search size={18} className="text-gray-400 transition-colors group-focus-within:text-accent" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-2xl border-none ${isLightMode ? "bg-white ring-black/5" : "bg-black/20 ring-white/5"} px-5 py-2.5 pl-12 text-[14px] font-semibold text-primary shadow-xl transition-all focus:ring-1 focus:ring-accent/20 placeholder:text-gray-400`}
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-10">
          {filteredItems.length > 0 ? (
            <div className="space-y-0.5">
              {filteredItems.map((item) => (
                <SidebarItem 
                  key={item._id}
                  item={item}
                  activeTab={activeTab}
                  isSelected={activeTab === "chats" ? selectedUser?._id === item._id : selectedGroup?._id === item._id}
                  online={activeTab === "chats" ? isOnline(item._id) : false}
                  themeColor={themeColor}
                  isLightMode={isLightMode}
                  setSelectedUser={setSelectedUser}
                  setSelectedGroup={setSelectedGroup}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center px-8">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-white shadow-xl">
                <MessageSquare size={32} className="text-accent opacity-20" />
              </div>
              <h3 className="text-lg font-bold text-primary">No items found</h3>
              <p className="text-xs font-normal leading-relaxed text-secondary opacity-70">Message your friends or groups from the sidebar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {isCreateGroupOpen && (
        <CreateGroupModal onClose={() => setIsCreateGroupOpen(false)} />
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <ConfirmationModal 
          title="Logout?"
          description="Are you sure you want to log out of your account?"
          onConfirm={logout}
          onCancel={() => setShowLogoutConfirm(false)}
          type="danger"
        />
      )}

    </aside>
  );
};

export default Sidebar;
