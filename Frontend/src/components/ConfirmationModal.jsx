import { X, AlertTriangle, LogOut, Trash2 } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ConfirmationModal = ({ title, description, onConfirm, onCancel, type = "danger" }) => {
  const { themeColor } = useThemeStore();
  
  const isLogout = title.toLowerCase().includes("logout") || title.toLowerCase().includes("disconnect");

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-secondary border border-primary rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative">
        
        {/* Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[80px] opacity-10" style={{ backgroundColor: type === "danger" ? "#ef4444" : themeColor }} />

        <div className="p-8 flex flex-col items-center text-center">
           <div className={`size-16 rounded-full flex items-center justify-center mb-6 ${type === "danger" ? "bg-red-500/10 text-red-500" : "bg-accent/10 text-accent"}`}>
              {isLogout ? <LogOut size={30} /> : <Trash2 size={30} />}
           </div>

           <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-2">{title}</h3>
           <p className="text-sm text-secondary mb-8 leading-relaxed opacity-60">{description}</p>

           <div className="flex flex-col w-full gap-3">
              <button 
                onClick={onConfirm} 
                className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest transition-all active:scale-95 ${type === "danger" ? "bg-red-600 hover:bg-red-500" : "bg-accent text-black hover:brightness-110"}`}
                style={type !== "danger" ? { backgroundColor: themeColor } : {}}
              >
                 Confirm Action
              </button>
              <button 
                onClick={onCancel} 
                className="w-full py-4 bg-surface border border-primary rounded-2xl text-secondary font-black uppercase tracking-widest hover:text-primary transition-all active:scale-95"
              >
                 Abort Protocol
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
