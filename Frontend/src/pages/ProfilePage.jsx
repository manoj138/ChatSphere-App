import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { Camera, Mail, User, MapPin, Calendar, ArrowLeft, Check, Edit3, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { themeColor } = useThemeStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(authUser?.bio || "Digital explorer in the Sphere.");

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
           <div className="size-12 rounded-2xl flex items-center justify-center text-black" style={{ backgroundColor: themeColor }}>
              <User size={24} fill="currentColor" />
           </div>
        </div>

        {/* Profile Info Section */}
        <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Star size={120} style={{ color: themeColor }} />
           </div>

           <div className="flex flex-col items-center gap-8 relative z-10">
              {/* Avatar Upload */}
              <div className="relative group">
                 <div className="size-40 rounded-[2.5rem] overflow-hidden border-4 border-[#0a0a0a] shadow-2xl relative">
                    <img
                      src={selectedImg || authUser.profilePicture || "/avatar.png"}
                      alt="Profile"
                      className="size-full object-cover"
                    />
                    <label className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${isUpdatingProfile ? "animate-pulse" : ""}`}>
                       <Camera className="w-8 h-8 text-white mb-2" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-white">Update Photo</span>
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
                    </label>
                 </div>
                 <div className="absolute -bottom-2 -right-2 p-3 rounded-2xl shadow-xl border-4 border-[#0a0a0a]" style={{ backgroundColor: themeColor }}>
                    <Shield size={20} className="text-black" />
                 </div>
              </div>

              {/* User Identity */}
              <div className="text-center space-y-2">
                 <h2 className="text-3xl font-black uppercase tracking-tight">{authUser?.username}</h2>
                 <p className="text-sm font-bold text-gray-500">{authUser?.email}</p>
              </div>

              {/* Dynamic Bio */}
              <div className="w-full max-w-sm bg-white/5 p-6 rounded-3xl border border-white/5 text-center relative group">
                 {isEditingBio ? (
                    <div className="space-y-4">
                       <textarea 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-medium focus:outline-none focus:border-[#bef264]/30 h-24 resize-none"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                       />
                       <button 
                        onClick={handleUpdateBio}
                        className="w-full py-3 rounded-xl font-black uppercase text-[10px] tracking-widest text-black"
                        style={{ backgroundColor: themeColor }}
                       >
                         Save Transformation
                       </button>
                    </div>
                 ) : (
                    <>
                       <p className="text-sm font-medium italic text-gray-400 leading-relaxed">"{authUser?.bio || bio}"</p>
                       <button 
                        onClick={() => setIsEditingBio(true)}
                        className="absolute -top-2 -right-2 p-2 bg-[#0a0a0a] border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#bef264]"
                       >
                          <Edit3 size={14} />
                       </button>
                    </>
                 )}
              </div>
           </div>

           {/* Account Stats */}
           <div className="grid grid-cols-2 gap-4 mt-12">
              <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center gap-4">
                 <div className="p-3 bg-white/5 rounded-xl text-gray-500"><Calendar size={20} /></div>
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">Member Since</p>
                    <p className="text-sm font-bold mt-0.5">{authUser.createdAt?.split("T")[0] || "May 2024"}</p>
                 </div>
              </div>
              <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center gap-4">
                 <div className="p-3 bg-white/5 rounded-xl text-gray-500"><MapPin size={20} /></div>
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">Node Status</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: themeColor }}>Verified Active</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
