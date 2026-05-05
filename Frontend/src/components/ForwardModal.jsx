import { useState } from "react";
import { Search, X, Send, Users } from "lucide-react";

import { useChatStore } from "../store/useChatStore";

const ForwardModal = ({ message, onClose }) => {
  const { users = [], sendMessage } = useChatStore();
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
    } catch (error) {
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
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-in fade-in duration-300"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="app-panel flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[2rem] sm:max-w-md sm:rounded-[2rem]">
        <div className="flex items-start justify-between gap-4 border-b border-primary p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-black tracking-tight text-primary">Forward message</h2>
            <p className="mt-1 text-sm text-secondary">Choose a person to send this message to.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-secondary transition hover:bg-secondary/10 hover:text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto custom-scrollbar p-5 sm:space-y-5 sm:p-6">
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

          <div className="max-h-[55vh] space-y-2 overflow-y-auto custom-scrollbar pr-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleForward(user)}
                  disabled={sendingTo === user._id}
                  className="flex w-full items-center gap-4 rounded-2xl border border-transparent bg-surface p-3 text-left transition-all hover:border-primary hover:bg-secondary/40"
                >
                  <div className="size-11 flex-shrink-0 overflow-hidden rounded-2xl border border-primary sm:size-12">
                    <img src={getAvatarSrc(user)} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-sm font-semibold text-primary">{user.username}</h4>
                    <p className="mt-1 text-xs text-secondary">Send a copy to this person</p>
                  </div>
                  <div className="rounded-xl border border-primary bg-surface p-2 text-secondary transition-all">
                    {sendingTo === user._id ? <Send size={14} className="animate-pulse" /> : <Send size={14} />}
                  </div>
                </button>
              ))
            ) : (
              <div className="py-12 text-center opacity-30">
                <Users size={40} className="mx-auto mb-2" />
                <p className="text-sm font-semibold text-primary">No people found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;
