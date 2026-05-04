import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { 
  X, Mail, Info, Users, Shield, User, Calendar, 
  Edit2, Camera, Check, Loader2, UserMinus, Trash2, AlertTriangle, Clock
} from "lucide-react";
import toast from "react-hot-toast";

const ChatInfoModal = ({ onClose }) => {
  const { selectedUser, selectedGroup, updateGroup, deleteGroup, kickMember } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const { themeColor, isLightMode } = useThemeStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(selectedGroup?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

  const formatLastSeen = (date) => {
    if (!date) return "UNKNOWN";
    const lastSeen = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastSeen) / 1000);

    if (diffInSeconds < 60) return "JUST NOW";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}M AGO`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}H AGO`;
    return lastSeen.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
    if (!editedName.trim() || editedName === selectedGroup.name) return setIsEditing(false);
    setIsUpdating(true);
    await updateGroup(selectedGroup._id, { name: editedName });
    setIsUpdating(false);
    setIsEditing(false);
  };

  const handleDeleteGroup = async () => {
    await deleteGroup(selectedGroup._id);
    onClose();
  };

  const handleKick = async (userId, username) => {
    if (window.confirm(`Are you sure you want to remove @${username} from this cell?`)) {
       await kickMember(selectedGroup._id, userId);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-secondary border border-primary rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.4)] overflow-hidden relative transition-colors duration-500">
        
        {/* Delete Confirmation Overlay */}
        {showDeleteConfirm && (
           <div className="absolute inset-0 z-50 bg-secondary/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
              <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                 <AlertTriangle size={40} />
              </div>
              <h3 className="text-xl font-black text-primary uppercase tracking-tighter mb-2">Terminate Cell?</h3>
              <p className="text-sm text-secondary mb-8 leading-relaxed opacity-60">This action will permanently delete all transmissions and logs. This cannot be undone.</p>
              <div className="flex flex-col w-full gap-3">
                 <button onClick={handleDeleteGroup} className="w-full py-4 bg-red-600 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-red-500 transition-all">Confirm Termination</button>
                 <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 bg-surface rounded-2xl text-secondary font-black uppercase tracking-widest hover:text-primary transition-all">Abort Protocol</button>
              </div>
           </div>
        )}

        {/* Header Image Area */}
        <div className="relative h-48 bg-gradient-to-b from-primary/5 to-transparent">
           <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-secondary/50 backdrop-blur-md rounded-full text-secondary hover:text-primary transition-all z-20 border border-primary">
              <X size={20} />
           </button>
           
           <div className="absolute inset-x-0 -bottom-16 flex justify-center">
              <div className="relative group">
                 <div className="size-32 rounded-[2.5rem] overflow-hidden border-4 border-secondary shadow-2xl bg-primary relative">
                    <img src={getAvatarSrc(info)} className={`w-full h-full object-cover ${isUpdating ? "opacity-50" : ""}`} alt="" />
                    {isUpdating && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>}
                 </div>
                 {isAdmin && !isUpdating && (
                    <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 p-2.5 bg-blue-600 rounded-2xl text-white shadow-xl hover:bg-blue-500 transition-all"><Camera size={16} /></button>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                 {!isGroup && onlineUsers.includes(info._id) && (
                    <div className="absolute bottom-2 right-2 size-6 bg-secondary rounded-full p-1">
                       <div className="size-full bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="pt-20 p-8 space-y-8">
           <div className="text-center">
              {isEditing ? (
                 <div className="flex items-center gap-2 max-w-xs mx-auto">
                    <input type="text" autoFocus value={editedName} onChange={(e) => setEditedName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()} className="flex-1 bg-surface border border-primary rounded-xl px-4 py-2 text-primary font-bold text-center focus:outline-none focus:border-blue-500 transition-all" />
                    <button onClick={handleUpdateName} className="p-2 bg-green-600 rounded-xl text-white"><Check size={18} /></button>
                 </div>
              ) : (
                 <div className="flex items-center justify-center gap-3">
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">{isGroup ? info.name : info.username}</h2>
                    {isAdmin && <button onClick={() => setIsEditing(true)} className="p-1.5 text-secondary hover:text-primary"><Edit2 size={16} /></button>}
                 </div>
              )}
              
              <div className="flex flex-col items-center gap-1 mt-2">
                 <p className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] opacity-60">
                    {isGroup ? `SECURE CELL ID: ${info._id.substring(0,8)}` : (onlineUsers.includes(info._id) ? "NODE STATUS: ACTIVE" : "NODE STATUS: STANDBY")}
                 </p>
                 {!isGroup && !onlineUsers.includes(info._id) && (
                    <div className="flex items-center gap-1.5 opacity-50">
                       <Clock size={10} className="text-secondary" />
                       <span className="text-[8px] font-black text-secondary uppercase tracking-widest">Offline Since {formatLastSeen(info.lastSeen)}</span>
                    </div>
                 )}
              </div>
           </div>

           <div className="space-y-6 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
              {isGroup ? (
                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-40">Active Agents</h4>
                       <span className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-40">{info.members?.length} Nodes</span>
                    </div>
                    <div className="space-y-2">
                       {info.members?.map(member => {
                          const isMemberAdmin = member._id === (info.admin?._id || info.admin);
                          return (
                             <div key={member._id} className="flex items-center gap-3 p-3 bg-surface border border-primary rounded-2xl hover:bg-surface/80 transition-all">
                                <div className="size-9 rounded-xl overflow-hidden border border-primary flex-shrink-0 relative">
                                   <img src={member.profilePicture || (member._id.charCodeAt(member._id.length-1)%2===0 ? "/boy_1.png" : "/girl_1.png")} className="w-full h-full object-cover" />
                                   {onlineUsers.includes(member._id) && (
                                      <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-secondary" />
                                   )}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className="text-xs font-bold text-primary truncate">@{member.username}</p>
                                   {isMemberAdmin && <p className="text-[8px] font-black text-yellow-500/50 uppercase tracking-widest">Cell Admin</p>}
                                </div>
                                {isAdmin && !isMemberAdmin && (
                                   <button 
                                     onClick={() => handleKick(member._id, member.username)}
                                     className="p-2 text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                   >
                                      <UserMinus size={16} />
                                   </button>
                                )}
                             </div>
                          );
                       })}
                    </div>
                    
                    {isAdmin && (
                       <button 
                         onClick={() => setShowDeleteConfirm(true)}
                         className="w-full py-4 mt-4 flex items-center justify-center gap-2 border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                       >
                          <Trash2 size={14} />
                          Terminate Cell
                       </button>
                    )}
                 </div>
              ) : (
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-surface border border-primary rounded-2xl">
                       <div className="size-10 rounded-xl bg-primary opacity-10 flex items-center justify-center text-primary"><Mail size={18} /></div>
                       <div className="flex-1 min-w-0 text-left">
                          <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-0.5 opacity-40">Email Protocol</p>
                          <p className="text-sm font-bold text-primary truncate">{info.email}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-surface border border-primary rounded-2xl">
                       <div className="size-10 rounded-xl bg-primary opacity-10 flex items-center justify-center text-primary flex-shrink-0"><Info size={18} /></div>
                       <div className="flex-1 text-left">
                          <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-0.5 opacity-40">User Bio</p>
                          <p className="text-sm font-bold text-primary leading-relaxed">{info.bio || "No encryption signature detected."}</p>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ChatInfoModal;
