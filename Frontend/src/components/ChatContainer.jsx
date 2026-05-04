import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Loader2, CheckCheck, Users, MessageSquare, Zap, ShieldCheck } from "lucide-react";
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
    if (emojiMatch && emojiMatch.length === [...str].length) return emojiMatch.length;
    return 0;
  };

  const getAvatarSrc = (user) => {
    if (user.profilePicture) return user.profilePicture;
    const idNum = user._id ? user._id.charCodeAt(user._id.length - 1) : 0;
    const isBoy = idNum % 2 === 0;
    return isBoy ? `/boy_${(idNum % 5) + 1}.png?v=3` : `/girl_${(idNum % 4) + 1}.png?v=3`;
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative">
           <div className="size-16 rounded-full border-t-2 border-r-2 animate-spin" style={{ borderColor: themeColor }} />
           <MessageSquare className="absolute inset-0 m-auto text-white/20" size={24} />
        </div>
        <p className="mt-6 text-[10px] text-gray-700 font-black uppercase tracking-[0.5em] animate-pulse">Establishing Signal...</p>
      </div>
    );
  }

  const activeChat = selectedUser || selectedGroup;
  if (!activeChat) return null;

  return (
    <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden h-full font-sans">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -right-24 size-64 blur-[120px] opacity-10 pointer-events-none" style={{ backgroundColor: themeColor }} />
      <div className="absolute bottom-1/4 -left-24 size-64 blur-[120px] opacity-5 pointer-events-none" style={{ backgroundColor: themeColor }} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />

      {/* Futuristic Header */}
      <header className="px-8 py-5 border-b border-white/[0.03] flex items-center justify-between bg-black/40 backdrop-blur-2xl z-30">
        <div className="flex items-center gap-4">
           <div className="relative group">
              <div className="size-12 rounded-[1.2rem] overflow-hidden border-2 border-white/5 group-hover:border-white/10 transition-all shadow-2xl relative z-10">
                 {selectedUser ? (
                    <img src={getAvatarSrc(selectedUser)} className="w-full h-full object-cover" alt="" />
                 ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500">
                       <Users size={20} />
                    </div>
                 )}
              </div>
              <div className="absolute -inset-1 rounded-[1.4rem] blur-md opacity-20 pointer-events-none" style={{ backgroundColor: themeColor }} />
           </div>
           
           <div className="min-w-0">
              <h3 className="text-base font-black text-white truncate uppercase tracking-tight leading-none mb-1.5">
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
                       <span className="text-[9px] font-black uppercase tracking-widest italic" style={{ color: themeColor }}>Synchronizing...</span>
                    </div>
                 ) : (
                    <div className="flex items-center gap-1.5">
                       <ShieldCheck size={10} className="text-gray-700" />
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-700">Encrypted Signal</span>
                    </div>
                 )}
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
           <button className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl hover:text-white transition-all"><Zap size={18} /></button>
           <button className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl hover:text-white transition-all"><MessageSquare size={18} /></button>
        </div>
      </header>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar pb-36 relative z-10">
        {messages && messages.length > 0 ? (
          messages.map((message, idx) => {
            const senderId = typeof message.senderId === 'string' ? message.senderId : message.senderId?._id;
            const isMine = senderId === authUser?._id;
            const emojiCount = getEmojiCount(message.text);
            const isBigEmoji = emojiCount > 0 && emojiCount <= 3;

            return (
              <div 
                key={message._id} 
                ref={scrollRef} 
                className={`flex flex-col ${isMine ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {!isMine && selectedGroup && (
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 mb-2 ml-4">
                      {message.senderId?.username || "Node Member"}
                   </span>
                )}
                
                <div className={`relative max-w-[85%] lg:max-w-[70%] group`}>
                   <div 
                    className={`relative transition-all duration-300 ${
                      isBigEmoji 
                      ? "bg-transparent" 
                      : `px-6 py-4 rounded-[2rem] shadow-2xl ${
                          isMine 
                          ? "bg-white/[0.05] text-white border border-white/10 rounded-tr-none hover:bg-white/[0.08]" 
                          : "bg-[#111] border border-white/5 text-gray-200 rounded-tl-none hover:bg-[#151515]"
                        }`
                    }`}
                   >
                      {/* Glow effect for my messages */}
                      {isMine && !isBigEmoji && (
                        <div className="absolute -inset-0.5 rounded-[2rem] rounded-tr-none blur-sm opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: themeColor }} />
                      )}

                      {message.text && (
                        <p className={`leading-relaxed whitespace-pre-wrap relative z-10 ${
                          isBigEmoji 
                          ? `text-6xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] filter grayscale-[0.2] ${emojiCount > 1 ? "text-5xl" : "text-7xl"}` 
                          : "text-sm font-bold tracking-tight"
                        }`}>
                          {message.text}
                        </p>
                      )}

                      {message.image && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 shadow-inner relative group/img">
                           <img src={message.image} className="max-w-full h-auto object-cover transition-transform duration-700 group-hover/img:scale-110" alt="" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                        </div>
                      )}
                   </div>
                   
                   <div className={`flex items-center gap-3 mt-2 px-3 ${isMine ? "justify-end" : "justify-start"}`}>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-800">
                         {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                      {isMine && !selectedGroup && (
                        <div className="flex items-center gap-1">
                           <CheckCheck size={14} className={message.isSeen ? "text-blue-500" : "text-gray-800"} strokeWidth={3} />
                        </div>
                      )}
                   </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-5 select-none">
             <div className="p-10 border-2 border-dashed border-white/20 rounded-[3rem]">
                <MessageSquare size={80} />
             </div>
             <p className="text-sm font-black uppercase tracking-[1em]">Secure Zone Empty</p>
          </div>
        )}
      </div>

      {/* Input Console */}
      <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-40">
        <div className="max-w-4xl mx-auto">
           <MessageInput />
        </div>
      </div>

    </div>
  );
};

export default ChatContainer;
