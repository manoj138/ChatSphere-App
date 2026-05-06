import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Bell,
  Camera,
  Check,
  LogOut,
  Moon,
  Palette,
  Shield,
  Sun,
  Volume2,
  Zap,
} from "lucide-react";

import ConfirmationModal from "../components/ConfirmationModal";
import { optimizeImageFile } from "../lib/image";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const NEON_PRESETS = [
  { name: "LIME", color: "#bef264" },
  { name: "CYAN", color: "#00ffff" },
  { name: "PINK", color: "#ff4dff" },
  { name: "GOLD", color: "#ffcc00" },
  { name: "RUBY", color: "#ff4d4d" },
  { name: "NOVA", color: "#bf40bf" },
];

const cardClass =
  "rounded-[2rem] sm:rounded-[2.5rem] border border-primary bg-secondary shadow-2xl";

const SettingsPage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const { themeColor, setThemeColor, isLightMode, toggleThemeMode } = useThemeStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const notificationSupported = typeof window !== "undefined" && "Notification" in window;
  const notificationPermission = notificationSupported ? Notification.permission : "unsupported";

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const optimizedImage = await optimizeImageFile(file);
      await updateProfile({ profilePicture: optimizedImage });
      toast.success("Profile image updated");
    } catch (error) {
      toast.error(error.message || "Failed to update profile image");
    }
  };

  const handleNotificationTest = () => {
    if (!notificationSupported) {
      toast.error("This browser does not support notifications");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification("ChatSphere test notification", {
        body: "Notifications are working correctly on this device.",
        icon: "/favicon.svg",
      });
      toast.success("Notification sent");
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        toast.success("Permission granted. Try the test again.");
      } else {
        toast.error("Notification permission denied.");
      }
    });
  };

  const handleSoundTest = () => {
    const audio = new Audio("/recieve-tone.mp3");
    audio
      .play()
      .then(() => toast.success("Sound played successfully"))
      .catch(() => toast.error("Browser blocked audio. Click again."));
  };

  return (
    <div className="min-h-screen bg-primary text-primary overflow-y-auto custom-scrollbar px-4 pb-20 pt-16 transition-colors duration-500 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className={`${cardClass} relative overflow-hidden p-6 sm:p-8`}>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-15 blur-3xl"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${themeColor} 50%, transparent 100%)` }}
          />

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/"
                className="app-button app-button-secondary inline-flex items-center gap-3 self-start text-secondary hover:text-primary"
              >
                <ArrowLeft size={18} />
                Back to chat
              </Link>

              <button
                onClick={toggleThemeMode}
                className="app-button app-button-secondary inline-flex items-center gap-3 self-start"
              >
                {isLightMode ? <Moon size={18} className="text-accent" /> : <Sun size={18} className="text-accent" />}
                {isLightMode ? "Switch to dark mode" : "Switch to light mode"}
              </button>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <span className="inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ borderColor: `${themeColor}33`, color: themeColor, backgroundColor: `${themeColor}12` }}>
                  Personalize workspace
                </span>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-primary sm:text-5xl">Settings</h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                    Cleaner controls for your profile, theme, and device checks in one place.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                <div className="rounded-2xl border border-primary bg-surface p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Theme</p>
                  <p className="mt-2 text-sm font-semibold text-primary">{isLightMode ? "Light mode" : "Dark mode"}</p>
                </div>
                <div className="rounded-2xl border border-primary bg-surface p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Accent</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="size-4 rounded-full" style={{ backgroundColor: themeColor }} />
                    <p className="text-sm font-semibold text-primary">{themeColor.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1.2fr]">
          <div className="space-y-6">
            <section className={`${cardClass} p-6 sm:p-8`}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative mx-auto sm:mx-0">
                  <div className="size-32 overflow-hidden rounded-[2rem] border-4 shadow-2xl" style={{ borderColor: themeColor }}>
                    <img
                      src={authUser.profilePicture || "/boy_1.png"}
                      className={`h-full w-full object-cover transition duration-500 ${isUpdatingProfile ? "scale-95 opacity-60" : ""}`}
                      alt={authUser.username}
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUpdatingProfile}
                    className="absolute -bottom-2 -right-2 inline-flex items-center gap-2 rounded-2xl border border-primary bg-secondary px-3 py-2 text-xs font-bold text-primary transition hover:scale-105 disabled:opacity-50"
                  >
                    <Camera size={14} />
                    {isUpdatingProfile ? "Updating" : "Change"}
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>

                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">Profile</p>
                    <h2 className="mt-2 text-2xl font-black text-primary">{authUser.username}</h2>
                    <p className="mt-1 break-all text-sm text-secondary">{authUser.email}</p>
                  </div>
                  <p className="rounded-2xl border border-primary bg-surface px-4 py-3 text-sm leading-6 text-secondary">
                    {authUser.bio || "No bio added yet. Add one from your profile to make your account feel complete."}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-primary bg-surface p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Account status</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary">
                    <Check size={16} className="text-green-500" />
                    Active session
                  </div>
                </div>
                <div className="rounded-2xl border border-primary bg-surface p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Security</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary">
                    <Shield size={16} className="text-accent" />
                    Protected
                  </div>
                </div>
              </div>
            </section>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="app-button app-button-danger flex w-full items-center justify-center gap-3 rounded-[1.75rem] px-5 py-4 font-black uppercase tracking-[0.25em]"
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>

          <div className="space-y-6">
            <section className={`${cardClass} p-6 sm:p-8`}>
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-primary bg-surface">
                  <Palette size={20} style={{ color: themeColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-primary">Appearance</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Pick an accent color and keep the rest of the app aligned with your style.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-primary bg-surface p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Live preview</p>
                <div className="mt-4 flex items-center justify-between rounded-[1.5rem] border border-primary bg-secondary/30 p-4">
                  <div>
                    <p className="text-sm font-semibold text-primary">Message highlight</p>
                    <p className="mt-1 text-xs text-secondary">Buttons, badges and links use this color.</p>
                  </div>
                  <div
                    className="flex h-11 min-w-[96px] items-center justify-center rounded-2xl px-4 text-xs font-black uppercase tracking-[0.2em] text-black"
                    style={{ backgroundColor: themeColor }}
                  >
                    Preview
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                {NEON_PRESETS.map((preset) => {
                  const isActive = themeColor === preset.color;

                  return (
                    <button
                      key={preset.name}
                      onClick={() => setThemeColor(preset.color)}
                      className={`rounded-[1.5rem] border p-4 text-left transition ${
                        isActive ? "bg-primary/5" : "bg-surface hover:bg-primary/5"
                      }`}
                      style={{ borderColor: isActive ? themeColor : "transparent" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="size-5 rounded-full shadow-lg" style={{ backgroundColor: preset.color }} />
                        {isActive && <Check size={16} className="text-accent" />}
                      </div>
                      <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-primary">{preset.name}</p>
                      <p className="mt-1 text-[11px] text-gray-500">{preset.color}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-[1.75rem] border border-primary bg-surface px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-primary">Custom color</p>
                  <p className="mt-1 text-xs text-gray-500">Use any color beyond the presets.</p>
                </div>
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="h-11 w-14 cursor-pointer rounded-xl border border-primary bg-transparent p-1"
                />
              </div>
            </section>

            <section className={`${cardClass} p-6 sm:p-8`}>
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-primary bg-surface">
                  <Zap size={20} className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-primary">Device checks</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Verify browser notifications and audio without leaving the page.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-primary bg-surface p-4">
                  <span className="text-sm font-semibold text-primary">Notification permission</span>
                  <span
                    className={`text-xs font-black uppercase tracking-[0.2em] ${
                      notificationPermission === "granted"
                        ? "text-green-500"
                        : notificationPermission === "unsupported"
                          ? "text-red-400"
                          : "text-orange-400"
                    }`}
                  >
                    {notificationPermission}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-primary bg-surface p-4">
                  <span className="text-sm font-semibold text-primary">Audio playback</span>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">Ready</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={handleNotificationTest}
                  className="flex items-center justify-between rounded-[1.5rem] border p-4 text-left transition hover:scale-[1.01]"
                  style={{ borderColor: `${themeColor}33`, backgroundColor: `${themeColor}12` }}
                >
                  <div>
                    <p className="text-sm font-semibold text-accent">Test notification</p>
                    <p className="mt-1 text-xs text-gray-400">Send a local browser alert.</p>
                  </div>
                  <Bell size={18} className="text-accent" />
                </button>

                <button
                  onClick={handleSoundTest}
                  className="flex items-center justify-between rounded-[1.5rem] border border-primary bg-surface p-4 text-left transition hover:bg-secondary/10"
                >
                  <div>
                    <p className="text-sm font-semibold text-primary">Test sound</p>
                    <p className="mt-1 text-xs text-secondary">Play the incoming tone once.</p>
                  </div>
                  <Volume2 size={18} className="text-primary" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <ConfirmationModal
          title="Log out?"
          description="You are about to end your current session. Do you want to continue?"
          onConfirm={logout}
          onCancel={() => setShowLogoutConfirm(false)}
          type="danger"
        />
      )}
    </div>
  );
};

export default SettingsPage;
