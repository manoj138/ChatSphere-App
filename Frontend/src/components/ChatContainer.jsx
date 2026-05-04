import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { 
  CheckCheck, MessageSquare, Info, 
  ShieldCheck, ArrowLeft, Trash2, SmilePlus, Search, Forward
} from "lucide-react";
import MessageInput from "./MessageInput";
import ForwardModal from "./ForwardModal";
import ChatInfoModal from "./ChatInfoModal";
import ConfirmationModal from "./ConfirmationModal";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const ChatContainer = () => {
  const { 
    messages = [], getMessages, getGroupMessages, isMessagesLoading, 
    selectedUser, selectedGroup, markMessagesAsSeen, typingStatus,
    deleteMessage, reactToMessage
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
    const photo = typeof user === 'object' ? user.profilePicture : null;
    if (photo) return photo;
    const userId = typeof user === 'object' ? user._id : user;
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

  const filteredMessages = messages.filter(m => 
    !searchQuery || (m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-primary">
        <div className="relative">
           <div className="size-16 rounded-full border-t-2 border-r-2 animate-spin" style={{ borderColor: themeColor }} />
           <MessageSquare className="absolute inset-0 m-auto text-primary opacity-20" size={24} />
        </div>
        <p className="mt-6 text-sm text-secondary font-semibold animate-pulse">Loading messages...</p>
      </div>
    );
  }

  const activeChat = selectedUser || selectedGroup;
  if (!activeChat) return null;

  return (
    <div className="flex-1 flex flex-col bg-primary relative overflow-hidden h-full font-sans transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 -right-24 size-64 blur-[120px] opacity-10 pointer-events-none" style={{ backgroundColor: themeColor }} />
      <div className={`absolute inset-0 opacity-[0.02] pointer-events-none ${isLightMode ? "bg-black" : "bg-white"}`} style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />

      {/* Header */}
      <header className="px-3 sm:px-4 lg:px-8 py-4 sm:py-5 border-b border-primary flex items-center justify-between bg-secondary/40 backdrop-blur-2xl z-30 transition-all duration-500 gap-3">
        {!isSearching ? (
           <div className="flex items-center gap-3 lg:gap-4 animate-in slide-in-from-left-4 duration-300">
              <button 
                onClick={() => {
                   const { setSelectedUser, setSelectedGroup } = useChatStore.getState();
                   setSelectedUser(null);
                   setSelectedGroup(null);
                }}
                className="lg:hidden p-2 text-secondary hover:text-primary transition-colors"
              >
                 <ArrowLeft size={20} />
              </button>

              <div 
                className="flex items-center gap-3 lg:gap-4 cursor-pointer group"
                onClick={() => setIsInfoModalOpen(true)}
              >
                 <div className="relative">
                    <div className="size-12 rounded-[1.2rem] overflow-hidden border-2 border-primary group-hover:border-accent/40 transition-all shadow-2xl relative z-10">
                       {selectedUser ? (
                          <img src={getAvatarSrc(selectedUser)} className="w-full h-full object-cover" alt="" />
                       ) : (
                          <img src={selectedGroup.groupImage || "/favicon.svg"} className="w-full h-full object-cover" alt="" />
                       )}
                    </div>
                    <div className="absolute -inset-1 rounded-[1.4rem] blur-md opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" style={{ backgroundColor: themeColor }} />
                 </div>
                 
                 <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-primary truncate tracking-tight leading-none mb-1.5 group-hover:text-accent transition-colors">
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
                             <ShieldCheck size={10} className="text-secondary opacity-40" />
                             <span className="text-[11px] font-semibold text-secondary opacity-60">Offline</span>
                       </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        ) : (
           <div className="flex-1 flex items-center gap-4 animate-in slide-in-from-right-4 duration-300">
              <button onClick={() => { setIsSearching(false); setSearchQuery(""); }} className="p-2 text-secondary hover:text-primary transition-all">
                 <ArrowLeft size={20} />
              </button>
              <div className="flex-1 relative">
                 <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-30" />
                 <input 
                    type="text"
                    autoFocus
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface border border-primary rounded-full py-2.5 pl-10 pr-4 text-sm text-primary focus:outline-none placeholder:text-secondary"
                 />
              </div>
           </div>
        )}

        <div className="flex items-center gap-4 text-secondary ml-4">
           {!isSearching && (
             <button onClick={() => setIsSearching(true)} className="p-2.5 bg-surface border border-primary rounded-xl hover:text-primary transition-all">
                <Search size={18} />
             </button>
           )}
           <button 
             onClick={() => setIsInfoModalOpen(true)}
             className="p-2.5 bg-surface border border-primary rounded-xl hover:text-primary transition-all"
           >
              <Info size={18} />
           </button>
        </div>
      </header>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-8 space-y-6 sm:space-y-10 custom-scrollbar pb-40 sm:pb-44 relative z-10">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message, idx) => {
            const senderIdString = (message.senderId?._id || message.senderId)?.toString();
            const myIdString = authUser?._id?.toString();
            const isMine = senderIdString === myIdString;

            const emojiCount = getEmojiCount(message.text);
            const isBigEmoji = emojiCount > 0 && emojiCount <= 3 && !message.image && !message.isDeleted;

            return (
              <div 
                key={message._id} 
                className={`flex w-full mb-6 ${isMine ? "justify-end" : "justify-start"} group/msg relative`}
              >
                
                <div className={`flex items-end gap-2 sm:gap-3 max-w-[92%] sm:max-w-[85%] lg:max-w-[70%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                   
                   {!isMine && (selectedGroup || message.groupId) && (
                      <div className="size-9 rounded-xl overflow-hidden border border-primary flex-shrink-0 mb-6 shadow-xl relative z-10">
                         <img src={getAvatarSrc(message.senderId)} className="w-full h-full object-cover" alt="Avatar" />
                      </div>
                   )}

                   <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                      
                      {!isMine && (selectedGroup || message.groupId) && (
                         <span 
                           className="text-[11px] font-semibold mb-1.5 ml-1"
                           style={{ color: getUserColor(message.senderId?.username) }}
                         >
                            {message.senderId?.username || "Unknown user"}
                         </span>
                      )}

                      <div className="flex items-center gap-2 group relative">
                         {isMine && !message.isDeleted && (
                           <button 
                             onClick={() => setMessageToDelete(message._id)}
                             className="opacity-0 group-hover:opacity-100 p-2 text-secondary hover:text-red-500 transition-all active:scale-90 order-last"
                           >
                             <Trash2 size={16} />
                           </button>
                         )}

                         {!isMine && !message.isDeleted && (
                            <button onClick={() => setForwardingMessage(message)} className="opacity-0 group-hover:opacity-100 p-2 text-secondary hover:text-primary transition-all order-first">
                               <Forward size={16} />
                            </button>
                         )}
                         
                         <div 
                           className={`relative transition-all duration-500 ${
                             isBigEmoji 
                             ? "bg-transparent" 
                                 : `px-4 sm:px-6 py-3 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl ${
                                 isMine 
                                 ? "bg-surface text-primary border border-primary rounded-tr-none" 
                                 : "bg-secondary/40 border border-primary text-primary rounded-tl-none"
                               } ${message.isDeleted ? "opacity-40 italic" : ""}`
                           }`}
                         >
                            <div className={`absolute -bottom-3 ${isMine ? "right-4" : "left-4"} flex items-center gap-1 z-20`}>
                               {message.reactions?.map((reaction, rIdx) => (
                                  <div key={rIdx} className="bg-secondary/80 border border-primary px-1.5 py-0.5 rounded-full text-[12px] shadow-lg animate-in zoom-in">
                                     {reaction.emoji}
                                  </div>
                               ))}
                            </div>

                            {!message.isDeleted && (
                               <button 
                                 onClick={() => setActiveMessageMenu(activeMessageMenu === message._id ? null : message._id)}
                                 className={`absolute -top-3 ${isMine ? "-left-3" : "-right-3"} size-8 bg-primary border border-primary rounded-full flex items-center justify-center text-secondary opacity-0 group-hover:opacity-100 transition-all hover:text-accent z-30`}
                               >
                                 <SmilePlus size={16} />
                               </button>
                            )}

                            {activeMessageMenu === message._id && (
                              <div className={`absolute bottom-full mb-3 ${isMine ? "right-0" : "left-0"} bg-primary/95 border border-primary p-1.5 rounded-full flex items-center gap-0.5 shadow-2xl z-[100] animate-in slide-in-from-bottom-2 duration-300`}>
                                 {QUICK_REACTIONS.map(emoji => (
                                   <button 
                                     key={emoji}
                                     onClick={() => {
                                       reactToMessage(message._id, emoji);
                                       setActiveMessageMenu(null);
                                     }}
                                     className="size-9 hover:bg-surface rounded-full flex items-center justify-center text-xl transition-all active:scale-150 hover:scale-110"
                                   >
                                     {emoji}
                                   </button>
                                 ))}
                              </div>
                            )}

                            {message.text && (
                              <p className={`leading-relaxed whitespace-pre-wrap relative z-10 ${
                                isBigEmoji 
                                ? `text-6xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] ${emojiCount > 1 ? "text-5xl" : "text-7xl"}` 
                                : "text-[14px] font-medium tracking-tight"
                              }`}>
                                {searchQuery ? (
                                  message.text.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => (
                                    part.toLowerCase() === searchQuery.toLowerCase() ? (
                                      <mark key={i} className="bg-yellow-500/30 text-yellow-500 p-0 rounded-sm">{part}</mark>
                                    ) : part
                                  ))
                                ) : message.text}
                              </p>
                            )}

                            {message.image && (
                              <div className="mt-3 rounded-2xl overflow-hidden border border-primary shadow-inner relative group/img">
                                 <img src={message.image} className="max-w-full h-auto object-cover transition-transform duration-700 group-hover/img:scale-110" alt="" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                              </div>
                            )}
                         </div>
                      </div>
                      
                      <div className={`flex items-center gap-3 mt-2.5 px-3 ${isMine ? "justify-end" : "justify-start"}`}>
                         <span className="text-[10px] font-medium text-secondary opacity-60">
                            {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "NOW"}
                         </span>
                         {isMine && !selectedGroup && !message.isDeleted && (
                           <div className="flex items-center gap-1">
                              <CheckCheck size={14} className={message.isSeen ? "text-blue-500" : "text-secondary opacity-30"} strokeWidth={3} />
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30 select-none px-4 text-center">
             <div className="p-10 border-2 border-dashed border-primary rounded-[3rem]">
                <MessageSquare size={80} className="text-primary" />
             </div>
             <p className="text-sm font-semibold text-primary">No messages yet.</p>
          </div>
        )}
        <div ref={scrollRef} className="h-32 w-full" />
      </div>

      {forwardingMessage && (
        <ForwardModal 
          message={forwardingMessage} 
          onClose={() => setForwardingMessage(null)} 
        />
      )}

      {isInfoModalOpen && (
        <ChatInfoModal onClose={() => setIsInfoModalOpen(false)} />
      )}

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

      <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 lg:p-6 bg-gradient-to-t from-primary via-primary/95 to-transparent z-40">
        <div className="max-w-4xl mx-auto">
           <MessageInput />
        </div>
      </div>

    </div>
  );
};

export default ChatContainer;
