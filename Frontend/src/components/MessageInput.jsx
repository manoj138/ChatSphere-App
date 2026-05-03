import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

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

      // Clear form after sending
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full bg-[#0a0a0a]/50 backdrop-blur-lg border-t border-white/5">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-2xl border border-[#bef264]/20 shadow-2xl"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500
              flex items-center justify-center transition-transform hover:scale-110 shadow-lg"
              type="button"
            >
              <X className="size-3 text-white" />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest animate-pulse">Image attached</p>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-[#111] border border-white/5 rounded-2xl px-4 py-1.5 focus-within:border-[#bef264]/30 transition-all shadow-inner">
          <button
            type="button"
            className="text-gray-500 hover:text-[#bef264] transition-colors"
          >
            <Smile size={22} />
          </button>
          
          <input
            type="text"
            className="w-full bg-transparent border-none py-3 text-sm focus:outline-none text-white placeholder:text-gray-600 font-medium"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`flex items-center justify-center transition-colors ${
              imagePreview ? "text-[#bef264]" : "text-gray-500 hover:text-[#bef264]"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </button>
        </div>

        <button
          type="submit"
          className={`size-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
            text.trim() || imagePreview 
            ? "bg-[#bef264] text-black scale-100 hover:scale-105 active:scale-95" 
            : "bg-white/5 text-gray-700 scale-90 cursor-not-allowed"
          }`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} className={text.trim() || imagePreview ? "translate-x-0.5 -translate-y-0.5" : ""} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
