import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Loader2, CheckCheck, Users, MessageSquare } from "lucide-react";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { 
    messages = [], getMessages, getGroupMessages, isMessagesLoading, 
    selectedUser, selectedGroup, markMessagesAsSeen, typingStatus 
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const { themeColor } = useThemeStore();
  const scrollRef = useRef(null);

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
    if (scrollRef.current && messages?.length > 0) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const getEmojiCount = (str) => {
    if (!str) return 0;
    const emojiMatch = str.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g);
    if (emojiMatch && emojiMatch.length === [...str].length) {
      return emojiMatch.length;
    }
    return 0;
  };

  const getAvatarSrc = (user) => {
    if (user.profilePicture) return user.profilePicture;
    const idNum = user._id ? user._id.charCodeAt(user._id.length - 1) : 0;
    const isBoy = idNum % 2 === 0;
    if (isBoy) {
        return `/boy_${(idNum % 5) + 1}.png?v=3`;
    } else {
        return `/girl_${(idNum % 4) + 1}.png?v=3`;
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#080808]">
        <Loader2 className="size-10 animate-spin" style={{ color: themeColor }} />
        <p className="mt-4 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">Syncing Feed</p>
      </div>
    );
  }

  const activeChat = selectedUser || selectedGroup;
  if (!activeChat) return null;

  return (
    <div className="flex-1 flex flex-col bg-[#080808] relative overflow-hidden h-full">
      
      <header className="p-4 border-b border-white/5 flex items-center gap-4 bg-[#0a0a0a]/80 backdrop-blur-xl z-20">
        <div className="size-11 rounded-2xl overflow-hidden border border-white/10 shadow-lg flex-shrink-0">
           {selectedUser ? (
              <img src={getAvatarSrc(selectedUser)} className="w-full h-full object-cover" alt="" />
           ) : (
              <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500">
                 <Users size={20} />
              </div>
           )}
        </div>
        <div className="min-w-0 flex-1">
           <h3 className="text-sm font-black text-white truncate uppercase tracking-tight">
              {selectedUser ? selectedUser.username : selectedGroup.name}
           </h3>
           <div className="flex items-center gap-2 mt-0.5">
              {isTyping ? (
                 <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] animate-pulse" style={{ color: themeColor }}>typing</span>
                    <div className="flex gap-0.5">
                       <div className="size-0.5 rounded-full animate-bounce" style={{ backgroundColor: themeColor }} />
                       <div className="size-0.5 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: themeColor }} />
                       <div className="size-0.5 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: themeColor }} />
                    </div>
                 </div>
              ) : (
                 <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600">
                    {selectedUser ? "Secure Direct Link" : `${selectedGroup.members?.length || 0} Nodes Connected`}
                 </p>
              )}
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32">
        {messages && messages.length > 0 ? (
          messages.map((message) => {
            const senderId = typeof message.senderId === 'string' ? message.senderId : message.senderId?._id;
            const isMine = senderId === authUser?._id;
            
            const emojiCount = getEmojiCount(message.text);
            const isBigEmoji = emojiCount > 0 && emojiCount <= 3;

            return (
              <div key={message._id} ref={scrollRef} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                {!isMine && selectedGroup && (
                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1.5 ml-2">
                      {message.senderId?.username || "Member"}
                   </span>
                )}
                
                <div className={`relative max-w-[80%] lg:max-w-[70%] ${isBigEmoji ? "p-0" : "space-y-1"}`}>
                   <div 
                    className={`relative transition-all ${
                      isBigEmoji 
                      ? "bg-transparent shadow-none" 
                      : `p-4 rounded-[1.5rem] shadow-xl ${
                          isMine ? "text-black rounded-tr-none" : "bg-[#111] border border-white/5 text-gray-200 rounded-tl-none"
                        }`
                    }`}
                    style={isMine && !isBigEmoji ? { backgroundColor: themeColor } : {}}
                   >
                      {message.text && (
                        <p className={`leading-relaxed whitespace-pre-wrap ${
                          isBigEmoji 
                          ? `text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] ${emojiCount > 1 ? "text-4xl" : "text-6xl"}` 
                          : "text-sm font-semibold"
                        }`}>
                          {message.text}
                        </p>
                      )}
                      {message.image && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-black/20 shadow-2xl">
                           <img src={message.image} className="max-w-full h-auto object-cover" alt="" />
                        </div>
                      )}
                   </div>
                   
                   <div className={`flex items-center gap-2 mt-1.5 px-2 ${isMine ? "justify-end" : "justify-start"}`}>
                      <span className="text-[8px] font-black uppercase text-gray-600">
                         {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                      {isMine && !selectedGroup && (
                        <CheckCheck size={12} className={message.isSeen ? "text-blue-500" : "text-gray-700"} />
                      )}
                   </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-10">
             <MessageSquare size={48} />
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Sphere is silent</p>
          </div>
        )}
        
        {isTyping && (
           <div className="flex items-center gap-2 opacity-50 ml-2 animate-in fade-in slide-in-from-bottom-2">
              <div className="size-6 rounded-lg bg-white/5 flex items-center justify-center">
                 <Loader2 size={12} className="animate-spin" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest italic">Interpreting signal...</span>
           </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent z-10">
        <MessageInput />
      </div>

    </div>
  );
};

export default ChatContainer;
