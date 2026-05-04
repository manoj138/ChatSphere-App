import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { 
  User, Mail, Shield, Zap, Palette, 
  ChevronRight, Camera, Info, LogOut, ArrowLeft, Sun, Moon, Monitor
} from "lucide-react";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";

const NEON_PRESETS = [
  { name: "LIME", color: "#bef264" },
  { name: "CYAN", color: "#00ffff" },
  { name: "PINK", color: "#ff4dff" },
  { name: "GOLD", color: "#ffcc00" },
  { name: "RUBY", color: "#ff4d4d" },
  { name: "NOVA", color: "#bf40bf" }
];

const SettingsPage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const { themeColor, setThemeColor, isLightMode, toggleThemeMode } = useThemeStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePicture: base64Image });
    };
  };

  return (
    <div className="h-screen bg-primary overflow-y-auto custom-scrollbar pt-24 pb-20 px-4 transition-colors duration-500">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
           <div className="w-full flex justify-between items-center px-2">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-secondary hover:text-primary transition-all group"
              >
                 <div className="size-10 rounded-xl bg-surface flex items-center justify-center group-hover:bg-white/10">
                    <ArrowLeft size={18} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Back to Grid</span>
              </Link>

              {/* Theme Mode Toggle */}
              <button 
                onClick={toggleThemeMode}
                className="flex items-center gap-3 px-4 py-2 bg-surface border border-primary rounded-2xl hover:border-accent transition-all group"
              >
                 {isLightMode ? (
                   <>
                     <Moon size={18} className="text-accent" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary">Night Protocol</span>
                   </>
                 ) : (
                   <>
                     <Sun size={18} className="text-accent" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary">Day Protocol</span>
                   </>
                 )}
              </button>
           </div>

           <div className="space-y-2">
              <h1 className="text-4xl font-black text-primary uppercase tracking-tighter">System Configuration</h1>
              <p className="text-secondary text-[10px] font-black uppercase tracking-[0.5em]">Adjust your node settings</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
           
           {/* Profile Section */}
           <div className="space-y-6 animate-in slide-in-from-left-8 duration-500">
              <div className="p-8 bg-surface border border-primary rounded-[3rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <User size={120} strokeWidth={1} className="text-primary" />
                 </div>
                 
                 <div className="relative flex flex-col items-center text-center space-y-6">
                    <div className="relative group/avatar">
                       <div className="size-32 rounded-[2.5rem] overflow-hidden border-4 border-primary shadow-2xl relative z-10">
                          <img 
                            src={authUser.profilePicture || "/boy_1.png"} 
                            className={`w-full h-full object-cover transition-all duration-700 ${isUpdatingProfile ? "blur-sm opacity-50" : "group-hover/avatar:scale-110"}`} 
                            alt="" 
                          />
                       </div>
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         disabled={isUpdatingProfile}
                         className="absolute bottom-1 right-1 p-3 bg-primary text-secondary border border-primary rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all z-20 disabled:opacity-50"
                       >
                          <Camera size={18} />
                       </button>
                       <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    <div className="space-y-1">
                       <h2 className="text-xl font-black text-primary uppercase tracking-tight">{authUser.username}</h2>
                       <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{authUser.email}</p>
                    </div>

                    <div className="w-full h-[1px] bg-primary opacity-20" />
                    
                    <div className="w-full text-left space-y-4">
                       <div>
                          <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-1.5 text-center">Encryption Bio</p>
                          <p className="text-sm font-bold text-secondary text-center leading-relaxed italic">
                             "{authUser.bio || "No bio established."}"
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all group"
              >
                 <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                 Disconnect Node
              </button>
           </div>

           {/* Appearance Section */}
           <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              
              <div className="p-8 bg-surface border border-primary rounded-[3rem] space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-surface flex items-center justify-center">
                       <Palette size={20} style={{ color: themeColor }} />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-primary uppercase tracking-widest">Neon Accent</h3>
                       <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Select your UI frequency</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-3">
                    {NEON_PRESETS.map((preset) => (
                       <button
                         key={preset.name}
                         onClick={() => setThemeColor(preset.color)}
                         className={`relative group h-16 rounded-2xl border transition-all overflow-hidden flex items-center justify-center ${
                           themeColor === preset.color ? "border-accent shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]" : "border-primary hover:border-accent/40"
                         }`}
                       >
                          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: preset.color }} />
                          <div className="size-4 rounded-full shadow-lg relative z-10" style={{ backgroundColor: preset.color }} />
                          {themeColor === preset.color && (
                             <div className="absolute bottom-1 text-[8px] font-black uppercase tracking-widest text-primary animate-in slide-in-from-bottom-1">
                                Active
                             </div>
                          )}
                       </button>
                    ))}
                 </div>

                 <div className="pt-4 flex items-center justify-between p-4 bg-primary opacity-40 border border-primary rounded-2xl">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Custom Frequency</span>
                    <input 
                      type="color" 
                      value={themeColor} 
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="size-10 bg-transparent border-none cursor-pointer" 
                    />
                 </div>
              </div>

              <div className="p-8 bg-surface border border-primary rounded-[3rem] space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-surface flex items-center justify-center">
                       <Zap size={20} className="text-yellow-500" />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-primary uppercase tracking-widest">Node Status</h3>
                       <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Network integrity metrics</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-surface border border-primary rounded-2xl">
                       <span className="text-xs font-bold text-secondary">Security Protocol</span>
                       <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">E2E Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface border border-primary rounded-2xl">
                       <span className="text-xs font-bold text-secondary">Sync Version</span>
                       <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-40">v1.2.0-Alpha</span>
                    </div>
                 </div>
              </div>

           </div>

        </div>
      </div>

      {showLogoutConfirm && (
        <ConfirmationModal 
          title="Disconnect Node?"
          description="You are about to terminate your active session. Are you sure you want to log out of the grid?"
          onConfirm={logout}
          onCancel={() => setShowLogoutConfirm(false)}
          type="danger"
        />
      )}
    </div>
  );
};

export default SettingsPage;
