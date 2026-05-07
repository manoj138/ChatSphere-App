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
  Star,
  User,
  X,
  Check,
  Edit2,
  Calendar,
  ShieldCheck,
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
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editedUsername, setEditedUsername] = useState(authUser?.username || "");
  const [bio, setBio] = useState(authUser?.bio || "Tell people a little about yourself.");
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  /* eslint-disable react-hooks/set-state-in-effect -- Keep local edit fields synced when authUser is loaded or refreshed. */
  useEffect(() => {
    if (authUser?.bio) setBio(authUser.bio);
    if (authUser?.username) setEditedUsername(authUser.username);
  }, [authUser]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
    } catch {
      toast.error("Failed to set avatar.");
    }
  };

  const handleUpdateBio = async () => {
    await updateProfile({ bio });
    setIsEditingBio(false);
  };

  const handleUpdateUsername = async () => {
    if (!editedUsername.trim() || editedUsername === authUser.username) {
      setIsEditingUsername(false);
      return;
    }
    await updateProfile({ username: editedUsername });
    setIsEditingUsername(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="app-shell min-h-screen overflow-y-auto custom-scrollbar px-4 pb-24 pt-8 text-primary sm:px-10 sm:pt-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="glass-panel relative flex items-center justify-between gap-3 p-5 sm:p-8 rounded-[2rem]">
          <div className="absolute right-0 top-0 h-40 w-64 opacity-20 blur-[100px]" style={{ backgroundColor: themeColor }} />
          <div className="flex min-w-0 items-center gap-4 sm:gap-8">
            <Link
              to="/"
              className="glass-card rounded-[1.5rem] p-4 text-primary shadow-xl transition-all hover:scale-110 hover:text-accent sm:p-5"
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

        <div className="glass-panel relative overflow-hidden rounded-[3rem] p-6 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute right-0 top-0 p-12 opacity-[0.05]">
            <Star size={160} style={{ color: themeColor }} />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
            <div className="space-y-6">
              <div className="glass-card rounded-[2rem] p-6 shadow-2xl">
                <div className="relative mx-auto w-fit">
                  <div
                    className={`size-32 overflow-hidden rounded-[2.5rem] border-4 bg-white/50 shadow-2xl transition-all duration-700 sm:size-40 ${
                      isUpdatingProfile ? "scale-95 opacity-60" : "hover:scale-[1.02]"
                    }`}
                    style={{ borderColor: "transparent" }}
                  >
                    <img
                      src={selectedImg || authUser.profilePicture || "/avatar.png"}
                      alt="Profile"
                      className="size-full object-cover cursor-zoom-in"
                      onClick={() => setPreviewImage(selectedImg || authUser.profilePicture || "/avatar.png")}
                    />
                    <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                      <Camera className="mb-2 h-8 w-8 text-white" />
                      <span className="px-6 text-center text-[10px] font-bold uppercase tracking-widest text-white">Change Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
                    </label>
                  </div>

                  <button
                    onClick={() => setShowAvatarGallery(!showAvatarGallery)}
                    className="absolute -bottom-1 -right-1 flex size-11 items-center justify-center rounded-xl text-black shadow-xl transition-all hover:scale-110 active:scale-90 ring-4 ring-black/5"
                    style={{ backgroundColor: themeColor }}
                    disabled={isUpdatingProfile}
                  >
                    <Grid size={24} />
                  </button>
                </div>

                <div className="mt-8 text-center">
                  {isEditingUsername ? (
                    <div className="mx-auto flex max-w-[200px] items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        value={editedUsername}
                        onChange={(e) => setEditedUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdateUsername()}
                        className="w-full rounded-xl border-none bg-black/5 px-4 py-2 text-center text-xl font-bold shadow-inner focus:ring-1 focus:ring-accent/20"
                      />
                      <button
                        onClick={handleUpdateUsername}
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl text-black shadow-lg"
                        style={{ backgroundColor: themeColor }}
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="group flex items-center justify-center gap-2">
                      <h2 className="break-words text-3xl font-bold tracking-tight text-primary">{authUser?.username}</h2>
                      <button
                        onClick={() => setIsEditingUsername(true)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 p-1 text-gray-400 hover:text-accent"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                  <p className="mt-2 break-all text-[14px] font-medium text-gray-500">{authUser?.email}</p>
                </div>
              </div>




            </div>

            <div className="space-y-8">
              {showAvatarGallery && (
                <div className="glass-card rounded-[2.5rem] p-6 shadow-2xl sm:p-10 animate-in zoom-in-95 duration-500">
                  <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                      <h4 className="text-xl font-bold tracking-tight text-primary text-2xl">Choose Avatar</h4>
                      <p className="mt-2 text-sm font-normal text-gray-400">Select an avatar to represent you.</p>
                    </div>
                    <button onClick={() => setShowAvatarGallery(false)} className="rounded-2xl bg-gray-50 p-3 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="mt-10 grid gap-10 sm:grid-cols-2">
                    <div className="space-y-6">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Boys</p>
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
                      <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Girls</p>
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

              <div className="glass-card rounded-[2.5rem] p-6 shadow-2xl sm:p-10">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Bio</p>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-primary">Your Bio</h3>
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
                      className="app-input min-h-[160px] w-full resize-none rounded-[2rem] border-none bg-black/5 px-6 py-6 text-[15px] font-medium text-primary shadow-inner focus:bg-black/10"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write about yourself..."
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

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="glass-card group flex items-center gap-5 rounded-[2rem] p-6 shadow-xl transition-all">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Member Since</p>
                    <p className="mt-1 text-base font-bold text-primary">{formatDate(authUser?.createdAt)}</p>
                  </div>
                </div>

                <div className="glass-card group flex items-center gap-5 rounded-[2rem] p-6 shadow-xl transition-all">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 transition-transform group-hover:scale-110">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Account Status</p>
                    <p className="mt-1 text-base font-bold text-green-500">Verified & Active</p>
                  </div>
                </div>
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
