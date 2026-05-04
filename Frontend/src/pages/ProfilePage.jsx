import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Camera, User, ArrowLeft, Edit3, Shield, Star, Grid, CheckCircle2, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
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
    <div className="min-h-screen bg-[#050505] text-white pt-6 sm:pt-10 px-4 sm:px-6 overflow-y-auto custom-scrollbar pb-20">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between bg-[#0a0a0a] p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 shadow-2xl animate-in slide-in-from-top-4 duration-500 gap-3">
           <div className="flex items-center gap-3 sm:gap-5 min-w-0">
              <Link to="/" className="p-3 sm:p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-gray-400 hover:text-white border border-white/5">
                 <ArrowLeft size={20} />
              </Link>
              <div className="min-w-0">
                 <h1 className="text-xl sm:text-2xl font-black tracking-tight">Profile</h1>
                 <p className="text-xs text-gray-500 font-semibold mt-1">Status: {isUpdatingProfile ? "Synchronizing..." : "Profile ready"}</p>
              </div>
           </div>
           {isUpdatingProfile ? (
             <Loader2 className="size-10 animate-spin" style={{ color: themeColor }} />
           ) : (
             <div className="size-12 rounded-2xl flex items-center justify-center text-black shadow-lg" style={{ backgroundColor: themeColor }}>
                <User size={24} fill="currentColor" />
             </div>
           )}
        </div>

        {/* Profile Info Section */}
        <div className="bg-[#0a0a0a] rounded-[2rem] sm:rounded-[3rem] border border-white/5 p-5 sm:p-10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Star size={120} style={{ color: themeColor }} />
           </div>

           <div className="flex flex-col items-center gap-8 relative z-10">
              {/* Avatar Section */}
              <div className="relative group">
                 <div className={`size-36 sm:size-48 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border-4 shadow-2xl relative transition-all duration-500 ${isUpdatingProfile ? "scale-95 opacity-50" : "scale-100 opacity-100"}`} style={{ borderColor: themeColor }}>
                    <img
                      src={selectedImg || authUser.profilePicture || "/avatar.png"}
                      alt="Profile"
                      className="size-full object-cover"
                    />
                    <label className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}>
                       <Camera className="w-8 h-8 text-white mb-2" />
                       <span className="text-xs font-semibold text-white text-center px-4">Upload photo</span>
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
                    </label>
                 </div>
                 
                 <button 
                  onClick={() => setShowAvatarGallery(!showAvatarGallery)}
                  className="absolute -bottom-2 -right-2 p-5 rounded-2xl shadow-xl border-4 border-[#0a0a0a] hover:scale-110 active:scale-90 transition-all z-20 group/btn" 
                  style={{ backgroundColor: themeColor }}
                  disabled={isUpdatingProfile}
                 >
                    <Grid size={24} className="text-black group-hover/btn:rotate-90 transition-transform" />
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap uppercase">Select Avatar</span>
                 </button>
              </div>

              {/* Avatar Gallery */}
              {showAvatarGallery && (
                <div className="w-full bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 animate-in slide-in-from-bottom-8 duration-500 space-y-6">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div>
                         <h4 className="text-xs font-black uppercase tracking-widest">3D Persona Library</h4>
                         <p className="text-xs text-gray-500 font-medium mt-1">Pick an avatar that fits your profile.</p>
                      </div>
                      <button onClick={() => setShowAvatarGallery(false)} className="p-2 hover:bg-white/5 rounded-xl"><X size={16} /></button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <p className="text-xs font-semibold tracking-wide text-blue-400">Masculine avatars</p>
                         <div className="grid grid-cols-3 gap-4">
                            {boyAvatars.map(path => (
                               <button key={path} onClick={() => selectAvatar(path)} className="relative group/av flex flex-col items-center gap-2">
                                  <div className={`size-16 rounded-2xl overflow-hidden border-2 transition-all ${authUser.profilePicture === path ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "border-white/5 hover:border-white/20"}`}>
                                     <img src={path} className="size-full object-cover" />
                                  </div>
                                  <span className="text-[10px] font-semibold text-gray-500 group-hover/av:text-white transition-colors">Select</span>
                                  {authUser.profilePicture === path && <div className="absolute top-0 right-0 size-4 bg-white text-black rounded-full flex items-center justify-center border-2 border-[#0a0a0a]"><CheckCircle2 size={10} /></div>}
                               </button>
                            ))}
                         </div>
                      </div>
                      <div className="space-y-4">
                         <p className="text-xs font-semibold tracking-wide text-pink-400">Feminine avatars</p>
                         <div className="grid grid-cols-3 gap-4">
                            {girlAvatars.map(path => (
                               <button key={path} onClick={() => selectAvatar(path)} className="relative group/av flex flex-col items-center gap-2">
                                  <div className={`size-16 rounded-2xl overflow-hidden border-2 transition-all ${authUser.profilePicture === path ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "border-white/5 hover:border-white/20"}`}>
                                     <img src={path} className="size-full object-cover" />
                                  </div>
                                  <span className="text-[10px] font-semibold text-gray-500 group-hover/av:text-white transition-colors">Select</span>
                                  {authUser.profilePicture === path && <div className="absolute top-0 right-0 size-4 bg-white text-black rounded-full flex items-center justify-center border-2 border-[#0a0a0a]"><CheckCircle2 size={10} /></div>}
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* User Identity */}
              <div className="text-center space-y-2">
                 <h2 className="text-3xl sm:text-4xl font-black tracking-tight break-words">{authUser?.username}</h2>
                 <p className="text-sm font-medium text-gray-500 opacity-60 break-all">{authUser?.email}</p>
              </div>

              {/* Bio Section */}
              <div className="w-full max-w-md bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5 text-center relative group shadow-inner">
                 {isEditingBio ? (
                    <div className="space-y-4 text-left">
                       <p className="text-xs font-semibold text-gray-400 ml-2">Bio</p>
                       <textarea 
                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:border-white/10 h-32 resize-none transition-all"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Write something about yourself..."
                       />
                       <div className="flex gap-3">
                          <button onClick={() => setIsEditingBio(false)} className="flex-1 py-4 bg-white/5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10">Cancel</button>
                          <button 
                            onClick={handleUpdateBio}
                            className="flex-[2] py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                            style={{ backgroundColor: themeColor }}
                          >
                            Save bio
                          </button>
                       </div>
                    </div>
                 ) : (
                    <>
                       <p className="text-base font-semibold italic text-gray-300 leading-relaxed">"{authUser?.bio || bio}"</p>
                       <button 
                        onClick={() => setIsEditingBio(true)}
                        className="absolute -top-4 -right-4 p-4 bg-[#0a0a0a] border border-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 shadow-2xl"
                       >
                          <Edit3 size={18} style={{ color: themeColor }} />
                       </button>
                    </>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
              <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center gap-5 group hover:bg-white/[0.04] transition-all">
                 <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                    <Shield size={22} className="text-gray-500" />
                 </div>
                 <div>
                    <p className="text-[11px] font-semibold text-gray-500">Plan</p>
                    <p className="text-sm font-black mt-0.5 text-white">Standard account</p>
                 </div>
              </div>
              <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center gap-5 group hover:bg-white/[0.04] transition-all">
                 <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                    <Star size={22} style={{ color: themeColor }} />
                 </div>
                 <div>
                    <p className="text-[11px] font-semibold text-gray-500">Theme</p>
                    <p className="text-sm font-black mt-0.5" style={{ color: themeColor }}>Custom accent enabled</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
