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
    getAllUsers, allUsers = [], getFriendRequests
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
    <aside className="relative flex h-screen w-full overflow-hidden border-r border-white/5 bg-[#0a0a0a] font-sans transition-all duration-500 select-none lg:h-full lg:w-[420px]">

      {/* Desktop Navigation Strip */}
      <div className="relative z-20 hidden h-full w-[74px] flex-col items-center gap-8 border-r border-white/5 bg-[#0a0a0a] py-6 lg:flex">
        <div className="absolute inset-x-3 top-3 h-24 rounded-[1.5rem] opacity-20 blur-2xl" style={{ backgroundColor: themeColor }} />
        <div className="flex flex-col items-center gap-5 sm:gap-8 flex-1 w-full">
          <button
            onClick={() => setActiveTab("chats")}
            className={`rounded-2xl p-3 transition-all ${activeTab === "chats" ? "border border-white/5 bg-white/[0.05] text-white" : "text-gray-500 hover:bg-white/[0.03] hover:text-white"}`}
          >
            <MessageSquare size={22} fill={activeTab === "chats" ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => setActiveTab("groups")} 
            className={`rounded-2xl p-3 transition-all ${activeTab === "groups" ? "border border-white/5 bg-white/[0.05] text-white" : "text-gray-500 hover:bg-white/[0.03] hover:text-white"}`}
          >
            <Users size={22} fill={activeTab === "groups" ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => setActiveTab("discover")} 
            className={`rounded-2xl p-3 transition-all ${activeTab === "discover" ? "border border-white/5 bg-white/[0.05] text-white" : "text-gray-500 hover:bg-white/[0.03] hover:text-white"}`}
          >
            <UserPlus size={22} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-5 sm:gap-8 w-full">
          <Link to="/settings" className="text-gray-500 transition-all hover:text-white">
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
      <div className="flex flex-1 flex-col bg-[#0a0a0a]">
        <div className="sticky top-0 z-20 border-b border-white/5 bg-[#0a0a0a]/95 px-4 pb-3 pt-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h1 className="text-lg font-black tracking-tight text-white">
                {activeTab === "chats" ? "Chats" : activeTab === "groups" ? "Groups" : "Discover"}
              </h1>
              <p className="text-xs text-gray-500">Browse chats, groups, and people.</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link to="/profile" className="size-10 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                <img
                  src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length - 1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length - 1) % 4) + 1}.png?v=3`)}
                  className="w-full h-full object-cover"
                />
              </Link>
              <Link to="/settings" className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-gray-400 transition-all hover:bg-white/[0.05] hover:text-white">
                <Settings size={18} />
              </Link>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-gray-400 transition-all active:scale-90 hover:text-red-400"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab("chats")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold transition-all ${activeTab === "chats" ? "border border-white/5 bg-white/[0.05] text-white" : "border border-transparent text-gray-500 hover:bg-white/[0.03]"}`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold transition-all ${activeTab === "groups" ? "border border-white/5 bg-white/[0.05] text-white" : "border border-transparent text-gray-500 hover:bg-white/[0.03]"}`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveTab("discover")}
              className={`rounded-2xl px-3 py-3 text-sm font-semibold transition-all ${activeTab === "discover" ? "border border-white/5 bg-white/[0.05] text-white" : "border border-transparent text-gray-500 hover:bg-white/[0.03]"}`}
            >
              Discover
            </button>
          </div>
        </div>

        {/* Minimalist Header */}
        <div className="sticky top-0 z-20 hidden items-center justify-between gap-3 bg-[#0a0a0a]/95 p-4 pb-2 backdrop-blur-xl sm:p-6 lg:flex">
          <div>
              <span className="app-chip mb-3" style={{ color: themeColor }}>Chat navigation</span>
              <h1 className="text-lg font-black tracking-tight text-white sm:text-xl">
                {activeTab === "chats" ? "Chats" : activeTab === "groups" ? "Groups" : "Discover"}
              </h1>
            <p className="mt-1 text-xs text-gray-500">Browse chats, groups, and people.</p>
          </div>
          
          <div className="flex items-center gap-2">
            {activeTab === "groups" && (
              <button 
                onClick={() => setIsCreateGroupOpen(true)}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-gray-400 transition-all active:scale-90 hover:bg-white/[0.05] hover:text-white"
              >
                <Plus size={18} />
              </button>
            )}
            <button onClick={() => setShowLogoutConfirm(true)} className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-gray-400 transition-all active:scale-90 hover:text-red-400">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Search Pill */}
        <div className="sticky top-[76px] z-20 bg-[#0a0a0a]/95 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4 lg:top-[88px]">
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
            filteredItems.map((item) => {
              const isSelected = activeTab === "chats" ? selectedUser?._id === item._id : selectedGroup?._id === item._id;
              const online = activeTab === "chats" ? isOnline(item._id) : false;
              const lastMsg = item.lastMessage;

              return (
                <button
                  key={item._id}
                  onClick={() => activeTab === "discover" ? null : (activeTab === "chats" ? setSelectedUser(item) : setSelectedGroup(item))}
                  className={`relative flex w-full items-center gap-3 px-4 py-4 transition-all sm:gap-4 sm:px-6 ${isSelected ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="size-12 overflow-hidden rounded-[1.2rem] border border-white/10 shadow-xl transition-transform group-hover:scale-105 sm:size-14">
                      <img src={getAvatarSrc(item)} className="w-full h-full object-cover" />
                    </div>
                    {online && (
                      <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-[#0a0a0a] p-0.5 transition-colors">
                        <div className="size-full bg-green-500 rounded-full shadow-[0_0_100px_rgba(34,197,94,1)] animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="truncate text-sm font-black tracking-tight text-white">
                        {activeTab === "groups" ? item.name : item.username}
                      </h3>
                      <span className="ml-2 text-[10px] font-semibold text-gray-500">
                        {formatTime(lastMsg?.createdAt) || "NEW"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeTab === "chats" && lastMsg && (
                        <CheckCheck size={14} className={lastMsg?.isSeen ? "text-blue-500" : "text-gray-600"} strokeWidth={3} />
                      )}
                      <p className="truncate text-xs font-medium text-gray-400 sm:text-[13px]">
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
