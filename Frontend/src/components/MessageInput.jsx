import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";
import { EMOJI_CATEGORIES } from "../lib/emojis";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Smileys");
  
  const fileInputRef = useRef(null);
  const emojiScrollRef = useRef(null);
  const categoryRefs = useRef({});
  
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
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

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const addEmoji = (emoji) => {
    setText(text + emoji);
  };

  const scrollToCategory = (catName) => {
    setActiveCategory(catName);
    categoryRefs.current[catName]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Detect which category is in view while scrolling
  useEffect(() => {
    const observerOptions = {
      root: emojiScrollRef.current,
      threshold: 0.3,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.getAttribute("data-category"));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Start observing each category header
    const currentRefs = categoryRefs.current;
    Object.values(currentRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [showEmojiPicker]);

  return (
    <div className="p-4 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/5 relative">
      {/* Advanced Infinite Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-24 left-4 w-80 bg-[#111111]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 ease-out">
           
           {/* Floating Category Tabs */}
           <div className="flex bg-white/5 border-b border-white/5 overflow-x-auto no-scrollbar p-3 gap-2 sticky top-0 z-10">
              {EMOJI_CATEGORIES.map(cat => (
                <button 
                  key={cat.name}
                  onClick={() => scrollToCategory(cat.name)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex-shrink-0 ${
                    activeCategory === cat.name 
                    ? "bg-[#bef264] text-black shadow-[0_0_15px_rgba(190,242,100,0.3)]" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
           </div>
           
           {/* Single Continuous Scrollable Emoji Area */}
           <div 
             ref={emojiScrollRef}
             className="p-4 max-h-72 overflow-y-auto no-scrollbar bg-transparent flex flex-col gap-6"
           >
              {EMOJI_CATEGORIES.map((cat) => (
                <div 
                  key={cat.name} 
                  ref={el => categoryRefs.current[cat.name] = el}
                  data-category={cat.name}
                  className="space-y-3"
                >
                  <h4 className="text-[10px] text-gray-600 font-black uppercase tracking-widest px-1">{cat.name}</h4>
                  <div className="grid grid-cols-6 gap-3">
                    {cat.emojis.map((emoji, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => addEmoji(emoji)}
                        className="text-2xl hover:scale-125 transition-all duration-200 p-1 flex items-center justify-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
           </div>

           {/* Picker Footer */}
           <div className="px-4 py-3 bg-white/5 flex items-center justify-between border-t border-white/5">
              <div className="flex items-center gap-2">
                 <div className="size-2 bg-[#bef264] rounded-full animate-pulse" />
                 <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">All Emojis</span>
              </div>
              <button 
                onClick={() => setShowEmojiPicker(false)} 
                className="text-gray-500 hover:text-white transition-colors p-1 bg-white/5 rounded-lg"
              >
                <X size={14} />
              </button>
           </div>
        </div>
      )}

      {imagePreview && (
        <div className="mb-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-3xl border-2 border-[#bef264]/30 shadow-[0_0_20px_rgba(190,242,100,0.2)]"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white
              flex items-center justify-center transition-all hover:scale-110 shadow-lg border-2 border-[#0a0a0a]"
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>
          <div>
            <p className="text-[10px] text-[#bef264] font-black uppercase tracking-widest animate-pulse">Image Ready</p>
            <p className="text-[10px] text-gray-600 font-medium">Click send to upload</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-[#111] border border-white/5 rounded-3xl px-5 py-2 focus-within:border-[#bef264]/30 transition-all shadow-2xl">
          <button
            type="button"
            className={`transition-all hover:scale-110 ${showEmojiPicker ? "text-[#bef264]" : "text-gray-500 hover:text-[#bef264]"}`}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={24} />
          </button>
          
          <input
            type="text"
            className="w-full bg-transparent border-none py-3 text-sm focus:outline-none text-white placeholder:text-gray-700 font-medium tracking-wide"
            placeholder="Write something..."
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
            className={`flex items-center justify-center transition-all hover:scale-110 ${
              imagePreview ? "text-[#bef264]" : "text-gray-500 hover:text-[#bef264]"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={22} />
          </button>
        </div>

        <button
          type="submit"
          className={`size-14 rounded-3xl flex items-center justify-center transition-all shadow-2xl ${
            text.trim() || imagePreview 
            ? "bg-[#bef264] text-black scale-100 hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(190,242,100,0.2)]" 
            : "bg-white/5 text-gray-800 scale-90 cursor-not-allowed"
          }`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={24} className={text.trim() || imagePreview ? "translate-x-0.5 -translate-y-0.5" : ""} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
