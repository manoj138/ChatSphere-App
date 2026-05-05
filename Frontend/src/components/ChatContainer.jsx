import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCheck,
  Forward,
  Info,
  MessageSquare,
  Search,
  ShieldCheck,
  SmilePlus,
  Trash2,
} from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import MessageInput from "./MessageInput";
import ForwardModal from "./ForwardModal";
import ChatInfoModal from "./ChatInfoModal";
import ConfirmationModal from "./ConfirmationModal";
import ImageModal from "./ImageModal";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const ChatContainer = () => {
  const {
    messages = [],
    getMessages,
    getGroupMessages,
    isMessagesLoading,
    selectedUser,
    selectedGroup,
    markMessagesAsSeen,
    typingStatus,
    deleteMessage,
    reactToMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const { themeColor, isLightMode } = useThemeStore();
  const scrollRef = useRef(null);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [forwardingMessage, setForwardingMessage] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const isTyping = selectedUser && typingStatus[selectedUser._id];

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      markMessagesAsSeen(selectedUser._id);
    } else if (selectedGroup?._id) {
      getGroupMessages(selectedGroup._id);
    }
  }, [selectedUser?._id, selectedGroup?._id, getMessages, getGroupMessages, markMessagesAsSeen]);

  useEffect(() => {
    if (scrollRef.current && messages?.length > 0 && !isSearching) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isSearching]);

  const getEmojiCount = (str) => {
    if (!str) return 0;
    const emojiMatch = str.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g);
    if (emojiMatch && emojiMatch.length === [...str].length) return emojiMatch.length;
    return 0;
  };

  const getAvatarSrc = (user) => {
    if (!user) return "/boy_1.png";
    const photo = typeof user === "object" ? user.profilePicture : null;
    if (photo) return photo;
    const userId = typeof user === "object" ? user._id : user;
    const idNum = userId ? userId.toString().charCodeAt(userId.toString().length - 1) : 0;
    return idNum % 2 === 0 ? `/boy_${(idNum % 5) + 1}.png?v=3` : `/girl_${(idNum % 4) + 1}.png?v=3`;
  };

  const getUserColor = (username) => {
    if (!username) return "#777";
    const colors = ["#ff4d4d", "#4da6ff", "#4dff88", "#ffcc00", "#ff4dff", "#00ffff"];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredMessages = messages.filter(
    (m) => !searchQuery || (m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-primary">
        <div className="relative">
          <div className="size-16 animate-spin rounded-full border-r-2 border-t-2" style={{ borderColor: themeColor }} />
          <MessageSquare className="absolute inset-0 m-auto opacity-20" size={24} />
        </div>
        <p className="mt-6 animate-pulse text-sm font-semibold text-gray-400">Loading messages...</p>
      </div>
    );
  }

  const activeChat = selectedUser || selectedGroup;
  if (!activeChat) return null;

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-primary font-sans transition-colors duration-500">
      <div className="pointer-events-none absolute -right-24 top-1/4 size-64 opacity-10 blur-[120px]" style={{ backgroundColor: themeColor }} />
      <div
        className={`pointer-events-none absolute inset-0 opacity-[0.02] ${isLightMode ? "bg-black" : "bg-white"}`}
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }}
      />

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-primary bg-secondary/80 px-3 py-4 backdrop-blur-2xl sm:px-4 sm:py-5 lg:px-8">
        {!isSearching ? (
          <div className="animate-in slide-in-from-left-4 flex items-center gap-3 duration-300 lg:gap-4">
            <button
              onClick={() => {
                const { setSelectedUser, setSelectedGroup } = useChatStore.getState();
                setSelectedUser(null);
                setSelectedGroup(null);
              }}
              className="p-2 text-gray-500 transition-colors hover:text-white lg:hidden"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="group flex cursor-pointer items-center gap-3 lg:gap-4" onClick={() => setIsInfoModalOpen(true)}>
              <div className="relative">
                <div className="relative z-10 size-12 overflow-hidden rounded-[1.2rem] border border-white/10 shadow-2xl transition-all group-hover:border-white/20">
                  {selectedUser ? (
                    <img src={getAvatarSrc(selectedUser)} className="h-full w-full object-cover" alt="" />
                  ) : (
                    <img src={selectedGroup.groupImage || "/favicon.svg"} className="h-full w-full object-cover" alt="" />
                  )}
                </div>
                <div className="absolute -inset-1 rounded-[1.4rem] opacity-20 blur-md transition-opacity group-hover:opacity-40" style={{ backgroundColor: themeColor }} />
              </div>

              <div className="min-w-0">
                <h3 className="mb-1.5 truncate text-sm font-black leading-none tracking-tight text-primary transition-colors group-hover:text-accent sm:text-base">
                  {selectedUser ? selectedUser.username : selectedGroup.name}
                </h3>
                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        <span className="size-1 rounded-full animate-bounce" style={{ backgroundColor: themeColor }} />
                        <span className="size-1 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: themeColor }} />
                        <span className="size-1 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: themeColor }} />
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: themeColor }}>Typing...</span>
                    </div>
                  ) : selectedUser && useAuthStore.getState().onlineUsers.includes(selectedUser._id) ? (
                    <div className="flex items-center gap-1.5">
                      <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      <span className="text-[11px] font-semibold text-green-500">Online</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={10} className="text-gray-600" />
                      <span className="text-[11px] font-semibold text-gray-500">Offline</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 flex flex-1 items-center gap-4 duration-300">
            <button onClick={() => { setIsSearching(false); setSearchQuery(""); }} className="p-2 text-gray-500 transition-all hover:text-white">
              <ArrowLeft size={20} />
            </button>
            <div className="relative flex-1">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                autoFocus
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="app-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
              />
            </div>
          </div>
        )}

        <div className="ml-4 flex items-center gap-4 text-gray-400">
          {!isSearching && (
            <button onClick={() => setIsSearching(true)} className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 transition-all hover:bg-white/[0.05] hover:text-white">
              <Search size={18} />
            </button>
          )}
          <button
            onClick={() => setIsInfoModalOpen(true)}
            className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 transition-all hover:bg-white/[0.05] hover:text-white"
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 sm:space-y-10 sm:p-4 lg:p-8 space-y-6">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => {
            const senderIdString = (message.senderId?._id || message.senderId)?.toString();
            const myIdString = authUser?._id?.toString();
            const isMine = senderIdString === myIdString;

            const emojiCount = getEmojiCount(message.text);
            const isBigEmoji = emojiCount > 0 && emojiCount <= 3 && !message.image && !message.isDeleted;

            return (
              <div key={message._id} className={`group/msg relative mb-6 flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[92%] items-end gap-2 sm:max-w-[85%] sm:gap-3 lg:max-w-[70%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                  {!isMine && (selectedGroup || message.groupId) && (
                    <div className="relative z-10 mb-6 size-9 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-xl">
                      <img src={getAvatarSrc(message.senderId)} className="h-full w-full object-cover" alt="Avatar" />
                    </div>
                  )}

                  <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                    {!isMine && (selectedGroup || message.groupId) && (
                      <span className="mb-1.5 ml-1 text-[11px] font-semibold" style={{ color: getUserColor(message.senderId?.username) }}>
                        {message.senderId?.username || "Unknown user"}
                      </span>
                    )}

                    <div className="group relative flex items-center gap-2">
                      {isMine && !message.isDeleted && (
                        <button
                          onClick={() => setMessageToDelete(message._id)}
                          className="order-last p-2 text-gray-500 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400 active:scale-90"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      {!isMine && !message.isDeleted && (
                        <button
                          onClick={() => setForwardingMessage(message)}
                          className="order-first p-2 text-gray-500 opacity-0 transition-all group-hover:opacity-100 hover:text-white"
                        >
                          <Forward size={16} />
                        </button>
                      )}

                      <div
                        className={`relative transition-all duration-500 ${
                          isBigEmoji
                            ? "bg-transparent"
                            : `rounded-[1.5rem] border px-4 py-3 shadow-2xl sm:rounded-[2rem] sm:px-6 sm:py-4 ${
                                isMine
                                  ? "rounded-tr-none border-primary bg-accent/10 text-primary"
                                  : "rounded-tl-none border-primary bg-secondary text-primary"
                              } ${message.isDeleted ? "opacity-40 italic" : ""}`
                        }`}
                      >
                        <div className={`absolute -bottom-3 z-20 flex items-center gap-1 ${isMine ? "right-4" : "left-4"}`}>
                          {message.reactions?.map((reaction, rIdx) => (
                            <div key={rIdx} className="rounded-full border border-primary bg-secondary px-1.5 py-0.5 text-[12px] shadow-lg animate-in zoom-in">
                              {reaction.emoji}
                            </div>
                          ))}
                        </div>

                        {!message.isDeleted && (
                          <button
                            onClick={() => setActiveMessageMenu(activeMessageMenu === message._id ? null : message._id)}
                            className={`absolute -top-3 z-30 flex size-8 items-center justify-center rounded-full border border-primary bg-primary text-secondary opacity-0 transition-all group-hover:opacity-100 hover:text-accent ${isMine ? "-left-3" : "-right-3"}`}
                          >
                            <SmilePlus size={16} />
                          </button>
                        )}

                        {activeMessageMenu === message._id && (
                          <div className={`absolute bottom-full z-[100] mb-3 flex items-center gap-0.5 rounded-full border border-primary bg-secondary/95 p-1.5 shadow-2xl animate-in slide-in-from-bottom-2 duration-300 ${isMine ? "right-0" : "left-0"}`}>
                            {QUICK_REACTIONS.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  reactToMessage(message._id, emoji);
                                  setActiveMessageMenu(null);
                                }}
                                className="flex size-9 items-center justify-center rounded-full text-xl transition-all hover:scale-110 hover:bg-white/[0.05] active:scale-150"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        {message.text && (
                          <p
                            className={`relative z-10 whitespace-pre-wrap leading-relaxed ${
                              isBigEmoji
                                ? `drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] ${emojiCount > 1 ? "text-5xl" : "text-7xl"}`
                                : "text-[14px] font-medium tracking-tight"
                            }`}
                          >
                            {searchQuery
                              ? message.text.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
                                  part.toLowerCase() === searchQuery.toLowerCase() ? (
                                    <mark key={i} className="rounded-sm bg-yellow-500/30 p-0 text-yellow-300">
                                      {part}
                                    </mark>
                                  ) : (
                                    part
                                  )
                                )
                              : message.text}
                          </p>
                        )}

                        {message.image && (
                          <div 
                            className="group/img relative mt-3 cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 shadow-inner"
                            onClick={() => setPreviewImage(message.image)}
                          >
                            <img src={message.image} className="h-auto max-w-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt="Sent asset" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover/img:opacity-100 flex items-end justify-center pb-4">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 translate-y-2 transition-transform group-hover/img:translate-y-0">Click to expand</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`mt-2.5 flex items-center gap-3 px-3 ${isMine ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] font-medium text-gray-500">
                        {message.createdAt
                          ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "NOW"}
                      </span>
                      {isMine && !selectedGroup && !message.isDeleted && (
                        <div className="flex items-center gap-1">
                          <CheckCheck size={14} className={message.isSeen ? "text-blue-500" : "text-gray-600"} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full select-none flex-col items-center justify-center space-y-6 px-4 text-center opacity-30">
            <div className="rounded-[3rem] border-2 border-dashed border-primary p-10">
              <MessageSquare size={80} className="text-primary" />
            </div>
            <p className="text-sm font-semibold text-primary">No messages yet.</p>
          </div>
        )}
        <div ref={scrollRef} className="h-32 w-full" />
      </div>

      {forwardingMessage && <ForwardModal message={forwardingMessage} onClose={() => setForwardingMessage(null)} />}
      {isInfoModalOpen && <ChatInfoModal onClose={() => setIsInfoModalOpen(false)} />}

      {messageToDelete && (
        <ConfirmationModal
          title="Delete message?"
          description="This message will be removed. Do you want to continue?"
          onConfirm={() => {
            deleteMessage(messageToDelete);
            setMessageToDelete(null);
          }}
          onCancel={() => setMessageToDelete(null)}
          type="danger"
        />
      )}

      {previewImage && <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />}

      <div className="sticky bottom-0 z-40 w-full shrink-0 border-t border-primary bg-gradient-to-t from-primary via-primary/95 to-primary p-3 sm:p-4 lg:p-6">
        <div className="mx-auto max-w-4xl">
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
