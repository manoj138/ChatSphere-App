import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Bell,
  Camera,
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
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const NEON_PRESETS = [
  { name: "MINT", color: "#bef264" },
  { name: "SKY", color: "#38bdf8" },
  { name: "ROSE", color: "#fda4af" },
  { name: "PURPLE", color: "#c084fc" },
  { name: "AMBER", color: "#fbbf24" },
  { name: "SILVER", color: "#94a3b8" },
];

const cardClass = "glass-panel rounded-[2rem]";

const SettingsPage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuth();
  const { 
    themeColor, setThemeColor, isLightMode, toggleThemeMode,
    soundEnabled, toggleSound, notificationsEnabled, toggleNotifications 
  } = useTheme();
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
      <div className="min-h-screen overflow-y-auto custom-scrollbar px-4 pb-20 pt-8 transition-colors duration-500 sm:px-10 sm:pt-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className={`${cardClass} relative overflow-hidden p-5 sm:p-8`}>
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-20 blur-[100px]"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${themeColor} 50%, transparent 100%)` }}
            />

            <div className="relative flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
                    App Settings
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Settings</h1>
                <p className="hidden sm:block mt-1 text-sm font-medium text-gray-400 uppercase tracking-tighter">Customize your experience</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Link
                  to="/"
                  className="glass-card flex size-12 items-center justify-center rounded-2xl text-primary shadow-xl transition-all hover:scale-110 hover:text-accent sm:size-14 sm:rounded-[1.25rem]"
                >
                  <ArrowLeft size={24} />
                </Link>
                <button
                  onClick={toggleThemeMode}
                  className="glass-card flex size-12 items-center justify-center rounded-2xl text-accent shadow-xl transition-all hover:scale-110 sm:size-14 sm:rounded-[1.25rem]"
                >
                  {isLightMode ? <Moon size={24} /> : <Sun size={24} />}
                </button>
              </div>
            </div>
          </div>
        </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-8">
              <section className={`${cardClass} p-6 sm:p-10`}>
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                  <div className="relative mx-auto sm:mx-0">
                    <div className="size-28 overflow-hidden rounded-[2rem] border-4 bg-black/10 shadow-2xl sm:size-32" style={{ borderColor: "transparent" }}>
                      <img
                        src={authUser.profilePicture || "/boy_1.png"}
                        className={`h-full w-full object-cover transition duration-700 ${isUpdatingProfile ? "scale-95 opacity-60" : "hover:scale-110"}`}
                        alt={authUser.username}
                      />
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUpdatingProfile}
                      className="absolute -bottom-2 -right-2 flex items-center justify-center rounded-2xl bg-black px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-105 disabled:opacity-50"
                    >
                      <Camera size={16} className="mr-2" />
                      Change
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>

                  <div className="flex-1 space-y-4 text-center sm:text-left">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Logged in as</p>
                      <h2 className="mt-1 text-2xl font-bold text-primary">{authUser.username}</h2>
                      <p className="truncate text-sm font-medium text-gray-400">{authUser.email}</p>
                    </div>
                    <p className="rounded-2xl bg-black/5 px-5 py-4 text-sm font-medium leading-relaxed text-secondary shadow-inner ring-1 ring-white/5">
                      {authUser.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="glass-card rounded-[1.5rem] p-5 shadow-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Connection</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-primary">
                      <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" /> 
                      Connected
                    </div>
                  </div>
                  <div className="glass-card rounded-[1.5rem] p-5 shadow-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Security</p>
                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-primary">
                      <Shield size={16} className="text-accent" /> Secure
                    </div>
                  </div>
                </div>
              </section>

              <section className={`${cardClass} p-6 sm:p-10`}>
                <div className="flex items-start gap-5">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-500 shadow-lg">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">Preferences</h3>
                    <p className="mt-1 text-[13px] font-medium leading-relaxed text-gray-400">
                      Test your sound and notifications.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="glass-card flex items-center justify-between rounded-[1.5rem] p-5 shadow-xl">
                    <div>
                      <p className="text-sm font-black text-primary">Visual Alerts</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">{notificationPermission}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" checked={notificationsEnabled} onChange={toggleNotifications} />
                      <div className="peer h-7 w-12 rounded-full bg-gray-100 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-lg after:transition-all peer-checked:bg-accent peer-checked:after:translate-x-5" style={{ backgroundColor: notificationsEnabled ? themeColor : "" }}></div>
                    </label>
                  </div>

                  <div className="glass-card flex items-center justify-between rounded-[1.5rem] p-5 shadow-xl">
                    <div>
                      <p className="text-sm font-black text-primary">Audio Feedback</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">{soundEnabled ? "Active" : "Disabled"}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" checked={soundEnabled} onChange={toggleSound} />
                      <div className="peer h-7 w-12 rounded-full bg-gray-100 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-lg after:transition-all peer-checked:after:translate-x-5" style={{ backgroundColor: soundEnabled ? themeColor : "" }}></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={handleNotificationTest}
                    className="flex items-center justify-between rounded-2xl p-5 text-left shadow-xl transition-all hover:scale-105"
                    style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-widest">Test Notification</p>
                    <Bell size={18} />
                  </button>

                  <button
                    onClick={handleSoundTest}
                    className="glass-card flex items-center justify-between rounded-2xl p-5 text-left text-gray-400 shadow-xl transition-all hover:scale-105 hover:text-primary"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-widest">Test Sound</p>
                    <Volume2 size={18} />
                  </button>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className={`${cardClass} p-6 sm:p-10`}>
                <div className="flex items-start gap-5">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent shadow-lg">
                    <Palette size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">Theme Colors</h3>
                    <p className="text-[13px] font-normal leading-relaxed text-gray-400">Choose a color that fits you.</p>
                  </div>
                </div>

                <div className="mt-8 rounded-[2rem] glass-card p-6 shadow-xl">
                  <div className="flex items-center justify-between rounded-2xl glass-card p-5 shadow-inner">
                    <div>
                      <p className="text-sm font-black text-primary">Core Accent</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Active Color</p>
                    </div>
                    <div
                      className="flex h-10 min-w-[100px] items-center justify-center rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-black shadow-xl"
                      style={{ backgroundColor: themeColor }}
                    >
                      Active
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  {NEON_PRESETS.map((preset) => {
                    const isActive = themeColor === preset.color;

                    return (
                      <button
                        key={preset.name}
                        onClick={() => setThemeColor(preset.color)}
                        className={`group relative flex flex-col items-center gap-2 rounded-xl glass-card p-3 shadow-lg transition-all hover:scale-110 ${
                          isActive ? "ring-2 ring-primary shadow-accent/20" : "hover:shadow-accent/10"
                        }`}
                      >
                        <div className="size-8 rounded-full shadow-2xl transition-transform group-hover:rotate-12" style={{ backgroundColor: preset.color }} />
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-primary">{preset.name}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between rounded-2xl glass-card p-5 shadow-xl">
                  <p className="text-sm font-black text-primary">Custom Spectrum</p>
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="h-10 w-16 cursor-pointer rounded-xl border-4 border-white bg-white shadow-lg"
                  />
                </div>
              </section>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="group flex w-full items-center justify-center gap-4 rounded-[2rem] bg-red-500 p-6 font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-red-500/30 transition-all hover:brightness-110 active:scale-95"
              >
                <LogOut size={20} className="transition-transform duration-300 group-hover:translate-x-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {showLogoutConfirm && (
          <ConfirmationModal
            title="Logout?"
            description="Are you sure you want to log out? You will need to login again to access your chats."
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
