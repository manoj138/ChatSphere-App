import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import { useThemeStore } from "../store/useThemeStore";
import { X, Search, Users, Image as ImageIcon, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { optimizeImageFile } from "../lib/image";

const CreateGroupModal = ({ onClose }) => {
  const { createGroup } = useChatStore();
  const { users = [] } = useChatStore(); // Friends are in 'users'
  const { themeColor, isLightMode } = useThemeStore();

  const [name, setName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const filteredFriends = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const optimizedImage = await optimizeImageFile(file);
      setGroupImage(optimizedImage);
    } catch (error) {
      toast.error(error.message || "Failed to process image");
    }
  };

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Group name required");
    if (selectedMembers.length === 0) return toast.error("Select at least one member");

    try {
      await createGroup({
        name: name.trim(),
        members: selectedMembers,
        groupImage
      });
      onClose();
    } catch (error) {
      console.log("Failed to create group");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-secondary border border-primary rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-500">
        
        <div className="p-8 border-b border-primary flex items-center justify-between">
           <div>
              <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Form New Cell</h2>
              <p className="text-[9px] font-black text-secondary uppercase tracking-[0.4em] mt-1 opacity-60">Establishing group connection</p>
           </div>
           <button onClick={onClose} className="p-2 text-secondary hover:text-primary transition-colors">
              <X size={24} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
           
           {/* Group Identity Area */}
           <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => document.getElementById('group-img-upload').click()}>
                 <div className="size-20 rounded-[1.5rem] bg-surface border-2 border-dashed border-primary flex items-center justify-center overflow-hidden transition-all group-hover:border-accent/40">
                    {groupImage ? (
                       <img src={groupImage} className="w-full h-full object-cover" />
                    ) : (
                       <ImageIcon size={24} className="text-secondary opacity-40 group-hover:opacity-100" />
                    )}
                 </div>
                 <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-accent text-black shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                    <Plus size={12} strokeWidth={4} />
                 </div>
                 <input id="group-img-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="flex-1">
                 <label className="text-xs font-semibold text-secondary mb-2 block opacity-80">Group name</label>
                 <input 
                    type="text"
                    placeholder="ENTER CELL NAME..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-primary py-2 text-lg font-black text-primary focus:outline-none focus:border-accent placeholder:text-secondary opacity-70 uppercase"
                 />
              </div>
           </div>

           {/* Member Selection Area */}
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <label className="text-[9px] font-black text-secondary uppercase tracking-widest opacity-40">Select Agents</label>
                 <span className="text-[9px] font-black uppercase text-secondary tracking-widest opacity-30">{selectedMembers.length} Selected</span>
              </div>
              
              <div className="relative">
                 <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-40" />
                 <input 
                   type="text"
                   placeholder="SCAN FOR AGENTS..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-surface border border-primary rounded-full py-3 pl-10 pr-4 text-sm text-primary focus:outline-none placeholder:text-secondary opacity-80"
                 />
              </div>

              <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-1 pr-2">
                 {filteredFriends.map(user => (
                    <div 
                      key={user._id}
                      onClick={() => toggleMember(user._id)}
                      className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${selectedMembers.includes(user._id) ? "bg-surface border border-primary" : "hover:bg-surface/50 border border-transparent"}`}
                    >
                       <div className="size-10 rounded-xl overflow-hidden border border-primary">
                          <img src={user.profilePicture || (user._id.charCodeAt(user._id.length-1) % 2 === 0 ? `/boy_${(user._id.charCodeAt(user._id.length-1) % 5) + 1}.png` : `/girl_${(user._id.charCodeAt(user._id.length-1) % 4) + 1}.png`)} className="w-full h-full object-cover" />
                       </div>
                       <h4 className="flex-1 text-[12px] font-black text-primary uppercase tracking-tight">{user.username}</h4>
                       <div className={`size-5 rounded-md border flex items-center justify-center transition-all ${selectedMembers.includes(user._id) ? "bg-accent border-accent" : "border-primary"}`}>
                          {selectedMembers.includes(user._id) && <Plus size={12} strokeWidth={4} className="text-black rotate-45" />}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <button 
             type="submit"
             className="w-full py-4 rounded-full font-black uppercase tracking-[0.2em] text-sm text-black shadow-2xl transition-all active:scale-95 hover:brightness-110"
             style={{ backgroundColor: themeColor }}
           >
              Establish Signal
           </button>
        </form>

      </div>
    </div>
  );
};

export default CreateGroupModal;
