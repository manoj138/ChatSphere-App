import { MessageSquare, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";

const NoChatSelected = () => {
  const { themeColor } = useThemeStore();
  const { onlineUsers = [], authUser } = useAuthStore();
  
  const isConnected = onlineUsers && Array.isArray(onlineUsers) && onlineUsers.includes(authUser?._id);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#080808] relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 -left-20 size-80 rounded-full blur-[100px] opacity-10 animate-pulse" style={{ backgroundColor: themeColor }} />
      <div className="absolute bottom-1/3 -right-20 size-80 rounded-full blur-[100px] opacity-10 animate-pulse" style={{ backgroundColor: themeColor }} />

      <div className="max-w-sm text-center space-y-6 relative z-10">
        {/* Icon Set */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="size-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/5 transition-transform duration-700 group-hover:rotate-[360deg]">
              <MessageSquare size={32} className="text-white opacity-80" />
            </div>
            <div className="absolute -top-3 -right-3 size-8 rounded-xl flex items-center justify-center shadow-2xl animate-bounce" style={{ backgroundColor: themeColor }}>
               <Sparkles size={16} className="text-black" />
            </div>
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Sphere Node</h2>
          <p className="text-gray-600 text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">
            Select a contact from the sidebar to establish a secure link.
          </p>
        </div>

        {/* Connection Status Pill */}
        <div className="pt-4">
           <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-500 ${
             isConnected ? "bg-white/5 border-white/10" : "bg-red-500/5 border-red-500/10"
           }`}>
              <div className={`size-1.5 rounded-full ${isConnected ? "animate-pulse" : "animate-ping"}`} 
                   style={{ backgroundColor: isConnected ? themeColor : "#ef4444" }} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                {isConnected ? "Connection Established" : "Awaiting Handshake..."}
              </span>
           </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-3 mt-8 opacity-40">
           <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
              <ShieldCheck size={14} className="text-gray-500" />
              <span className="text-[8px] font-black uppercase tracking-widest">E2E Sync</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
              <Zap size={14} style={{ color: themeColor }} />
              <span className="text-[8px] font-black uppercase tracking-widest">Low Latency</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
