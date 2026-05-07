import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Globe, UserPlus, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";

const NoChatSelected = () => {
  const { themeColor } = useTheme();
  const { authUser, onlineUsers = [] } = useAuth();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-transparent p-6 font-sans transition-all duration-500 sm:p-12">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] blur-[150px] opacity-[0.1] pointer-events-none rounded-full" style={{ backgroundColor: themeColor }} />
      <div className="absolute top-1/4 left-1/4 size-[300px] blur-[120px] opacity-[0.05] pointer-events-none rounded-full bg-emerald-400" />

      <div className="relative z-10 w-full max-w-2xl space-y-6 sm:space-y-8">
        
        {/* Compact Profile Identity */}
         <div className="animate-in fade-in zoom-in flex flex-col items-center gap-4 duration-1000">
            <div className="relative group">
               <div className="size-16 rounded-2xl overflow-hidden bg-white shadow-xl p-1 ring-2 ring-white transition-all group-hover:scale-105">
                  <img 
                    src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length-1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 4) + 1}.png?v=3`)} 
                    className="w-full h-full object-cover rounded-[0.8rem]" 
                  />
               </div>
               <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-lg bg-white shadow-lg transition-transform group-hover:rotate-12">
                  <div className="size-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
               </div>
            </div>
            <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-accent">
                  Neural Network Active
                </span>
                <h3 className="text-xl font-black tracking-tight text-primary sm:text-2xl">Welcome back, {authUser?.username}</h3>
                <p className="mx-auto max-w-lg text-[13px] font-medium leading-relaxed text-secondary opacity-70">Initiate a secure stream or synchronize your identity.</p>
            </div>
        </div>

        {/* Action Grid */}
        <div className="animate-in slide-in-from-bottom-12 grid grid-cols-1 gap-6 duration-1000 delay-300 md:grid-cols-2">
           
            <div className="glass-card group flex flex-col gap-4 rounded-2xl p-5 shadow-xl transition-all hover:scale-[1.02]">
               <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all group-hover:scale-110 shadow-lg shadow-accent/10">
                  <MessageSquarePlus size={18} />
               </div>
               <div>
                  <h4 className="mb-1 text-base font-bold text-primary uppercase tracking-tight">Start Chatting</h4>
                  <p className="text-xs font-normal leading-relaxed text-secondary opacity-70">Message your friends or groups from the sidebar.</p>
               </div>
            </div>

            <div className="glass-card group flex flex-col gap-4 rounded-2xl p-5 shadow-xl transition-all hover:scale-[1.02]">
               <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-all group-hover:scale-110 shadow-lg shadow-emerald-500/10">
                  <UserPlus size={18} />
               </div>
               <div>
                  <h4 className="mb-1 text-base font-bold text-primary uppercase tracking-tight">Find People</h4>
                  <p className="text-xs font-normal leading-relaxed text-secondary opacity-70">Search for new users or manage your friend requests.</p>
               </div>
            </div>

         </div>

         {/* Global Stats Bar */}
         <div className="glass-card animate-in fade-in flex flex-col items-center justify-center gap-4 rounded-xl px-6 py-3.5 duration-1000 delay-500 sm:flex-row sm:gap-8 shadow-xl">
            <div className="flex items-center gap-2">
               <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-60">{onlineUsers.length} Online Users</span>
           </div>
           <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">E2E Secure</span>
           </div>
           <div className="flex items-center gap-2">
              <Globe size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Sync: 100%</span>
           </div>
        </div>

         {/* Bottom CTA */}
            <div className="text-center animate-in fade-in duration-1000 delay-700 flex flex-col items-center gap-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-accent animate-pulse">Awaiting operator input...</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
               <Link to="/profile" className="w-full sm:w-auto rounded-xl bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-primary shadow-lg transition-all hover:scale-105 active:scale-95">
                 Identity
               </Link>
               <Link to="/settings" className="w-full sm:w-auto rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest text-black shadow-xl transition-all hover:scale-105 active:scale-95 hover:brightness-110" style={{ backgroundColor: themeColor }}>
                 Config
               </Link>
            </div>
         </div>

      </div>

    </div>
  );
};

export default NoChatSelected;
