import { useEffect, useRef, useState, memo, useMemo } from "react";
import {
  ArrowLeft,
  CheckCheck,
  Forward,
  Info,
  MessageSquare,
  Search,
  SmilePlus,
  Trash2,
} from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import MessageInput from "./MessageInput";
import ForwardModal from "./ForwardModal";
import ChatInfoModal from "./ChatInfoModal";
import ImageModal from "./ImageModal";
import DeleteMessageModal from "./DeleteMessageModal";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const MessageItem = memo(({
  message,
  authUser,
  selectedGroup,
  activeMessageMenu,
  setActiveMessageMenu,
  setMessageToDelete,
  setForwardingMessage,
  setPreviewImage,
  reactToMessage,
  searchQuery
}) => {
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

  const senderIdString = (message.senderId?._id || message.senderId)?.toString();
  const myIdString = authUser?._id?.toString();
  const isMine = senderIdString === myIdString;

  const emojiCount = getEmojiCount(message.text);
  const isBigEmoji = emojiCount > 0 && emojiCount <= 3 && !message.image && !message.isDeleted;

  return (
    <div className={`group/msg relative mb-6 flex w-full animate-slide-up ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[92%] items-end gap-2 sm:max-w-[85%] sm:gap-4 lg:max-w-[75%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
        {!isMine && (selectedGroup || message.groupId) && (
          <div className="relative z-10 mb-8 size-10 flex-shrink-0 overflow-hidden rounded-[1.25rem] border-2 border-white bg-white shadow-xl transition-transform hover:scale-110">
            <img src={getAvatarSrc(message.senderId)} className="h-full w-full object-cover" alt="Avatar" />
          </div>
        )}

        <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
          {!isMine && (selectedGroup || message.groupId) && (
            <span className="mb-2 ml-1 text-[11px] font-black uppercase tracking-widest" style={{ color: getUserColor(message.senderId?.username) }}>
              {message.senderId?.username || "Unknown user"}
            </span>
          )}

          <div className="group relative flex items-center gap-3">
            <button
              onClick={() => setMessageToDelete(message._id)}
              className={`${isMine ? "order-last" : "order-first"} rounded-xl bg-red-500/5 p-2.5 text-red-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500 hover:text-white hover:shadow-lg active:scale-90`}
            >
              <Trash2 size={16} />
            </button>

            {!isMine && !message.isDeleted && (
              <button
                onClick={() => setForwardingMessage(message)}
                className="order-first rounded-xl bg-accent/5 p-2.5 text-accent opacity-0 transition-all group-hover:opacity-100 hover:bg-accent hover:text-black hover:shadow-lg"
              >
                <Forward size={16} />
              </button>
            )}

            <div
              className={`relative transition-all duration-300 ${isBigEmoji
                  ? "bg-transparent"
                  : `rounded-[1.75rem] border-none ${message.image && !message.text ? "p-2" : "px-5 py-4"} shadow-xl ${message.image && !message.text ? "sm:p-3" : "sm:px-8 sm:py-5"} ${isMine
                    ? "rounded-tr-none bubble-mine"
                    : "rounded-tl-none bubble-other"
                  } ${message.isDeleted ? "opacity-50 grayscale italic" : ""}`
                }`}
            >
              <div className={`absolute -bottom-4 z-20 flex items-center gap-1.5 ${isMine ? "right-6" : "left-6"}`}>
                {message.reactions?.map((reaction, rIdx) => (
                  <div key={rIdx} className="rounded-full border-2 border-white bg-white px-2 py-0.5 text-[14px] font-bold shadow-xl animate-in zoom-in ring-1 ring-black/5">
                    {reaction.emoji}
                  </div>
                ))}
              </div>

              {!message.isDeleted && (
                <button
                  onClick={() => setActiveMessageMenu(activeMessageMenu === message._id ? null : message._id)}
                  className={`absolute -top-4 z-30 flex size-10 items-center justify-center rounded-2xl bg-white text-accent opacity-0 shadow-xl ring-1 ring-black/5 transition-all group-hover:opacity-100 hover:scale-110 active:scale-125 ${isMine ? "-left-5" : "-right-5"}`}
                >
                  <SmilePlus size={20} />
                </button>
              )}

              {activeMessageMenu === message._id && (
                <div className={`absolute bottom-full z-[100] mb-5 flex items-center gap-1 rounded-[1.5rem] bg-white/95 p-2 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500 ring-1 ring-black/5 ${isMine ? "right-0" : "left-0"}`}>
                  {QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        reactToMessage(message._id, emoji);
                        setActiveMessageMenu(null);
                      }}
                      className="flex size-11 items-center justify-center rounded-xl text-2xl transition-all hover:scale-125 hover:bg-accent/10 active:scale-150"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {message.text && (
                <p
                  className={`relative z-10 whitespace-pre-wrap leading-relaxed ${isBigEmoji
                      ? `drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] ${emojiCount > 1 ? "text-6xl" : "text-8xl"}`
                      : "text-[15px] font-bold tracking-tight"
                    }`}
                >
                  {searchQuery
                    ? message.text.split(new RegExp(`(${searchQuery})`, "gi")).map((part, i) =>
                      part.toLowerCase() === searchQuery.toLowerCase() ? (
                        <mark key={i} className="rounded-md bg-accent/20 p-0.5 text-accent">
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
                  className={`group/img relative ${message.text ? "mt-4" : ""} cursor-zoom-in overflow-hidden rounded-2xl border-4 border-white/20 bg-white shadow-inner transition-all hover:shadow-2xl`}
                  onClick={() => setPreviewImage(message.image)}
                >
                  <img src={message.image} loading="lazy" className="h-auto max-w-[220px] sm:max-w-[280px] max-h-[350px] object-cover transition-transform duration-1000 group-hover/img:scale-110" alt="Sent asset" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover/img:opacity-100 flex items-end justify-center pb-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white translate-y-4 transition-transform group-hover/img:translate-y-0">Expand Visual</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`mt-3.5 flex items-center gap-4 px-4 ${isMine ? "justify-end" : "justify-start"}`}>
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
              {message.createdAt
                ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "NOW"}
            </span>
            {isMine && !selectedGroup && !message.isDeleted && (
              <div className="flex items-center gap-1.5">
                <CheckCheck size={16} className={message.isSeen ? "text-accent" : "text-gray-300"} strokeWidth={3} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

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
      const scrollOptions = { behavior: messages.length > 50 ? "auto" : "smooth" };
      scrollRef.current.scrollIntoView(scrollOptions);
    }
  }, [messages.length, isTyping, isSearching]);

  const filteredMessages = useMemo(() =>
    messages.filter(
      (m) => !searchQuery || (m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [messages, searchQuery]
  );

  const getAvatarSrc = (user) => {
    if (!user) return "/boy_1.png";
    const photo = typeof user === "object" ? user.profilePicture : null;
    if (photo) return photo;
    const userId = typeof user === "object" ? user._id : user;
    const idNum = userId ? userId.toString().charCodeAt(userId.toString().length - 1) : 0;
    return idNum % 2 === 0 ? `/boy_${(idNum % 5) + 1}.png?v=3` : `/girl_${(idNum % 4) + 1}.png?v=3`;
  };

  if (isMessagesLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-transparent">
        <div className="relative">
          <div className="size-20 animate-spin rounded-[2rem] border-r-4 border-t-4 shadow-2xl" style={{ borderColor: themeColor }} />
          <MessageSquare className="absolute inset-0 m-auto text-accent opacity-40" size={32} />
        </div>
        <p className="mt-8 animate-pulse text-[11px] font-black uppercase tracking-[0.4em] text-accent">Decoding Stream...</p>
      </div>
    );
  }

  const activeChat = selectedUser || selectedGroup;
  if (!activeChat) return null;

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-transparent font-sans transition-all duration-500">
      <div className="pointer-events-none absolute -right-24 top-1/4 size-96 opacity-20 blur-[150px]" style={{ backgroundColor: themeColor }} />
      <div className="pointer-events-none absolute -left-24 bottom-1/4 size-96 opacity-10 blur-[150px] bg-emerald-400" />

      <header className={`sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b px-4 py-4 backdrop-blur-3xl sm:px-6 lg:px-8 ${isLightMode ? "border-black/5 bg-white/95" : "border-white/10 bg-black/40"}`}>
        {!isSearching ? (
          <div className="animate-in slide-in-from-left-6 flex items-center gap-4 duration-500 lg:gap-6">
            <button
              onClick={() => {
                const { setSelectedUser, setSelectedGroup } = useChatStore.getState();
                setSelectedUser(null);
                setSelectedGroup(null);
              }}
              className={`rounded-xl p-2.5 shadow-lg transition-all lg:hidden active:scale-90 ${isLightMode ? "bg-white text-black" : "bg-white/10 text-primary"}`}
            >
              <ArrowLeft size={20} />
            </button>

            <div className="group flex cursor-pointer items-center gap-4 lg:gap-6" onClick={() => setIsInfoModalOpen(true)}>
              <div className="relative">
                <div className="relative z-10 size-10 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-2xl transition-all group-hover:scale-105 sm:size-11">
                  {selectedUser ? (
                    <img src={getAvatarSrc(selectedUser)} className="h-full w-full object-cover" alt="" />
                  ) : (
                    <img src={selectedGroup.groupImage || "/favicon.svg"} className="h-full w-full object-cover" alt="" />
                  )}
                </div>
                <div className="absolute -inset-2 rounded-[1.75rem] opacity-20 blur-xl transition-all group-hover:opacity-40" style={{ backgroundColor: themeColor }} />
              </div>

              <div className="min-w-0">
                <h3 className="mb-0.5 truncate text-base font-bold capitalize tracking-tight text-primary transition-colors group-hover:text-accent sm:text-lg">
                  {selectedUser ? selectedUser.username : selectedGroup.name}
                </h3>
                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="size-1.5 rounded-full animate-bounce bg-accent" />
                        <span className="size-1.5 rounded-full animate-bounce [animation-delay:0.2s] bg-accent" />
                        <span className="size-1.5 rounded-full animate-bounce [animation-delay:0.4s] bg-accent" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">Transmitting...</span>
                    </div>
                  ) : selectedUser && useAuthStore.getState().onlineUsers.includes(selectedUser._id) ? (
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-500">Live Connection</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-gray-300" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/40">Offline Space</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-6 flex flex-1 items-center gap-6 duration-500">
            <button onClick={() => { setIsSearching(false); setSearchQuery(""); }} className={`rounded-xl p-2.5 shadow-lg transition-all active:scale-90 ${isLightMode ? "bg-white text-black" : "bg-white/10 text-primary"}`}>
              <ArrowLeft size={20} />
            </button>
            <div className="relative flex-1">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Locate message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="app-input w-full rounded-[1.5rem] border-none bg-white/60 px-6 py-4 pl-14 text-sm font-bold shadow-xl backdrop-blur-xl transition-all focus:bg-white"
              />
            </div>
          </div>
        )}

        <div className="ml-4 flex items-center gap-3 sm:gap-4">
          {!isSearching && (
            <button onClick={() => setIsSearching(true)} className={`rounded-2xl p-3 shadow-xl ring-1 ring-black/5 transition-all hover:scale-110 active:scale-90 ${isLightMode ? "bg-white text-black" : "bg-white/10 text-primary"}`}>
              <Search size={20} />
            </button>
          )}
          <button
            onClick={() => setIsInfoModalOpen(true)}
            className={`rounded-2xl p-3 shadow-xl ring-1 ring-black/5 transition-all hover:scale-110 active:scale-90 ${isLightMode ? "bg-white text-black" : "bg-white/10 text-primary"}`}
          >
            <Info size={20} />
          </button>
        </div>
      </header>

      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 sm:p-8 lg:p-12 space-y-10">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              authUser={authUser}
              selectedGroup={selectedGroup}
              activeMessageMenu={activeMessageMenu}
              setActiveMessageMenu={setActiveMessageMenu}
              setMessageToDelete={setMessageToDelete}
              setForwardingMessage={setForwardingMessage}
              setPreviewImage={setPreviewImage}
              reactToMessage={reactToMessage}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <div className="flex h-full select-none flex-col items-center justify-center space-y-8 px-6 text-center opacity-40">
            <div className="rounded-[4rem] border-4 border-dashed border-accent/20 p-16 animate-pulse">
              <MessageSquare size={100} className="text-accent/30" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight text-primary">Absolute Silence</h3>
              <p className="text-sm font-bold uppercase tracking-widest text-accent">Initiate the first pulse</p>
            </div>
          </div>
        )}
        <div ref={scrollRef} className="h-4 w-full" />
      </div>

      {forwardingMessage && <ForwardModal message={forwardingMessage} onClose={() => setForwardingMessage(null)} />}
      {isInfoModalOpen && <ChatInfoModal onClose={() => setIsInfoModalOpen(false)} />}

      {messageToDelete && (
        <DeleteMessageModal
          message={messages.find(m => m._id === messageToDelete)}
          onConfirm={(type) => {
            deleteMessage(messageToDelete, type);
            setMessageToDelete(null);
          }}
          onCancel={() => setMessageToDelete(null)}
        />
      )}

      {previewImage && <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />}

      <div className="sticky bottom-0 z-40 w-full shrink-0 bg-transparent px-4 pb-6 pt-2 sm:px-12 sm:pb-10 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
