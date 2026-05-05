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

      <div className="mx-auto grid min-h-screen max-w-7xl overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden items-center justify-center border-r border-white/5 px-10 py-6 lg:flex">
          <div className="app-hero-panel relative w-full max-w-2xl h-[620px] sm:h-[680px] overflow-hidden rounded-[2.5rem] p-6">
            <div className="absolute inset-x-10 top-0 h-40 opacity-20 blur-3xl" style={{ backgroundColor: themeColor }} />
            <div className="relative space-y-4">
              <div className="app-chip w-fit" style={{ borderColor: `${themeColor}33`, color: themeColor }}>
                Build your profile
              </div>
              <div>
                <h2 className="text-5xl font-black leading-tight tracking-tight text-primary">Join the conversation.</h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-secondary">
                  Start with a polished account setup and move into the same visual system used across the app.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-secondary">Identity</p>
                  <p className="mt-2 text-sm font-semibold text-primary">Custom profile</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Groups</p>
                  <p className="mt-2 text-sm font-semibold text-white">Shared chats</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Theme</p>
                  <p className="mt-2 text-sm font-semibold text-white">Personal style</p>
                </div>
              </div>
              <img src="/signup-png.png" alt="Signup visual" className="mx-auto max-h-[240px] w-full object-contain" />
            </div>
          </div>
        </section>

        <section className="relative flex items-center px-4 py-4 sm:px-6 sm:py-6 lg:px-10">

          <div className="app-hero-panel relative mx-auto flex h-[620px] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] p-5 sm:h-[680px] sm:rounded-[2.5rem] sm:p-6 lg:p-8">
            <div className="absolute right-0 top-0 h-28 w-40 opacity-15 blur-3xl" style={{ backgroundColor: themeColor }} />
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl shadow-lg" style={{ backgroundColor: themeColor }}>
                    <MessageSquare className="h-5 w-5 text-black" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-lg font-black tracking-tight text-primary">ChatSphere</p>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-secondary">Create your space</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="app-chip" style={{ color: themeColor }}>
                    Create your space
                  </span>
                  <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">Create account</h1>
                  <p className="mt-3 max-w-md text-sm leading-6 text-secondary">
                    Set up your profile once and keep the same clean UI rhythm across the rest of the app.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-secondary">Username</span>
                    <input
                      type="text"
                      className="app-input w-full rounded-2xl px-4 py-3.5 text-sm"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Email</span>
                    <input
                      type="email"
                      className="app-input w-full rounded-2xl px-4 py-3.5 text-sm"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Password</span>
                    <div className="app-input flex items-center rounded-2xl px-4 py-3.5">
                      <input
                        type={showPassword ? "text" : "password"}
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
                  className="flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                  style={{ backgroundColor: themeColor }}
                  disabled={isSigningUp}
                >
                  {isSigningUp ? "Creating..." : "Create account"}
                </button>
              </form>

              <p className="text-sm text-secondary">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-primary transition hover:text-accent">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignUpPage;
