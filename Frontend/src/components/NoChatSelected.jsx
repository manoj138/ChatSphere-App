import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { ShieldCheck, Globe, Zap, Sparkles, UserPlus, Settings, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";

const NoChatSelected = () => {
  const { themeColor } = useThemeStore();
  const { authUser, onlineUsers = [] } = useAuthStore();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#050505] relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] blur-[150px] opacity-[0.1] pointer-events-none rounded-full" style={{ backgroundColor: themeColor }} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-[0.02] pointer-events-none" />

      <div className="max-w-2xl w-full space-y-10 relative z-10">
        
        {/* Compact Profile Identity */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
           <div className="relative group">
              <div className="size-20 rounded-[1.5rem] overflow-hidden border-2 border-white/5 group-hover:border-white/20 transition-all p-0.5 shadow-2xl">
                 <img 
                   src={authUser?.profilePicture || (authUser?._id?.charCodeAt(authUser?._id.length-1) % 2 === 0 ? `/boy_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 5) + 1}.png?v=3` : `/girl_${(authUser?._id?.charCodeAt(authUser?._id.length-1) % 4) + 1}.png?v=3`)} 
                   className="w-full h-full object-cover rounded-[1.3rem]" 
                 />
              </div>
              <div className="absolute -inset-2 rounded-[1.7rem] blur-md opacity-20" style={{ backgroundColor: themeColor }} />
           </div>
           <div className="text-center">
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">Welcome, <span style={{ color: themeColor }}>{authUser?.username}</span></h1>
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mt-1">Authorized User Node</p>
           </div>
        </div>

        {/* Dashboard Grid - Compact & Stylish */}
        <div className="grid grid-cols-2 gap-4">
           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-4 group hover:bg-white/[0.04] transition-all">
              <div className="size-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                 <ShieldCheck size={24} />
              </div>
              <div>
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Signal</p>
                 <p className="text-xs font-bold text-gray-300">Encrypted</p>
              </div>
           </div>
           
           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-4 group hover:bg-white/[0.04] transition-all">
              <div className="size-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                 <Globe size={24} />
              </div>
              <div>
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Presence</p>
                 <p className="text-xs font-bold text-gray-300">{onlineUsers.length} Online</p>
              </div>
           </div>
        </div>

        {/* Transmission Prompt */}
        <div className="bg-white/[0.01] border border-white/[0.03] p-8 rounded-[2.5rem] text-center space-y-4">
           <div className="flex justify-center mb-2">
              <Zap size={20} className="text-yellow-500 animate-pulse" />
           </div>
           <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] leading-relaxed">
              "Select a terminal node to initiate encrypted transmission."
           </p>
        </div>

        {/* Quick Actions Matrix */}
        <div className="flex items-center justify-center gap-6">
           <Link to="/settings" className="flex items-center gap-2 px-6 py-2.5 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-black text-gray-600 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
              <Settings size={14} /> Customize
           </Link>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-black text-gray-600 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
              <UserPlus size={14} /> Discover
           </button>
        </div>

      </div>

      {/* Subtle Decals */}
      <div className="absolute left-8 bottom-12">
         <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.5em]">Sphere v3.1</p>
      </div>
      <div className="absolute right-8 bottom-12">
         <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.5em]">AES-256 Enabled</p>
      </div>

    </div>
  );
};

export default NoChatSelected;
