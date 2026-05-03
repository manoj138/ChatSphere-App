import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Camera, Mail, User, ArrowLeft, Loader2, Calendar, ShieldCheck, MessageSquare, Users, Settings, Zap, Check, Edit2 } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { users } = useChatStore();
  
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(authUser?.bio || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePicture: base64Image });
        setSelectedImg(null); // Reset preview to show the new real URL
      } catch (error) {
        setSelectedImg(null);
      }
    };
  };

  const handleUpdateBio = async () => {
    await updateProfile({ bio });
    setIsEditingBio(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#bef264] selection:text-black font-sans pb-10 overflow-x-hidden">
      
      {/* Immersive Background Header */}
      <div className="h-48 w-full bg-gradient-to-br from-[#111] via-[#050505] to-[#bef264]/10 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
         <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#050505] to-transparent" />
         
         <div className="absolute top-6 left-6 z-20">
            <Link to="/" className="group flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/5 hover:border-[#bef264]/50 transition-all">
               <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-[#bef264]" />
               <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </Link>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-6 flex flex-col items-center shadow-2xl relative overflow-hidden">
                <div className="relative">
                  <div className="size-32 rounded-[1.5rem] overflow-hidden border-4 border-[#0a0a0a] shadow-xl relative group/img">
                    <img
                      src={selectedImg || authUser?.profilePicture || "/avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {isUpdatingProfile && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="size-8 animate-spin text-[#bef264]" />
                      </div>
                    )}
                  </div>
                  
                  <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-[#bef264] p-3 rounded-xl shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all border-4 border-[#0a0a0a]">
                     <Camera size={16} className="text-black" />
                     <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
                  </label>
                </div>

                <div className="mt-6 text-center space-y-2">
                   <h2 className="text-xl font-black tracking-tighter uppercase truncate max-w-[180px]">{authUser?.username}</h2>
                   <div className="flex items-center justify-center gap-1.5 text-[#bef264] bg-[#bef264]/10 px-3 py-1 rounded-full border border-[#bef264]/20">
                      <Zap size={12} fill="currentColor" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Premium Member</span>
                   </div>
                </div>

                <div className="w-full h-[1px] bg-white/5 my-6" />

                <div className="grid grid-cols-2 w-full gap-3">
                   <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                      <p className="text-lg font-black text-white">{users.length}</p>
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Friends</p>
                   </div>
                   <div className="bg-white/5 p-3 rounded-2xl text-center border border-white/5">
                      <p className="text-lg font-black text-white">Live</p>
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Status</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-8 space-y-6">
             
             {/* Dynamic Bio Section */}
             <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-8 shadow-2xl space-y-4 relative">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="size-2 bg-[#bef264] rounded-full" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">About Me</h3>
                   </div>
                   <button 
                    onClick={() => isEditingBio ? handleUpdateBio() : setIsEditingBio(true)}
                    className="p-2 bg-white/5 rounded-xl hover:bg-[#bef264]/10 hover:text-[#bef264] transition-all"
                   >
                     {isEditingBio ? (isUpdatingProfile ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />) : <Edit2 size={14} />}
                   </button>
                </div>
                
                {isEditingBio ? (
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-[#bef264]/30 min-h-[100px] resize-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your story..."
                    autoFocus
                  />
                ) : (
                  <p className="text-base font-medium leading-relaxed text-gray-300 italic">
                     "{authUser?.bio || "No bio set yet."}"
                  </p>
                )}
             </div>

             {/* Personal Info Grid */}
             <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 p-6 shadow-2xl group">
                   <div className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-[#bef264] mb-4">
                      <Mail size={20} />
                   </div>
                   <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Email Address</p>
                   <p className="text-base font-bold text-white truncate">{authUser?.email}</p>
                </div>

                <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 p-6 shadow-2xl group">
                   <div className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-[#bef264] mb-4">
                      <Calendar size={20} />
                   </div>
                   <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Member Since</p>
                   <p className="text-base font-bold text-white">
                      {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                   </p>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
