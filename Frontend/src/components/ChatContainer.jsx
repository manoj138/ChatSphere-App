import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Loader2, CheckCheck, Users, Calendar } from "lucide-react";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { 
    messages = [], getMessages, getGroupMessages, isMessagesLoading, 
    selectedUser, selectedGroup, markMessagesAsSeen 
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const { themeColor } = useThemeStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
        getMessages(selectedUser._id);
        markMessagesAsSeen(selectedUser._id);
    } else if (selectedGroup?._id) {
        getGroupMessages(selectedGroup._id);
    }
  }, [selectedUser?._id, selectedGroup?._id, getMessages, getGroupMessages, markMessagesAsSeen]);

  useEffect(() => {
    if (scrollRef.current && messages) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getEmojiCount = (str) => {
    const emojiMatch = str.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g);
    if (emojiMatch && emojiMatch.length === [...str].length) {
      return emojiMatch.length;
    }
    return 0;
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#080808]">
        <div className="relative">
           <Loader2 className="size-12 animate-spin" style={{ color: themeColor }} />
           <div className="absolute inset-0 blur-xl opacity-20" style={{ backgroundColor: themeColor }} />
        </div>
        <p className="mt-6 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">Connecting Sphere</p>
      </div>
    );
  }

  const activeChat = selectedUser || selectedGroup;
  if (!activeChat) return null;

  return (
    <div className="flex-1 flex flex-col bg-[#080808] relative overflow-hidden">
      
      {/* Immersive Header */}
      <header className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-2xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
           <div className="relative">
              <div className="size-11 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                 {selectedUser ? (
                    <img src={selectedUser.profilePicture || "/avatar.png"} className="w-full h-full object-cover" alt="" />
                 ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-400">
                       <Users size={20} />
                    </div>
                 )}
              </div>
              {selectedUser && <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-green-500 border-4 border-[#0a0a0a] rounded-full" />}
           </div>
           <div className="min-w-0">
              <h3 className="text-sm font-black text-white truncate uppercase tracking-tight">{activeChat.username || activeChat.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                 <div className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                 <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                    {selectedUser ? "Encrypted Session" : `${selectedGroup.members?.length} Contributors`}
                 </span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="p-2.5 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors cursor-pointer">
              <Calendar size={18} />
           </div>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {messages.map((message, idx) => {
          const isMine = message.senderId === authUser._id || message.senderId?._id === authUser._id;
          const emojiCount = message.text ? getEmojiCount(message.text) : 0;
          const isBigEmoji = emojiCount > 0 && emojiCount <= 3;
          
          // Group consecutive messages logic could go here
          
          return (
            <div key={message._id} ref={scrollRef} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
               {selectedGroup && !isMine && (
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1.5 ml-2">
                    {message.senderId?.username || "Guest"}
                 </span>
               )}

               <div className={`group relative max-w-[75%] ${isBigEmoji ? "p-0" : "space-y-1"}`}>
                  <div className={`relative transition-all duration-300 ${
                    isBigEmoji 
                    ? "bg-transparent" 
                    : `p-4 rounded-[1.5rem] shadow-xl ${
                        isMine 
                        ? "text-black rounded-tr-none" 
                        : "bg-[#111] border border-white/5 text-gray-200 rounded-tl-none"
                    }`
                  }`}
                  style={isMine && !isBigEmoji ? { backgroundColor: themeColor } : {}}
                  >
                     {message.text && (
                       <p className={`leading-relaxed whitespace-pre-wrap ${
                         isBigEmoji 
                         ? `text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] ${emojiCount > 1 ? "text-4xl" : "text-6xl"}` 
                         : "text-sm font-medium"
                       }`}>
                         {message.text}
                       </p>
                     )}

                     {message.image && (
                       <div className="mt-2 rounded-xl overflow-hidden border border-black/10 shadow-2xl">
                          <img src={message.image} className="max-w-full h-auto object-cover" alt="" />
                       </div>
                     )}
                  </div>

                  <div className={`flex items-center gap-2 mt-1.5 px-1 ${isMine ? "justify-end" : "justify-start"}`}>
                     <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                     {isMine && !selectedGroup && (
                        <CheckCheck size={12} className={message.isSeen ? "text-blue-500" : "text-gray-700"} />
                     )}
                  </div>
               </div>
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20">
             <div className="size-20 bg-white/5 rounded-[2rem] flex items-center justify-center rotate-12">
                <MessageSquare size={32} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Void Sphere</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-gradient-to-t from-[#080808] to-transparent">
         <MessageInput />
      </div>

    </div>
  );
};

export default ChatContainer;
