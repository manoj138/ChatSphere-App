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
    <div className="relative w-full py-2">
      
      {/* Image Preview Floating Card */}
      {(imagePreview || isProcessingImage) && (
        <div className="absolute bottom-full left-0 mb-6 animate-scale-in">
          <div className="relative overflow-hidden rounded-[2rem] bg-white/80 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-black/5">
            <div className="relative size-28 sm:size-36">
              {isProcessingImage ? (
                <div className="flex size-full items-center justify-center rounded-[1.5rem] bg-accent/5">
                   <div className="size-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
                </div>
              ) : (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="size-full rounded-[1.5rem] object-cover shadow-inner"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-red-500 text-white shadow-xl transition-all hover:scale-110 hover:bg-red-600"
                    type="button"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker Overlay */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 z-50 mb-6 w-full max-w-[340px] animate-slide-up sm:max-w-[380px]">
           <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl ring-1 ring-black/5">
              <EmojiPicker 
                onEmojiClick={onEmojiClick}
                theme={isLightMode ? "light" : "dark"}
                lazyLoadEmojis={true}
                searchPlaceholder="Search expressions..."
                width="100%"
                height={400}
              />
           </div>
        </div>
      )}

      {/* Main Console Input */}
      <form onSubmit={handleSendMessage} className="relative">
        <div className="relative flex items-center gap-3 overflow-hidden rounded-[2rem] border-none bg-white/60 p-2 shadow-2xl backdrop-blur-3xl transition-all duration-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-accent/20">
           
           {/* Utility Buttons Area */}
           <div className="flex items-center gap-1 pl-1">
              <button
                type="button"
                className={`flex size-11 items-center justify-center rounded-2xl transition-all ${imagePreview ? "bg-accent text-black shadow-lg" : "text-gray-400 hover:bg-accent/10 hover:text-accent"}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending || isProcessingImage}
              >
                <Image size={22} />
              </button>
              <button
                type="button"
                className={`flex size-11 items-center justify-center rounded-2xl transition-all ${showEmojiPicker ? "bg-accent text-black shadow-lg" : "text-gray-400 hover:bg-accent/10 hover:text-accent"}`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={isSending || isProcessingImage}
              >
                <Smile size={22} />
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
                className="w-full bg-transparent border-none px-2 py-3.5 text-[15px] font-bold text-primary placeholder:font-medium placeholder:text-gray-400 focus:outline-none"
                placeholder="Compose a message..."
                value={text}
                onChange={handleTyping}
                disabled={isSending}
              />
           </div>

           {/* Transmission Button */}
           <button
             type="submit"
             disabled={isSending || isProcessingImage || (!text.trim() && !imagePreview)}
             className="flex size-12 flex-shrink-0 items-center justify-center rounded-[1.25rem] shadow-xl transition-all hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-20"
             style={{ backgroundColor: themeColor }}
           >
              <Send size={20} className="text-black transition-transform group-hover:translate-x-1" strokeWidth={3} />
           </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
