import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, MessageSquare, ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-[#050505] text-white font-sans selection:bg-[#bef264] selection:text-black relative">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-gray-500 hover:text-[#bef264] transition-colors font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Left Side - Form Section (50%) */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-20 relative border-r border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#bef264]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-sm space-y-12 relative">
          {/* Brand Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#bef264] flex items-center justify-center shadow-[0_0_20px_rgba(190,242,100,0.4)]">
                <MessageSquare className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="text-xl font-bold tracking-tight">ChatSphere.</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tighter leading-none">Sign In.</h1>
              <p className="text-gray-500 font-medium">Step inside your personal chat space.</p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="email"
                  required
                  className="peer w-full py-3 bg-transparent border-b-2 border-gray-800 focus:border-[#bef264] outline-none transition-all text-lg placeholder-transparent"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <label className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#bef264] peer-focus:text-sm pointer-events-none">
                  Email Address
                </label>
              </div>

              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="peer w-full py-3 bg-transparent border-b-2 border-gray-800 focus:border-[#bef264] outline-none transition-all text-lg placeholder-transparent"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <label className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[#bef264] peer-focus:text-sm pointer-events-none">
                  Password
                </label>
                <button
                  type="button"
                  className="absolute right-0 top-3 text-gray-600 hover:text-[#bef264] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full py-4 bg-[#bef264] text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:pr-8 active:scale-95 disabled:opacity-50"
              disabled={isLoggingIn}
            >
              <span className="relative z-10">{isLoggingIn ? "Connecting..." : "Access Account"}</span>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-white font-bold hover:text-[#bef264] transition-colors border-b border-white hover:border-[#bef264]">
                Join Now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Section */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden p-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#bef264]/5 rounded-full animate-pulse" />
        <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
          <img src="/login-png.png" alt="Visual" className="w-full h-auto object-contain drop-shadow-[0_0_80px_rgba(190,242,100,0.1)]" />
          <div className="text-center space-y-4 mt-12">
             <h2 className="text-5xl font-extrabold tracking-tighter leading-tight italic uppercase italic">Redefining <br /><span className="text-[#bef264]">Messaging.</span></h2>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
