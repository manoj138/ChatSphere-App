import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { X, Mail, Info, Users, Shield, User, Calendar, Edit2, Camera, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ChatInfoModal = ({ onClose }) => {
  const { selectedUser, selectedGroup, updateGroup } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(selectedGroup?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const info = selectedUser || selectedGroup;
  if (!info) return null;

  const isGroup = !!selectedGroup;
  const isAdmin = isGroup && String(selectedGroup.admin?._id || selectedGroup.admin) === String(authUser?._id);

  const getAvatarSrc = (item) => {
    if (!item) return "/boy_1.png";
    if (isGroup) return item.groupImage || "/favicon.svg";
    if (item.profilePicture) return item.profilePicture;
    const idNum = item._id ? item._id.toString().charCodeAt(item._id.toString().length - 1) : 0;
    return idNum % 2 === 0 ? `/boy_${(idNum % 5) + 1}.png` : `/girl_${(idNum % 4) + 1}.png`;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 2) {
      return toast.error("File size too large (max 2MB)");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setIsUpdating(true);
      await updateGroup(selectedGroup._id, { groupImage: base64Image });
      setIsUpdating(false);
    };
  };

  const handleUpdateName = async () => {
    if (!editedName.trim() || editedName === selectedGroup.name) {
       return setIsEditing(false);
    }
    setIsUpdating(true);
    await updateGroup(selectedGroup._id, { name: editedName });
    setIsUpdating(false);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Header Image Area */}
        <div className="relative h-48 bg-gradient-to-b from-white/5 to-transparent">
           <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/50 hover:text-white transition-all z-20">
              <X size={20} />
           </button>
           
           <div className="absolute inset-x-0 -bottom-16 flex justify-center">
              <div className="relative group">
                 <div className="size-32 rounded-[2.5rem] overflow-hidden border-4 border-[#0a0a0a] shadow-2xl bg-[#111] relative">
                    <img src={getAvatarSrc(info)} className={`w-full h-full object-cover ${isUpdating ? "opacity-50" : ""}`} alt="" />
                    {isUpdating && (
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="animate-spin text-white" size={24} />
                       </div>
                    )}
                 </div>
                 
                 {/* Admin Image Edit Trigger */}
                 {isAdmin && !isUpdating && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 p-2.5 bg-blue-600 rounded-2xl text-white shadow-xl hover:bg-blue-500 transition-all active:scale-90"
                    >
                       <Camera size={16} />
                    </button>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

                 {!isGroup && onlineUsers.includes(info._id) && (
                    <div className="absolute bottom-2 right-2 size-6 bg-[#0a0a0a] rounded-full p-1">
                       <div className="size-full bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="pt-20 p-8 space-y-8">
           <div className="text-center group/name relative">
              {isEditing ? (
                 <div className="flex items-center gap-2 max-w-xs mx-auto">
                    <input 
                       type="text"
                       autoFocus
                       value={editedName}
                       onChange={(e) => setEditedName(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                       className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold text-center focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <button onClick={handleUpdateName} className="p-2 bg-green-600 rounded-xl text-white hover:bg-green-500">
                       <Check size={18} />
                    </button>
                 </div>
              ) : (
                 <div className="flex items-center justify-center gap-3">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{isGroup ? info.name : info.username}</h2>
                    {isAdmin && (
                       <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-700 hover:text-white transition-all">
                          <Edit2 size={16} />
                       </button>
                    )}
                 </div>
              )}
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mt-2">
                 {isGroup ? `SECURE CELL ID: ${info._id.substring(0,8)}` : (onlineUsers.includes(info._id) ? "NODE STATUS: ACTIVE" : "NODE STATUS: STANDBY")}
              </p>
           </div>

           <div className="space-y-6">
              {!isGroup ? (
                 <>
                    <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <div className="size-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-500">
                          <Mail size={18} />
                       </div>
                       <div className="flex-1 min-w-0 text-left">
                          <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-0.5">Email Protocol</p>
                          <p className="text-sm font-bold text-gray-300 truncate">{info.email}</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <div className="size-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-500 flex-shrink-0">
                          <Info size={18} />
                       </div>
                       <div className="flex-1 text-left">
                          <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-0.5">User Bio</p>
                          <p className="text-sm font-bold text-gray-300 leading-relaxed">{info.bio || "No encryption signature detected."}</p>
                       </div>
                    </div>
                 </>
              ) : (
                 <>
                    <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <div className="size-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-500">
                          <Shield size={18} />
                       </div>
                       <div className="flex-1 text-left">
                          <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-0.5">Cell Admin</p>
                          <p className="text-sm font-bold text-gray-300">@{info.admin?.username || "Authorized Admin"}</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center justify-between px-2">
                          <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Active Agents</h4>
                          <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{info.members?.length} Nodes</span>
                       </div>
                       <div className="max-h-[180px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
                          {info.members?.map(member => (
                             <div key={member._id} className="flex items-center gap-3 p-2 hover:bg-white/[0.02] rounded-xl transition-all border border-transparent hover:border-white/5">
                                <div className="size-8 rounded-lg overflow-hidden border border-white/10">
                                   <img src={member.profilePicture || (member._id.charCodeAt(member._id.length-1)%2===0 ? "/boy_1.png" : "/girl_1.png")} className="w-full h-full object-cover" />
                                </div>
                                <span className="flex-1 text-xs font-bold text-gray-400">@{member.username}</span>
                                {member._id === (info.admin?._id || info.admin) && <Shield size={12} className="text-yellow-500/50" />}
                             </div>
                          ))}
                       </div>
                    </div>
                 </>
              )}
           </div>

           <div className="pt-4 flex items-center justify-center gap-2 opacity-20">
              <Calendar size={12} />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Authorized since 2026</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ChatInfoModal;
