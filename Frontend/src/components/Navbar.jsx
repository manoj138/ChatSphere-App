import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, Sparkles } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { logout, authUser } = useAuth();
  const { themeColor } = useTheme();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-secondary/70 backdrop-blur-3xl transition-all duration-500">
      <div className="mx-auto h-16 max-w-[1600px] px-4 sm:px-8">
        <div className="flex h-full items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3 transition-all hover:scale-[1.02]">
            <div
              className="flex size-9 items-center justify-center rounded-xl shadow-lg transition-all group-hover:rotate-12"
              style={{ backgroundColor: themeColor }}
            >
              <MessageSquare className="h-5 w-5 text-black" fill="currentColor" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tight text-primary">
                ChatSphere<span style={{ color: themeColor }}>.</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Chat & Connect</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/settings"
              className="group flex items-center gap-2 rounded-[1.25rem] border border-transparent px-4 py-2.5 transition-all hover:bg-white hover:shadow-xl hover:shadow-black/5"
            >
              <Settings className="h-5 w-5 text-gray-400 transition-colors group-hover:text-accent" />
              <span className="hidden text-sm font-bold text-gray-500 group-hover:text-primary sm:inline">Preferences</span>
            </Link>

            {authUser ? (
              <>
                <Link
                  to="/profile"
                  className="group flex items-center gap-3 rounded-[1.25rem] bg-bg-secondary px-4 py-2.5 shadow-xl shadow-black/[0.03] ring-1 ring-black/[0.02] transition-all hover:scale-105 active:scale-95"
                >
                  <div className="size-8 overflow-hidden rounded-xl border-2 border-white shadow-inner">
                    <img src={authUser.profilePicture || "/boy_1.png"} className="h-full w-full object-cover" alt="" />
                  </div>
                  <span className="hidden text-sm font-black text-primary sm:inline">{authUser.username}</span>
                </Link>

                <div className="mx-2 h-6 w-px bg-primary/10" />

                <button
                  className="group flex size-11 items-center justify-center rounded-2xl bg-red-500/5 text-red-400 transition-all hover:bg-red-500 hover:text-white hover:shadow-xl hover:shadow-red-500/20 active:scale-90"
                  onClick={() => logout()}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl bg-bg-secondary px-5 py-2.5 shadow-xl ring-1 ring-black/5">
                <Sparkles size={16} className="animate-pulse" style={{ color: themeColor }} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Elevate Now</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
