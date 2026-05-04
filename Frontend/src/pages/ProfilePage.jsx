import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Edit3,
  Grid,
  Loader2,
  Shield,
  Star,
  User,
  X,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { optimizeImageFile } from "../lib/image";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { themeColor } = useThemeStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(authUser?.bio || "Tell people a little about yourself.");
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);

  useEffect(() => {
    if (authUser?.bio) setBio(authUser.bio);
  }, [authUser]);

  const boyAvatars = ["/boy_1.png", "/boy_2.png", "/boy_3.png", "/boy_4.png", "/boy_5.png"];
  const girlAvatars = ["/girl_1.png", "/girl_2.png", "/girl_3.png", "/girl_4.png"];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const optimizedImage = await optimizeImageFile(file);
      setSelectedImg(optimizedImage);
      await updateProfile({ profilePicture: optimizedImage });
      toast.success("Custom profile image set!");
    } catch (err) {
      toast.error(err.message || "Upload failed. Try an avatar instead.");
    }
  };

  const selectAvatar = async (path) => {
    setSelectedImg(path);
    try {
      await updateProfile({ profilePicture: path });
      setShowAvatarGallery(false);
      toast.success("Avatar updated successfully!");
    } catch (err) {
      toast.error("Failed to set avatar.");
    }
  };

  const handleUpdateBio = async () => {
    await updateProfile({ bio });
    setIsEditingBio(false);
  };

  return (
    <div className="app-shell min-h-screen overflow-y-auto custom-scrollbar px-4 pb-20 pt-6 text-white sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="app-hero-panel relative flex items-center justify-between gap-3 overflow-hidden rounded-[2rem] p-4 sm:rounded-[2.5rem] sm:p-6">
          <div className="absolute right-0 top-0 h-28 w-40 opacity-15 blur-3xl" style={{ backgroundColor: themeColor }} />
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <Link
              to="/"
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-gray-400 transition-all hover:bg-white/[0.05] hover:text-white sm:p-4"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="min-w-0">
              <span className="app-chip mb-3" style={{ color: themeColor }}>Identity</span>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl">Profile</h1>
              <p className="mt-1 text-xs font-medium text-gray-500">
                {isUpdatingProfile ? "Synchronizing profile changes..." : "Profile ready"}
              </p>
            </div>
          </div>

          {isUpdatingProfile ? (
            <Loader2 className="size-10 animate-spin" style={{ color: themeColor }} />
          ) : (
            <div
              className="flex size-12 items-center justify-center rounded-2xl text-black shadow-lg"
              style={{ backgroundColor: themeColor }}
            >
              <User size={24} fill="currentColor" />
            </div>
          )}
        </div>

        <div className="app-hero-panel relative overflow-hidden rounded-[2rem] p-5 sm:rounded-[2.5rem] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute right-0 top-0 p-8 opacity-[0.04]">
            <Star size={120} style={{ color: themeColor }} />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-5">
                <div className="relative mx-auto w-fit">
                  <div
                    className={`size-32 overflow-hidden rounded-[2rem] border-4 shadow-2xl transition-all duration-500 sm:size-40 ${
                      isUpdatingProfile ? "scale-95 opacity-60" : ""
                    }`}
                    style={{ borderColor: themeColor }}
                  >
                    <img
                      src={selectedImg || authUser.profilePicture || "/avatar.png"}
                      alt="Profile"
                      className="size-full object-cover"
                    />
                    <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/55 opacity-0 transition-opacity hover:opacity-100">
                      <Camera className="mb-2 h-6 w-6 text-white" />
                      <span className="px-4 text-center text-xs font-semibold text-white">Upload photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
                    </label>
                  </div>

                  <button
                    onClick={() => setShowAvatarGallery(!showAvatarGallery)}
                    className="absolute -bottom-2 -right-2 rounded-2xl border-4 border-[#0a0a0a] p-3 text-black shadow-xl transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: themeColor }}
                    disabled={isUpdatingProfile}
                  >
                    <Grid size={18} />
                  </button>
                </div>

                <div className="mt-5 text-center">
                  <h2 className="break-words text-2xl font-black tracking-tight sm:text-3xl">{authUser?.username}</h2>
                  <p className="mt-2 break-all text-sm text-gray-500">{authUser?.email}</p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-4 rounded-[1.5rem] border border-white/5 bg-white/[0.03] p-4">
                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <Shield size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">Plan</p>
                    <p className="mt-1 text-sm font-semibold text-white">Standard account</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-[1.5rem] border border-white/5 bg-white/[0.03] p-4">
                  <div className="rounded-xl bg-white/[0.04] p-3">
                    <Star size={18} style={{ color: themeColor }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">Theme</p>
                    <p className="mt-1 text-sm font-semibold" style={{ color: themeColor }}>
                      Custom accent enabled
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {showAvatarGallery && (
                <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h4 className="text-sm font-black tracking-tight text-white">Avatar gallery</h4>
                      <p className="mt-1 text-xs text-gray-500">Pick a cleaner default avatar for your profile.</p>
                    </div>
                    <button onClick={() => setShowAvatarGallery(false)} className="rounded-xl p-2 text-gray-500 transition hover:bg-white/[0.05] hover:text-white">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Masculine avatars</p>
                      <div className="grid grid-cols-3 gap-3">
                        {boyAvatars.map((path) => (
                          <button key={path} onClick={() => selectAvatar(path)} className="relative flex flex-col items-center gap-2">
                            <div className={`size-16 overflow-hidden rounded-2xl border-2 transition-all ${authUser.profilePicture === path ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.16)]" : "border-white/5 hover:border-white/20"}`}>
                              <img src={path} className="size-full object-cover" />
                            </div>
                            <span className="text-[10px] font-medium text-gray-500">Select</span>
                            {authUser.profilePicture === path && (
                              <div className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-white text-black">
                                <CheckCircle2 size={10} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Feminine avatars</p>
                      <div className="grid grid-cols-3 gap-3">
                        {girlAvatars.map((path) => (
                          <button key={path} onClick={() => selectAvatar(path)} className="relative flex flex-col items-center gap-2">
                            <div className={`size-16 overflow-hidden rounded-2xl border-2 transition-all ${authUser.profilePicture === path ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.16)]" : "border-white/5 hover:border-white/20"}`}>
                              <img src={path} className="size-full object-cover" />
                            </div>
                            <span className="text-[10px] font-medium text-gray-500">Select</span>
                            {authUser.profilePicture === path && (
                              <div className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-white text-black">
                                <CheckCircle2 size={10} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">About</p>
                    <h3 className="mt-1 text-lg font-black tracking-tight text-white">Bio</h3>
                  </div>
                  {!isEditingBio && (
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-gray-400 transition-all hover:bg-white/[0.05]"
                    >
                      <Edit3 size={16} style={{ color: themeColor }} />
                    </button>
                  )}
                </div>

                {isEditingBio ? (
                  <div className="space-y-4">
                    <textarea
                      className="app-input h-32 w-full resize-none rounded-2xl px-4 py-4 text-sm"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write something about yourself..."
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsEditingBio(false)}
                        className="flex-1 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.05]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateBio}
                        className="flex-[1.4] rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-black transition hover:brightness-110 active:scale-[0.99]"
                        style={{ backgroundColor: themeColor }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-7 text-gray-300">
                    {authUser?.bio || bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
