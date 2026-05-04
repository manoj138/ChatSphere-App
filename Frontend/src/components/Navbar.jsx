import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, Sparkles } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { themeColor } = useThemeStore();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/85 backdrop-blur-2xl">
      <div className="mx-auto h-16 max-w-[1600px] px-4 sm:px-6">
        <div className="flex h-full items-center justify-between gap-3">
          <Link to="/" className="group flex items-center gap-3 transition-all">
            <div
              className="flex size-9 items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-105 group-hover:rotate-6"
              style={{ backgroundColor: themeColor }}
            >
              <MessageSquare className="h-5 w-5 text-black" fill="currentColor" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tight text-white">
                ChatSphere<span style={{ color: themeColor }}>.</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">Private realtime chat</p>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/settings"
              className="group flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition-all hover:border-white/5 hover:bg-white/5"
            >
              <Settings className="h-4 w-4 text-gray-500 transition-colors group-hover:text-white" />
              <span className="hidden text-xs font-semibold text-gray-500 group-hover:text-white sm:inline">Settings</span>
            </Link>

            {authUser ? (
              <>
                <Link
                  to="/profile"
                  className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-all hover:border-white/5 hover:bg-white/5"
                >
                  <div className="size-6 overflow-hidden rounded-lg border border-white/10 transition-all group-hover:border-white/30">
                    <img src={authUser.profilePicture || "/avatar.png"} className="h-full w-full object-cover" alt="" />
                  </div>
                  <span className="hidden text-xs font-semibold text-gray-500 group-hover:text-white sm:inline">{authUser.username}</span>
                </Link>

                <div className="mx-2 h-4 w-px bg-white/10" />

                <button
                  className="group flex items-center gap-2 rounded-xl px-3 py-2 text-red-500/70 transition-all hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span className="hidden text-xs font-semibold sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1.5">
                <Sparkles size={12} style={{ color: themeColor }} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Join now</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
