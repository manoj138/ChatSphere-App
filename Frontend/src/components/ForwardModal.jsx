import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { Search, X, Send, Users } from "lucide-react";

const ForwardModal = ({ message, onClose }) => {
  const { users = [], sendMessage } = useChatStore();
  const { themeColor, isLightMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingTo, setSendingTo] = useState(null);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleForward = async (user) => {
    setSendingTo(user._id);
    try {
      await sendMessage({
        text: message.text,
        image: message.image,
        forwardedTo: user._id // Can be used for "Forwarded" label if needed
      }, user._id);
      onClose();
    } catch (error) {
      console.log("Forward failed");
    } finally {
      setSendingTo(null);
    }
  };

  const getAvatarSrc = (user) => {
    if (user.profilePicture) return user.profilePicture;
    const idNum = user._id ? user._id.charCodeAt(user._id.length - 1) : 0;
    const isBoy = idNum % 2 === 0;
    return isBoy ? `/boy_${(idNum % 5) + 1}.png?v=3` : `/girl_${(idNum % 4) + 1}.png?v=3`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-secondary border border-primary rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-500">
        
        <div className="p-6 border-b border-primary flex items-center justify-between">
           <div>
              <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Forward Signal</h2>
              <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mt-1 opacity-40">Select recipient node</p>
           </div>
           <button onClick={onClose} className="p-2 text-secondary hover:text-primary transition-colors">
              <X size={20} />
           </button>
        </div>

        <div className="p-6 space-y-6">
           <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary opacity-40" />
              <input 
                type="text"
                placeholder="Scan for recipients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-primary rounded-full py-3 pl-10 pr-4 text-[10px] text-primary focus:outline-none placeholder:text-secondary opacity-40 font-black tracking-widest uppercase"
              />
           </div>

           <div className="max-h-[350px] overflow-y-auto custom-scrollbar space-y-2 pr-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                   <button 
                     key={user._id}
                     onClick={() => handleForward(user)}
                     disabled={sendingTo === user._id}
                     className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-surface transition-all group"
                   >
                      <div className="size-12 rounded-2xl overflow-hidden border border-primary group-hover:border-accent/40 transition-all">
                         <img src={getAvatarSrc(user)} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                         <h4 className="text-[13px] font-black text-primary uppercase tracking-tight">{user.username}</h4>
                         <p className="text-[9px] text-secondary font-black uppercase tracking-widest opacity-30">Active Node</p>
                      </div>
                      <div className="p-2 rounded-xl bg-surface text-secondary group-hover:text-primary group-hover:bg-primary/5 transition-all">
                         {sendingTo === user._id ? <Send size={14} className="animate-pulse" /> : <Send size={14} />}
                      </div>
                   </button>
                ))
              ) : (
                <div className="py-12 text-center opacity-10">
                   <Users size={40} className="mx-auto mb-2" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary">No nodes found</p>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ForwardModal;
