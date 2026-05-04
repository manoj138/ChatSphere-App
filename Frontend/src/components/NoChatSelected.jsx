import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { ShieldCheck, Globe, Zap, Sparkles, UserPlus, Settings, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";

const NoChatSelected = () => {
  const { themeColor, isLightMode } = useThemeStore();
  const { authUser, onlineUsers = [] } = useAuthStore();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-primary relative overflow-hidden font-sans transition-colors duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] blur-[150px] opacity-[0.1] pointer-events-none rounded-full" style={{ backgroundColor: themeColor }} />
      <div className={`absolute inset-0 opacity-[0.02] pointer-events-none ${isLightMode ? "bg-black" : "bg-white"}`} style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-linen.png')" }} />

      <div className="max-w-2xl w-full space-y-10 relative z-10">
        
        {/* Compact Profile Identity */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
           <div className="relative group">
              <div className="size-20 rounded-[1.5rem] overflow-hidden border-2 border-primary group-hover:border-accent/40 transition-all p-0.5 shadow-2xl">
                 <img 
                   src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length-1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 4) + 1}.png?v=3`)} 
                   className="w-full h-full object-cover rounded-[1.3rem]" 
                 />
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-full p-1 transition-colors">
                 <div className="size-full bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
              </div>
           </div>
           <div className="text-center">
              <h3 className="text-lg font-black text-primary uppercase tracking-tighter">Welcome, @{authUser?.username}</h3>
              <p className="text-[9px] font-black text-secondary uppercase tracking-[0.3em] opacity-40">Grid Access: Authorized</p>
           </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-200">
           
           <div className="p-6 bg-surface border border-primary rounded-[2.5rem] flex flex-col gap-4 group hover:bg-surface/50 transition-all">
              <div className="size-10 rounded-xl bg-surface border border-primary flex items-center justify-center text-primary group-hover:text-accent transition-colors">
                 <MessageSquarePlus size={20} />
              </div>
              <div>
                 <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-1">Secure Transmission</h4>
                 <p className="text-[10px] text-secondary font-bold leading-relaxed opacity-60">Initialize end-to-end encrypted signals with your nodes.</p>
              </div>
           </div>

           <div className="p-6 bg-surface border border-primary rounded-[2.5rem] flex flex-col gap-4 group hover:bg-surface/50 transition-all">
              <div className="size-10 rounded-xl bg-surface border border-primary flex items-center justify-center text-primary group-hover:text-accent transition-colors">
                 <UserPlus size={20} />
              </div>
              <div>
                 <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-1">Discover Nodes</h4>
                 <p className="text-[10px] text-secondary font-bold leading-relaxed opacity-60">Expand your network by discovering authorized agents on the grid.</p>
              </div>
           </div>

        </div>

        {/* Global Stats Bar */}
        <div className="flex items-center justify-center gap-8 py-4 border-y border-primary/40 animate-in fade-in duration-1000 delay-500">
           <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-[9px] font-black text-secondary uppercase tracking-widest opacity-60">{onlineUsers.length} Nodes Online</span>
           </div>
           <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-accent opacity-40" />
              <span className="text-[9px] font-black text-secondary uppercase tracking-widest opacity-60">Secure Protocol v1.2</span>
           </div>
           <div className="flex items-center gap-2">
              <Globe size={12} className="text-blue-500 opacity-40" />
              <span className="text-[9px] font-black text-secondary uppercase tracking-widest opacity-60">Global Grid</span>
           </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center animate-in fade-in duration-1000 delay-700">
           <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] mb-4">Please select a transmission node to begin</p>
           <div className="flex items-center justify-center gap-2 text-gray-800">
              <Zap size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest italic opacity-30">Waiting for uplink signal...</span>
           </div>
        </div>

      </div>

    </div>
  );
};

export default NoChatSelected;
