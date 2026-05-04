import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Zap } from "lucide-react";
import toast from "react-hot-toast";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
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

  const addEmoji = (emoji) => {
    setText(text + emoji.native);
  };

  return (
    <div className="w-full relative animate-in slide-in-from-bottom-8 duration-700">
      
      {/* Image Preview Floating Card */}
      {imagePreview && (
        <div className="absolute bottom-full left-0 mb-4 animate-in zoom-in-95 duration-300">
          <div className="relative group p-2 bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-2xl">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-32 object-cover rounded-[1.5rem] border border-white/5"
            />
            <button
              onClick={removeImage}
              className="absolute -top-3 -right-3 size-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              type="button"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* Emoji Picker Overlay */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
           <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <Picker 
                data={data} 
                onEmojiSelect={addEmoji} 
                theme="dark"
                skinTonePosition="none"
                previewPosition="none"
              />
           </div>
        </div>
      )}

      {/* Main Console Input */}
      <form onSubmit={handleSendMessage} className="relative group">
        
        {/* Glow Effect */}
        <div className="absolute -inset-1 rounded-[2.5rem] blur-md opacity-20 group-focus-within:opacity-40 transition-opacity" style={{ backgroundColor: themeColor }} />

        <div className="relative flex items-center gap-3 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-3 rounded-[2.5rem] shadow-2xl overflow-hidden">
           
           {/* Utility Buttons Area */}
           <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                className={`p-3 rounded-full transition-all ${imagePreview ? "text-green-500 bg-green-500/10" : "text-gray-600 hover:text-white hover:bg-white/5"}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Image size={20} />
              </button>
              <button
                type="button"
                className={`p-3 rounded-full transition-all ${showEmojiPicker ? "text-yellow-500 bg-yellow-500/10" : "text-gray-600 hover:text-white hover:bg-white/5"}`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={20} />
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
                className="w-full bg-transparent border-none text-white text-sm font-bold placeholder:text-gray-800 placeholder:uppercase placeholder:tracking-[0.2em] focus:outline-none py-3 px-2"
                placeholder="Transmit Signal..."
                value={text}
                onChange={handleTyping}
              />
           </div>

           {/* Transmission Button */}
           <button
             type="submit"
             disabled={!text.trim() && !imagePreview}
             className="p-4 rounded-2xl transition-all shadow-xl flex items-center justify-center group/btn disabled:opacity-20 disabled:grayscale"
             style={{ backgroundColor: themeColor }}
           >
             <Send size={20} className="text-black group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" strokeWidth={3} />
           </button>

           <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
        </div>
      </form>

      {/* Security Tagline */}
      <div className="flex items-center justify-center gap-2 mt-4 opacity-20">
         <Zap size={10} style={{ color: themeColor }} />
         <p className="text-[8px] font-black uppercase tracking-[0.4em]">Proprietary Sphere Protocol v3.1</p>
      </div>

    </div>
  );
};

export default MessageInput;
