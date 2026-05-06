import { X, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";

const ImageModal = ({ src, onClose }) => {
  const { themeColor } = useThemeStore();
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!src) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `chatsphere-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Header Actions */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-4">
           <button 
             onClick={onClose}
             className="rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 active:scale-95"
           >
             <X size={24} />
           </button>
           <span className="hidden sm:block text-sm font-medium text-white/60">Image Preview</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
           <button 
             onClick={(e) => { e.stopPropagation(); setScale(prev => Math.min(prev + 0.25, 3)); }}
             className="rounded-xl bg-white/5 p-2.5 text-white/80 transition hover:bg-white/10 hover:text-white"
           >
             <ZoomIn size={20} />
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); setScale(prev => Math.max(prev - 0.25, 0.5)); }}
             className="rounded-xl bg-white/5 p-2.5 text-white/80 transition hover:bg-white/10 hover:text-white"
           >
             <ZoomOut size={20} />
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); setRotation(prev => prev + 90); }}
             className="rounded-xl bg-white/5 p-2.5 text-white/80 transition hover:bg-white/10 hover:text-white"
           >
             <RotateCcw size={20} />
           </button>
           <div className="mx-2 h-6 w-px bg-white/10" />
           <button 
             onClick={(e) => { e.stopPropagation(); handleDownload(); }}
             className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black uppercase tracking-wider text-black transition hover:brightness-110 active:scale-95"
             style={{ backgroundColor: themeColor }}
           >
             <Download size={18} strokeWidth={3} />
             <span className="hidden sm:inline">Save</span>
           </button>
        </div>
      </div>

      {/* Image Container */}
      <div 
        className="relative flex h-full w-full items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center transition-all duration-300 ease-out" style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}>
           <img 
             src={src} 
             alt="Full size" 
             className="max-h-[85vh] max-w-[90vw] rounded-xl border border-white/5 object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)]"
           />
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 flex items-center gap-6 rounded-full bg-white/5 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 backdrop-blur-md">
         <span>Click outside to close</span>
         <div className="h-4 w-px bg-white/10" />
         <span>{Math.round(scale * 100)}% zoom level</span>
      </div>
    </div>
  );
};

export default ImageModal;
