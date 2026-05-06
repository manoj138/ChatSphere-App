import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, MessageSquare } from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();
  const { themeColor } = useThemeStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="app-shell min-h-screen text-primary selection:bg-accent selection:text-black">
      <div className="pointer-events-none absolute -left-24 top-1/4 size-96 opacity-20 blur-[150px]" style={{ backgroundColor: themeColor }} />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 size-96 opacity-10 blur-[150px] bg-emerald-400" />

      <button
        onClick={() => navigate("/")}
        className="fixed left-4 top-5 z-20 flex size-10 items-center justify-center rounded-xl bg-white text-gray-400 shadow-lg transition-all hover:scale-110 hover:text-accent active:scale-90"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white/40 shadow-2xl backdrop-blur-3xl ring-1 ring-black/5 lg:grid lg:grid-cols-[1fr_1.1fr]">
          
          {/* Left Side: Form */}
          <section className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="absolute right-0 top-0 h-32 w-52 opacity-20 blur-[80px]" style={{ backgroundColor: themeColor }} />
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl shadow-xl transition-transform hover:rotate-12" style={{ backgroundColor: themeColor }}>
                  <MessageSquare className="h-7 w-7 text-black" fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-primary">ChatSphere</h2>
                  <p className="text-[11px] font-black uppercase tracking-widest text-accent">Neural Entry</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent">
                   Welcome Back
                </span>
                <h1 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">Sign In</h1>
                <p className="text-sm font-medium leading-relaxed text-secondary opacity-70">
                  Re-establish your connection to the global realtime pulse.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-widest text-accent">Email Node</span>
                    <input
                      type="email"
                      required
                      className="w-full rounded-2xl border-none bg-white/60 px-6 py-4 text-[15px] font-bold text-primary shadow-xl backdrop-blur-xl transition-all focus:bg-white focus:ring-4 focus:ring-accent/5"
                      placeholder="operator@matrix.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-widest text-accent">Access Key</span>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full rounded-2xl border-none bg-white/60 px-6 py-4 pr-14 text-[15px] font-bold text-primary shadow-xl backdrop-blur-xl transition-all focus:bg-white focus:ring-4 focus:ring-accent/5"
                        placeholder="Enter credentials"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-4 flex size-10 items-center justify-center rounded-xl text-gray-400 transition-all hover:bg-accent/10 hover:text-accent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-[1.5rem] py-4 text-sm font-black uppercase tracking-widest text-black shadow-2xl transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                  style={{ backgroundColor: themeColor }}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Establishing..." : "Synchronize Session"}
                </button>
              </form>

              <p className="text-sm font-bold text-gray-400">
                Awaiting new operators?{" "}
                <Link to="/signup" className="text-accent hover:underline">
                  Initiate SignUp
                </Link>
              </p>
            </div>
          </section>

          {/* Right Side: Visual Content */}
          <section className="relative hidden flex-col justify-center bg-white/30 p-10 backdrop-blur-2xl lg:flex lg:p-16">
            <div className="absolute inset-x-20 top-0 h-48 opacity-20 blur-[100px]" style={{ backgroundColor: themeColor }} />
            
            <div className="relative space-y-10">
              <div className="inline-flex items-center gap-2 rounded-[1.25rem] bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-primary shadow-xl">
                <div className="size-2 rounded-full bg-accent animate-pulse" />
                Secure Protocol Active
              </div>
              
              <div className="space-y-4">
                <h2 className="text-5xl font-black leading-tight tracking-tight text-primary">
                  Minimalist Chat.<br />Maximum Power.
                </h2>
                <p className="max-w-md text-[15px] font-medium leading-relaxed text-secondary opacity-70">
                  Experience the ultimate digital workspace. Refined cards, premium transparency, and precise synchronization across all your nodes.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-3xl bg-white p-5 text-center shadow-xl transition-transform hover:scale-105">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent">Sync</p>
                  <p className="mt-1 text-xs font-black text-primary">Realtime</p>
                </div>
                <div className="rounded-3xl bg-white p-5 text-center shadow-xl transition-transform hover:scale-105">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent">UI</p>
                  <p className="mt-1 text-xs font-black text-primary">Premium</p>
                </div>
                <div className="rounded-3xl bg-white p-5 text-center shadow-xl transition-transform hover:scale-105">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent">Privacy</p>
                  <p className="mt-1 text-xs font-black text-primary">Encrypted</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 rounded-[3rem] bg-accent/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                <img src="/login-png.png" alt="Login visual" className="relative mx-auto max-h-[280px] w-full object-contain transition-transform duration-700 group-hover:scale-110" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
