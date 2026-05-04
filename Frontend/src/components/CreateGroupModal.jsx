import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import { useThemeStore } from "../store/useThemeStore";
import { X, Search, Users, Image as ImageIcon, Plus } from "lucide-react";
import toast from "react-hot-toast";

const CreateGroupModal = ({ onClose }) => {
  const { createGroup } = useChatStore();
  const { users = [] } = useChatStore(); // Friends are in 'users'
  const { themeColor } = useThemeStore();

  const [name, setName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setGroupImage(reader.result);
    };
    reader.readAsDataURL(file);
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
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
        
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Form New Cell</h2>
              <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] mt-1">Establishing group connection</p>
           </div>
           <button onClick={onClose} className="p-2 text-gray-600 hover:text-white transition-colors">
              <X size={24} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
           
           {/* Group Identity Area */}
           <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => document.getElementById('group-img-upload').click()}>
                 <div className="size-20 rounded-[1.5rem] bg-white/[0.03] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-white/20">
                    {groupImage ? (
                       <img src={groupImage} className="w-full h-full object-cover" />
                    ) : (
                       <ImageIcon size={24} className="text-gray-700 group-hover:text-gray-500" />
                    )}
                 </div>
                 <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-white text-black shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                    <Plus size={12} strokeWidth={4} />
                 </div>
                 <input id="group-img-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="flex-1">
                 <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-2 block">Group Name</label>
                 <input 
                    type="text"
                    placeholder="ENTER CELL NAME..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-2 text-lg font-black text-white focus:outline-none focus:border-white/30 placeholder:text-gray-900 uppercase"
                 />
              </div>
           </div>

           {/* Member Selection Area */}
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <label className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Select Agents</label>
                 <span className="text-[9px] font-black uppercase text-gray-800 tracking-widest">{selectedMembers.length} Selected</span>
              </div>
              
              <div className="relative">
                 <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" />
                 <input 
                   type="text"
                   placeholder="SCAN FOR AGENTS..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-white/[0.02] border border-white/5 rounded-full py-3 pl-10 pr-4 text-[10px] text-white focus:outline-none placeholder:text-gray-800 font-black tracking-widest uppercase"
                 />
              </div>

              <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-1 pr-2">
                 {filteredFriends.map(user => (
                    <div 
                      key={user._id}
                      onClick={() => toggleMember(user._id)}
                      className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${selectedMembers.includes(user._id) ? "bg-white/[0.05] border border-white/10" : "hover:bg-white/[0.02] border border-transparent"}`}
                    >
                       <div className="size-10 rounded-xl overflow-hidden border border-white/5">
                          <img src={user.profilePicture || (user._id.charCodeAt(user._id.length-1) % 2 === 0 ? `/boy_${(user._id.charCodeAt(user._id.length-1) % 5) + 1}.png` : `/girl_${(user._id.charCodeAt(user._id.length-1) % 4) + 1}.png`)} className="w-full h-full object-cover" />
                       </div>
                       <h4 className="flex-1 text-[12px] font-black text-white uppercase tracking-tight">{user.username}</h4>
                       <div className={`size-5 rounded-md border flex items-center justify-center transition-all ${selectedMembers.includes(user._id) ? "bg-green-500 border-green-500" : "border-white/10"}`}>
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
