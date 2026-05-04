import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader2, Check, CheckCheck, Users } from "lucide-react";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { 
    messages = [], getMessages, getGroupMessages, isMessagesLoading, 
    selectedUser, selectedGroup, markMessagesAsSeen 
  } = useChatStore();
  
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
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050505]">
        <Loader2 className="size-10 animate-spin text-[#bef264]" />
        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Sphere...</p>
      </div>
    );
  }

  const activeChat = selectedUser || selectedGroup;
  if (!activeChat) return null;

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-[#050505] relative">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
        <div className="relative">
            {selectedUser ? (
                <img src={selectedUser.profilePicture || "/avatar.png"} alt="" className="size-10 rounded-xl border border-white/10 object-cover" />
            ) : (
                <div className="size-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 text-[#bef264]">
                    <Users size={20} />
                </div>
            )}
            {selectedUser && <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />}
        </div>
        <div>
            <h3 className="font-bold text-white leading-none">{activeChat.username || activeChat.name}</h3>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider mt-1">
                {selectedUser ? "Active Now" : `${selectedGroup.members?.length || 0} Members Online`}
            </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-10">
        {messages?.map((message) => {
          const emojiCount = message.text ? getEmojiCount(message.text) : 0;
          const isOnlyEmoji = emojiCount > 0 && emojiCount <= 3;
          const isOwnMessage = message.senderId === (selectedUser ? useChatStore.getState().selectedUser?._id : useChatStore.getState().selectedGroup?._id) 
                              ? false : true; // This is a bit tricky, let's simplify

          // Correct logic for 'isOwnMessage'
          const currentUserId = useAuthStore.getState().authUser?._id;
          const isMine = message.senderId === currentUserId;

          return (
            <div
              key={message?._id}
              ref={scrollRef}
              className={`flex flex-col ${!isMine ? "items-start" : "items-end"}`}
            >
              {selectedGroup && !isMine && (
                <p className="text-[9px] text-gray-500 font-bold uppercase mb-1 ml-1">{message.senderId?.username || "Member"}</p>
              )}
              <div
                className={`max-w-[70%] relative group transition-all ${
                  isOnlyEmoji 
                  ? "bg-transparent shadow-none p-0"
                  : `p-4 rounded-2xl shadow-2xl ${
                    !isMine
                      ? "bg-[#111] border border-white/5 text-gray-200 rounded-tl-none"
                      : "bg-[#bef264] text-black font-semibold rounded-tr-none"
                  }`
                }`}
              >
                {message?.text && (
                  <p className={`leading-relaxed whitespace-pre-wrap ${
                    isOnlyEmoji 
                    ? `text-5xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] ${emojiCount > 1 ? "text-4xl" : "text-6xl"}` 
                    : "text-sm"
                  }`}>
                    {message.text}
                  </p>
                )}
                
                {message?.image && (
                  <img src={message.image} alt="" className="max-w-[280px] sm:max-w-[350px] rounded-lg mt-2 shadow-xl border border-black/10" />
                )}
                
                <div className={`flex items-center gap-1 mt-1.5 ${
                  isOnlyEmoji 
                  ? "absolute -bottom-6 right-0 bg-[#bef264] text-black px-2 py-0.5 rounded-full shadow-lg border border-[#bef264]/50" 
                  : (!isMine ? "justify-start opacity-60" : "justify-end opacity-60")
                }`}>
                   <p className="text-[9px] uppercase font-bold tracking-tighter italic">
                      {message?.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                   </p>
                   
                   {isMine && !selectedGroup && (
                      <div className="ml-1">
                          {message?.isSeen ? <CheckCheck size={14} className="text-blue-500" /> : <CheckCheck size={14} className="text-gray-500" />}
                      </div>
                   )}
                </div>
              </div>
            </div>
          );
        })}
        
        {(!messages || messages.length === 0) && (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 space-y-4">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 className="size-6 opacity-20" />
             </div>
             <p className="italic text-sm font-medium">No messages in this sphere yet.</p>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
