import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/api";
import { useAuthStore } from "./useAuthStore";
import { useThemeStore } from "./useThemeStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],
  selectedUser: null,
  selectedGroup: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isGroupsLoading: false,
  typingStatus: {}, // { userId: boolean }

  appendMessageIfMissing: (message) => {
    if (!message?._id) return;

    set((state) => {
      const alreadyExists = state.messages.some((item) => item._id === message._id);
      if (alreadyExists) return state;
      return { messages: [...state.messages, message] };
    });
  },

  getUsers: async (silent = false) => {
    if (!silent) set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users-sidebar");
      set({ users: res.data.data });
    } catch (error) {
      if (!silent) toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      if (!silent) set({ isUsersLoading: false });
    }
  },

  getGroups: async (silent = false) => {
    if (!silent) set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups/my-groups");
      set({ groups: res.data.data });
    } catch (error) {
      if (!silent) toast.error(error.response?.data?.message || "Error fetching groups");
    } finally {
      if (!silent) set({ isGroupsLoading: false });
    }
  },

  createGroup: async (groupData) => {
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      set({ groups: [...get().groups, res.data.data] });
      toast.success("Group established successfully");
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating group");
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/group/${groupId}`);
      set({ messages: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching group messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData, targetId = null) => {
    const { selectedUser, selectedGroup } = get();
    try {
      const finalTargetId = targetId || (selectedGroup ? selectedGroup._id : selectedUser?._id);
      if(!finalTargetId) return;

      const endpoint = (selectedGroup && !targetId)
        ? `/messages/send/${selectedGroup._id}` 
        : `/messages/send/${finalTargetId}`;
      
      const payload = selectedGroup 
        ? { ...messageData, groupId: selectedGroup._id }
        : messageData;

      const res = await axiosInstance.post(endpoint, payload);
      const newMessage = res.data.data;
      get().appendMessageIfMissing(newMessage);
      
      if (useThemeStore.getState().soundEnabled) {
        const sendAudio = new Audio("/send-tone.mp3");
        sendAudio.volume = 0.5;
        sendAudio.play().catch(e => console.log("Send sound blocked:", e));
      }

      // Silent refresh to update last message in sidebar without skeleton flicker
      get().getUsers(true); 
      if (selectedGroup) get().getGroups(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
      throw error;
    }
  },

  sendTypingStatus: (isTyping) => {
    const { selectedUser } = get();
    const authStore = useAuthStore.getState();
    const socket = authStore.socket;
    if (!socket || !selectedUser) return;

    if (isTyping) {
        socket.emit("typing", { receiverId: selectedUser._id, senderId: authStore.authUser._id, typing: true });
    } else {
        socket.emit("stopTyping", { receiverId: selectedUser._id, senderId: authStore.authUser._id });
    }
  },

  deleteMessage: async (messageId, type = "everyone") => {
    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`, { data: { type } });
      
      if (type === "me") {
        set((state) => ({
          messages: state.messages.filter((m) => m._id !== messageId),
        }));
      } else {
        set((state) => ({
          messages: state.messages.map((m) =>
            m._id === messageId ? { ...m, isDeleted: true, text: "This message was deleted", image: null } : m
          ),
        }));
      }
      toast.success(`Message removed for ${type === "me" ? "you" : "everyone"}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting message");
    }
  },

  reactToMessage: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.put(`/messages/react/${messageId}`, { emoji });
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? { ...m, reactions: res.data.data.reactions } : m
        ),
      }));
    } catch {
      console.log("Error reacting to message");
    }
  },

  subscribeToEvents: () => {
    const authStore = useAuthStore.getState();
    const socket = authStore.socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("newGroupMessage");
    socket.off("messageDeleted");
    socket.off("messageReaction");
    socket.off("usertyping");
    socket.off("userStopTyping");
    socket.off("messagesSeen");
    socket.off("newFriendRequest");
    socket.off("friendRequestAccepted");

    socket.on("newMessage", (newMessage) => {
        const isMessageFromSelectedUser = newMessage.senderId === get().selectedUser?._id;
        if (isMessageFromSelectedUser) {
            get().appendMessageIfMissing(newMessage);
            get().markMessagesAsSeen(newMessage.senderId);
        }
        // Silent refresh on receiving message
        get().getUsers(true);
        
        const authStore = useAuthStore.getState();
        const myId = authStore.authUser?._id;
        if (newMessage.senderId !== myId) {
            if (useThemeStore.getState().soundEnabled) {
                const audio = new Audio("/recieve-tone.mp3");
                audio.play().catch(() => console.log("Receive sound failed"));
            }
        }
    });

    socket.on("newFriendRequest", () => {
        // Silently refresh friend requests if store exists
        import("./useFriendStore").then((mod) => {
            const friendStore = mod.useFriendStore || mod.default?.useFriendStore;
            if (friendStore) friendStore.getState().getFriendRequests();
        });
        if (useThemeStore.getState().soundEnabled) {
            const audio = new Audio("/recieve-tone.mp3");
            audio.play().catch(() => console.log("Sound blocked"));
        }
    });

    socket.on("friendRequestAccepted", () => {
        // Refresh everything to show the new friend
        get().getUsers(true);
        import("./useFriendStore").then((mod) => {
            mod.useFriendStore.getState().getFriendRequests();
            mod.useFriendStore.getState().getAllUsers();
        });
        toast.success("A friend request was accepted!");
    });

    socket.on("newGroupMessage", (newMessage) => {
        const isMessageForSelectedGroup = newMessage.groupId === get().selectedGroup?._id;
        if (isMessageForSelectedGroup) {
            get().appendMessageIfMissing(newMessage);
        }
        get().getGroups(true);

        const authStore = useAuthStore.getState();
        const isMyMessage = newMessage.senderId?._id === authStore.authUser?._id || newMessage.senderId === authStore.authUser?._id;
        if (!isMyMessage) {
            if (useThemeStore.getState().soundEnabled) {
                const audio = new Audio("/recieve-tone.mp3");
                audio.play().catch(() => console.log("Receive sound failed"));
            }
        }
    });

    socket.on("messageDeleted", ({ messageId }) => {
        set((state) => ({
            messages: state.messages.map((m) =>
                m._id === messageId ? { ...m, isDeleted: true, text: "This message was deleted", image: null } : m
            ),
        }));
    });

    socket.on("messageReaction", ({ messageId, reactions }) => {
        set((state) => ({
            messages: state.messages.map((m) =>
                m._id === messageId ? { ...m, reactions } : m
            ),
        }));
    });

    socket.on("usertyping", ({ senderId, typing }) => {
        set((state) => ({
            typingStatus: { ...state.typingStatus, [senderId]: typing }
        }));
    });

    socket.on("userStopTyping", ({ senderId }) => {
        set((state) => ({
            typingStatus: { ...state.typingStatus, [senderId]: false }
        }));
    });

    socket.on("messagesSeen", ({ senderId }) => {
        const { selectedUser, messages } = get();
        if (selectedUser?._id === senderId) {
            set({
                messages: messages.map(m => ({ ...m, isSeen: true }))
            });
        }
    });
  },

  unsubscribeFromEvents: () => {
    const authStore = useAuthStore.getState();
    const socket = authStore.socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("newGroupMessage");
    socket.off("messageDeleted");
    socket.off("messageReaction");
    socket.off("usertyping");
    socket.off("userStopTyping");
    socket.off("messagesSeen");
    socket.off("newFriendRequest");
    socket.off("friendRequestAccepted");
  },

  markMessagesAsSeen: async (userId) => {
    try {
      await axiosInstance.put(`/messages/seen/${userId}`);
    } catch {
      console.log("Error marking messages as seen");
    }
  },

  setSelectedUser: (selectedUser) => {
    if (selectedUser) {
      set((state) => ({
        selectedUser,
        selectedGroup: null,
        users: state.users.map((u) => (u._id === selectedUser._id ? { ...u, unreadCount: 0 } : u)),
      }));
      get().markMessagesAsSeen(selectedUser._id);
    } else {
      set({ selectedUser: null, selectedGroup: null });
    }
  },
  setSelectedGroup: (selectedGroup) => {
    if (selectedGroup) {
      set((state) => ({
        selectedGroup,
        selectedUser: null,
        groups: state.groups.map((g) => (g._id === selectedGroup._id ? { ...g, unreadCount: 0 } : g)),
      }));
      const socket = useAuthStore.getState().socket;
      if (socket) socket.emit("joinGroup", selectedGroup._id);
    } else {
      set({ selectedUser: null, selectedGroup: null });
    }
  },

  updateGroup: async (groupId, groupData) => {
    try {
      const res = await axiosInstance.put(`/groups/update/${groupId}`, groupData);
      set((state) => ({
        groups: state.groups.map((g) => (g._id === groupId ? { ...g, ...res.data.data } : g)),
        selectedGroup: state.selectedGroup?._id === groupId ? { ...state.selectedGroup, ...res.data.data } : state.selectedGroup,
      }));
      toast.success("Group settings updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating group");
    }
  },

  deleteGroup: async (groupId) => {
    try {
      await axiosInstance.delete(`/groups/delete/${groupId}`);
      set((state) => ({
        groups: state.groups.filter((g) => g._id !== groupId),
        selectedGroup: state.selectedGroup?._id === groupId ? null : state.selectedGroup,
      }));
      toast.success("Group terminated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting group");
    }
  },
  kickMember: async (groupId, userId) => {
    try {
      const res = await axiosInstance.put(`/groups/kick/${groupId}`, { userId });
      set((state) => ({
        groups: state.groups.map((g) => (g._id === groupId ? { ...g, ...res.data.data } : g)),
        selectedGroup: state.selectedGroup?._id === groupId ? { ...state.selectedGroup, ...res.data.data } : state.selectedGroup,
      }));
      toast.success("Node removed from cell");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error kicking member");
    }
  },
}));
