import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/api";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],
  selectedUser: null,
  selectedGroup: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isGroupsLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users-sidebar");
      set({ users: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups/my-groups");
      set({ groups: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async (groupData) => {
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      set({ groups: [...get().groups, res.data.data] });
      toast.success("Group created successfully");
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

  sendMessage: async (messageData) => {
    const { selectedUser, selectedGroup, messages } = get();
    try {
      const endpoint = selectedGroup 
        ? `/messages/send/${selectedGroup._id}?groupId=true` 
        : `/messages/send/${selectedUser._id}`;
      
      const payload = selectedGroup 
        ? { ...messageData, groupId: selectedGroup._id }
        : messageData;

      const res = await axiosInstance.post(endpoint, payload);
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  },

  subscribeToEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isChattingWithSender = get().selectedUser?._id === newMessage.senderId;
      if (isChattingWithSender) {
        set({ messages: [...get().messages, newMessage] });
      }
    });

    socket.on("newGroupMessage", (newMessage) => {
      const isChattingInGroup = get().selectedGroup?._id === newMessage.groupId;
      if (isChattingInGroup) {
        set({ messages: [...get().messages, newMessage] });
      }
    });

    socket.on("messagesSeen", ({ senderId, recipientId }) => {
        const { selectedUser, messages } = get();
        if (selectedUser?._id === senderId) {
            set({
                messages: messages.map(m => 
                    m.senderId !== selectedUser._id ? { ...m, isSeen: true } : m
                )
            });
        }
    });
  },

  unsubscribeFromEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("newGroupMessage");
    socket.off("messagesSeen");
  },

  markMessagesAsSeen: async (userId) => {
    try {
      await axiosInstance.put(`/messages/seen/${userId}`);
    } catch (error) {
      console.log("Error marking messages as seen");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, selectedGroup: null }),
  setSelectedGroup: (selectedGroup) => {
      set({ selectedGroup, selectedUser: null });
      if (selectedGroup) {
          const socket = useAuthStore.getState().socket;
          if (socket) socket.emit("joinGroup", selectedGroup._id);
      }
  },
}));
