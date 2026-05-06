import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "../../store/useAuthStore";
import { useThemeStore } from "../../store/useThemeStore";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  const { themeColor } = useThemeStore();
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
    <div className="app-shell min-h-screen text-primary selection:bg-accent selection:text-black">
      <button
        onClick={() => navigate("/")}
        className="fixed left-4 top-5 z-20 inline-flex items-center gap-2 rounded-xl border border-primary bg-surface px-3 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary/10 hover:text-primary sm:left-6 sm:top-8"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="app-hero-panel grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] lg:grid-cols-[1fr_1fr]">
          
          {/* Left Side: Visual Content */}
          <section className="relative hidden flex-col justify-center border-r border-primary bg-surface/50 p-8 lg:flex lg:p-10">
            <div className="absolute inset-x-10 top-0 h-40 opacity-20 blur-3xl" style={{ backgroundColor: themeColor }} />
            
            <div className="relative space-y-6">
              <div className="app-chip w-fit" style={{ borderColor: `${themeColor}33`, color: themeColor }}>
                Build your profile
              </div>
              
              <div>
                <h2 className="text-4xl font-black leading-tight tracking-tight text-primary">
                  Join the<br />conversation.
                </h2>
                <p className="mt-3 text-xs leading-5 text-secondary">
                  Start with a polished account setup and move into the same visual system used across the app.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-primary bg-secondary/50 p-3 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-secondary">Identity</p>
                  <p className="mt-0.5 text-[10px] font-black text-primary">Custom</p>
                </div>
                <div className="rounded-xl border border-primary bg-secondary/50 p-3 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-secondary">Groups</p>
                  <p className="mt-0.5 text-[10px] font-black text-primary">Shared</p>
                </div>
                <div className="rounded-xl border border-primary bg-secondary/50 p-3 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-secondary">Theme</p>
                  <p className="mt-0.5 text-[10px] font-black text-primary">Style</p>
                </div>
              </div>

              <div className="relative pt-2">
                <img src="/signup-png.png" alt="Signup visual" className="mx-auto max-h-[220px] w-full object-contain" />
              </div>
            </div>
          </section>

          {/* Right Side: Form */}
          <section className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="absolute right-0 top-0 h-28 w-40 opacity-15 blur-3xl" style={{ backgroundColor: themeColor }} />
            
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl shadow-lg" style={{ backgroundColor: themeColor }}>
                  <MessageSquare className="h-5 w-5 text-black" fill="currentColor" />
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight text-primary">ChatSphere</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-secondary">Create your space</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="app-chip" style={{ color: themeColor }}>New account</span>
                <h1 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">Register</h1>
                <p className="text-xs leading-5 text-secondary">
                  Set up your profile once and keep the same clean UI rhythm across the rest of the app.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Username</span>
                    <input
                      type="text"
                      required
                      className="app-input w-full rounded-xl px-4 py-3 text-sm"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Email</span>
                    <input
                      type="email"
                      required
                      className="app-input w-full rounded-xl px-4 py-3 text-sm"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Password</span>
                    <div className="app-input flex items-center rounded-xl px-4 py-3">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full bg-transparent text-sm text-primary outline-none"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="text-secondary transition hover:text-primary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                  style={{ backgroundColor: themeColor }}
                  disabled={isSigningUp}
                >
                  {isSigningUp ? "Creating..." : "Create account"}
                </button>
              </form>

              <p className="text-xs text-secondary">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-primary transition hover:text-accent">
                  Sign in
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
