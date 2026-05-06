import { useState, useEffect } from "react";
import { X, Search, Image as ImageIcon, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { optimizeImageFile } from "../lib/image";

const CreateGroupModal = ({ onClose }) => {
  const { createGroup } = useChatStore();
  const { users = [] } = useChatStore();
  const { themeColor } = useThemeStore();

  const [name, setName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const filteredFriends = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const optimizedImage = await optimizeImageFile(file);
      setGroupImage(optimizedImage);
    } catch (error) {
      toast.error(error.message || "Failed to process image");
    }
  };

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Group name required");
    if (selectedMembers.length === 0) return toast.error("Select at least one member");

    try {
      await createGroup({
        name: name.trim(),
        members: selectedMembers,
        groupImage,
      });
      onClose();
    } catch (error) {
      console.log("Failed to create group");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[250] flex items-end justify-center bg-black/40 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-in fade-in duration-500"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="app-panel relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[2.5rem] border-none shadow-2xl sm:max-w-md sm:rounded-[2.5rem]">
        {/* Abstract Wavy Shapes (Mint Aesthetic) */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4 border-b border-primary/10 p-5 sm:p-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-primary">Create group</h2>
            <p className="mt-1 text-sm font-medium text-secondary">New community starting here.</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-surface/50 p-2.5 text-secondary transition hover:bg-white hover:text-primary hover:shadow-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-8 overflow-y-auto custom-scrollbar p-5 sm:p-8">
          <div className="flex items-center gap-6">
            <label
              htmlFor="group-img-upload"
              className="group relative flex size-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed border-primary/20 bg-surface/50 shadow-inner transition-all hover:border-accent hover:bg-white"
            >
              {groupImage ? (
                <img src={groupImage} className="size-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <ImageIcon size={28} className="text-secondary transition-colors group-hover:text-accent" />
              )}
              <div
                className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-[1rem] text-black shadow-lg ring-4 ring-white"
                style={{ backgroundColor: themeColor }}
              >
                <Plus size={14} strokeWidth={3} />
              </div>
              <input id="group-img-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>

            <div className="flex-1 space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                Group name
              </label>
              <input
                type="text"
                placeholder="Name your squad..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="app-input w-full rounded-2xl border-none bg-surface/50 px-5 py-4 text-[15px] font-bold shadow-inner focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Add Members</label>
              <span className="text-[11px] font-bold text-accent">{selectedMembers.length} selected</span>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="app-input w-full rounded-2xl border-none bg-surface/50 py-4 pl-12 pr-4 text-sm font-medium shadow-inner focus:bg-white"
              />
            </div>

            <div className="max-h-[35vh] space-y-2 overflow-y-auto custom-scrollbar pr-1">
              {filteredFriends.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => toggleMember(user._id)}
                  className={`group flex w-full items-center gap-4 rounded-[1.5rem] border border-transparent p-3 text-left transition-all ${selectedMembers.includes(user._id) ? "bg-accent/5" : "bg-surface/30 hover:bg-white hover:shadow-lg"}`}
                >
                  <div className="size-12 overflow-hidden rounded-[1.25rem] border-2 border-white bg-white shadow-sm transition-transform group-hover:scale-105">
                    <img
                      src={user.profilePicture || (user._id.charCodeAt(user._id.length - 1) % 2 === 0 ? `/boy_${(user._id.charCodeAt(user._id.length - 1) % 5) + 1}.png` : `/girl_${(user._id.charCodeAt(user._id.length - 1) % 4) + 1}.png`)}
                      className="size-full object-cover"
                    />
                  </div>
                  <h4 className={`flex-1 text-[15px] font-bold transition-colors ${selectedMembers.includes(user._id) ? "text-accent" : "text-primary"}`}>{user.username}</h4>
                  <div
                    className={`flex size-6 items-center justify-center rounded-xl border-2 transition-all ${selectedMembers.includes(user._id) ? "text-black shadow-lg" : "border-gray-200 bg-surface"}`}
                    style={selectedMembers.includes(user._id) ? { backgroundColor: themeColor, borderColor: themeColor } : {}}
                  >
                    {selectedMembers.includes(user._id) && <Plus size={14} strokeWidth={4} className="rotate-45" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-[1.5rem] py-4.5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-xl transition hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
            style={{ backgroundColor: themeColor }}
          >
            Launch Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
