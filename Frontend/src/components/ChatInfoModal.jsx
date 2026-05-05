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
      className="fixed inset-0 z-[300] flex items-end justify-center bg-black/40 p-0 backdrop-blur-xl sm:items-center sm:p-4 animate-in fade-in duration-300"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="app-panel relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[2rem] sm:max-w-md sm:rounded-[2rem]">
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-secondary/95 p-8 text-center backdrop-blur-md animate-in zoom-in duration-300">
            <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-black tracking-tight text-primary">Delete group?</h3>
            <p className="mt-3 text-sm leading-6 text-secondary">
              This will permanently remove the group and its messages. This action cannot be undone.
            </p>
            <div className="mt-6 grid w-full gap-3">
              <button
                onClick={handleDeleteGroup}
                className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-red-500"
              >
                Delete group
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full rounded-2xl border border-primary bg-surface px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary/10"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="relative border-b border-primary bg-surface px-5 pb-6 pt-5 sm:px-6">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-xl border border-primary bg-surface p-2 text-secondary transition hover:bg-secondary/10 hover:text-primary"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center pt-2">
            <div className="relative">
              <div className="size-28 overflow-hidden rounded-[2rem] border-4 border-[#0a0a0a] bg-[#080808] shadow-2xl sm:size-32">
                <img src={getAvatarSrc(info)} className={`size-full object-cover ${isUpdating ? "opacity-50" : ""}`} alt="" />
                {isUpdating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={24} />
                  </div>
                )}
              </div>

              {isAdmin && !isUpdating && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 rounded-xl p-2 text-black shadow-lg"
                  style={{ backgroundColor: themeColor }}
                >
                  <Camera size={14} />
                </button>
              )}

              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

              {!isGroup && onlineUsers.includes(info._id) && (
                <div className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-[#0a0a0a]">
                  <div className="size-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                </div>
              )}
            </div>

            <div className="mt-5 w-full text-center">
              {isEditing ? (
                <div className="mx-auto flex max-w-xs items-center gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdateName()}
                    className="app-input flex-1 rounded-2xl px-4 py-3 text-center text-sm font-semibold"
                  />
                  <button
                    onClick={handleUpdateName}
                    className="rounded-xl p-3 text-black"
                    style={{ backgroundColor: themeColor }}
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <h2 className="break-words text-2xl font-black tracking-tight text-primary">
                    {isGroup ? info.name : info.username}
                  </h2>
                  {isAdmin && (
                    <button onClick={() => setIsEditing(true)} className="rounded-xl p-2 text-secondary transition hover:bg-secondary/10 hover:text-primary">
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>
              )}

              <div className="mt-2 flex flex-col items-center gap-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {isGroup
                    ? `Group ID ${info._id.substring(0, 8)}`
                    : onlineUsers.includes(info._id)
                      ? "Online now"
                      : "Offline"}
                </p>
                {!isGroup && !onlineUsers.includes(info._id) && (
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <Clock size={10} />
                    <span>Last seen {formatLastSeen(info.lastSeen)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 overflow-y-auto custom-scrollbar p-5 sm:p-6">
          {isGroup ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Members</h4>
                <span className="text-xs text-gray-500">{info.members?.length} people</span>
              </div>

              <div className="space-y-2">
                {info.members?.map((member) => {
                  const isMemberAdmin = member._id === (info.admin?._id || info.admin);

                  return (
                    <div key={member._id} className="flex items-center gap-3 rounded-2xl border border-primary bg-surface p-3">
                      <div className="relative size-10 overflow-hidden rounded-xl border border-white/10">
                        <img
                          src={member.profilePicture || (member._id.charCodeAt(member._id.length - 1) % 2 === 0 ? "/boy_1.png" : "/girl_1.png")}
                          className="size-full object-cover"
                        />
                        {onlineUsers.includes(member._id) && (
                          <div className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#0a0a0a] bg-green-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-primary">@{member.username}</p>
                        {isMemberAdmin && (
                          <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-yellow-400">
                            <ShieldCheck size={10} />
                            Admin
                          </div>
                        )}
                      </div>

                      {isAdmin && !isMemberAdmin && (
                        <button
                          onClick={() => handleKick(member._id, member.username)}
                          className="rounded-xl p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                          <UserMinus size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                  Delete group
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-2xl border border-primary bg-surface p-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/5 text-secondary">
                  <Mail size={18} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">Email</p>
                  <p className="mt-1 truncate text-sm font-semibold text-primary">{info.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-primary bg-surface p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-secondary">
                  <Info size={18} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">Bio</p>
                  <p className="mt-1 text-sm leading-6 text-secondary">{info.bio || "No bio added yet."}</p>
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
