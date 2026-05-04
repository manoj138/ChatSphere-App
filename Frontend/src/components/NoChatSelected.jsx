import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { ShieldCheck, Globe, UserPlus, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";

const NoChatSelected = () => {
  const { themeColor, isLightMode } = useThemeStore();
  const { authUser, onlineUsers = [] } = useAuthStore();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#080808] p-4 font-sans transition-colors duration-500 sm:p-8">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] blur-[150px] opacity-[0.1] pointer-events-none rounded-full" style={{ backgroundColor: themeColor }} />
      <div className={`absolute inset-0 opacity-[0.02] pointer-events-none ${isLightMode ? "bg-black" : "bg-white"}`} style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/black-linen.png')" }} />

      <div className="relative z-10 w-full max-w-3xl space-y-6 sm:space-y-10">
        
        {/* Compact Profile Identity */}
        <div className="animate-in fade-in zoom-in flex flex-col items-center gap-4 duration-700">
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
              <span className="app-chip mb-4" style={{ color: themeColor }}>Workspace ready</span>
              <h3 className="text-3xl font-black tracking-tight text-white">Welcome, @{authUser?.username}</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">Pick a conversation, discover new people, or tune your account before you jump back into chat.</p>
           </div>
        </div>

        {/* Action Grid */}
        <div className="animate-in slide-in-from-bottom-8 grid grid-cols-1 gap-4 duration-700 delay-200 md:grid-cols-2">
           
           <div className="group flex flex-col gap-4 rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.05]">
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-white transition-colors group-hover:text-accent">
                 <MessageSquarePlus size={20} />
              </div>
              <div>
                 <h4 className="mb-1 text-sm font-black text-white">Start a conversation</h4>
                 <p className="text-xs font-medium leading-relaxed text-gray-400">Select a friend from the sidebar to open your chat and continue where you left off.</p>
              </div>
           </div>

           <div className="group flex flex-col gap-4 rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.05]">
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-white transition-colors group-hover:text-accent">
                 <UserPlus size={20} />
              </div>
              <div>
                 <h4 className="mb-1 text-sm font-black text-white">Discover people</h4>
                 <p className="text-xs font-medium leading-relaxed text-gray-400">Update your profile or settings, then use the sidebar to discover new people and groups.</p>
              </div>
           </div>

        </div>

        {/* Global Stats Bar */}
        <div className="animate-in fade-in flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/5 bg-white/[0.03] px-6 py-5 duration-1000 delay-500 sm:flex-row sm:gap-8">
           <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-[11px] font-semibold text-secondary opacity-80">{onlineUsers.length} people online</span>
           </div>
           <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-accent opacity-40" />
              <span className="text-[11px] font-semibold text-secondary opacity-80">Secure messaging enabled</span>
           </div>
           <div className="flex items-center gap-2">
              <Globe size={12} className="text-blue-500 opacity-40" />
              <span className="text-[11px] font-semibold text-secondary opacity-80">Realtime sync active</span>
           </div>
        </div>

        {/* Bottom CTA */}
           <div className="text-center animate-in fade-in duration-1000 delay-700">
           <p className="text-sm font-semibold text-gray-500 mb-4">Choose a chat from the sidebar, or update your account first.</p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/profile" className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.05]">
                Open Profile
              </Link>
              <Link to="/settings" className="px-5 py-3 rounded-2xl text-sm font-semibold text-black hover:brightness-110 transition-all" style={{ backgroundColor: themeColor }}>
                Open Settings
              </Link>
           </div>
        </div>

      </div>

    </div>
  );
};

export default NoChatSelected;
