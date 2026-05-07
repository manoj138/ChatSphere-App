import { useState } from "react";
import { Search, X, Send, Users } from "lucide-react";

import { useChat } from "../context/ChatContext";

const ForwardModal = ({ message, onClose }) => {
  const { users = [], sendMessage } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingTo, setSendingTo] = useState(null);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleForward = async (user) => {
    setSendingTo(user._id);
    try {
      await sendMessage(
        {
          text: message.text,
          image: message.image,
          forwardedTo: user._id,
        },
        user._id
      );
      onClose();
    } catch {
      console.log("Forward failed");
    } finally {
      setSendingTo(null);
    }
  };

  const getAvatarSrc = (user) => {
    if (user.profilePicture) return user.profilePicture;
    const idNum = user._id ? user._id.charCodeAt(user._id.length - 1) : 0;
    return idNum % 2 === 0 ? `/boy_${(idNum % 5) + 1}.png?v=3` : `/girl_${(idNum % 4) + 1}.png?v=3`;
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-in fade-in duration-500"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="app-panel relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[2.5rem] border-none shadow-2xl sm:max-w-md sm:rounded-[2.5rem]">
        {/* Abstract Wavy Shapes (Mint Aesthetic) */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4 border-b border-primary/10 p-5 sm:p-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-primary">Forward</h2>
            <p className="mt-1 text-sm font-medium text-secondary">Choose a person to share this with.</p>
          </div>
          <button onClick={onClose} className="rounded-2xl bg-surface/50 p-2.5 text-secondary transition hover:bg-white hover:text-primary hover:shadow-lg">
            <X size={20} />
          </button>
        </div>

        <div className="relative space-y-4 overflow-y-auto custom-scrollbar p-5 sm:space-y-6 sm:p-8">
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

          <div className="max-h-[50vh] space-y-2 overflow-y-auto custom-scrollbar pr-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleForward(user)}
                  disabled={sendingTo === user._id}
                  className="group flex w-full items-center gap-4 rounded-[1.5rem] border border-transparent bg-surface/30 p-3 text-left transition-all hover:bg-white hover:shadow-xl active:scale-[0.98]"
                >
                  <div className="size-12 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm transition-transform group-hover:scale-105">
                    <img src={getAvatarSrc(user)} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-[15px] font-bold text-primary group-hover:text-accent transition-colors">{user.username}</h4>
                    <p className="mt-0.5 text-xs font-medium text-gray-500">Active now</p>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-surface/50 p-2.5 text-secondary transition-all group-hover:bg-accent group-hover:text-white">
                    {sendingTo === user._id ? <Send size={16} className="animate-pulse" /> : <Send size={16} />}
                  </div>
                </button>
              ))
            ) : (
              <div className="py-16 text-center opacity-40">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-[1.5rem] bg-surface">
                  <Users size={32} className="text-secondary" />
                </div>
                <p className="text-sm font-bold text-primary">No one found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;
