import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, UserPlus, MessageSquare, Settings, LogOut, Search, X, Plus, Users as GroupsIcon } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { 
    getUsers, users, selectedUser, setSelectedUser, isUsersLoading,
    getGroups, groups, selectedGroup, setSelectedGroup, isGroupsLoading,
    createGroup
  } = useChatStore();
  
  const { authUser, logout } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState("chats"); // "chats" or "groups"
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      toast.error("Please provide a group name and select members");
      return;
    }
    await createGroup({ name: groupName, members: selectedMembers });
    setShowCreateGroup(false);
    setGroupName("");
    setSelectedMembers([]);
  };

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-white/5 flex flex-col transition-all duration-300 bg-[#0a0a0a]">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-[#bef264] rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(190,242,100,0.3)]">
            <MessageSquare size={18} />
          </div>
          <span className="font-black text-white hidden lg:block uppercase tracking-tighter text-xl">Sphere</span>
        </div>
      </div>

      {/* Profile Section Mini */}
      <div className="p-4 mx-4 my-4 bg-white/5 rounded-2xl border border-white/5 hidden lg:flex items-center gap-3">
        <img src={authUser?.profilePicture || "/avatar.png"} className="size-10 rounded-xl object-cover border border-white/10" alt="" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white truncate uppercase tracking-tight">{authUser?.username}</p>
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 bg-[#bef264] rounded-full animate-pulse" />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active</span>
          </div>
        </div>
        <Link to="/profile" className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400">
          <Settings size={16} />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-2 mb-4">
         <button 
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            activeTab === "chats" ? "bg-[#bef264] text-black shadow-lg" : "text-gray-500 hover:text-white bg-white/5"
          }`}
         >
           <Users size={14} />
           <span className="hidden lg:block">Chats</span>
         </button>
         <button 
          onClick={() => setActiveTab("groups")}
          className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            activeTab === "groups" ? "bg-[#bef264] text-black shadow-lg" : "text-gray-500 hover:text-white bg-white/5"
          }`}
         >
           <GroupsIcon size={14} />
           <span className="hidden lg:block">Groups</span>
         </button>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
        {activeTab === "chats" ? (
          <>
            <div className="flex items-center justify-between mb-4 px-1">
               <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Contacts</p>
               <button onClick={() => setShowAddFriend(true)} className="p-1 hover:text-[#bef264] transition-colors"><Plus size={16} /></button>
            </div>
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 flex items-center gap-3 rounded-2xl transition-all group ${
                  selectedUser?._id === user._id ? "bg-[#bef264] text-black shadow-lg" : "hover:bg-white/5 text-gray-400"
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img src={user.profilePicture || "/avatar.png"} alt={user.name} className="size-11 object-cover rounded-xl border border-white/10" />
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full" />
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-bold truncate">{user.username}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${selectedUser?._id === user._id ? "text-black/60" : "text-gray-500"}`}>Online</div>
                </div>
              </button>
            ))}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 px-1">
               <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Communities</p>
               <button onClick={() => setShowCreateGroup(true)} className="p-1 hover:text-[#bef264] transition-colors"><Plus size={16} /></button>
            </div>
            {groups.map((group) => (
              <button
                key={group._id}
                onClick={() => setSelectedGroup(group)}
                className={`w-full p-3 flex items-center gap-3 rounded-2xl transition-all group ${
                  selectedGroup?._id === group._id ? "bg-[#bef264] text-black shadow-lg" : "hover:bg-white/5 text-gray-400"
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <div className="size-11 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                    {group.groupImage ? <img src={group.groupImage} className="w-full h-full object-cover" /> : <GroupsIcon size={20} />}
                  </div>
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-bold truncate">{group.name}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${selectedGroup?._id === group._id ? "text-black/60" : "text-gray-500"}`}>
                    {group.members?.length} Members
                  </div>
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 mt-auto">
        <button onClick={logout} className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden lg:block font-bold uppercase tracking-widest text-[10px]">Logout Session</span>
        </button>
      </div>

      {/* Create Group Modal Overlay */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
           <div className="bg-[#0a0a0a] w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Create New Group</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Start a new community</p>
                 </div>
                 <button onClick={() => setShowCreateGroup(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Group Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#bef264]/30" 
                      placeholder="e.g. Design Team"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-2">Select Members</label>
                    <div className="max-h-48 overflow-y-auto space-y-2 thin-scrollbar">
                       {users.map(user => (
                         <div 
                          key={user._id} 
                          onClick={() => toggleMember(user._id)}
                          className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer border transition-all ${
                            selectedMembers.includes(user._id) ? "bg-[#bef264]/10 border-[#bef264]/30" : "bg-white/5 border-transparent hover:border-white/10"
                          }`}
                         >
                            <img src={user.profilePicture || "/avatar.png"} className="size-8 rounded-lg" />
                            <span className="flex-1 text-sm font-bold">{user.username}</span>
                            {selectedMembers.includes(user._id) && <CheckIcon size={16} className="text-[#bef264]" />}
                         </div>
                       ))}
                    </div>
                 </div>
                 <button 
                  onClick={handleCreateGroup}
                  className="w-full bg-[#bef264] text-black py-4 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                 >
                   Create Group
                 </button>
              </div>
           </div>
        </div>
      )}
    </aside>
  );
};

const CheckIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Sidebar;
