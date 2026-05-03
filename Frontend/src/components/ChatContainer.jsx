import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader2 } from "lucide-react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050505]">
        <Loader2 className="size-10 animate-spin text-[#bef264]" />
        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Messages...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-[#050505]">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
        <img src={selectedUser.profilePicture || "/avatar.png"} alt="" className="size-10 rounded-xl border border-white/10" />
        <div>
            <h3 className="font-bold text-white leading-none">{selectedUser.username}</h3>
            <p className="text-xs text-green-500 font-medium">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.senderId === selectedUser._id ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl shadow-2xl ${
                message.senderId === selectedUser._id
                  ? "bg-[#111] border border-white/5 text-gray-200 rounded-tl-none"
                  : "bg-[#bef264] text-black font-medium rounded-tr-none"
              }`}
            >
              {message.text && <p>{message.text}</p>}
              {message.image && <img src={message.image} alt="Attachment" className="max-w-[200px] rounded-lg mt-2 shadow-lg" />}
              <p className={`text-[10px] mt-1 opacity-50 ${message.senderId === selectedUser._id ? "text-gray-500" : "text-black"}`}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 italic">
            No messages yet. Say hi to {selectedUser.username}!
          </div>
        )}
      </div>

      {/* Message Input Placeholder */}
      <div className="p-4 border-t border-white/5 bg-[#0a0a0a]/50">
          <div className="bg-[#111] border border-white/5 p-3 rounded-2xl text-gray-500 text-sm italic">
            Message Input goes here...
          </div>
      </div>
    </div>
  );
};

export default ChatContainer;
