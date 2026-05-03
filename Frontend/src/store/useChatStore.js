import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/api";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  searchResults: [],
  pendingRequests: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSearching: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users-sidebar");
      set({ users: res.data.data });
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.server || error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  searchUsers: async (query) => {
    if (query === undefined) return; 
    set({ isSearching: true });
    try {
      const res = await axiosInstance.get(`/messages/search/user?search=${query}`);
      set({ searchResults: res.data.data });
    } catch (error) {
      console.log("Error searching users");
    } finally {
      set({ isSearching: false });
    }
  },

  sendFriendRequest: async (receiverId) => {
    try {
      await axiosInstance.post("/friends/send", { receiverId });
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Request already sent");
    }
  },

  getPendingRequests: async () => {
    try {
      const res = await axiosInstance.get("/friends/pending");
      set({ pendingRequests: res.data.data });
    } catch (error) {
      console.log("Error fetching requests");
    }
  },

  respondToRequest: async (requestId, status) => {
    try {
      await axiosInstance.post("/friends/respond", { requestId, status });
      toast.success(`Request ${status} successfully`);
      get().getPendingRequests();
      get().getUsers(); 
    } catch (error) {
      toast.error("Error responding to request");
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.data });
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.server || error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.server || error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  },

  subscribeToEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newFriendRequest", (newRequest) => {
      set({ pendingRequests: [newRequest, ...get().pendingRequests] });
      toast("New Friend Request!", { icon: '👋' });
    });

    socket.on("friendRequestAccepted", () => {
      get().getUsers(); // Refresh sidebar to show new friend
      toast.success("Friend request accepted!");
    });

    socket.on("newMessage", (newMessage) => {
        const { selectedUser, messages } = get();
        // Only update if the message is from the currently selected user
        if (selectedUser && newMessage.senderId === selectedUser._id) {
          set({ messages: [...messages, newMessage] });
        }
    });
  },

  unsubscribeFromEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newFriendRequest");
    socket.off("friendRequestAccepted");
    socket.off("newMessage");
  },

  markMessagesAsSeen: async (userId) => {
    try {
      await axiosInstance.put(`/messages/seen/${userId}`);
    } catch (error) {
      console.log("Error marking messages as seen");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
