import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  const handleLogout = () => {
    console.log("Logout button clicked!");
    logout();
  };

  return (
    <header
      className="bg-[#0a0a0a] border-b border-white/5 fixed w-full top-0 z-40 backdrop-blur-lg bg-opacity-80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-[#bef264]/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#bef264]" />
              </div>
              <h1 className="text-lg font-bold">ChatSphere.</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="btn btn-sm gap-2 transition-colors hover:bg-white/5 px-3 py-2 rounded-lg flex items-center"
            >
              <Settings className="w-4 h-4 text-gray-400" />
              <span className="hidden sm:inline text-sm font-medium">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2 hover:bg-white/5 px-3 py-2 rounded-lg flex items-center">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="hidden sm:inline text-sm font-medium">Profile</span>
                </Link>

                <button 
                  className="flex gap-2 items-center hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors text-red-500 cursor-pointer" 
                  onClick={handleLogout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline text-sm font-bold">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
