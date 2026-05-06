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

import ImageModal from "../components/ImageModal";

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
  const [previewImage, setPreviewImage] = useState(null);

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
    <div className="app-shell min-h-screen overflow-y-auto custom-scrollbar px-4 pb-24 pt-8 text-primary sm:px-10 sm:pt-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-[2rem] bg-white/40 p-5 backdrop-blur-3xl shadow-2xl ring-1 ring-black/5 sm:p-8">
          <div className="absolute right-0 top-0 h-40 w-64 opacity-20 blur-[100px]" style={{ backgroundColor: themeColor }} />
          <div className="flex min-w-0 items-center gap-4 sm:gap-8">
            <Link
              to="/"
              className="rounded-[1.5rem] bg-white p-4 text-gray-400 shadow-xl transition-all hover:scale-110 hover:text-accent sm:p-5"
            >
              <ArrowLeft size={24} />
            </Link>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-accent">
                <div className="size-1.5 rounded-full bg-accent animate-pulse" />
                Verified Identity
              </span>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-primary">Your Profile</h1>
              <p className="mt-1 text-sm font-bold text-gray-500 uppercase tracking-tighter">
                {isUpdatingProfile ? "Synchronizing Cloud..." : "Global Status: Operational"}
              </p>
            </div>
          </div>

          {isUpdatingProfile ? (
            <Loader2 className="size-12 animate-spin text-accent" />
          ) : (
            <div
              className="flex size-11 items-center justify-center rounded-xl text-black shadow-xl transition-transform hover:rotate-12"
              style={{ backgroundColor: themeColor }}
            >
              <User size={28} fill="currentColor" />
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-[3rem] bg-white/60 p-6 backdrop-blur-3xl shadow-2xl ring-1 ring-black/5 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute right-0 top-0 p-12 opacity-[0.05]">
            <Star size={160} style={{ color: themeColor }} />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/[0.03]">
                <div className="relative mx-auto w-fit">
                  <div
                    className={`size-32 overflow-hidden rounded-[2.5rem] border-4 bg-white shadow-2xl transition-all duration-700 sm:size-40 ${
                      isUpdatingProfile ? "scale-95 opacity-60" : "hover:scale-[1.02]"
                    }`}
                    style={{ borderColor: "white" }}
                  >
                    <img
                      src={selectedImg || authUser.profilePicture || "/avatar.png"}
                      alt="Profile"
                      className="size-full object-cover cursor-zoom-in"
                      onClick={() => setPreviewImage(selectedImg || authUser.profilePicture || "/avatar.png")}
                    />
                    <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                      <Camera className="mb-2 h-8 w-8 text-white" />
                      <span className="px-6 text-center text-[10px] font-black uppercase tracking-widest text-white">Refine Visual</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
                    </label>
                  </div>

                  <button
                    onClick={() => setShowAvatarGallery(!showAvatarGallery)}
                    className="absolute -bottom-1 -right-1 flex size-11 items-center justify-center rounded-xl text-black shadow-xl transition-all hover:scale-110 active:scale-90 ring-4 ring-white"
                    style={{ backgroundColor: themeColor }}
                    disabled={isUpdatingProfile}
                  >
                    <Grid size={24} />
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <h2 className="break-words text-3xl font-black tracking-tight text-primary">{authUser?.username}</h2>
                  <p className="mt-3 break-all text-[15px] font-bold text-accent">{authUser?.email}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="group flex items-center gap-5 rounded-[2rem] bg-white p-5 shadow-xl transition-all hover:bg-accent/5">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Security Tier</p>
                    <p className="mt-1 text-[15px] font-black text-primary">Premium User</p>
                  </div>
                </div>

                <div className="group flex items-center gap-5 rounded-[2rem] bg-white p-5 shadow-xl transition-all hover:bg-accent/5">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-500 transition-transform group-hover:scale-110">
                    <Star size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Design System</p>
                    <p className="mt-1 text-[15px] font-black" style={{ color: themeColor }}>
                      Mint Aesthetic Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {showAvatarGallery && (
                <div className="rounded-[2.5rem] bg-white p-6 shadow-2xl sm:p-10 animate-in zoom-in-95 duration-500">
                  <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                      <h4 className="text-xl font-black tracking-tight text-primary text-2xl">Visual Archetypes</h4>
                      <p className="mt-2 text-sm font-medium text-gray-400">Curated default avatars for your digital presence.</p>
                    </div>
                    <button onClick={() => setShowAvatarGallery(false)} className="rounded-2xl bg-gray-50 p-3 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mt-10 grid gap-10 sm:grid-cols-2">
                    <div className="space-y-6">
                      <p className="text-[11px] font-black uppercase tracking-widest text-accent">Masculine Styles</p>
                      <div className="grid grid-cols-3 gap-4">
                        {boyAvatars.map((path) => (
                          <button key={path} onClick={() => selectAvatar(path)} className="group relative flex flex-col items-center gap-3">
                            <div className={`size-20 overflow-hidden rounded-2xl border-4 transition-all duration-300 ${authUser.profilePicture === path ? "border-accent shadow-2xl scale-110" : "border-white bg-white shadow-lg group-hover:border-accent/30 group-hover:scale-105"}`}>
                              <img src={path} className="size-full object-cover" />
                            </div>
                            {authUser.profilePicture === path && (
                              <div className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-lg bg-accent text-black shadow-lg ring-2 ring-white">
                                <CheckCircle2 size={14} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[11px] font-black uppercase tracking-widest text-accent">Feminine Styles</p>
                      <div className="grid grid-cols-3 gap-4">
                        {girlAvatars.map((path) => (
                          <button key={path} onClick={() => selectAvatar(path)} className="group relative flex flex-col items-center gap-3">
                            <div className={`size-20 overflow-hidden rounded-2xl border-4 transition-all duration-300 ${authUser.profilePicture === path ? "border-accent shadow-2xl scale-110" : "border-white bg-white shadow-lg group-hover:border-accent/30 group-hover:scale-105"}`}>
                              <img src={path} className="size-full object-cover" />
                            </div>
                            {authUser.profilePicture === path && (
                              <div className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-lg bg-accent text-black shadow-lg ring-2 ring-white">
                                <CheckCircle2 size={14} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-[2.5rem] bg-white p-6 shadow-2xl sm:p-10 shadow-black/[0.03]">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-accent">Personal Statement</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-primary">Your Bio</h3>
                  </div>
                  {!isEditingBio && (
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="rounded-2xl bg-accent/10 p-4 text-accent transition-all hover:bg-accent hover:text-black hover:shadow-xl hover:shadow-accent/20 active:scale-95"
                    >
                      <Edit3 size={20} />
                    </button>
                  )}
                </div>

                {isEditingBio ? (
                  <div className="space-y-6">
                    <textarea
                      className="app-input min-h-[160px] w-full resize-none rounded-[2rem] border-none bg-gray-50 px-6 py-6 text-[15px] font-bold text-primary shadow-inner focus:bg-white"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write your manifesto..."
                    />
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <button
                        onClick={() => setIsEditingBio(false)}
                        className="rounded-2xl bg-gray-100 px-8 py-4 text-sm font-bold text-gray-500 transition-all hover:bg-gray-200 hover:text-primary active:scale-95"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateBio}
                        className="flex-1 rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-black shadow-xl transition-all hover:brightness-110 hover:shadow-accent/30 active:scale-[0.98]"
                        style={{ backgroundColor: themeColor }}
                      >
                        Save Biography
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[16px] font-medium leading-relaxed text-secondary opacity-80">
                    {authUser?.bio || bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {previewImage && <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />}
    </div>
  );
};

export default ProfilePage;
