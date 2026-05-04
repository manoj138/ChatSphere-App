import { useRef, useState } from "react"; 
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Zap } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from 'emoji-picker-react';
import { useThemeStore } from "../store/useThemeStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, sendTypingStatus } = useChatStore();
  const { themeColor } = useThemeStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setShowEmojiPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      sendTypingStatus(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (e.target.value.length > 0) {
      sendTypingStatus(true);
    } else {
      sendTypingStatus(false);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="w-full relative py-2">
      
      {/* Image Preview Floating Card */}
      {imagePreview && (
        <div className="absolute bottom-full left-0 mb-4 animate-in zoom-in-95 duration-300">
          <div className="relative group p-1 bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] shadow-2xl">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-24 object-cover rounded-[1.2rem] border border-white/5"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              type="button"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* Emoji Picker Overlay */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
           <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                theme="dark"
                lazyLoadEmojis={true}
                searchPlaceholder="Search emojis..."
                width={300}
                height={400}
              />
           </div>
        </div>
      )}

      {/* Main Console Input - Made more Compact */}
      <form onSubmit={handleSendMessage} className="relative group">
        
        {/* Glow Effect */}
        <div className="absolute -inset-1 rounded-full blur-md opacity-10 group-focus-within:opacity-30 transition-opacity" style={{ backgroundColor: themeColor }} />

        <div className="relative flex items-center gap-2 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 p-1.5 rounded-full shadow-2xl overflow-hidden">
           
           {/* Utility Buttons Area */}
           <div className="flex items-center gap-0.5 ml-1">
              <button
                type="button"
                className={`p-2.5 rounded-full transition-all ${imagePreview ? "text-green-500 bg-green-500/10" : "text-gray-600 hover:text-white hover:bg-white/5"}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Image size={18} />
              </button>
              <button
                type="button"
                className={`p-2.5 rounded-full transition-all ${showEmojiPicker ? "text-yellow-500 bg-yellow-500/10" : "text-gray-600 hover:text-white hover:bg-white/5"}`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={18} />
              </button>
           </div>

           <input
             type="file"
             accept="image/*"
             className="hidden"
             ref={fileInputRef}
             onChange={handleImageChange}
           />

           {/* Command Input Area */}
           <div className="flex-1 relative">
              <input
                type="text"
                className="w-full bg-transparent border-none text-white text-sm font-medium placeholder:text-gray-700 placeholder:uppercase placeholder:tracking-[0.1em] focus:outline-none py-2 px-1"
                placeholder="Type a message..."
                value={text}
                onChange={handleTyping}
              />
           </div>

           {/* Transmission Button - Compact Pill */}
           <button
             type="submit"
             disabled={!text.trim() && !imagePreview}
             className="size-10 rounded-full transition-all shadow-xl flex items-center justify-center group/btn disabled:opacity-20 disabled:grayscale mr-1 flex-shrink-0"
             style={{ backgroundColor: themeColor }}
           >
             <Send size={16} className="text-black group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" strokeWidth={3} />
           </button>

        </div>
      </form>

    </div>
  );
};

export default MessageInput;
