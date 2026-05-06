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
  const { 
    themeColor, setThemeColor, isLightMode, toggleThemeMode,
    soundEnabled, toggleSound, notificationsEnabled, toggleNotifications 
  } = useThemeStore();
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

    if (!notificationsEnabled) {
      toast.error("Notifications are disabled in settings");
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
    if (!soundEnabled) {
      toast.error("Sound is disabled in settings");
      return;
    }
    const audio = new Audio("/recieve-tone.mp3");
    audio
      .play()
      .then(() => toast.success("Sound played successfully"))
      .catch(() => toast.error("Browser blocked audio. Click again."));
  };

  return (
    <>
      <div className="min-h-screen bg-primary text-primary overflow-y-hidden px-4 pb-4 pt-4 transition-colors duration-500 sm:px-6 sm:pt-6">
      <div className="mx-auto max-w-6xl h-full flex flex-col gap-4">
        <section className={`${cardClass} relative overflow-hidden p-3 sm:p-4 shrink-0`}>
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-15 blur-3xl"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${themeColor} 50%, transparent 100%)` }}
            />

            <div className="relative flex flex-col gap-4">
              <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black tracking-tight text-primary sm:text-2xl">Settings</h1>
                <p className="hidden sm:block text-xs text-gray-400">Manage profile & preferences.</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/"
                  className="app-button app-button-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary hover:text-primary"
                >
                  <ArrowLeft size={12} />
                  Back
                </Link>
                <button
                  onClick={toggleThemeMode}
                  className="app-button app-button-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
                >
                  {isLightMode ? <Moon size={12} className="text-accent" /> : <Sun size={12} className="text-accent" />}
                  {isLightMode ? "Dark" : "Light"}
                </button>
              </div>
            </div>
          </div>
        </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr] flex-1 min-h-0">
            <div className="space-y-4 min-h-0">
              <section className={`${cardClass} p-4 sm:p-5`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative mx-auto sm:mx-0">
                    <div className="size-20 overflow-hidden rounded-[1.5rem] border-2 shadow-xl" style={{ borderColor: themeColor }}>
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

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Profile</p>
                      <h2 className="text-lg font-black text-primary">{authUser.username}</h2>
                      <p className="truncate text-xs text-secondary">{authUser.email}</p>
                    </div>
                    <p className="rounded-xl border border-primary bg-surface px-3 py-2 text-[11px] leading-relaxed text-secondary line-clamp-2">
                      {authUser.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-primary bg-surface p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-secondary">Status</p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Check size={14} className="text-green-500" /> Active
                    </div>
                  </div>
                  <div className="rounded-xl border border-primary bg-surface p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-secondary">Security</p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Shield size={14} className="text-accent" /> Protected
                    </div>
                  </div>
                </div>
              </section>

              <section className={`${cardClass} p-4 sm:p-5`}>
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

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-primary bg-surface p-3">
                    <div>
                      <p className="text-xs font-semibold text-primary">Notifications</p>
                      <p className="text-[9px] text-secondary uppercase tracking-wider font-bold">{notificationPermission}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" checked={notificationsEnabled} onChange={toggleNotifications} />
                      <div className="peer h-5 w-9 rounded-full bg-secondary after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white" style={{ backgroundColor: notificationsEnabled ? themeColor : "" }}></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-primary bg-surface p-3">
                    <div>
                      <p className="text-xs font-semibold text-primary">Sound</p>
                      <p className="text-[9px] text-secondary uppercase tracking-wider font-bold">{soundEnabled ? "Enabled" : "Muted"}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" checked={soundEnabled} onChange={toggleSound} />
                      <div className="peer h-5 w-9 rounded-full bg-secondary after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" style={{ backgroundColor: soundEnabled ? themeColor : "" }}></div>
                    </label>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={handleNotificationTest}
                    className="flex items-center justify-between rounded-xl border p-3 text-left transition hover:scale-[1.01]"
                    style={{ borderColor: `${themeColor}33`, backgroundColor: `${themeColor}12` }}
                  >
                    <p className="text-[11px] font-semibold text-accent">Test Alert</p>
                    <Bell size={14} className="text-accent" />
                  </button>

                  <button
                    onClick={handleSoundTest}
                    className="flex items-center justify-between rounded-xl border border-primary bg-surface p-3 text-left transition hover:bg-secondary/10"
                  >
                    <p className="text-[11px] font-semibold text-primary">Test Sound</p>
                    <Volume2 size={14} className="text-primary" />
                  </button>
                </div>
              </section>
            </div>

            <div className="space-y-4 min-h-0">
              <section className={`${cardClass} p-4 sm:p-5`}>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-primary bg-surface">
                    <Palette size={18} style={{ color: themeColor }} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-primary">Appearance</h3>
                    <p className="hidden sm:block text-[11px] text-gray-400">Personalize your accent color.</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-primary bg-surface p-3">
                  <div className="flex items-center justify-between rounded-xl border border-primary bg-secondary/30 p-3">
                    <div>
                      <p className="text-xs font-semibold text-primary">Highlight</p>
                      <p className="text-[10px] text-secondary">Accent color preview.</p>
                    </div>
                    <div
                      className="flex h-8 min-w-[72px] items-center justify-center rounded-lg px-3 text-[10px] font-black uppercase tracking-wider text-black"
                      style={{ backgroundColor: themeColor }}
                    >
                      Preview
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {NEON_PRESETS.map((preset) => {
                    const isActive = themeColor === preset.color;

                    return (
                      <button
                        key={preset.name}
                        onClick={() => setThemeColor(preset.color)}
                        className={`rounded-xl border p-2 text-center transition ${
                          isActive ? "bg-primary/5" : "bg-surface hover:bg-primary/5"
                        }`}
                        style={{ borderColor: isActive ? themeColor : "transparent" }}
                      >
                        <div className="mx-auto size-4 rounded-full shadow-md" style={{ backgroundColor: preset.color }} />
                        <p className="mt-2 text-[9px] font-black uppercase tracking-wider text-primary">{preset.name}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-primary bg-surface p-3">
                  <p className="text-xs font-semibold text-primary">Custom</p>
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="h-8 w-12 cursor-pointer rounded-lg border border-primary bg-transparent p-0.5"
                  />
                </div>
              </section>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="group app-button app-button-danger flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-3.5 font-black uppercase tracking-[0.15em] text-sm"
              >
                <LogOut size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                Log out
              </button>
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
    </>
  );
};

export default SettingsPage;
