import { useState, useRef, useEffect } from "react";
import {
  X,
  Mail,
  Info,
  Edit2,
  Camera,
  Check,
  Loader2,
  UserMinus,
  Trash2,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { optimizeImageFile } from "../lib/image";

const ChatInfoModal = ({ onClose }) => {
  const { selectedUser, selectedGroup, updateGroup, deleteGroup, kickMember } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const { themeColor } = useThemeStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(selectedGroup?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (showDeleteConfirm) setShowDeleteConfirm(false);
        else onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, showDeleteConfirm]);

  const info = selectedUser || selectedGroup;
  if (!info) return null;

  const isGroup = !!selectedGroup;
  const isAdmin = isGroup && String(selectedGroup.admin?._id || selectedGroup.admin) === String(authUser?._id);

  const getAvatarSrc = (item) => {
    if (!item) return "/boy_1.png";
    if (isGroup) return item.groupImage || "/favicon.svg";
    if (item.profilePicture) return item.profilePicture;
    const idNum = item._id ? item._id.toString().charCodeAt(item._id.toString().length - 1) : 0;
    return idNum % 2 === 0 ? `/boy_${(idNum % 5) + 1}.png` : `/girl_${(idNum % 4) + 1}.png`;
  };

  const formatLastSeen = (date) => {
    if (!date) return "Unknown";
    const lastSeen = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastSeen) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return lastSeen.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64Image = await optimizeImageFile(file);
      setIsUpdating(true);
      await updateGroup(selectedGroup._id, { groupImage: base64Image });
    } catch (error) {
      toast.error(error.message || "Failed to update group image");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateName = async () => {
    if (!editedName.trim() || editedName === selectedGroup.name) return setIsEditing(false);
    setIsUpdating(true);
    await updateGroup(selectedGroup._id, { name: editedName });
    setIsUpdating(false);
    setIsEditing(false);
  };

  const handleDeleteGroup = async () => {
    await deleteGroup(selectedGroup._id);
    onClose();
  };

  const handleKick = async (userId, username) => {
    if (window.confirm(`Are you sure you want to remove @${username} from this group?`)) {
      await kickMember(selectedGroup._id, userId);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end justify-center bg-black/40 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-in fade-in duration-500"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="app-panel relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[2.5rem] border-none shadow-2xl sm:max-w-md sm:rounded-[2.5rem]">
        {/* Abstract Wavy Shapes (Mint Aesthetic) */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-emerald-400/10 blur-3xl" />

        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 p-8 text-center backdrop-blur-md animate-in zoom-in duration-300">
            <div className="mb-6 flex size-20 items-center justify-center rounded-[2rem] bg-red-500/10 text-red-500 shadow-xl">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-primary">Delete?</h3>
            <p className="mt-4 text-[13px] font-medium leading-relaxed text-secondary">
              This will permanently remove everything. This action cannot be undone.
            </p>
            <div className="mt-10 grid w-full gap-3">
              <button
                onClick={handleDeleteGroup}
                className="w-full rounded-2xl bg-red-600 py-4 text-[13px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition hover:bg-red-500"
              >
                Delete Forever
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full rounded-2xl border border-primary bg-surface py-4 text-[13px] font-bold text-secondary transition hover:bg-white hover:text-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="relative border-b border-primary/10 bg-surface/30 px-5 pb-8 pt-5 sm:px-8">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-2xl bg-surface/50 p-2.5 text-secondary transition hover:bg-white hover:text-primary hover:shadow-lg"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center pt-6">
            <div className="relative">
              <div className="size-32 overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-2xl transition-transform hover:scale-105 sm:size-36">
                <img src={getAvatarSrc(info)} className={`size-full object-cover ${isUpdating ? "opacity-50" : ""}`} alt="" />
                {isUpdating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                    <Loader2 className="animate-spin text-accent" size={28} />
                  </div>
                )}
              </div>

              {isAdmin && !isUpdating && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex size-10 items-center justify-center rounded-2xl text-black shadow-xl ring-4 ring-white"
                  style={{ backgroundColor: themeColor }}
                >
                  <Camera size={16} />
                </button>
              )}

              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

              {!isGroup && onlineUsers.includes(info._id) && (
                <div className="absolute bottom-1 right-1 flex size-6 items-center justify-center rounded-full bg-white ring-4 ring-white shadow-lg">
                  <div className="size-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                </div>
              )}
            </div>

            <div className="mt-6 w-full text-center">
              {isEditing ? (
                <div className="mx-auto flex max-w-xs items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdateName()}
                    className="app-input flex-1 rounded-2xl border-none bg-white px-5 py-4 text-center text-[15px] font-bold shadow-inner"
                  />
                  <button
                    onClick={handleUpdateName}
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-black shadow-lg"
                    style={{ backgroundColor: themeColor }}
                  >
                    <Check size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <h2 className="break-words text-3xl font-black tracking-tight text-primary">
                    {isGroup ? info.name : info.username}
                  </h2>
                  {isAdmin && (
                    <button onClick={() => setIsEditing(true)} className="rounded-2xl bg-surface/50 p-2.5 text-secondary transition hover:bg-white hover:text-primary hover:shadow-md">
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              )}

              <div className="mt-3 flex flex-col items-center gap-1">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-accent">
                  {isGroup
                    ? `Public Community`
                    : onlineUsers.includes(info._id)
                      ? "Online Now"
                      : "Recently Active"}
                </p>
                {!isGroup && !onlineUsers.includes(info._id) && (
                  <div className="flex items-center gap-2 text-[12px] font-medium text-gray-500">
                    <Clock size={12} className="text-accent" />
                    <span>Last seen {formatLastSeen(info.lastSeen)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative space-y-6 overflow-y-auto custom-scrollbar p-5 sm:p-8">
          {isGroup ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Members</h4>
                <span className="text-[11px] font-bold text-accent">{info.members?.length} people</span>
              </div>

              <div className="space-y-3">
                {info.members?.map((member) => {
                  const isMemberAdmin = member._id === (info.admin?._id || info.admin);

                  return (
                    <div key={member._id} className="group flex items-center gap-4 rounded-[1.5rem] bg-surface/30 p-3 transition-all hover:bg-white hover:shadow-lg">
                      <div className="relative size-12 overflow-hidden rounded-[1.25rem] border-2 border-white bg-white shadow-sm transition-transform group-hover:scale-105">
                        <img
                          src={member.profilePicture || (member._id.charCodeAt(member._id.length - 1) % 2 === 0 ? "/boy_1.png" : "/girl_1.png")}
                          className="size-full object-cover"
                        />
                        {onlineUsers.includes(member._id) && (
                          <div className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-green-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-bold text-primary group-hover:text-accent transition-colors">@{member.username}</p>
                        {isMemberAdmin && (
                          <div className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-yellow-500">
                            <ShieldCheck size={12} />
                            Moderator
                          </div>
                        )}
                      </div>

                      {isAdmin && !isMemberAdmin && (
                        <button
                          onClick={() => handleKick(member._id, member.username)}
                          className="rounded-xl p-2.5 text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-500 hover:shadow-md"
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-4 flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-red-500/5 px-4 py-4 text-[13px] font-black uppercase tracking-[0.15em] text-red-500 transition-all hover:bg-red-500/10 hover:shadow-xl"
                >
                  <Trash2 size={16} />
                  Terminate Community
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="group flex items-center gap-5 rounded-[1.5rem] bg-surface/30 p-5 transition-all hover:bg-white hover:shadow-lg">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-accent shadow-sm transition-transform group-hover:scale-110">
                  <Mail size={24} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Email Address</p>
                  <p className="mt-1 truncate text-[15px] font-bold text-primary">{info.email}</p>
                </div>
              </div>

              <div className="group flex items-start gap-5 rounded-[1.5rem] bg-surface/30 p-5 transition-all hover:bg-white hover:shadow-lg">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-accent shadow-sm transition-transform group-hover:scale-110">
                  <Info size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">About Me</p>
                  <p className="mt-1 text-[14px] font-medium leading-relaxed text-secondary">{info.bio || "No bio added yet."}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInfoModal;
