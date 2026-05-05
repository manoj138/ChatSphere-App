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
      <button
        onClick={() => navigate("/")}
        className="fixed left-4 top-5 z-20 inline-flex items-center gap-2 rounded-xl border border-primary bg-surface px-3 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary/10 hover:text-primary sm:left-6 sm:top-8"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="mx-auto grid min-h-screen max-w-7xl overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
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
                    <p className="text-[11px] uppercase tracking-[0.22em] text-secondary">Welcome back</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="app-chip" style={{ color: themeColor }}>
                    Fast private chat
                  </span>
                  <h1 className="text-4xl font-black tracking-tight text-primary sm:text-5xl">Sign in</h1>
                  <p className="mt-3 max-w-md text-sm leading-6 text-secondary">
                    Continue your conversations with the same clean workspace across every screen.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-secondary">Email</span>
                    <input
                      type="email"
                      required
                      className="app-input w-full rounded-2xl px-4 py-3.5 text-sm"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-secondary">Password</span>
                    <div className="app-input flex items-center rounded-2xl px-4 py-3.5">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full bg-transparent text-sm text-primary outline-none"
                        placeholder="Enter your password"
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
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p className="text-sm text-secondary">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="font-bold text-primary transition hover:text-accent">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="hidden lg:flex items-center justify-center border-l border-white/5 px-10 py-6">
          <div className="app-hero-panel relative w-full max-w-2xl h-[620px] sm:h-[680px] overflow-hidden rounded-[2.5rem] p-6">
            <div className="absolute inset-x-10 top-0 h-40 opacity-20 blur-3xl" style={{ backgroundColor: themeColor }} />
            <div className="relative space-y-4">
              <div className="app-chip w-fit" style={{ borderColor: `${themeColor}33`, color: themeColor }}>
                Secure messaging
              </div>
              <div>
                <h2 className="text-5xl font-black leading-tight tracking-tight text-primary">
                  Private chat,
                  <br />
                  made simple.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-secondary">
                  Consistent cards, softer surfaces and clearer spacing across auth, profile, settings and chat.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-secondary">Realtime</p>
                  <p className="mt-2 text-sm font-semibold text-primary">Instant sync</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Focused</p>
                  <p className="mt-2 text-sm font-semibold text-white">Zero clutter</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Secure</p>
                  <p className="mt-2 text-sm font-semibold text-white">Private space</p>
                </div>
              </div>
              <img src="/login-png.png" alt="Login visual" className="mx-auto max-h-[240px] w-full object-contain" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
