import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuth();
  const { themeColor, isLightMode } = useTheme();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Username is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData, navigate);
  };

  return (
    <div className="app-shell relative min-h-screen overflow-hidden text-primary selection:bg-accent selection:text-black">
      <div className="pointer-events-none absolute -left-24 top-1/4 size-96 opacity-20 blur-[150px]" style={{ backgroundColor: themeColor }} />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 size-96 opacity-10 blur-[150px] bg-emerald-400" />

      <button
        onClick={() => navigate("/")}
        className="fixed left-4 top-5 z-20 flex size-10 items-center justify-center rounded-xl bg-bg-secondary text-primary/40 shadow-lg transition-all hover:scale-110 hover:text-accent active:scale-90"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="flex min-h-screen items-center justify-center p-4 py-12 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-surface/90 shadow-2xl backdrop-blur-3xl ring-1 ring-primary/5 lg:grid lg:grid-cols-[1.1fr_1fr]">
          
          {/* Left Side: Visual Content */}
          <section className="relative hidden flex-col justify-center bg-surface/40 p-6 backdrop-blur-2xl lg:flex lg:p-8">
            <div className="absolute inset-x-20 top-0 h-48 opacity-20 blur-[100px]" style={{ backgroundColor: themeColor }} />
            
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 rounded-[1.25rem] bg-bg-secondary px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-primary shadow-xl">
                <div className="size-2 rounded-full bg-accent animate-pulse" />
                Evolutionary Interface
              </div>
              
              <div className="space-y-3">
                <h2 className="text-4xl font-black leading-tight tracking-tight text-primary">
                  Begin Your<br />Digital Journey.
                </h2>
                <p className="max-w-md text-[14px] font-medium leading-relaxed text-secondary opacity-70">
                  Step into a workspace designed for precision. Join a network where every pixel is tuned for clarity.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-3xl bg-bg-secondary p-5 text-center shadow-xl transition-transform hover:scale-105">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent">ID</p>
                  <p className="mt-1 text-xs font-black text-primary">Custom</p>
                </div>
                <div className="rounded-3xl bg-bg-secondary p-5 text-center shadow-xl transition-transform hover:scale-105">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent">Nodes</p>
                  <p className="mt-1 text-xs font-black text-primary">Global</p>
                </div>
                <div className="rounded-3xl bg-bg-secondary p-5 text-center shadow-xl transition-transform hover:scale-105">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent">Vibe</p>
                  <p className="mt-1 text-xs font-black text-primary">Mint</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 rounded-[3rem] bg-accent/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                <img src="/signup-png.png" alt="Signup visual" className="relative mx-auto max-h-[180px] w-full object-contain transition-transform duration-700 group-hover:scale-110" />
              </div>
            </div>
          </section>

          {/* Right Side: Form */}
          <section className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-8">
            <div className="absolute right-0 top-0 h-32 w-52 opacity-20 blur-[80px]" style={{ backgroundColor: themeColor }} />
            
            <div className="relative space-y-5">
              <div className="flex items-center gap-5">
                <div className="flex size-14 items-center justify-center rounded-2xl shadow-2xl transition-transform hover:rotate-12" style={{ backgroundColor: themeColor }}>
                  <MessageSquare className="h-7 w-7 text-black" fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-primary">ChatSphere</h2>
                  <p className="text-[11px] font-black uppercase tracking-widest text-accent" style={{ textShadow: isLightMode ? "0.5px 0.5px 1px rgba(0,0,0,0.15)" : "none" }}>Join Us</p>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">Register</h1>
                <p className="text-sm font-medium leading-relaxed text-secondary opacity-70">
                  Create your account to get started.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-primary">Username</span>
                    <input
                      type="text"
                      required
                      className="w-full rounded-2xl border-none bg-bg-secondary px-6 py-3.5 text-[15px] font-bold text-primary shadow-xl transition-all focus:ring-4 focus:ring-accent/10"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-primary">Email Address</span>
                    <input
                      type="email"
                      required
                      className="w-full rounded-2xl border-none bg-bg-secondary px-6 py-3.5 text-[15px] font-bold text-primary shadow-xl transition-all focus:ring-4 focus:ring-accent/10"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-primary">Password</span>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full rounded-2xl border-none bg-bg-secondary px-6 py-3.5 pr-14 text-[15px] font-bold text-primary shadow-xl transition-all focus:ring-4 focus:ring-accent/10"
                        placeholder="Create a password"
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
                  className="w-full rounded-[1.5rem] py-3.5 text-sm font-black uppercase tracking-widest text-black shadow-2xl transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                  style={{ backgroundColor: themeColor }}
                  disabled={isSigningUp}
                >
                  {isSigningUp ? "Creating..." : "Create Account"}
                </button>
              </form>

              <p className="text-sm font-bold text-primary/60">
                Already have an account?{" "}
                <Link to="/login" className="text-primary underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent">
                  Login
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
