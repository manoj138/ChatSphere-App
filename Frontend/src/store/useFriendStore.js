import { create } from "zustand";
import { axiosInstance } from "../services/api";
import toast from "react-hot-toast";

export const useFriendStore = create((set, get) => ({
    allUsers: [],
    friendRequests: [],
    isUsersLoading: false,
    isRequestsLoading: false,

    getAllUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/friends/all-users");
            set({ allUsers: res.data.data });
        } catch (error) {
            console.log("Error in getAllUsers:", error);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getFriendRequests: async () => {
        set({ isRequestsLoading: true });
        try {
            const res = await axiosInstance.get("/friends/pending");
            set({ friendRequests: res.data.data });
        } catch (error) {
            console.log("Error in getFriendRequests:", error);
        } finally {
            set({ isRequestsLoading: false });
        }
    },

    sendFriendRequest: async (userId) => {
        try {
            await axiosInstance.post("/friends/send", { receiverId: userId });
            toast.success("Request sent successfully");
            get().getAllUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send request");
        }
    },

    respondToRequest: async (requestId, status) => {
        try {
            await axiosInstance.post("/friends/respond", { requestId, status });
            toast.success(`Request ${status}`);
            get().getFriendRequests();
        } catch (error) {
            toast.error("Failed to respond to request");
        }
    },
}));
