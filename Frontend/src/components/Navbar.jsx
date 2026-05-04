import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { LogOut, MessageSquare, Settings, User, Sparkles } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { themeColor } = useThemeStore();

  return (
    <header className="fixed w-full top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-[1600px] mx-auto px-6 h-16">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group transition-all">
            <div className="size-9 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 group-hover:scale-110" style={{ backgroundColor: themeColor }}>
              <MessageSquare className="w-5 h-5 text-black" fill="currentColor" />
            </div>
            <div className="hidden sm:block">
               <h1 className="text-lg font-black tracking-tighter uppercase text-white">Sphere<span style={{ color: themeColor }}>.</span></h1>
               <div className="h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-full" style={{ backgroundColor: themeColor }} />
            </div>
          </Link>

          {/* Actions Section */}
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-white/5 group"
            >
              <Settings className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Settings</span>
            </Link>

            {authUser ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all hover:bg-white/5 border border-transparent hover:border-white/5 group"
                >
                  <div className="size-6 rounded-lg overflow-hidden border border-white/10 group-hover:border-white/30 transition-all">
                     <img src={authUser.profilePicture || "/avatar.png"} className="w-full h-full object-cover" alt="" />
                  </div>
                  <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">Profile</span>
                </Link>

                <div className="w-[1px] h-4 bg-white/10 mx-2" />

                <button 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-red-500/10 text-red-500/70 hover:text-red-500 group" 
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Logout</span>
                </button>
              </>
            ) : (
               <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 flex items-center gap-2">
                     <Sparkles size={12} style={{ color: themeColor }} />
                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Join the sphere</span>
                  </div>
               </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
