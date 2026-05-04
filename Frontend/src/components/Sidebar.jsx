import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import {
  MessageSquare, Settings, LogOut, Plus,
  Search, CheckCheck, Users, UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import CreateGroupModal from "./CreateGroupModal";
import ConfirmationModal from "./ConfirmationModal";

const Sidebar = () => {
  const {
    getUsers, users = [], selectedUser, setSelectedUser, isUsersLoading,
    getGroups, groups = [], selectedGroup, setSelectedGroup, isGroupsLoading,
  } = useChatStore();

  const {
    getAllUsers, allUsers = [], getFriendRequests, friendRequests = [],
    sendFriendRequest, respondToRequest
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
    <aside className="h-full flex bg-secondary border-r border-primary transition-all w-full lg:w-[420px] overflow-hidden select-none font-sans relative duration-500">

      {/* 1. Vertical Navigation Strip */}
      <div className="w-[62px] sm:w-[70px] bg-secondary flex flex-col items-center py-4 sm:py-6 gap-5 sm:gap-8 border-r border-primary relative z-20">
        <div className="flex flex-col items-center gap-5 sm:gap-8 flex-1 w-full">
          <button
            onClick={() => setActiveTab("chats")}
            className={`p-3 rounded-xl transition-all ${activeTab === "chats" ? "bg-surface text-primary shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "text-secondary hover:text-primary"}`}
          >
            <MessageSquare size={22} fill={activeTab === "chats" ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => setActiveTab("groups")} 
            className={`p-3 rounded-xl transition-all ${activeTab === "groups" ? "bg-surface text-primary shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "text-secondary hover:text-primary"}`}
          >
            <Users size={22} fill={activeTab === "groups" ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => setActiveTab("discover")} 
            className={`p-3 rounded-xl transition-all ${activeTab === "discover" ? "bg-surface text-primary shadow-[0_0_20px_rgba(255,255,255,0.05)]" : "text-secondary hover:text-primary"}`}
          >
            <UserPlus size={22} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-5 sm:gap-8 w-full">
          <Link to="/settings" className="text-secondary hover:text-primary transition-all">
            <Settings size={22} />
          </Link>
          <Link to="/profile" className="mb-2">
            <div className="size-10 rounded-full overflow-hidden border border-primary shadow-lg group">
              <img
                src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length - 1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 4) + 1}.png?v=3`)}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
          </Link>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 flex flex-col bg-secondary">

        {/* Minimalist Header */}
        <div className="p-4 sm:p-6 pb-2 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-primary tracking-tight">
              {activeTab === "chats" ? "Chats" : activeTab === "groups" ? "Groups" : "Discover"}
            </h1>
            <p className="text-xs text-secondary mt-1 opacity-70">Browse chats, groups, and people.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {activeTab === "groups" && (
              <button 
                onClick={() => setIsCreateGroupOpen(true)}
                className="p-2.5 bg-surface border border-primary rounded-xl text-secondary hover:text-primary transition-all active:scale-90"
              >
                <Plus size={18} />
              </button>
            )}
            <button onClick={() => setShowLogoutConfirm(true)} className="p-2.5 bg-surface border border-primary rounded-xl text-secondary hover:text-red-500 transition-all active:scale-90">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Search Pill */}
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="relative group">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-40" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-primary rounded-full py-2.5 pl-10 pr-4 text-sm text-primary focus:outline-none placeholder:text-secondary"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 pb-10">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isSelected = activeTab === "chats" ? selectedUser?._id === item._id : selectedGroup?._id === item._id;
              const online = activeTab === "chats" ? isOnline(item._id) : false;
              const lastMsg = item.lastMessage;

              return (
                <button
                  key={item._id}
                  onClick={() => activeTab === "discover" ? null : (activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item))}
                  className={`w-full px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4 transition-all relative ${isSelected ? "bg-surface" : "hover:bg-surface/50"}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="size-12 sm:size-14 rounded-[1.2rem] overflow-hidden border border-primary shadow-xl transition-transform group-hover:scale-105">
                      <img src={getAvatarSrc(item)} className="w-full h-full object-cover" />
                    </div>
                    {online && (
                      <div className="absolute -bottom-0.5 -right-0.5 size-4 bg-secondary rounded-full p-0.5 transition-colors">
                        <div className="size-full bg-green-500 rounded-full shadow-[0_0_100px_rgba(34,197,94,1)] animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-sm font-black text-primary tracking-tight truncate">
                        {activeTab === "groups" ? item.name : item.username}
                      </h3>
                      <span className="text-[10px] text-secondary font-semibold ml-2 opacity-60">
                        {formatTime(lastMsg?.createdAt) || "NEW"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeTab === "chats" && lastMsg && (
                        <CheckCheck size={14} className={lastMsg?.isSeen ? "text-blue-500" : "text-secondary opacity-30"} strokeWidth={3} />
                      )}
                      <p className="text-xs sm:text-[13px] truncate text-secondary font-medium opacity-80">
                        {lastMsg ? (activeTab === "groups" ? `${lastMsg.senderName || "Someone"}: ${lastMsg.text}` : lastMsg.text) : "No messages yet"}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-l-full" style={{ backgroundColor: themeColor }} />
                  )}
                </button>
              );
            })
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
