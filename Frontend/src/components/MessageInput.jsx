import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { Image, Send, X, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";
import { EMOJI_MAP, EMOJI_LIST } from "../lib/emojis";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
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
    if (e) e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      setSuggestion(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setText(val);

    const words = val.split(" ");
    const lastWord = words[words.length - 1].toLowerCase();
    
    if (lastWord.length > 2 && EMOJI_MAP[lastWord]) {
      setSuggestion({ word: lastWord, emoji: EMOJI_MAP[lastWord] });
    } else {
      setSuggestion(null);
    }
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    const words = text.split(" ");
    words[words.length - 1] = suggestion.emoji;
    setText(words.join(" ") + " ");
    setSuggestion(null);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Suggestions Badge */}
      {suggestion && (
        <button 
          onClick={applySuggestion}
          className="absolute -top-12 left-4 bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 shadow-2xl group"
        >
           <span className="text-xl">{suggestion.emoji}</span>
           <div className="text-left">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Press to insert</p>
              <p className="text-[10px] font-bold text-white">Replace "{suggestion.word}"</p>
           </div>
        </button>
      )}

      {/* Image Preview Overlay */}
      {imagePreview && (
        <div className="absolute -top-32 left-0 p-4 bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in zoom-in-95">
          <div className="relative size-20 rounded-2xl overflow-hidden border border-white/10">
            <img src={imagePreview} className="w-full h-full object-cover" alt="" />
            <button onClick={removeImage} className="absolute top-1 right-1 bg-black/60 p-1 rounded-lg hover:bg-black transition-colors">
              <X size={12} />
            </button>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Image Ready</p>
        </div>
      )}

      {/* Main Input Capsule */}
      <form onSubmit={handleSendMessage} className="bg-[#111]/80 backdrop-blur-3xl border border-white/10 p-2 rounded-[2.5rem] flex items-center gap-2 shadow-2xl relative z-30">
        
        <button 
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-3.5 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"
        >
          <Smile size={22} />
        </button>

        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm font-medium placeholder:text-gray-600"
          placeholder="Enter your message..."
          value={text}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />

        <div className="flex items-center gap-1 pr-2">
           <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"
           >
             <Paperclip size={20} />
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
           </button>

           <button 
            type="submit"
            disabled={!text.trim() && !imagePreview}
            className="size-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:grayscale shadow-lg active:scale-90"
            style={{ backgroundColor: themeColor, color: "#000" }}
           >
             <Send size={20} fill="currentColor" />
           </button>
        </div>
      </form>

      {/* Aesthetic Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-0 w-72 h-80 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 z-40">
           <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pick Emotion</span>
              <button onClick={() => setShowEmojiPicker(false)} className="p-1 hover:bg-white/10 rounded-lg"><X size={14} /></button>
           </div>
           <div className="p-4 grid grid-cols-5 gap-2 overflow-y-auto h-[calc(100%-60px)] custom-scrollbar">
              {EMOJI_LIST.map((category) => (
                category.emojis.map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => { setText(prev => prev + emoji); setShowEmojiPicker(false); }}
                    className="text-2xl p-2 hover:bg-white/5 rounded-xl transition-all hover:scale-125"
                  >
                    {emoji}
                  </button>
                ))
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
