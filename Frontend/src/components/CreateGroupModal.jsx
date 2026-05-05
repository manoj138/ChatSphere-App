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
      className="fixed inset-0 z-[250] flex items-end justify-center bg-black/40 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-in fade-in duration-300"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="app-panel flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[2rem] sm:max-w-md sm:rounded-[2rem]">
        <div className="flex items-start justify-between gap-4 border-b border-primary p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-black tracking-tight text-primary">Create group</h2>
            <p className="mt-1 text-sm text-secondary">Add a name, image and members for the new group.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-secondary transition hover:bg-secondary/10 hover:text-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto custom-scrollbar p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <label
              htmlFor="group-img-upload"
              className="group relative flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-primary bg-surface"
            >
              {groupImage ? (
                <img src={groupImage} className="size-full object-cover" />
              ) : (
                <ImageIcon size={22} className="text-secondary transition group-hover:text-primary" />
              )}
              <div
                className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-xl text-black shadow-lg"
                style={{ backgroundColor: themeColor }}
              >
                <Plus size={12} strokeWidth={3} />
              </div>
              <input id="group-img-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>

            <div className="flex-1">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Group name
              </label>
              <input
                type="text"
                placeholder="Enter group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="app-input w-full rounded-2xl px-4 py-3.5 text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Members</label>
              <span className="text-xs font-medium text-gray-500">{selectedMembers.length} selected</span>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="app-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
              />
            </div>

            <div className="max-h-[32vh] space-y-2 overflow-y-auto custom-scrollbar pr-1">
              {filteredFriends.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => toggleMember(user._id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all ${selectedMembers.includes(user._id) ? "border-white/10 bg-white/[0.05]" : "border-transparent bg-white/[0.02] hover:bg-white/[0.04]"}`}
                >
                  <div className="size-10 overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={user.profilePicture || (user._id.charCodeAt(user._id.length - 1) % 2 === 0 ? `/boy_${(user._id.charCodeAt(user._id.length - 1) % 5) + 1}.png` : `/girl_${(user._id.charCodeAt(user._id.length - 1) % 4) + 1}.png`)}
                      className="size-full object-cover"
                    />
                  </div>
                  <h4 className="flex-1 text-sm font-semibold text-white">{user.username}</h4>
                  <div
                    className={`flex size-5 items-center justify-center rounded-md border transition-all ${selectedMembers.includes(user._id) ? "text-black" : "border-white/10"}`}
                    style={selectedMembers.includes(user._id) ? { backgroundColor: themeColor, borderColor: themeColor } : {}}
                  >
                    {selectedMembers.includes(user._id) && <Plus size={12} strokeWidth={4} className="rotate-45" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl px-4 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-black transition hover:brightness-110 active:scale-[0.99]"
            style={{ backgroundColor: themeColor }}
          >
            Create group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
