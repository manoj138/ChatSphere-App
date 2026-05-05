import { useRef, useState } from "react"; 
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from 'emoji-picker-react';
import { useThemeStore } from "../store/useThemeStore";
import { optimizeImageFile } from "../lib/image";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, sendTypingStatus } = useChatStore();
  const { themeColor, isLightMode } = useThemeStore();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const optimizedImage = await optimizeImageFile(file);
      setImagePreview(optimizedImage);
    } catch (error) {
      toast.error(error.message || "Failed to process image");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsProcessingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isSending || isProcessingImage || (!text.trim() && !imagePreview)) return;

    try {
      setIsSending(true);
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
    } finally {
      setIsSending(false);
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
      {(imagePreview || isProcessingImage) && (
        <div className="absolute bottom-full left-0 mb-4 animate-in zoom-in-95 duration-300">
          <div className="app-modal relative group rounded-[1.5rem] p-1.5 shadow-2xl overflow-hidden">
            <div className="relative size-24 sm:size-32">
              {isProcessingImage ? (
                <div className="flex size-full items-center justify-center rounded-[1rem] bg-secondary/50 backdrop-blur-md">
                   <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="size-full rounded-[1rem] border border-white/10 object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 size-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110 shadow-lg z-10"
                    type="button"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                  <div className="absolute inset-0 bg-black/20 rounded-[1rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker Overlay */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 mb-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
           <div className="rounded-[2rem] overflow-hidden border border-primary shadow-[0_0_50px_rgba(0,0,0,0.4)]">
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                theme={isLightMode ? "light" : "dark"}
                lazyLoadEmojis={true}
                searchPlaceholder="Search emojis..."
                width={300}
                height={400}
              />
           </div>
        </div>
      )}

      {/* Main Console Input */}
      <form onSubmit={handleSendMessage} className="relative group">
        
        {/* Glow Effect */}
        <div className="absolute -inset-1 rounded-full blur-md opacity-10 group-focus-within:opacity-30 transition-opacity" style={{ backgroundColor: themeColor }} />

        <div className="relative flex items-center gap-2 overflow-hidden rounded-full border border-primary bg-secondary/95 p-1.5 shadow-2xl backdrop-blur-2xl transition-all duration-500">
           
           {/* Utility Buttons Area */}
           <div className="ml-1 flex items-center gap-0.5">
              <button
                type="button"
                className={`rounded-full p-2.5 transition-all ${imagePreview ? "bg-green-500/10 text-green-500" : "text-secondary hover:bg-secondary/10 hover:text-primary"}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending || isProcessingImage}
              >
                <Image size={18} />
              </button>
              <button
                type="button"
                className={`rounded-full p-2.5 transition-all ${showEmojiPicker ? "bg-yellow-500/10 text-yellow-500" : "text-secondary hover:bg-secondary/10 hover:text-primary"}`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={isSending || isProcessingImage}
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
           <div className="relative flex-1">
              <input
                type="text"
                className="w-full bg-transparent border-none px-1 py-2 text-[14px] font-medium text-primary placeholder:text-gray-500 focus:outline-none"
                placeholder="Type a message..."
                value={text}
                onChange={handleTyping}
                disabled={isSending}
              />
           </div>

           {/* Transmission Button - Compact Pill */}
           <button
             type="submit"
             disabled={isSending || isProcessingImage || (!text.trim() && !imagePreview)}
             className="mr-1 flex size-10 flex-shrink-0 items-center justify-center rounded-full shadow-xl transition-all group/btn disabled:grayscale disabled:opacity-20"
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
