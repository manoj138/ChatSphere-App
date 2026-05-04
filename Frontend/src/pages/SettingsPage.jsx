import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Check, ArrowLeft, Moon, Bell, Shield, Palette, Volume2, Settings as SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";

const PRESET_THEMES = [
  { name: "Lime", color: "#bef264" },
  { name: "Electric", color: "#3b82f6" },
  { name: "Rose", color: "#fb7185" },
  { name: "Amber", color: "#fbbf24" },
  { name: "Purple", color: "#a855f7" },
];

const SettingsPage = () => {
  const { themeColor, setThemeColor } = useThemeStore();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#bef264] pb-10">
      
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <div className="flex items-center justify-between bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 shadow-2xl mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-white/5 rounded-xl transition-colors" style={{ color: themeColor }}>
              <ArrowLeft size={24} />
            </Link>
            <div>
               <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Settings</h1>
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Customize your experience</p>
            </div>
          </div>
          <div className="size-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400">
             <SettingsIcon size={24} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           
           <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <Palette style={{ color: themeColor }} size={20} />
                 <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Appearance</h2>
              </div>
              
              <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 p-8 shadow-2xl space-y-8">
                 <div>
                    <p className="text-sm font-bold mb-4">Accent Color</p>
                    <div className="flex gap-4">
                       {PRESET_THEMES.map((t) => (
                         <button 
                          key={t.name}
                          onClick={() => setThemeColor(t.color)}
                          className="size-8 rounded-full border-2 border-[#050505] shadow-lg transition-transform hover:scale-125 relative group"
                          style={{ backgroundColor: t.color }}
                         >
                            {themeColor === t.color && (
                              <div className="absolute inset-0 flex items-center justify-center text-black">
                                <Check size={14} />
                              </div>
                            )}
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">{t.name}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div>
                       <p className="text-sm font-bold">Dark Mode</p>
                       <p className="text-[10px] text-gray-500 font-medium">Immersive OLED experience</p>
                    </div>
                    <div className="size-12 rounded-2xl flex items-center justify-center text-black shadow-lg" style={{ backgroundColor: themeColor, boxShadow: `0 0 20px ${themeColor}33` }}>
                       <Moon size={20} fill="currentColor" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <Bell style={{ color: themeColor }} size={20} />
                 <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Preferences</h2>
              </div>

              <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 p-8 shadow-2xl space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-2.5 bg-white/5 rounded-xl text-gray-400"><Volume2 size={18} /></div>
                       <p className="text-sm font-bold">Sound Effects</p>
                    </div>
                    <div className="w-12 h-6 rounded-full relative p-1 cursor-pointer" style={{ backgroundColor: themeColor }}>
                       <div className="size-4 bg-black rounded-full absolute right-1" />
                    </div>
                 </div>

                 <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div className="flex items-center gap-4">
                       <div className="p-2.5 bg-white/5 rounded-xl text-gray-400"><Shield size={18} /></div>
                       <p className="text-sm font-bold">Privacy Lock</p>
                    </div>
                    <div className="w-12 h-6 bg-white/10 rounded-full relative p-1 cursor-pointer">
                       <div className="size-4 bg-gray-500 rounded-full absolute left-1" />
                    </div>
                 </div>

                 <div className="mt-8 p-4 rounded-2xl border" style={{ backgroundColor: `${themeColor}0D`, borderColor: `${themeColor}1A` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-center leading-relaxed" style={{ color: themeColor }}>
                       Settings are automatically synced to your account cloud.
                    </p>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
