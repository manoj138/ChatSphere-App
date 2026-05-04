import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";

const NoChatSelected = () => {
  const { themeColor } = useThemeStore();
  const { onlineUsers = [] } = useAuthStore();

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-[#050505] relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 size-96 blur-[150px] opacity-10 animate-pulse pointer-events-none" style={{ backgroundColor: themeColor }} />
      <div className="absolute bottom-1/4 right-1/4 size-96 blur-[150px] opacity-5 pointer-events-none" style={{ backgroundColor: themeColor }} />

      <div className="max-w-md text-center space-y-12 relative z-10">
        
        {/* Animated Brand Icon */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-4 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" style={{ backgroundColor: themeColor }} />
            <div className="size-32 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex items-center justify-center relative shadow-2xl">
               <MessageSquare size={54} style={{ color: themeColor }} className="drop-shadow-2xl" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-3 bg-[#0a0a0a] rounded-2xl border border-white/5 shadow-xl">
               <Zap size={20} className="text-yellow-500 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] rounded-full border border-white/5 mb-2">
              <Sparkles size={12} style={{ color: themeColor }} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Welcome to the Sphere</span>
           </div>
           <h1 className="text-5xl font-black uppercase tracking-tighter text-white">Select a <span style={{ color: themeColor }}>Signal</span></h1>
           <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-xs mx-auto italic">
              "Establish a secure end-to-end encrypted link with your contacts to begin data transmission."
           </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 flex flex-col items-center gap-3 group hover:bg-white/[0.05] transition-all">
              <ShieldCheck size={24} className="text-gray-700 group-hover:text-white transition-colors" />
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">Encrypted</p>
           </div>
           <div className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/5 flex flex-col items-center gap-3 group hover:bg-white/[0.05] transition-all">
              <Globe size={24} className="text-gray-700 group-hover:text-white transition-colors" />
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">{onlineUsers.length} Online</p>
           </div>
        </div>

      </div>

      {/* Decorative Corner Text */}
      <div className="absolute bottom-12 left-12">
         <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.5em] rotate-180 [writing-mode:vertical-lr]">Sphere OS v3.1</p>
      </div>
      <div className="absolute top-12 right-12">
         <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">Protocol: Quantum-Safe</p>
      </div>

    </div>
  );
};

export default NoChatSelected;
