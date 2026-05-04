import { MessageSquare, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const NoChatSelected = () => {
  const { themeColor } = useThemeStore();

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-[#080808] relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 -left-20 size-96 rounded-full blur-[120px] opacity-10 animate-pulse" style={{ backgroundColor: themeColor }} />
      <div className="absolute bottom-1/4 -right-20 size-96 rounded-full blur-[120px] opacity-10 animate-pulse" style={{ backgroundColor: themeColor }} />

      <div className="max-w-md text-center space-y-8 relative z-10">
        {/* Animated Icon Container */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <div className="size-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform duration-500 shadow-2xl">
              <MessageSquare size={40} className="text-white" />
            </div>
            <div className="absolute -top-4 -right-4 size-10 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{ backgroundColor: themeColor }}>
               <Sparkles size={20} className="text-black" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Welcome to Sphere</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            Step into the next dimension of digital communication. Select a contact or join a community to begin.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 gap-3 pt-4">
           <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
              <ShieldCheck size={20} className="text-gray-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Secured Node</span>
           </div>
           <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
              <Zap size={20} style={{ color: themeColor }} />
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Hyper Flow</span>
           </div>
        </div>

        {/* Action Suggestion */}
        <div className="pt-8">
           <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <div className="size-1.5 rounded-full animate-ping" style={{ backgroundColor: themeColor }} />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Waiting for connection...</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
