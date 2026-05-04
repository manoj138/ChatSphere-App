import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Camera, User, ArrowLeft, Edit3, Shield, Star, Grid, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { themeColor } = useThemeStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(authUser?.bio || "Digital explorer in the Sphere.");
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);

  const boyAvatars = ["/boy_1.png", "/boy_2.png", "/boy_3.png", "/boy_4.png", "/boy_5.png"];
  const girlAvatars = ["/girl_1.png", "/girl_2.png", "/girl_3.png", "/girl_4.png"];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePicture: base64Image });
    };
  };

  const selectAvatar = async (path) => {
      setSelectedImg(path);
      await updateProfile({ profilePicture: path });
      setShowAvatarGallery(false);
  };

  const handleUpdateBio = async () => {
      await updateProfile({ bio });
      setIsEditingBio(false);
      toast.success("Bio updated successfully");
  };

  return (
    <div className="h-screen bg-[#050505] text-white pt-10 px-6 overflow-y-auto custom-scrollbar pb-20">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between bg-[#0a0a0a] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
           <div className="flex items-center gap-5">
              <Link to="/" className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-gray-400 hover:text-white border border-white/5">
                 <ArrowLeft size={20} />
              </Link>
              <div>
                 <h1 className="text-2xl font-black uppercase tracking-tighter">Your Identity</h1>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage your digital presence</p>
              </div>
           </div>
           <div className="size-12 rounded-2xl flex items-center justify-center text-black shadow-lg" style={{ backgroundColor: themeColor }}>
              <User size={24} fill="currentColor" />
           </div>
        </div>

        {/* Profile Info Section */}
        <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Star size={120} style={{ color: themeColor }} />
           </div>

           <div className="flex flex-col items-center gap-8 relative z-10">
              {/* Avatar Section */}
              <div className="relative group">
                 <div className="size-44 rounded-[3rem] overflow-hidden border-4 border-[#0a0a0a] shadow-2xl relative">
                    <img
                      src={selectedImg || authUser.profilePicture || "/avatar.png"}
                      alt="Profile"
                      className="size-full object-cover"
                    />
                    <label className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${isUpdatingProfile ? "animate-pulse" : ""}`}>
                       <Camera className="w-8 h-8 text-white mb-2" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-white text-center px-4">Upload Custom Image</span>
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
                    </label>
                 </div>
                 <button 
                  onClick={() => setShowAvatarGallery(!showAvatarGallery)}
                  className="absolute -bottom-2 -right-2 p-4 rounded-2xl shadow-xl border-4 border-[#0a0a0a] hover:scale-110 transition-transform" 
                  style={{ backgroundColor: themeColor }}
                 >
                    <Grid size={22} className="text-black" />
                 </button>
              </div>

              {/* Avatar Gallery Modal/Dropdown */}
              {showAvatarGallery && (
                <div className="w-full bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 animate-in zoom-in-95 duration-500 space-y-6">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Pick a 3D Avatar</p>
                      <CheckCircle2 size={16} style={{ color: themeColor }} />
                   </div>
                   
                   <div className="space-y-6">
                      <div>
                         <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-3">Male Nodes</p>
                         <div className="grid grid-cols-5 gap-3">
                            {boyAvatars.map(path => (
                               <button key={path} onClick={() => selectAvatar(path)} className="relative group/av">
                                  <div className={`size-12 rounded-xl overflow-hidden border-2 transition-all ${authUser.profilePicture === path ? "border-[#bef264]" : "border-transparent hover:border-white/20"}`}>
                                     <img src={path} className="size-full object-cover" />
                                  </div>
                                  {authUser.profilePicture === path && <div className="absolute -top-1 -right-1 size-3 bg-[#bef264] rounded-full border-2 border-[#0a0a0a]" />}
                               </button>
                            ))}
                         </div>
                      </div>
                      <div>
                         <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 mb-3">Female Nodes</p>
                         <div className="grid grid-cols-5 gap-3">
                            {girlAvatars.map(path => (
                               <button key={path} onClick={() => selectAvatar(path)} className="relative group/av">
                                  <div className={`size-12 rounded-xl overflow-hidden border-2 transition-all ${authUser.profilePicture === path ? "border-[#bef264]" : "border-transparent hover:border-white/20"}`}>
                                     <img src={path} className="size-full object-cover" />
                                  </div>
                                  {authUser.profilePicture === path && <div className="absolute -top-1 -right-1 size-3 bg-[#bef264] rounded-full border-2 border-[#0a0a0a]" />}
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* User Identity */}
              <div className="text-center space-y-2">
                 <h2 className="text-3xl font-black uppercase tracking-tight">{authUser?.username}</h2>
                 <p className="text-sm font-bold text-gray-500">{authUser?.email}</p>
              </div>

              {/* Bio Section */}
              <div className="w-full max-w-md bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 text-center relative group">
                 {isEditingBio ? (
                    <div className="space-y-4 text-left">
                       <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 ml-2">Update Bio Signal</p>
                       <textarea 
                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-white/10 h-28 resize-none"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                       />
                       <div className="flex gap-3">
                          <button onClick={() => setIsEditingBio(false)} className="flex-1 py-3.5 bg-white/5 rounded-xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
                          <button 
                            onClick={handleUpdateBio}
                            className="flex-[2] py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest text-black shadow-lg"
                            style={{ backgroundColor: themeColor }}
                          >
                            Save Update
                          </button>
                       </div>
                    </div>
                 ) : (
                    <>
                       <p className="text-sm font-medium italic text-gray-400 leading-relaxed">"{authUser?.bio || bio}"</p>
                       <button 
                        onClick={() => setIsEditingBio(true)}
                        className="absolute -top-3 -right-3 p-3 bg-[#0a0a0a] border border-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                       >
                          <Edit3 size={16} />
                       </button>
                    </>
                 )}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              <div className="p-6 bg-white/[0.02] rounded-[1.5rem] border border-white/5 flex items-center gap-4">
                 <Shield size={20} className="text-gray-600" />
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">Verification</p>
                    <p className="text-xs font-bold mt-0.5">Authorized Member</p>
                 </div>
              </div>
              <div className="p-6 bg-white/[0.02] rounded-[1.5rem] border border-white/5 flex items-center gap-4">
                 <Star size={20} style={{ color: themeColor }} />
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">Node Status</p>
                    <p className="text-xs font-bold mt-0.5" style={{ color: themeColor }}>Premium Access</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
