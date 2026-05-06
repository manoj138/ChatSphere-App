import { useEffect, useState, memo, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import {
  MessageSquare, Settings, LogOut, Plus,
  Search, CheckCheck, Users, UserPlus, Check, X
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
  setSelectedUser, 
  setSelectedGroup, 
  sendFriendRequest, 
  respondToRequest 
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
      className={`relative flex w-full items-center gap-3 px-4 py-4 transition-premium hover:scale-[1.01] active:scale-[0.99] sm:gap-4 sm:px-6 ${isSelected ? "bg-secondary" : "hover:bg-secondary/40"}`}
    >
      <div className="relative flex-shrink-0">
        <div className="size-12 overflow-hidden rounded-[1.2rem] border border-white/10 shadow-xl transition-transform group-hover:scale-105 sm:size-14">
          <img src={getAvatarSrc()} loading="lazy" className="w-full h-full object-cover" />
        </div>
        {online && (
          <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-secondary p-0.5 transition-colors">
            <div className="size-full bg-green-500 rounded-full shadow-[0_0_100px_rgba(34,197,94,1)] animate-pulse" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="truncate text-sm font-black tracking-tight text-primary">
            {activeTab === "groups" ? item.name : (activeTab === "requests" ? (item.requestType === "incoming" ? item.sender?.username : item.receiver?.username) : item.username)}
          </h3>
          {activeTab !== "discover" && activeTab !== "requests" && (
            <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
              <span className="text-[10px] font-semibold text-secondary/60">
                {formatTime(lastMsg?.createdAt) || "NEW"}
              </span>
              {item.unreadCount > 0 && (
                <span 
                  className="flex size-5 items-center justify-center rounded-full text-[10px] font-black text-black animate-in zoom-in duration-300"
                  style={{ backgroundColor: themeColor }}
                >
                  {item.unreadCount}
                </span>
              )}
            </div>
          )}
          {activeTab === "requests" && (
            <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${item.requestType === "incoming" ? "bg-blue-500/10 text-blue-500" : "bg-orange-500/10 text-orange-500"}`}>
              {item.requestType}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-1.5 min-w-0">
            {activeTab === "chats" && lastMsg && (
              <CheckCheck size={14} className={lastMsg?.isSeen ? "text-blue-500" : "text-gray-600"} strokeWidth={3} />
            )}
            <p className="truncate text-xs font-medium text-gray-400 sm:text-[13px]">
              {activeTab === "discover" ? (item.email || "Available to chat") : (activeTab === "requests" ? (item.requestType === "incoming" ? (item.sender?.email || "Wants to connect") : (item.receiver?.email || "Request sent")) : (lastMsg ? (activeTab === "groups" ? `${lastMsg.senderName || "Someone"}: ${lastMsg.text}` : lastMsg.text) : "No messages yet"))}
            </p>
          </div>

          {activeTab === "discover" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                sendFriendRequest(item._id);
              }}
              className="flex items-center gap-1 rounded-lg bg-surface px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary transition-all hover:bg-primary/10 hover:text-primary active:scale-90"
            >
              <UserPlus size={14} />
              Add
            </button>
          )}

          {activeTab === "requests" && item.requestType === "incoming" && (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  respondToRequest(item._id, "accepted");
                }}
                className="rounded-lg bg-green-500/10 p-1.5 text-green-500 transition-all hover:bg-green-500/20 active:scale-90"
              >
                <Check size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  respondToRequest(item._id, "rejected");
                }}
                className="rounded-lg bg-red-500/10 p-1.5 text-red-500 transition-all hover:bg-red-500/20 active:scale-90"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {activeTab === "requests" && item.requestType === "outgoing" && (
            <div className="flex items-center gap-1.5 rounded-lg bg-secondary/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
              <CheckCheck size={12} className="text-gray-400" />
              Sent
            </div>
          )}
        </div>
      </div>
      {isSelected && activeTab !== "discover" && activeTab !== "requests" && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-l-full" style={{ backgroundColor: themeColor }} />
      )}
    </button>
  );
});

const Sidebar = () => {
  const {
    getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading,
    getGroups, groups = [], selectedGroup, setSelectedGroup, isGroupsLoading,
  } = useChatStore();

  const {
    getAllUsers, allUsers = [], getFriendRequests, sendFriendRequest, friendRequests = [], respondToRequest
  } = useFriendStore();

  const { authUser, logout, onlineUsers = [] } = useAuthStore();
  const { themeColor } = useThemeStore();

  const [activeTab, setActiveTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
    getFriendRequests();
  }, [getUsers, getGroups, getFriendRequests]);

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
    <aside className="relative flex h-[100dvh] w-full overflow-hidden border-r border-primary bg-secondary font-sans transition-all duration-500 select-none lg:h-full lg:w-[380px] xl:w-[420px]">

      {/* Desktop Navigation Strip */}
      <div className="relative z-20 hidden h-full w-[74px] flex-col items-center gap-8 border-r border-primary bg-secondary py-6 lg:flex">
        <div className="absolute inset-x-3 top-3 h-24 rounded-[1.5rem] opacity-20 blur-2xl" style={{ backgroundColor: themeColor }} />
        <div className="flex flex-col items-center gap-5 sm:gap-8 flex-1 w-full">
          <button
            onClick={() => setActiveTab("chats")}
            className={`relative rounded-2xl p-3 transition-all ${activeTab === "chats" ? "border border-primary bg-surface text-primary" : "text-secondary hover:bg-secondary/10 hover:text-primary"}`}
          >
            <MessageSquare size={22} fill={activeTab === "chats" ? "currentColor" : "none"} />
            {hasUnreadChats && activeTab !== "chats" && (
              <div className="absolute right-2 top-2 size-2.5 rounded-full border-2 border-secondary animate-pulse" style={{ backgroundColor: themeColor }} />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("groups")} 
            className={`relative rounded-2xl p-3 transition-all ${activeTab === "groups" ? "border border-primary bg-surface text-primary" : "text-secondary hover:bg-secondary/10 hover:text-primary"}`}
          >
            <Users size={22} fill={activeTab === "groups" ? "currentColor" : "none"} />
            {hasUnreadGroups && activeTab !== "groups" && (
              <div className="absolute right-2 top-2 size-2.5 rounded-full border-2 border-secondary animate-pulse" style={{ backgroundColor: themeColor }} />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("discover")} 
            className={`rounded-2xl p-3 transition-all ${activeTab === "discover" ? "border border-primary bg-surface text-primary" : "text-secondary hover:bg-secondary/10 hover:text-primary"}`}
          >
            <Search size={22} />
          </button>
          <button 
            onClick={() => setActiveTab("requests")} 
            className={`relative rounded-2xl p-3 transition-all ${activeTab === "requests" ? "border border-primary bg-surface text-primary" : "text-secondary hover:bg-secondary/10 hover:text-primary"}`}
          >
            <UserPlus size={22} />
            {totalRequests > 0 && (
              <div className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-secondary">
                {totalRequests}
              </div>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center gap-5 sm:gap-8 w-full">
          <Link to="/settings" className="text-secondary transition-all hover:text-primary">
            <Settings size={22} />
          </Link>
          <Link to="/profile" className="mb-2">
            <div className="group size-10 overflow-hidden rounded-full border border-white/10 shadow-lg">
              <img
                src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length - 1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 4) + 1}.png?v=3`)}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex flex-1 flex-col bg-secondary">
        <div className="sticky top-0 z-20 border-b border-primary bg-secondary/95 px-4 pb-3 pt-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="min-w-0">
                <h1 className="text-lg font-black tracking-tight text-primary">
                  {activeTab === "chats" ? "Chats" : activeTab === "groups" ? "Groups" : activeTab === "discover" ? "Discover" : "Requests"}
                </h1>
                <p className="text-xs text-gray-500">
                  {activeTab === "requests" ? "Manage friend requests" : "Browse chats, groups, and people."}
                </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link to="/profile" className="size-10 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                <img
                  src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length - 1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 4) + 1}.png?v=3`)}
                  className="w-full h-full object-cover"
                />
              </Link>
              <Link to="/settings" className="rounded-xl border border-primary bg-surface p-2.5 text-secondary transition-all hover:bg-secondary/10 hover:text-primary">
                <Settings size={18} />
              </Link>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="rounded-xl border border-primary bg-surface p-2.5 text-secondary transition-all active:scale-90 hover:text-red-400"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveTab("chats")}
              className={`group flex flex-col items-center justify-center rounded-2xl py-2.5 transition-all ${activeTab === "chats" ? "bg-surface text-primary shadow-sm ring-1 ring-white/10" : "text-secondary hover:bg-white/5"}`}
            >
              <MessageSquare size={18} className={activeTab === "chats" ? "text-accent" : "group-hover:text-primary"} />
              <span className="mt-1 text-[10px] font-bold uppercase tracking-tight">Chats</span>
              {hasUnreadChats && activeTab !== "chats" && (
                <div className="absolute right-3 top-3 size-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
              )}
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`group flex flex-col items-center justify-center rounded-2xl py-2.5 transition-all ${activeTab === "groups" ? "bg-surface text-primary shadow-sm ring-1 ring-white/10" : "text-secondary hover:bg-white/5"}`}
            >
              <Users size={18} className={activeTab === "groups" ? "text-accent" : "group-hover:text-primary"} />
              <span className="mt-1 text-[10px] font-bold uppercase tracking-tight">Groups</span>
              {hasUnreadGroups && activeTab !== "groups" && (
                <div className="absolute right-3 top-3 size-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
              )}
            </button>
            <button
              onClick={() => setActiveTab("discover")}
              className={`group flex flex-col items-center justify-center rounded-2xl py-2.5 transition-all ${activeTab === "discover" ? "bg-surface text-primary shadow-sm ring-1 ring-white/10" : "text-secondary hover:bg-white/5"}`}
            >
              <Search size={18} className={activeTab === "discover" ? "text-accent" : "group-hover:text-primary"} />
              <span className="mt-1 text-[10px] font-bold uppercase tracking-tight">Discover</span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`group relative flex flex-col items-center justify-center rounded-2xl py-2.5 transition-all ${activeTab === "requests" ? "bg-surface text-primary shadow-sm ring-1 ring-white/10" : "text-secondary hover:bg-white/5"}`}
            >
              <UserPlus size={18} className={activeTab === "requests" ? "text-accent" : "group-hover:text-primary"} />
              <span className="mt-1 text-[10px] font-bold uppercase tracking-tight">Requests</span>
              {totalRequests > 0 && (
                <div className="absolute right-3 top-3 flex size-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-secondary">
                  {totalRequests}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Minimalist Header */}
        <div className="sticky top-0 z-20 hidden items-center justify-between gap-3 bg-secondary/95 p-4 pb-2 backdrop-blur-xl sm:p-6 lg:flex">
          <div>
              <span className="app-chip mb-3" style={{ color: themeColor }}>Chat navigation</span>
              <h1 className="text-lg font-black tracking-tight text-primary sm:text-xl">
                {activeTab === "chats" ? "Chats" : activeTab === "groups" ? "Groups" : activeTab === "discover" ? "Discover" : "Requests"}
              </h1>
            <p className="mt-1 text-xs text-gray-500">
              {activeTab === "requests" ? "Manage friend requests" : "Browse chats, groups, and people."}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {activeTab === "groups" && (
              <button 
                onClick={() => setIsCreateGroupOpen(true)}
                className="rounded-xl border border-primary bg-surface p-2.5 text-secondary transition-all active:scale-90 hover:bg-secondary/10 hover:text-primary"
              >
                <Plus size={18} />
              </button>
            )}
            <button onClick={() => setShowLogoutConfirm(true)} className="rounded-xl border border-primary bg-surface p-2.5 text-secondary transition-all active:scale-90 hover:text-red-400">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Search Pill */}
        <div className="sticky top-[76px] z-20 bg-secondary/95 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4 lg:top-[88px]">
          <div className="relative group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="app-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-6 lg:pb-10">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <SidebarItem 
                key={item._id}
                item={item}
                activeTab={activeTab}
                isSelected={activeTab === "chats" ? selectedUser?._id === item._id : selectedGroup?._id === item._id}
                online={activeTab === "chats" ? isOnline(item._id) : false}
                themeColor={themeColor}
                setSelectedUser={setSelectedUser}
                setSelectedGroup={setSelectedGroup}
                sendFriendRequest={sendFriendRequest}
                respondToRequest={respondToRequest}
              />
            ))
          ) : (
            <div className="py-20 text-center opacity-30 px-4">
              <MessageSquare size={60} className="mx-auto" />
              <p className="mt-4 text-sm font-semibold text-secondary">Nothing to show here yet.</p>
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
          title="Log out?"
          description="You are about to end your current session. Do you want to continue?"
          onConfirm={logout}
          onCancel={() => setShowLogoutConfirm(false)}
          type="danger"
        />
      )}

    </aside>
  );
};

export default Sidebar;
